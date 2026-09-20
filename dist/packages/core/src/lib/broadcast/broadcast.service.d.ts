import { DataSource, UpdateResult } from 'typeorm';
import { IBroadcast, IBroadcastCreateInput, IBroadcastUpdateInput, ID, IPagination } from '@gauzy/contracts';
import { BaseQueryDTO, TenantAwareCrudService } from '../core/crud';
import { EmployeeService } from '../employee/employee.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { RoleService } from '../role/role.service';
import { EmployeeNotificationService } from '../employee-notification/employee-notification.service';
import { TypeOrmOrganizationTeamEmployeeRepository } from '../organization-team-employee/repository/type-orm-organization-team-employee.repository';
import { Broadcast } from './broadcast.entity';
import { TypeOrmBroadcastRepository } from './repository/type-orm-broadcast.repository';
import { MikroOrmBroadcastRepository } from './repository/mikro-orm-broadcast.repository';
export declare class BroadcastService extends TenantAwareCrudService<Broadcast> {
    private readonly dataSource;
    readonly typeOrmBroadcastRepository: TypeOrmBroadcastRepository;
    readonly mikroOrmBroadcastRepository: MikroOrmBroadcastRepository;
    private readonly _employeeService;
    private readonly _activityLogService;
    private readonly _roleService;
    private readonly _employeeNotificationService;
    private readonly _typeOrmOrganizationTeamEmployeeRepository;
    constructor(dataSource: DataSource, typeOrmBroadcastRepository: TypeOrmBroadcastRepository, mikroOrmBroadcastRepository: MikroOrmBroadcastRepository, _employeeService: EmployeeService, _activityLogService: ActivityLogService, _roleService: RoleService, _employeeNotificationService: EmployeeNotificationService, _typeOrmOrganizationTeamEmployeeRepository: TypeOrmOrganizationTeamEmployeeRepository);
    /**
     * Creates a new broadcast.
     *
     * @param input - The input data for creating a broadcast.
     * @returns A promise that resolves to the created broadcast.
     * @throws {NotFoundException} If the employee (publisher) is not found.
     * @throws {BadRequestException} If an error occurs during the creation.
     */
    create(input: IBroadcastCreateInput): Promise<IBroadcast>;
    /**
     * Updates an existing broadcast.
     *
     * @param id - The unique identifier of the broadcast to update.
     * @param input - The update data for the broadcast.
     * @returns A promise that resolves to the updated broadcast or update result.
     * @throws {BadRequestException} If the broadcast is not found or update fails.
     */
    update(id: ID, input: IBroadcastUpdateInput): Promise<IBroadcast | UpdateResult>;
    /**
     * Finds broadcasts with visibility and audience filtering.
     *
     * @param filters - Filter criteria for broadcasts.
     * @returns A promise that resolves to a paginated list of broadcasts.
     */
    findAll(filters: BaseQueryDTO<Broadcast>): Promise<IPagination<IBroadcast>>;
    /**
     * Finds a single broadcast by ID with visibility checks.
     *
     * @param id - The unique identifier of the broadcast.
     * @param relations - Optional relations to load.
     * @returns A promise that resolves to the broadcast if found and visible.
     * @throws {NotFoundException} If the broadcast is not found or not visible to the current user.
     */
    findOneById(id: ID, params?: BaseQueryDTO<Broadcast>): Promise<IBroadcast>;
    /**
     * Checks if the current user can view a broadcast based on visibility mode and audience rules.
     *
     * @param broadcast - The broadcast to check.
     * @param employeeId - The current employee ID.
     * @param userId - The current user ID.
     * @param roleId - The current role ID.
     * @returns True if the user can view the broadcast, false otherwise.
     */
    private canViewBroadcast;
    /**
     * Checks if an employee is a member of a specific entity by loading the entity with its members relation.
     * Supports: Organization (employees), OrganizationProject, OrganizationTeam, OrganizationDepartment (members).
     *
     * @param entity - The entity type.
     * @param entityId - The entity ID.
     * @param employeeId - The employee ID to check.
     * @returns True if the employee is a member of the entity.
     */
    private isEntityMember;
    /**
     * Checks if the current user matches the audience rules.
     *
     * @param audienceRules - The audience rules to check.
     * @param employeeId - The current employee ID.
     * @param userId - The current user ID.
     * @param roleId - The current role ID.
     * @returns True if the user matches the audience rules, false otherwise.
     */
    private checkAudienceRules;
    /**
     * Notifies the audience of a new broadcast based on visibility mode and audience rules.
     *
     * @param broadcast - The broadcast to notify about.
     * @param publisherName - The name of the employee who published the broadcast.
     */
    private notifyAudience;
    /**
     * Gets employee IDs that are members of the broadcast's entity.
     *
     * @param broadcast - The broadcast containing entity information.
     * @returns Array of employee IDs.
     */
    private getEntityMemberIds;
    /**
     * Gets employee IDs from restricted audience rules.
     *
     * @param audienceRules - The audience rules defining who can view.
     * @param organizationId - The organization ID.
     * @param tenantId - The tenant ID.
     * @returns Array of employee IDs.
     */
    private getRestrictedAudienceIds;
}
