import { EventBus } from '@nestjs/cqrs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ID, IEmployee, IOrganizationTeamEmployeeActiveTaskUpdateInput, IOrganizationTeamEmployeeFindInput, IOrganizationTeamEmployeeUpdateInput } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud';
import { Role } from './../core/entities/internal';
import { OrganizationTeamEmployee } from './organization-team-employee.entity';
import { TaskService } from './../tasks/task.service';
import { EntitySubscriptionService } from '../entity-subscription/entity-subscription.service';
import { TypeOrmOrganizationTeamEmployeeRepository } from './repository/type-orm-organization-team-employee.repository';
import { MikroOrmOrganizationTeamEmployeeRepository } from './repository/mikro-orm-organization-team-employee.repository';
export declare class OrganizationTeamEmployeeService extends TenantAwareCrudService<OrganizationTeamEmployee> {
    readonly typeOrmOrganizationTeamEmployeeRepository: TypeOrmOrganizationTeamEmployeeRepository;
    readonly mikroOrmOrganizationTeamEmployeeRepository: MikroOrmOrganizationTeamEmployeeRepository;
    private readonly _eventBus;
    private readonly _taskService;
    private readonly _entitySubscriptionService;
    constructor(typeOrmOrganizationTeamEmployeeRepository: TypeOrmOrganizationTeamEmployeeRepository, mikroOrmOrganizationTeamEmployeeRepository: MikroOrmOrganizationTeamEmployeeRepository, _eventBus: EventBus, _taskService: TaskService, _entitySubscriptionService: EntitySubscriptionService);
    /**
     * Update organization team by managing its members and their roles.
     *
     * @param organizationTeamId - ID of the organization team
     * @param organizationId - ID of the organization
     * @param employees - Array of employees to be assigned to the team
     * @param role - The role to assign to managers in the team
     * @param managerIds - Array of employee IDs to be assigned as managers
     * @param memberIds - Array of employee IDs to be assigned as members
     * @returns Promise<void>
     */
    updateOrganizationTeam(organizationTeamId: ID, organizationId: ID, employees: IEmployee[], role: Role, managerIds: ID[], memberIds: ID[]): Promise<void>;
    /**
     * Update organization team member entity
     *
     * @param memberId - The ID of the organization team member to update
     * @param entity - The input data for updating the organization team member
     * @returns The updated OrganizationTeamEmployee or UpdateResult
     */
    update(memberId: ID, entity: IOrganizationTeamEmployeeUpdateInput): Promise<OrganizationTeamEmployee | UpdateResult>;
    /**
     * Update organization team member active task entity
     *
     * @param memberId - The ID of the organization team member to update
     * @param entity - The input data for updating the active task
     * @returns The updated OrganizationTeamEmployee or UpdateResult
     */
    updateActiveTask(memberId: ID, entity: IOrganizationTeamEmployeeActiveTaskUpdateInput): Promise<OrganizationTeamEmployee | UpdateResult>;
    /**
     * Delete a team member by their ID.
     *
     * @param memberId - ID of the team member to delete
     * @param options - Options for the team member find query
     * @returns A promise resolving to the result of the deletion operation
     */
    deleteTeamMember(memberId: ID, options: IOrganizationTeamEmployeeFindInput): Promise<DeleteResult | OrganizationTeamEmployee>;
}
