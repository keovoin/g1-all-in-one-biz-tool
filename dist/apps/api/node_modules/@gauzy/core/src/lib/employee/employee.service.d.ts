import { FindOneOptions, SelectQueryBuilder } from 'typeorm';
import { IBasePerTenantAndOrganizationEntityModel, ID, IDateRangePicker, IEmployee, IFindMembersInput, IPagination } from '@gauzy/contracts';
import { BaseQueryDTO, TenantAwareCrudService } from './../core/crud';
import { IPartialEntity } from './../core/crud/icrud.service';
import { MikroOrmEmployeeRepository } from './repository/mikro-orm-employee.repository';
import { TypeOrmEmployeeRepository } from './repository/type-orm-employee.repository';
import { Employee } from './employee.entity';
export declare class EmployeeService extends TenantAwareCrudService<Employee> {
    readonly typeOrmEmployeeRepository: TypeOrmEmployeeRepository;
    readonly mikroOrmEmployeeRepository: MikroOrmEmployeeRepository;
    constructor(typeOrmEmployeeRepository: TypeOrmEmployeeRepository, mikroOrmEmployeeRepository: MikroOrmEmployeeRepository);
    /**
     * Creates (or, via the update command handlers, upserts) an employee record, sanitizing the
     * rich-text `description` HTML through the shared server-side allowlist before persisting.
     * `Employee.description` is rendered with `[innerHTML]` on the PUBLIC organization page, so
     * every write path must be sanitized (see `sanitizeRichHtml`).
     *
     * @param entity - The employee data to persist.
     * @returns The persisted employee.
     */
    create(entity: IPartialEntity<Employee>): Promise<Employee>;
    /**
     * Finds members based on provided options.
     *
     * @param options - The options to filter members.
     * @returns A pagination object containing the list of members and total count.
     */
    findMembers(options: IFindMembersInput): Promise<IPagination<IEmployee>>;
    /**
     * Retrieves a list of active, non-archived employees based on provided employee IDs,
     * organization ID, and tenant ID.
     *
     * @param {ID[]} employeeIds - Array of employee IDs to search for. Defaults to an empty array if not provided.
     * @param {ID} organizationId - The ID of the organization to filter employees.
     * @param {ID} tenantId - The ID of the tenant to filter employees.
     * @returns {Promise<IEmployee[]>} - Promise resolving with an array of matching `IEmployee` objects.
     *
     * @throws {Error} - Throws an error if the retrieval process fails.
     */
    findActiveEmployeesByEmployeeIds(employeeIds: ID[], organizationId: ID, tenantId: ID): Promise<IEmployee[]>;
    /**
     * Finds employees based on an array of user IDs.
     *
     * @param userIds An array of user IDs.
     * @param tenantId The ID of the tenant to filter employees.
     * @returns A promise resolving to an array of employees.
     */
    findEmployeesByUserIds(userIds: ID[], tenantId: ID): Promise<IEmployee[]>;
    /**
     * Finds the employeeId associated with a given userId.
     *
     * @param userId The ID of the user.
     * @param organizationId Optional organization ID. If not provided, uses the current organization from request context.
     * @returns The employeeId or null if not found or in case of an error.
     */
    findEmployeeIdByUserId(userId: ID, organizationId?: ID): Promise<string | null>;
    /**
     * Finds an employee by user ID.
     *
     * @param userId The ID of the user to find.
     * @param organizationId Optional organization ID. If not provided, uses the current organization from request context.
     * @param options Optional FindOneOptions.
     * @returns A Promise resolving to the employee if found, otherwise null.
     */
    findOneByUserId(userId: ID, organizationId?: ID, options?: FindOneOptions<Employee>): Promise<IEmployee | null>;
    /**
     * Retrieves all active employees with their associated user and organization details.
     * @returns A Promise that resolves to an array of active employees.
     */
    findAllActive(): Promise<IEmployee[]>;
    /**
     * Find the employees working in the organization for a particular date range.
     * An employee is considered to be 'working' if:
     * 1. The startedWorkOn date is (not null and) less than the last day forMonth
     * 2. The endWork date is either null or greater than the first day forMonth
     * @param organizationId
     * @param forRange
     * @param withUser
     * @returns
     */
    findWorkingEmployees(organizationId: ID, forRange: IDateRangePicker | any, withUser?: boolean): Promise<IPagination<IEmployee>>;
    /**
     * Find the counts of employees working in the organization for a particular date range.
     * An employee is considered to be 'working' if:
     * 1. The startedWorkOn date is (not null and) less than the last day forMonth
     * 2. The endWork date is either null or greater than the first day forMonth
     * @param organizationId
     * @param forRange
     * @returns
     */
    findWorkingEmployeesCount(organizationId: string, forRange: IDateRangePicker | any): Promise<{
        total: number;
    }>;
    /**
     * Adds a filter to the TypeORM SelectQueryBuilder for the Employee entity based on specified conditions.
     *
     * @param qb - The TypeORM SelectQueryBuilder for the Employee entity.
     * @param organizationId - The organization ID to filter by.
     * @param forRange - An object representing a date range (IDateRangePicker) or any other type.
     */
    getFilterQuery(qb: SelectQueryBuilder<Employee>, organizationId: string, forRange: IDateRangePicker | any): void;
    /**
     * Get all employees using pagination
     *
     * @param options Pagination options
     * @returns Promise containing paginated employees and total count
     */
    pagination(options: BaseQueryDTO<any>): Promise<IPagination<IEmployee>>;
    /**
     * Softly delete an employee by ID, with organization and tenant constraints.
     *
     * @param employeeId - ID of the employee to delete.
     * @param params - Contains organizationId and possibly other per-tenant information.
     * @returns - UpdateResult or DeleteResult depending on the ORM type.
     */
    softRemovedById(employeeId: ID, params: IBasePerTenantAndOrganizationEntityModel): Promise<Employee>;
    /**
     * Restores a soft-deleted employee by ID.
     *
     * This method restores an employee who was previously soft-deleted. It uses the organization ID
     * and tenant ID to ensure that the correct employee is restored.
     *
     * @param employeeId The ID of the employee to restore.
     * @param params Additional context parameters, including organization ID and tenant ID.
     * @returns The restored Employee entity.
     * @throws BadRequestException if the employee cannot be restored or if an error occurs.
     */
    softRecoverById(employeeId: ID, params: IBasePerTenantAndOrganizationEntityModel): Promise<Employee>;
}
