import { CommandBus } from '@nestjs/cqrs';
import { DeleteResult } from 'typeorm';
import { ID, IOrganizationProject, IOrganizationProjectEditByEmployeeInput, IOrganizationProjectSetting, IPagination } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from './../core/crud';
import { OrganizationProject } from './organization-project.entity';
import { OrganizationProjectService } from './organization-project.service';
import { CountQueryDTO, RelationsQueryDTO } from './../shared/dto';
import { TenantOrganizationBaseDTO } from './../core/dto';
import { CreateOrganizationProjectDTO, UpdateOrganizationProjectDTO, UpdateProjectSettingDTO, UpdateTaskModeDTO } from './dto';
export declare class OrganizationProjectController extends CrudController<OrganizationProject> {
    private readonly organizationProjectService;
    private readonly commandBus;
    constructor(organizationProjectService: OrganizationProjectService, commandBus: CommandBus);
    /**
     * GET organization projects by employee.
     *
     * @param employeeId - UUID of the employee.
     * @param options - Additional filtering options based on tenant organization.
     * @returns An array of organization projects associated with the employee.
     */
    findProjectsByEmployee(employeeId: ID, options: TenantOrganizationBaseDTO): Promise<IOrganizationProject[]>;
    /**
     * Update organization project by employee.
     *
     * @param body - Payload for updating the organization project by employee.
     * @returns A boolean indicating if the update was successful.
     */
    updateProjectByEmployee(body: IOrganizationProjectEditByEmployeeInput): Promise<boolean>;
    /**
     * Update organization project task view mode.
     *
     * @param id - The UUID of the organization project to update.
     * @param entity - Payload containing the new task view mode settings.
     * @returns The updated organization project.
     */
    updateTaskViewMode(id: ID, entity: UpdateTaskModeDTO): Promise<IOrganizationProject>;
    /**
     * Update organization project settings by ID.
     *
     * @param id - The ID of the organization project to update settings for.
     * @param entity - An object containing the updated project settings.
     * @returns A promise that resolves to an `IOrganizationProjectSetting` object representing the updated project settings.
     */
    updateProjectSetting(id: ID, entity: UpdateProjectSettingDTO): Promise<IOrganizationProjectSetting>;
    /**
     * Finds synced projects with pagination and optional search.
     * @param params - Pagination and filtering parameters.
     * @returns A paginated list of organization projects.
     */
    findSyncedProjects(params: BaseQueryDTO<OrganizationProject>): Promise<IPagination<IOrganizationProject>>;
    /**
     * Get count of organization projects.
     * @param options - Query options for filtering the count of organization projects.
     * @returns The total count of organization projects.
     */
    getCount(options: CountQueryDTO<OrganizationProject>): Promise<number>;
    /**
     * Find all organization projects in the same tenant using pagination.
     * @param filter - Pagination parameters and additional filters.
     * @returns A paginated result containing organization projects.
     */
    pagination(filter: BaseQueryDTO<OrganizationProject>): Promise<IPagination<IOrganizationProject>>;
    /**
     * Find all organization projects.
     * @param params - Pagination parameters and any additional filters.
     * @returns A paginated result containing organization projects.
     */
    findAll(params: BaseQueryDTO<OrganizationProject>): Promise<IPagination<IOrganizationProject>>;
    /**
     * Retrieve an organization project by its ID.
     * @param id - UUID of the organization project.
     * @param options - Optional query parameters for relations.
     * @returns The organization project corresponding to the given ID.
     */
    findById(id: ID, options: RelationsQueryDTO): Promise<IOrganizationProject>;
    /**
     * Create a new organization project.
     * @param entity - Payload for creating a new organization project.
     * @returns The newly created organization project.
     */
    create(entity: CreateOrganizationProjectDTO): Promise<IOrganizationProject>;
    /**
     * Check if an employee is a manager of a specific project.
     * @param projectId - UUID of the organization project.
     * @param employeeId - UUID of the employee.
     * @returns True if the employee is a manager of the project, otherwise false.
     */
    isProjectManager(projectId: ID, employeeId: ID): Promise<boolean>;
    /**
     * Update an organization project by ID.
     * @param id - UUID of the organization project
     * @param entity - Update payload for the organization project
     * @returns The updated organization project.
     */
    update(id: ID, entity: UpdateOrganizationProjectDTO): Promise<IOrganizationProject>;
    /**
     * Delete an organization project by ID.
     * @param id - UUID of the organization project
     */
    delete(id: ID): Promise<DeleteResult>;
}
