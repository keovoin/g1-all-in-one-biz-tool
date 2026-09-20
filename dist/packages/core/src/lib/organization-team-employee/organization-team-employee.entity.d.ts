import { ID, IEmployee, IOrganizationTeam, IOrganizationTeamEmployee, IRole, ITask } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class OrganizationTeamEmployee extends TenantOrganizationBaseEntity implements IOrganizationTeamEmployee {
    order?: number;
    isTrackingEnabled?: boolean;
    isManager?: boolean;
    assignedAt?: Date;
    /**
     * member's active task
     */
    activeTask?: ITask;
    activeTaskId?: ID;
    /**
     * OrganizationTeam
     */
    organizationTeam: IOrganizationTeam;
    organizationTeamId: ID;
    /**
     * Employee
     */
    employee: IEmployee;
    employeeId: ID;
    /**
     * Role
     */
    role?: IRole;
    roleId?: ID;
}
