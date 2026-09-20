import { ID, IOrganizationSprintTask, ITask } from '@gauzy/contracts';
import { OrganizationSprint, TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class OrganizationSprintTask extends TenantOrganizationBaseEntity implements IOrganizationSprintTask {
    totalWorkedHours?: number;
    /**
     * OrganizationSprint
     */
    organizationSprint: OrganizationSprint;
    organizationSprintId: ID;
    /**
     * Task
     */
    task: ITask;
    taskId: ID;
}
