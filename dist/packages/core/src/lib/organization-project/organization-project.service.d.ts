import { EventBus } from '@nestjs/cqrs';
import { SelectQueryBuilder } from 'typeorm';
import { ID, IEmployee, IOrganizationGithubRepository, IOrganizationProject, IOrganizationProjectCreateInput, IOrganizationProjectEditByEmployeeInput, IOrganizationProjectsFindInput, IOrganizationProjectUpdateInput, IPagination } from '@gauzy/contracts';
import { CustomEmbeddedFieldConfig } from '@gauzy/common';
import { RelationsQueryDTO } from '../shared/dto';
import { BaseQueryDTO, TenantAwareCrudService } from '../core/crud';
import { RoleService } from '../role/role.service';
import { EntitySubscriptionService } from '../entity-subscription/entity-subscription.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { EmployeeService } from '../employee/employee.service';
import { EmployeeRecentVisitService } from '../employee-recent-visit/employee-recent-visit.service';
import { OrganizationProject } from './organization-project.entity';
import { TypeOrmEmployeeRepository } from '../employee/repository/type-orm-employee.repository';
import { TypeOrmOrganizationProjectRepository } from './repository/type-orm-organization-project.repository';
import { MikroOrmOrganizationProjectRepository } from './repository/mikro-orm-organization-project.repository';
import { TypeOrmOrganizationProjectEmployeeRepository } from './repository/type-orm-organization-project-employee.repository';
export declare class OrganizationProjectService extends TenantAwareCrudService<OrganizationProject> {
    readonly typeOrmOrganizationProjectRepository: TypeOrmOrganizationProjectRepository;
    readonly mikroOrmOrganizationProjectRepository: MikroOrmOrganizationProjectRepository;
    readonly typeOrmOrganizationProjectEmployeeRepository: TypeOrmOrganizationProjectEmployeeRepository;
    readonly typeOrmEmployeeRepository: TypeOrmEmployeeRepository;
    private readonly _eventBus;
    private readonly _roleService;
    private readonly _employeeService;
    private readonly _entitySubscriptionService;
    private readonly _activityLogService;
    private readonly _employeeRecentVisitService;
    constructor(typeOrmOrganizationProjectRepository: TypeOrmOrganizationProjectRepository, mikroOrmOrganizationProjectRepository: MikroOrmOrganizationProjectRepository, typeOrmOrganizationProjectEmployeeRepository: TypeOrmOrganizationProjectEmployeeRepository, typeOrmEmployeeRepository: TypeOrmEmployeeRepository, _eventBus: EventBus, _roleService: RoleService, _employeeService: EmployeeService, _entitySubscriptionService: EntitySubscriptionService, _activityLogService: ActivityLogService, _employeeRecentVisitService: EmployeeRecentVisitService);
    /**
     * Creates an organization project based on the provided input.
     * @param input - Input data for creating the organization project.
     * @returns A Promise resolving to the created organization project.
     */
    create(input: IOrganizationProjectCreateInput): Promise<IOrganizationProject>;
    /**
     * Update an organization project.
     *
     * @param id - The ID of the organization project to be updated.
     * @param input - The updated information for the organization project.
     * @returns A Promise resolving to the updated organization project.
     */
    update(id: ID, input: IOrganizationProjectUpdateInput): Promise<IOrganizationProject>;
    /**
     * Find an organization project by ID.
     *
     * @param id - The ID of the organization project to find.
     * @param options - The options for finding the organization project.
     * @returns A promise that resolves with the organization project.
     */
    findById(id: ID, options?: RelationsQueryDTO): Promise<OrganizationProject>;
    /**
     * Delete project members by IDs.
     *
     * @param memberIds - Array of member IDs to delete
     * @returns A promise that resolves when all deletions are complete
     */
    deleteMemberByIds(memberIds: ID[]): Promise<void>;
    /**
     * Updates an organization project by managing its members and their roles.
     *
     * @param organizationProjectId - ID of the organization project
     * @param organizationId - ID of the organization
     * @param employees - Array of employees to be assigned to the project
     * @param managerIds - Array of employee IDs to be assigned as managers
     * @param memberIds - Array of employee IDs to be assigned as members
     * @returns Promise<void>
     */
    updateOrganizationProjectMembers(organizationProjectId: ID, organizationId: ID, tenantId: ID, employees: IEmployee[], managerIds: ID[], memberIds: ID[]): Promise<void>;
    /**
     * Finds projects assigned to a specific employee based on the provided options.
     *
     * @param employeeId - The ID of the employee to find projects for.
     * @param input - Filter options for finding organization projects.
     * @returns A promise that resolves with a list of projects assigned to the employee.
     */
    findByEmployee(employeeId: ID, input: IOrganizationProjectsFindInput): Promise<IOrganizationProject[]>;
    /**
     * Overrides the organization project find all method to handle special cases.
     *
     * @param options - Pagination parameters with optional filters.
     * @returns A promise that resolves with the paginated result of organization projects.
     */
    findAll(options?: BaseQueryDTO<OrganizationProject>): Promise<IPagination<OrganizationProject>>;
    /**
     * Overrides the organization project pagination method to handle filtering by tags.
     *
     * @param options - Pagination parameters with optional filters.
     * @returns A promise that resolves with the paginated result of organization projects.
     */
    pagination(options?: BaseQueryDTO<OrganizationProject>): Promise<IPagination<OrganizationProject>>;
    /**
     * Get organization projects associated with a specific repository.
     *
     * @param repositoryId - The ID of the repository.
     * @param options - An object containing organization, tenant, and integration information.
     * @returns A Promise that resolves to an array of organization projects.
     */
    getProjectsByGithubRepository(repositoryId: IOrganizationGithubRepository['repositoryId'], options: {
        organizationId: ID;
        tenantId: ID;
        integrationId: ID;
        projectId?: ID;
    }): Promise<IOrganizationProject[]>;
    /**
     * Adds custom joins and selects based on the presence of custom fields.
     *
     * @param query - The TypeORM query builder instance.
     * @param customFields - The array of custom fields.
     * @returns The modified query builder instance.
     */
    addCustomFieldJoins<T>(query: SelectQueryBuilder<T>, customFields: CustomEmbeddedFieldConfig[]): SelectQueryBuilder<T>;
    /**
     * Adds custom where conditions based on provided options and tenant ID.
     *
     * @param query - The TypeORM query builder instance.
     * @param tenantId - The tenant ID to be used in the where conditions.
     * @param options - Additional options containing where conditions.
     * @returns The modified query builder instance.
     */
    addWhereConditions<T>(query: SelectQueryBuilder<T>, options?: {
        where?: Record<string, any>;
    }): SelectQueryBuilder<T>;
    /**
     * Find synchronized organization projects with options and count their associated issues.
     *
     * @param options - Query and pagination options (optional).
     * @returns A paginated list of synchronized organization projects with associated issue counts.
     */
    findSyncedProjects(options?: BaseQueryDTO<OrganizationProject>): Promise<IPagination<OrganizationProject>>;
    /**
     * Updates the employee's project associations.
     *
     * This method adds or removes projects for an employee based on the provided input. If the employee is added to
     * new projects, the respective project members are updated. If the employee is removed from projects, the project
     * membership records are deleted.
     *
     * @param input The input data containing information about the employee, projects to add, projects to remove, and the organization.
     * @returns A Promise that resolves to `true` when the update is successful.
     */
    updateByEmployee(input: IOrganizationProjectEditByEmployeeInput): Promise<boolean>;
    /**
     * Checks if a given employee is a manager of a specific project.
     *
     * @param projectId - The ID of the project.
     * @param employeeId - The ID of the employee.
     * @returns A boolean indicating whether the employee is a manager of the project.
     */
    isManagerOfProject(projectId: ID, employeeId: ID): Promise<boolean>;
}
