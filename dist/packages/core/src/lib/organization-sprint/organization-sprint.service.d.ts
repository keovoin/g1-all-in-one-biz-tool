import { EventBus } from '@nestjs/cqrs';
import { ID, IEmployee, IOrganizationSprint, IOrganizationSprintCreateInput, IOrganizationSprintUpdateInput } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud';
import { EntitySubscriptionService } from '../entity-subscription/entity-subscription.service';
import { RoleService } from '../role/role.service';
import { EmployeeService } from '../employee/employee.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { OrganizationSprint } from './organization-sprint.entity';
import { TypeOrmEmployeeRepository } from '../employee/repository/type-orm-employee.repository';
import { TypeOrmOrganizationSprintRepository } from './repository/type-orm-organization-sprint.repository';
import { TypeOrmOrganizationSprintEmployeeRepository } from './repository/type-orm-organization-sprint-employee.repository';
import { MikroOrmOrganizationSprintRepository } from './repository/mikro-orm-organization-sprint.repository';
import { MikroOrmOrganizationSprintEmployeeRepository } from './repository/mikro-orm-organization-sprint-employee.repository';
export declare class OrganizationSprintService extends TenantAwareCrudService<OrganizationSprint> {
    readonly typeOrmOrganizationSprintRepository: TypeOrmOrganizationSprintRepository;
    readonly mikroOrmOrganizationSprintRepository: MikroOrmOrganizationSprintRepository;
    readonly typeOrmOrganizationSprintEmployeeRepository: TypeOrmOrganizationSprintEmployeeRepository;
    readonly mikroOrmOrganizationSprintEmployeeRepository: MikroOrmOrganizationSprintEmployeeRepository;
    readonly typeOrmEmployeeRepository: TypeOrmEmployeeRepository;
    private readonly _eventBus;
    private readonly _roleService;
    private readonly _employeeService;
    private readonly _entitySubscriptionService;
    private readonly _activityLogService;
    constructor(typeOrmOrganizationSprintRepository: TypeOrmOrganizationSprintRepository, mikroOrmOrganizationSprintRepository: MikroOrmOrganizationSprintRepository, typeOrmOrganizationSprintEmployeeRepository: TypeOrmOrganizationSprintEmployeeRepository, mikroOrmOrganizationSprintEmployeeRepository: MikroOrmOrganizationSprintEmployeeRepository, typeOrmEmployeeRepository: TypeOrmEmployeeRepository, _eventBus: EventBus, _roleService: RoleService, _employeeService: EmployeeService, _entitySubscriptionService: EntitySubscriptionService, _activityLogService: ActivityLogService);
    /**
     * Creates an organization sprint based on the provided input.
     * @param input - Input data for creating the organization sprint.
     * @returns A Promise resolving to the created organization sprint.
     * @throws BadRequestException if there is an error in the creation process.
     */
    create(input: IOrganizationSprintCreateInput): Promise<IOrganizationSprint>;
    /**
     * Update an organization sprint.
     *
     * @param id - The ID of the organization sprint to be updated.
     * @param input - The updated information for the organization sprint.
     * @returns A Promise resolving to the updated organization sprint.
     * @throws ForbiddenException if the user lacks permission or if certain conditions are not met.
     * @throws BadRequestException if there's an error during the update process.
     */
    update(id: ID, input: IOrganizationSprintUpdateInput): Promise<IOrganizationSprint>;
    /**
     * Delete sprint members by IDs.
     *
     * @param memberIds - Array of member IDs to delete
     * @returns A promise that resolves when all deletions are complete
     */
    deleteMemberByIds(memberIds: ID[]): Promise<void>;
    /**
     * Updates an organization sprint by managing its members and their roles.
     *
     * @param organizationSprintId - ID of the organization sprint
     * @param organizationId - ID of the organization
     * @param employees - Array of employees to be assigned to the sprint
     * @param managerIds - Array of employee IDs to be assigned as managers
     * @param memberIds - Array of employee IDs to be assigned as members
     * @returns Promise<void>
     */
    updateOrganizationSprintMembers(organizationSprintId: ID, organizationId: ID, employees: IEmployee[], managerIds: ID[], memberIds: ID[]): Promise<void>;
}
