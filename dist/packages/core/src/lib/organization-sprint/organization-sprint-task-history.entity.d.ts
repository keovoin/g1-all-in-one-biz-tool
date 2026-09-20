import { ID, IOrganizationSprintTaskHistory, ITask, IUser } from '@gauzy/contracts';
import { OrganizationSprint, TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class OrganizationSprintTaskHistory extends TenantOrganizationBaseEntity implements IOrganizationSprintTaskHistory {
    reason?: string;
    /**
     * Task
     */
    task: ITask;
    taskId: ID;
    /**
     * From OrganizationSprint
     */
    fromSprint: OrganizationSprint;
    fromSprintId: ID;
    /**
     * To OrganizationSprint
     */
    toSprint: OrganizationSprint;
    toSprintId: ID;
    /**
     * User moved issue
     */
    movedBy?: IUser;
    movedById?: ID;
}
