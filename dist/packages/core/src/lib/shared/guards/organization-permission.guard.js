"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationPermissionGuard = exports.ORGANIZATION_POLICY_COLUMNS = void 0;
const tslib_1 = require("tslib");
const config_1 = require("@gauzy/config");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const cache_manager_1 = require("@nestjs/cache-manager");
const typeorm_1 = require("typeorm");
const constants_1 = require("@gauzy/constants");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const context_1 = require("./../../core/context");
const organization_policy_target_decorator_1 = require("../decorators/organization-policy-target.decorator");
const utils_2 = require("../../core/utils");
const mikro_orm_employee_repository_1 = require("../../employee/repository/mikro-orm-employee.repository");
const type_orm_employee_repository_1 = require("../../employee/repository/type-orm-employee.repository");
const mikro_orm_organization_repository_1 = require("../../organization/repository/mikro-orm-organization.repository");
const type_orm_organization_repository_1 = require("../../organization/repository/type-orm-organization.repository");
// Get the type of the Object-Relational Mapping (ORM) used in the application.
const ormType = (0, utils_2.getORMType)();
/**
 * The only permissions this guard is able to translate into an organization time-tracking policy
 * column.
 *
 * The previous implementation built the column name with `camelcase(permission)` and interpolated
 * it straight into SQL. An explicit allow list keeps the guard from silently checking a column that
 * does not exist (which would make the whole check throw and, worse, tempts a future route into
 * passing an unrelated permission to this guard). Anything outside this map is refused.
 */
