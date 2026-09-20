import { ID, IOrganizationProjectModule, IOrganizationSprint, IOrganizationSprintEmployee, IOrganizationSprintTask, IOrganizationSprintTaskHistory, JsonData, ITaskView, OrganizationSprintStatusEnum } from '@gauzy/contracts';
import { OrganizationProject, Task, TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class OrganizationSprint extends TenantOrganizationBaseEntity implements IOrganizationSprint {
    name: string;
    goal?: string;
    length: number;
    startDate?: Date;
    endDate?: Date;
    status?: OrganizationSprintStatusEnum;
    dayStart?: number;
    sprintProgress?: JsonData;
    /**
     * OrganizationProject Relationship
     */
    project: OrganizationProject;
    projectId: ID;
    /**
     * OrganizationTeamEmployee
     */
    members?: IOrganizationSprintEmployee[];
    /**
     * Sprint Tasks (Many-To-Many sprint tasks)
     */
    taskSprints?: IOrganizationSprintTask[];
    /**
     * Tasks (Task active sprint)
     */
    tasks?: Task[];
    /**
     * Sprint views
     */
    views?: ITaskView[];
    /**
     * From OrganizationSprint histories
     */
    fromSprintTaskHistories?: IOrganizationSprintTaskHistory[];
    /**
     * From OrganizationSprint histories
     */
    toSprintTaskHistories?: IOrganizationSprintTaskHistory[];
    /**
     * Organization Project Module
     */
    modules?: IOrganizationProjectModule[];
}
