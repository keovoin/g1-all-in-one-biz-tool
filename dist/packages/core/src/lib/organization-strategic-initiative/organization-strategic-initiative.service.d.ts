import { UpdateResult } from 'typeorm';
import { ID, IOrganizationStrategicInitiative, IOrganizationStrategicInitiativeCreateInput, IOrganizationStrategicInitiativeFindInput, IOrganizationStrategicInitiativeUpdateInput, IPagination } from '@gauzy/contracts';
import { BaseQueryDTO, TenantAwareCrudService } from '../core/crud';
import { EmployeeService } from '../employee/employee.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { RoleService } from '../role/role.service';
import { TypeOrmOrganizationTeamEmployeeRepository } from '../organization-team-employee/repository/type-orm-organization-team-employee.repository';
import { TypeOrmOrganizationProjectRepository } from '../organization-project/repository/type-orm-organization-project.repository';
import { OrganizationStrategicInitiative } from './organization-strategic-initiative.entity';
import { TypeOrmOrganizationStrategicInitiativeRepository } from './repository/type-orm-organization-strategic-initiative.repository';
import { MikroOrmOrganizationStrategicInitiativeRepository } from './repository/mikro-orm-organization-strategic-initiative.repository';
export declare class OrganizationStrategicInitiativeService extends TenantAwareCrudService<OrganizationStrategicInitiative> {
    readonly typeOrmOrganizationStrategicInitiativeRepository: TypeOrmOrganizationStrategicInitiativeRepository;
    readonly mikroOrmOrganizationStrategicInitiativeRepository: MikroOrmOrganizationStrategicInitiativeRepository;
    private readonly _employeeService;
    private readonly _activityLogService;
    private readonly _roleService;
    private readonly _typeOrmOrganizationTeamEmployeeRepository;
    private readonly _typeOrmOrganizationProjectRepository;
    constructor(typeOrmOrganizationStrategicInitiativeRepository: TypeOrmOrganizationStrategicInitiativeRepository, mikroOrmOrganizationStrategicInitiativeRepository: MikroOrmOrganizationStrategicInitiativeRepository, _employeeService: EmployeeService, _activityLogService: ActivityLogService, _roleService: RoleService, _typeOrmOrganizationTeamEmployeeRepository: TypeOrmOrganizationTeamEmployeeRepository, _typeOrmOrganizationProjectRepository: TypeOrmOrganizationProjectRepository);
    /**
     * Creates a new organization strategic initiative.
     *
     * @param input - The input data for creating an organization strategic initiative.
     * @returns A promise that resolves to the created organization strategic initiative.
     * @throws {NotFoundException} If the steward employee is not found.
     * @throws {BadRequestException} If an error occurs during the creation.
     */
    create(input: IOrganizationStrategicInitiativeCreateInput): Promise<IOrganizationStrategicInitiative>;
    /**
     * Updates an existing organization strategic initiative.
     *
     * @param id - The unique identifier of the organization strategic initiative to update.
     * @param input - The update data for the organization strategic initiative.
     * @returns A promise that resolves to the updated organization strategic initiative.
     * @throws {NotFoundException} If the organization strategic initiative is not found.
     * @throws {BadRequestException} If the organization strategic initiative update fails.
     */
    update(id: ID, input: IOrganizationStrategicInitiativeUpdateInput): Promise<IOrganizationStrategicInitiative | UpdateResult>;
    /**
     * Finds all strategic initiatives with visibility filtering.
     *
     * @param filters - Filter criteria for initiatives.
     * @returns A promise that resolves to a paginated list of initiatives.
     */
    findAll(filters: BaseQueryDTO<OrganizationStrategicInitiative> & IOrganizationStrategicInitiativeFindInput): Promise<IPagination<IOrganizationStrategicInitiative>>;
    /**
     * Finds a single organization strategic initiative by ID with visibility checks.
     *
     * @param id - The unique identifier of the organization strategic initiative.
     * @param params - Optional query parameters.
     * @returns A promise that resolves to the organization strategic initiative if found and visible.
     * @throws {NotFoundException} If the organization strategic initiative is not found or not visible.
     */
    findOneById(id: ID, params?: BaseQueryDTO<OrganizationStrategicInitiative>): Promise<IOrganizationStrategicInitiative>;
    /**
     * Finds all strategic initiatives linked to a specific project.
     *
     * @param projectId - The project ID.
     * @returns A promise that resolves to a list of initiatives.
     */
    findByProject(projectId: ID): Promise<IOrganizationStrategicInitiative[]>;
    /**
     * Updates the organization strategic signals of an initiative.
     *
     * @param id - The organization strategic initiative ID.
     * @param signals - The new signals data.
     * @returns The updated organization strategic initiative.
     */
    updateSignals(id: ID, signals: IOrganizationStrategicInitiative['signals']): Promise<IOrganizationStrategicInitiative>;
    /**
     * Safely parses a JSON string with a fallback value.
     * Prevents 500 errors from malformed or manually edited database values.
     *
     * @param jsonString - The JSON string to parse.
     * @param fallback - The fallback value if parsing fails.
     * @returns The parsed object or the fallback value.
     */
    private safeJsonParse;
    /**
     * Gets all team IDs that an employee is a member of.
     * This is used to batch-check team membership instead of N+1 queries.
     *
     * @param employeeId - The employee ID.
     * @returns A Set of team IDs the employee belongs to.
     */
    private getEmployeeTeamIds;
    /**
     * Synchronous version of visibility check that uses pre-loaded data.
     * Avoids N+1 queries by using pre-fetched employee team IDs and organization strategic initiative relations.
     *
     * @param organizationStrategicInitiative - The organization strategic initiative (with projects.teams relations loaded).
     * @param employeeId - The current employee ID.
     * @param employeeTeamIds - Pre-fetched Set of team IDs the employee belongs to.
     * @param hasLeadership - Pre-computed leadership access flag.
     * @returns True if the user can view the organization strategic initiative.
     */
    private canViewOrganizationStrategicInitiativeSync;
    /**
     * Synchronous check if employee is a team member of associated projects.
     * Uses pre-loaded relations and pre-fetched team memberships.
     *
     * @param organizationStrategicInitiative - The organization strategic initiative with projects.teams relations already loaded.
     * @param employeeTeamIds - Pre-fetched Set of team IDs the employee belongs to.
     * @returns True if the employee is a team member of associated projects.
     */
    private isTeamMemberOfAssociatedProjectsSync;
    /**
     * Checks if the current user can view a strategic initiative based on visibility scope.
     *
     * Visibility rules:
     * - LEADERSHIP: Only admins/managers can view
     * - ORGANIZATION: All organization members can view
     * - TEAM: Members of teams linked to associated projects can view
     *
     * @param organizationStrategicInitiative - The organization strategic initiative to check.
     * @param employeeId - The current employee ID.
     * @returns True if the user can view the organization strategic initiative.
     */
    private canViewOrganizationStrategicInitiative;
    /**
     * Checks if the current user has leadership access (admin or manager role).
     *
     * @returns True if user has leadership access.
     */
    private hasLeadershipAccess;
    /**
     * Checks if the employee is a member of any team linked to projects associated with the organization strategic initiative.
     *
     * @param organizationStrategicInitiative - The organization strategic initiative.
     * @param employeeId - The employee ID to check.
     * @returns True if the employee is a team member of associated projects.
     */
    private isTeamMemberOfAssociatedProjects;
}