exports.ORGANIZATION_POLICY_COLUMNS = Object.freeze({
    [contracts_1.PermissionsEnum.ALLOW_MANUAL_TIME]: 'allowManualTime',
    [contracts_1.PermissionsEnum.ALLOW_MODIFY_TIME]: 'allowModifyTime',
    [contracts_1.PermissionsEnum.ALLOW_DELETE_TIME]: 'allowDeleteTime'
});
let OrganizationPermissionGuard = class OrganizationPermissionGuard {
    constructor(cacheManager, _reflector, _typeOrmEmployeeRepository, _mikroOrmEmployeeRepository, _typeOrmOrganizationRepository, _mikroOrmOrganizationRepository) {
        this.cacheManager = cacheManager;
        this._reflector = _reflector;
        this._typeOrmEmployeeRepository = _typeOrmEmployeeRepository;
        this._mikroOrmEmployeeRepository = _mikroOrmEmployeeRepository;
        this._typeOrmOrganizationRepository = _typeOrmOrganizationRepository;
        this._mikroOrmOrganizationRepository = _mikroOrmOrganizationRepository;
    }
    /**
     * Enforces the organization's time-tracking policy toggles (allowManualTime / allowModifyTime /
     * allowDeleteTime) for EVERY role.
     *
     * Historically the policy was only consulted when the caller's role was exactly `EMPLOYEE`;
     * every other role fell into an unconditional `isAuthorized = true` branch, so the organization
     * setting was void for the very roles it matters most for (GHSA-rmq9-85v7-f365). The check is
     * now role agnostic and resolves the organization(s) the request touches instead of the caller's
     * role.
     *
     * @param context The execution context.
     * @returns A promise that resolves to a boolean indicating authorization status.
     */
    async canActivate(context) {
        // Retrieve permissions from metadata
        const targets = [context.getHandler(), context.getClass()];
        const permissions = (0, utils_1.deduplicate)(this._reflector.getAllAndOverride(constants_1.PERMISSIONS_METADATA, targets)) || [];
        // Fail closed: this guard exists to evaluate an organization policy. A route that applies it
        // without declaring which policy to evaluate cannot reach a verdict, so it must not get the
        // permissive one.
        if ((0, utils_1.isEmpty)(permissions)) {
            console.log('OrganizationPermissionGuard: no permissions declared on the route, access denied');
            return false;
        }
        // Translate the declared permissions into organization policy columns, refusing anything
        // this guard does not know how to evaluate.
        const columns = [];
        for (const permission of permissions) {
            const column = exports.ORGANIZATION_POLICY_COLUMNS[permission];
            if (!column) {
                console.log(`OrganizationPermissionGuard: permission ${permission} is not an organization policy, access denied`);
                return false;
            }
            columns.push(column);
        }
        // Authorize from the request's DB-fresh user, not from the bearer token's claims. The `role`
        // claim is frozen at issuance, so decoding it here meant a demoted user kept their former role
        // for the token's whole lifetime (GHSA-m8xc-8pwr-89fj). `employeeId` is the claim JwtStrategy
        // already validated against the database before attaching the user.
        const user = context_1.RequestContext.currentUser();
        // No authenticated caller means no verdict can be reached: deny.
        if (!user) {
            console.log('OrganizationPermissionGuard: no authenticated user on the request, access denied');
            return false;
        }
        const id = user.id;
        const role = context_1.RequestContext.currentRoleName();
        const employeeId = user.employeeId ?? undefined;
        // No resolvable role (the user's roleId is NULL, the role row is gone, or its lookup returned
        // nothing) means no verdict can be reached either.
        if (!role) {
            console.log(`Unauthorized access blocked: User ID: ${id}, Role: unresolved, Permissions Checked: ${permissions.join(', ')}`);
            return false;
        }
        // Check if super admin role is allowed from the .env file
        if (config_1.environment.allowSuperAdminRole && context_1.RequestContext.hasRoles([contracts_1.RolesEnum.SUPER_ADMIN])) {
            return true;
        }
        const tenantId = context_1.RequestContext.currentTenantId();
        if ((0, utils_1.isEmpty)(tenantId)) {
            console.log('OrganizationPermissionGuard: no tenant on the request, access denied');
            return false;
        }
        // Resolve every organization whose policy has to allow this request.
        const organizationIds = await this.resolveOrganizationIds(context, tenantId, role, employeeId);
        if (organizationIds === null || (0, utils_1.isEmpty)(organizationIds)) {
            console.log(`Unauthorized access blocked: User ID: ${id}, Role: ${role}, Employee ID: ${employeeId}, no organization could be resolved for the organization policy check`);
            return false;
        }
        const cacheKey = `orgPermissions_${tenantId}_${organizationIds.join('_')}_${permissions.join('_')}`;
        let isAuthorized = await this.cacheManager.get(cacheKey);
        if (isAuthorized == null) {
            isAuthorized = await this.checkOrganizationPermission(tenantId, organizationIds, columns);
            const ttl = 5 * 60 * 1000; // 5 minutes caching period for Organization Permissions
            await this.cacheManager.set(cacheKey, isAuthorized, ttl);
        }
        if (!isAuthorized) {
            // Log unauthorized access attempts
            console.log(`Unauthorized access blocked: User ID: ${id}, Role: ${role}, Employee ID: ${employeeId}, Permissions Checked: ${permissions.join(', ')}`);
        }
        return isAuthorized;
    }
    /**
     * Works out which organizations must allow the requested action.
     *
     * Every resolved organization has to permit the action (the check below counts the matching
     * rows and requires all of them), so adding a candidate can only ever narrow the verdict.
     *
     * @param context The execution context, used to read the organization the request targets.
     * @param tenantId The caller's tenant.
     * @param role The caller's role name, taken from the verified JWT.
     * @param employeeId The caller's employee id, taken from the verified JWT.
     * @returns The organization ids to check, or `null` when the guard cannot reach a verdict.
     */
    async resolveOrganizationIds(context, tenantId, role, employeeId) {
        const organizationIds = new Set();
        if ((0, utils_1.isNotEmpty)(employeeId)) {
            // The caller acts as an employee: the organization of their own employee record always
            // has to allow the action, exactly as before this fix.
            const employeeOrganizationId = await this.findEmployeeOrganizationId(tenantId, employeeId);
            if (!employeeOrganizationId) {
                // The employee id on the token does not resolve inside the caller's tenant.
                return null;
            }
            organizationIds.add(employeeOrganizationId);
        }
        else if (role === contracts_1.RolesEnum.EMPLOYEE) {
            // An employee-role caller with no employee record was refused before this fix (the
            // employee lookup matched nothing); keep refusing them rather than falling through to
            // the request-supplied organization.
            return null;
        }
        // The organization of the record the route mutates, when the route declares one. The request
        // cannot name that organization for us: a caller with no employee record could otherwise name a
        // permissive organization while addressing a record of an organization whose policy is off.
        const target = this._reflector.get(organization_policy_target_decorator_1.ORGANIZATION_POLICY_TARGET_METADATA, context.getHandler());
        if (target) {
            const targetOrganizationId = await this.findTargetOrganizationId(context, tenantId, target);
            if (!targetOrganizationId) {
                // The record does not exist in the caller's tenant (or the id is missing).
                return null;
            }
            organizationIds.add(targetOrganizationId);
        }
        // The organization the request itself targets. It is validated against the caller's tenant
        // by the policy query below, which only counts rows of this tenant.
        const requestOrganizationId = this.extractRequestOrganizationId(context);
        if (requestOrganizationId) {
            organizationIds.add(requestOrganizationId);
        }
        if (organizationIds.size === 0) {
            // Fall back to the organization pinned on the JWT. `jwt.strategy` only sets it after
            // verifying that the user has an active membership of that organization.
            const currentOrganizationId = context_1.RequestContext.currentOrganizationId();
            if (currentOrganizationId) {
                organizationIds.add(currentOrganizationId);
            }
        }
        return [...organizationIds].sort();
    }
    /**
     * Reads the organization id the request targets from the body, the query string or the route
     * params, without trusting it: it is only ever used as a lookup key of a tenant-scoped query.
     *
     * @param context The execution context.
     * @returns The organization id found on the request, or undefined.
     */
    extractRequestOrganizationId(context) {
        try {
            const request = context.switchToHttp().getRequest();
            const candidates = [
                request?.body?.organizationId,
                request?.query?.organizationId,
                request?.params?.organizationId
            ];
            for (const candidate of candidates) {
                if (typeof candidate === 'string' && candidate.trim().length > 0) {
                    return candidate;
                }
            }
        }
        catch (error) {
            console.log('OrganizationPermissionGuard: unable to read the request organization id', error);
        }
        return undefined;
    }
    /**
     * Finds the organization of the record a route addresses by id, scoped to the caller's tenant.
     *
     * @param context The execution context, used to read the route param carrying the record id.
     * @param tenantId The caller's tenant.
     * @param target The entity and route param declared with `@OrganizationPolicyTarget()`.
     * @returns The record's organization id, or undefined when the id is missing or the record is not
     * in this tenant.
     */
    async findTargetOrganizationId(context, tenantId, target) {
        try {
            const id = context.switchToHttp().getRequest()?.params?.[target.param];
            if (typeof id !== 'string' || id.trim().length === 0) {
                return undefined;
            }
            switch (ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const record = await this._mikroOrmOrganizationRepository
                        .getEntityManager()
                        .findOne(target.entity, { id, tenantId }, { fields: ['id', 'organizationId'] });
                    return record?.organizationId ?? undefined;
                }
                case utils_2.MultiORMEnum.TypeORM: {
                    const record = await this._typeOrmOrganizationRepository.manager.findOne(target.entity, {
                        where: { id, tenantId },
                        select: { id: true, organizationId: true }
                    });
                    return record?.organizationId ?? undefined;
                }
                default:
                    return undefined;
            }
        }
        catch (error) {
            console.log('Error occurred while resolving the organization of the target record:', error);
            return undefined;
        }
    }
    /**
     * Finds the organization of an employee, scoped to the caller's tenant.
     *
     * @param tenantId The caller's tenant.
     * @param employeeId The employee to resolve.
     * @returns The employee's organization id, or undefined when the employee is not in this tenant.
     */
    async findEmployeeOrganizationId(tenantId, employeeId) {
        try {
            switch (ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const employee = await this._mikroOrmEmployeeRepository
                        .createQueryBuilder('employee')
                        .where({ id: employeeId })
                        .andWhere({ tenantId })
                        .getSingleResult();
                    return employee?.organizationId ?? undefined;
                }
                case utils_2.MultiORMEnum.TypeORM: {
                    const employee = await this._typeOrmEmployeeRepository.findOne({
                        where: { id: employeeId, tenantId },
                        // Object form: TypeORM 1.0 rejects the legacy string-array `select` syntax.
                        select: { id: true, organizationId: true }
                    });
                    return employee?.organizationId ?? undefined;
                }
                default:
                    return undefined;
            }
        }
        catch (error) {
            console.log('Error occurred while resolving the employee organization:', error);
            return undefined;
        }
    }
    /**
     * Checks that EVERY given organization of the tenant enables at least one of the policy columns.
     *
     * The row count is compared with the number of requested organizations, so an organization that
     * does not exist in this tenant (or has the policy switched off) makes the whole check fail.
     *
     * @param tenantId The caller's tenant.
     * @param organizationIds The organizations whose policy must allow the action.
     * @param columns The organization policy columns to OR together.
     * @returns A Promise resolving to true only when all organizations allow the action.
     */
    async checkOrganizationPermission(tenantId, organizationIds, columns) {
        if ((0, utils_1.isEmpty)(organizationIds) || (0, utils_1.isEmpty)(columns)) {
            return false;
        }
        try {
            switch (ormType) {
                case utils_2.MultiORMEnum.MikroORM:
                    try {
                        // Create a QueryBuilder for the Organization entity
                        const mikroOrmQueryBuilder = this._mikroOrmOrganizationRepository.createQueryBuilder('organization');
                        // Restrict to the requested organizations of the caller's tenant
                        mikroOrmQueryBuilder.where({ id: { $in: organizationIds } });
                        mikroOrmQueryBuilder.andWhere({ tenantId });
                        // Use OR condition for each policy column
                        mikroOrmQueryBuilder.andWhere({ $or: columns.map((column) => ({ [column]: true })) });
                        // Execute the query and get the count
                        const count = await mikroOrmQueryBuilder.getCount();
                        // Every requested organization has to allow the action
                        return count === organizationIds.length;
                    }
                    catch (error) {
                        console.log(`Error occurred while checking ${utils_2.MultiORMEnum.MikroORM} organization permission:`, error);
                        return false;
                    }
                case utils_2.MultiORMEnum.TypeORM:
                    try {
                        // Create a query builder for the 'organization' entity
                        const typeOrmQueryBuilder = this._typeOrmOrganizationRepository.createQueryBuilder('organization');
                        // Restrict to the requested organizations of the caller's tenant
                        typeOrmQueryBuilder.where(`${typeOrmQueryBuilder.alias}.id IN (:...organizationIds)`, {
                            organizationIds
                        });
                        typeOrmQueryBuilder.andWhere(`${typeOrmQueryBuilder.alias}.tenantId = :tenantId`, { tenantId });
                        // Use OR condition for each policy column
                        typeOrmQueryBuilder.andWhere(new typeorm_1.Brackets((qb) => {
                            columns.forEach((column) => {
                                qb.orWhere(`${typeOrmQueryBuilder.alias}.${column} = true`);
                            });
                        }));
                        // Execute the query and get the count
                        const count = await typeOrmQueryBuilder.getCount();
                        // Every requested organization has to allow the action
                        return count === organizationIds.length;
                    }
                    catch (error) {
                        console.log(`Error occurred while checking ${utils_2.MultiORMEnum.TypeORM} organization permission:`, error);
                        return false;
                    }
                default:
                    return false;
            }
        }
        catch (error) {
            // Handle any potential errors, log, and fail closed.
            console.error('Error occurred while checking organization permission:', error);
            return false;
        }
    }
};
exports.OrganizationPermissionGuard = OrganizationPermissionGuard;
exports.OrganizationPermissionGuard = OrganizationPermissionGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [Object, core_1.Reflector,
        type_orm_employee_repository_1.TypeOrmEmployeeRepository,
        mikro_orm_employee_repository_1.MikroOrmEmployeeRepository,
        type_orm_organization_repository_1.TypeOrmOrganizationRepository,
        mikro_orm_organization_repository_1.MikroOrmOrganizationRepository])
], OrganizationPermissionGuard);
//# sourceMappingURL=organization-permission.guard.js.map