import { DeleteResult, UpdateResult } from 'typeorm';
import { ID, IOrganizationTeamEmployee } from '@gauzy/contracts';
import { OrganizationTeamEmployeeService } from './organization-team-employee.service';
import { DeleteTeamMemberQueryDTO, UpdateOrganizationTeamActiveTaskDTO, UpdateTeamMemberDTO } from './dto';
import { OrganizationTeamEmployee } from './organization-team-employee.entity';
export declare class OrganizationTeamEmployeeController {
    private readonly organizationTeamEmployeeService;
    constructor(organizationTeamEmployeeService: OrganizationTeamEmployeeService);
    /**
     * Update a team member by memberId
     *
     * @param id - ID of the team member to update
     * @param entity - Data transfer object for updating team member
     * @returns Updated team member
     */
    update(id: ID, entity: UpdateTeamMemberDTO): Promise<UpdateResult | IOrganizationTeamEmployee>;
    /**
     * Update organization team member's active task entity
     *
     * @param id - ID of the team member
     * @param entity - Data transfer object for updating active task
     * @returns Updated team member
     */
    updateActiveTask(id: ID, entity: UpdateOrganizationTeamActiveTaskDTO): Promise<UpdateResult | IOrganizationTeamEmployee>;
    /**
     * Delete a team member by memberId
     *
     * @param id - ID of the team member to delete
     * @param options - Query parameters for deletion
     * @returns Result of the deletion operation
     */
    delete(id: ID, options: DeleteTeamMemberQueryDTO): Promise<DeleteResult | OrganizationTeamEmployee>;
}
