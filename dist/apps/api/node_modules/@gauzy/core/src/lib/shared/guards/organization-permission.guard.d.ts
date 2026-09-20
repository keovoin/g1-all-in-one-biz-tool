import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { ID, IOrganization } from '@gauzy/contracts';
import { MikroOrmEmployeeRepository } from '../../employee/repository/mikro-orm-employee.repository';
import { TypeOrmEmployeeRepository } from '../../employee/repository/type-orm-employee.repository';
import { MikroOrmOrganizationRepository } from '../../organization/repository/mikro-orm-organization.repository';
import { TypeOrmOrganizationRepository } from '../../organization/repository/type-orm-organization.repository';
/**
 * The only permissions this guard is able to translate into an organization time-tracking policy
 * column.
 *
 * The previous implementation built the column name with `camelcase(permission)` and interpolated
 * it straight into SQL. An explicit allow list keeps the guard from silently checking a column that
 * does not exist (which would make the whole check throw and, worse, tempts a future route into
 * passing an unrelated permission to this guard). Anything outside this map is refused.
 */
export declare const ORGANIZATION_POLICY_COLUMNS: Readonly<Record<string, keyof IOrganization>>;
export declare class OrganizationPermissionGuard implements CanActivate {
    private cacheManager;
    readonly _reflector: Reflector;
    readonly _typeOrmEmployeeRepository: TypeOrmEmployeeRepository;
    readonly _mikroOrmEmployeeRepository: MikroOrmEmployeeRepository;
    readonly _typeOrmOrganizationRepository: TypeOrmOrganizationRepository;
    readonly _mikroOrmOrganizationRepository: MikroOrmOrganizationRepository;
    constructor(cacheManager: Cache, _reflector: Reflector, _typeOrmEmployeeRepository: TypeOrmEmployeeRepository, _mikroOrmEmployeeRepository: MikroOrmEmployeeRepository, _typeOrmOrganizationRepository: TypeOrmOrganizationRepository, _mikroOrmOrganizationRepository: MikroOrmOrganizationRepository);
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
    canActivate(context: ExecutionContext): Promise<boolean>;
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
    private resolveOrganizationIds;
    /**
     * Reads the organization id the request targets from the body, the query string or the route
     * params, without trusting it: it is only ever used as a lookup key of a tenant-scoped query.
     *
     * @param context The execution context.
     * @returns The organization id found on the request, or undefined.
     */
    private extractRequestOrganizationId;
    /**
     * Finds the organization of the record a route addresses by id, scoped to the caller's tenant.
     *
     * @param context The execution context, used to read the route param carrying the record id.
     * @param tenantId The caller's tenant.
     * @param target The entity and route param declared with `@OrganizationPolicyTarget()`.
     * @returns The record's organization id, or undefined when the id is missing or the record is not
     * in this tenant.
     */
    private findTargetOrganizationId;
    /**
     * Finds the organization of an employee, scoped to the caller's tenant.
     *
     * @param tenantId The caller's tenant.
     * @param employeeId The employee to resolve.
     * @returns The employee's organization id, or undefined when the employee is not in this tenant.
     */
    private findEmployeeOrganizationId;
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
    checkOrganizationPermission(tenantId: ID, organizationIds: ID[], columns: string[]): Promise<boolean>;
}
