import { DataSource, DeleteResult, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { ID, IOrganizationProjectModule, IOrganizationProjectModuleCreateInput, IOrganizationProjectModuleFindInput, IOrganizationProjectModuleUpdateInput, IPagination, IEmployee } from '@gauzy/contracts';
import { BaseQueryDTO, TenantAwareCrudService } from './../core/crud';
import { OrganizationProjectModule } from './organization-project-module.entity';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { RoleService } from '../role/role.service';
import { EmployeeService } from '../employee/employee.service';
import { TaskService } from '../tasks/task.service';
import { TypeOrmOrganizationProjectModuleRepository } from './repository/type-orm-organization-project-module.repository';
import { MikroOrmOrganizationProjectModuleRepository } from './repository/mikro-orm-organization-project-module.repository';
import { TypeOrmOrganizationProjectModuleEmployeeRepository } from './repository/type-orm-organization-project-module-employee.repository';
import { MikroOrmOrganizationProjectModuleEmployeeRepository } from './repository/mikro-orm-organization-project-module-employee.repository';
export declare class OrganizationProjectModuleService extends TenantAwareCrudService<OrganizationProjectModule> {
    private readonly dataSource;
    readonly typeOrmProjectModuleRepository: TypeOrmOrganizationProjectModuleRepository;
    readonly mikroOrmProjectModuleRepository: MikroOrmOrganizationProjectModuleRepository;
    readonly typeOrmOrganizationProjectModuleEmployeeRepository: TypeOrmOrganizationProjectModuleEmployeeRepository;
    readonly mikroOrmOrganizationProjectModuleEmployeeRepository: MikroOrmOrganizationProjectModuleEmployeeRepository;
    private readonly _activityLogService;
    private readonly _roleService;
    private readonly _employeeService;
    private readonly _taskService;
    constructor(dataSource: DataSource, typeOrmProjectModuleRepository: TypeOrmOrganizationProjectModuleRepository, mikroOrmProjectModuleRepository: MikroOrmOrganizationProjectModuleRepository, typeOrmOrganizationProjectModuleEmployeeRepository: TypeOrmOrganizationProjectModuleEmployeeRepository, mikroOrmOrganizationProjectModuleEmployeeRepository: MikroOrmOrganizationProjectModuleEmployeeRepository, _activityLogService: ActivityLogService, _roleService: RoleService, _employeeService: EmployeeService, _taskService: TaskService);
    /**
     * Creates a new organization project module with the provided input.
     *
     * @param entity - The input data to create the project module.
     * @returns The created organization project module.
     */
    create(entity: IOrganizationProjectModuleCreateInput): Promise<IOrganizationProjectModule>;
    /**
     * @description Update Project Module
     * @param {ID} id - The project module ID to be updated
     * @param {IOrganizationProjectModuleUpdateInput} entity Body Request data
     * @returns A promise resolved to updated project module Or Update Result
     * @memberof OrganizationProjectModuleService
     */
    update(id: ID, entity: IOrganizationProjectModuleUpdateInput): Promise<IOrganizationProjectModule | UpdateResult>;
    /**
     * @description Find employee project modules
     * @param options - Options finders and relations
     * @returns - A promise that resolves after found project modules
     * @memberof OrganizationProjectModuleService
     */
    getEmployeeProjectModules(options: BaseQueryDTO<OrganizationProjectModule>): Promise<IPagination<IOrganizationProjectModule>>;
    /**
     * @description Find Team's project modules
     * @param options - Options finders and relations
     * @returns - A promise that resolves after found project modules
     * @memberof OrganizationProjectModuleService
     */
    findTeamProjectModules(options: BaseQueryDTO<OrganizationProjectModule>): Promise<IPagination<IOrganizationProjectModule>>;
    /**
     * @description Find project modules by employee
     * @param employeeId - The employee ID for whom to search project modules
     * @param options - Finders options
     * @returns A promise that resolves after found project modules
     * @memberof OrganizationProjectModuleService
     */
    findByEmployee(employeeId: ID, options: IOrganizationProjectModuleFindInput): Promise<IPagination<IOrganizationProjectModule>>;
    /**
     * Updates an organization project module by managing its members and their roles.
     *
     * @param organizationProjectModuleId - ID of the organization project module
     * @param organizationId - ID of the organization
     * @param employees - Array of employees to be assigned to the project
     * @param managerIds - Array of employee IDs to be assigned as managers
     * @param memberIds - Array of employee IDs to be assigned as members
     * @returns Promise<void>
     */
    updateOrganizationProjectModuleMembers(organizationProjectModuleId: ID, organizationId: ID, employees: IEmployee[], managerIds: ID[], memberIds: ID[]): Promise<void>;
    /**
     * Apply pagination and query options
     *
     * @param query - The query builder to apply pagination and options
     * @param options - Pagination and query options
     */
    private applyPaginationAndOptions;
    /**
     * Apply optional filters to the query builder
     */
    private applyOptionalFilters;
    /**
     * Executes the given query with pagination and returns the results.
     *
     * @param query The query builder instance to execute.
     * @returns A promise that resolves to an object containing the paginated items and total count.
     */
    executePaginationQuery<BaseType>(query: SelectQueryBuilder<BaseType>): Promise<IPagination<BaseType>>;
    /**
     * Delete project Module members by IDs.
     *
     * @param memberIds - Array of member IDs to delete
     * @returns A promise that resolves when all deletions are complete
     */
    deleteMemberByIds(memberIds: ID[]): Promise<DeleteResult[]>;
    /**
     * Add the current employee to managerIds if applicable.
     *
     * @param managerIds List of manager IDs.
     * @param currentRoleId The current role ID of the user.
     * @param employeeId The current employee ID.
     */
    private addCurrentEmployeeToManagers;
    /**
     * Retrieve existing tasks from the database that match the provided list.
     *
     * @param tasks - Array of task objects to check.
     * @returns A promise resolving to an array of existing tasks found in the database.
     */
    private getExistingTasks;
    /**
     * Constructs an array of OrganizationProjectModuleEmployee instances,
     * marking specified employees as managers.
     *
     * @param employees - Array of employee entities.
     * @param managerIds - Array of employee IDs designated as managers.
     * @param organizationId - The ID of the organization.
     * @param tenantId - The ID of the tenant.
     * @returns Promise resolving to an array of OrganizationProjectModuleEmployee instances.
     */
    private buildModuleMembers;
    /**
     * Assign tasks to the project module.
     * @param tasks List of tasks to associate with the module.
     * @param projectModule The project module to assign tasks to.
     */
    private assignTasksToModule;
    /**
     * Log activity for a project module.
     * @param projectModule The project module to log.
     * @param organizationId The ID of the organization.
     * @param tenantId The ID of the tenant.
     */
    private logModuleActivity;
}
