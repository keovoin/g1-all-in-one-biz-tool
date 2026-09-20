"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOrganizationService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const context_1 = require("../core/context");
const crud_1 = require("../core/crud");
const internal_1 = require("../core/entities/internal");
const employee_service_1 = require("../employee/employee.service");
const type_orm_organization_repository_1 = require("../organization/repository/type-orm-organization.repository");
const user_organization_entity_1 = require("./user-organization.entity");
const type_orm_user_organization_repository_1 = require("./repository/type-orm-user-organization.repository");
const mikro_orm_user_organization_repository_1 = require("./repository/mikro-orm-user-organization.repository");
let UserOrganizationService = class UserOrganizationService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmUserOrganizationRepository, mikroOrmUserOrganizationRepository, typeOrmOrganizationRepository, employeeService) {
        super(typeOrmUserOrganizationRepository, mikroOrmUserOrganizationRepository);
        this.typeOrmUserOrganizationRepository = typeOrmUserOrganizationRepository;
        this.mikroOrmUserOrganizationRepository = mikroOrmUserOrganizationRepository;
        this.typeOrmOrganizationRepository = typeOrmOrganizationRepository;
        this.employeeService = employeeService;
    }
    /**
     * Finds all user organizations based on the provided filter options.
     *
     * Every loaded `user` relation is handed back as a real `User` instance, whichever ORM loaded it
     * and whether or not employees were requested, so the global `TransformInterceptor` can apply the
     * `@Exclude({ toPlainOnly: true })` redaction of the `User` credential columns.
     *
     * @param filter Optional filter options to apply when querying user organizations.
     * @param includeEmployee When true, attaches each user's employee record as `user.employee`.
     * @returns A promise resolving to the paginated user organizations.
     */
    async findUserOrganizations(filter, includeEmployee) {
        // Use the filter as-is, permission handling is now handled by the interceptor
        const { items, total } = await super.findAll(filter ?? {});
        // Employee details keyed by user ID; stays empty unless 'includeEmployee' is set to true
        const employeeMap = new Map();
        // If 'includeEmployee' is set to true, fetch employee details associated with each user organization
        if (includeEmployee) {
            try {
                // Get the tenant ID from the current request context
                const tenantId = context_1.RequestContext.currentTenantId();
                // Extract user IDs from the items array
                const userIds = items
                    .filter((organization) => organization?.user) // Filter out user organizations without a user object
                    .map((organization) => organization?.user?.id) || [];
                // Fetch all employee details in bulk for the extracted user IDs
                const employees = await this.employeeService.findEmployeesByUserIds(userIds, tenantId);
                employees.forEach((employee) => {
                    // If user ID is available, add employee details to the map
                    if (employee.userId) {
                        // Add employee details to the map
                        employeeMap.set(employee.userId, employee);
                    }
                });
            }
            catch (error) {
                console.error(`Error fetching employee details: ${error.message}`);
            }
        }
        // Redaction runs on EVERY path, including the employee-lookup failure above
        return { items: items.map((organization) => this.restoreUserPrototype(organization, employeeMap)), total };
    }
    /**
     * Ensures a user organization row carries its loaded `user` as a `User` instance, merging in the
     * matching employee when one was found.
     *
     * SECURITY: `User.hash`, `refreshToken`, `code`, `codeExpireAt`, `emailVerifiedAt` and
     * `emailToken` are redacted only by class-transformer's `@Exclude({ toPlainOnly: true })`, whose
     * metadata is reached through the class prototype. A prototype-less user object therefore has
     * every credential column serialized verbatim by the global `TransformInterceptor`
     * (`instanceToPlain`). Such an object arises two ways: rebuilding a loaded entity with an object
     * spread (never do that here), and the MikroORM branch of `CrudService.findAll`, which returns
     * `wrap(entity).toJSON()` plain objects. The user is re-wrapped whenever it is not already a
     * `User` or an employee has to be attached — the same pattern as `UserService.findMeUser`.
     *
     * The employee is looked up by `userId`, falling back to the loaded `user.id` so a projection
     * that omits `userId` neither skips the re-wrap nor loses the employee.
     *
     * @param organization The user organization row as returned by `findAll` (mutated in place).
     * @param employeeMap Employee records keyed by user ID.
     * @returns The same row, with `user` safe to serialize.
     */
    restoreUserPrototype(organization, employeeMap) {
        const user = organization?.user;
        if (!user || typeof user !== 'object') {
            return organization;
        }
        const employee = employeeMap.get(organization.userId ?? user.id);
        if (!(user instanceof internal_1.User) || employee) {
            organization.user = new internal_1.User({
                ...user,
                ...(employee && { employee })
            });
        }
        // Return the row itself, never a spread copy of it
        return organization;
    }
    /**
     * Adds a user to all organizations within a specific tenant.
     *
     * @param userId The unique identifier of the user to be added to the organizations.
     * @param tenantId The unique identifier of the tenant whose organizations the user will be added to.
     * @returns A promise that resolves to an array of IUserOrganization, where each element represents the user's association with an organization in the tenant.
     */
    async addUserToOrganization(user, organizationId) {
        /** If role is SUPER_ADMIN, add user to all organizations in the tenant */
        if (user.role.name === contracts_1.RolesEnum.SUPER_ADMIN) {
            return await this._addUserToAllOrganizations(user.id, user.tenantId);
        }
        const entity = new user_organization_entity_1.UserOrganization({
            organizationId,
            tenantId: user.tenantId,
            userId: user.id
        });
        return await this.typeOrmUserOrganizationRepository.save(entity);
    }
    /**
     * Adds a user to all organizations within a given tenant..
     *
     * @param userId The unique identifier of the user to be added to the organizations.
     * @param tenantId The unique identifier of the tenant whose organizations the user will be added to.
     * @returns A promise that resolves to an array of IUserOrganization, representing the user-organization relationships created.
     */
    async _addUserToAllOrganizations(userId, tenantId) {
        /** Add user to all organizations in the tenant */
        const organizations = await this.typeOrmOrganizationRepository.find({
            where: { tenantId }
        });
        const entities = organizations.map(({ id: organizationId }) => {
            const entity = new user_organization_entity_1.UserOrganization();
            entity.organizationId = organizationId;
            entity.tenantId = tenantId;
            entity.userId = userId;
            return entity;
        });
        return await this.typeOrmUserOrganizationRepository.save(entities);
    }
};
exports.UserOrganizationService = UserOrganizationService;
exports.UserOrganizationService = UserOrganizationService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_user_organization_repository_1.TypeOrmUserOrganizationRepository,
        mikro_orm_user_organization_repository_1.MikroOrmUserOrganizationRepository,
        type_orm_organization_repository_1.TypeOrmOrganizationRepository,
        employee_service_1.EmployeeService])
], UserOrganizationService);
//# sourceMappingURL=user-organization.services.js.map