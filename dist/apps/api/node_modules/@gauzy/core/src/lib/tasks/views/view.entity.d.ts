import { ID, IOrganizationProject, IOrganizationProjectModule, IOrganizationSprint, IOrganizationTeam, ITaskView, JsonData, VisibilityLevelEnum } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../../core/entities/internal';
export declare class TaskView extends TenantOrganizationBaseEntity implements ITaskView {
    name: string;
    description?: string;
    visibilityLevel?: VisibilityLevelEnum;
    queryParams?: JsonData;
    filterOptions?: JsonData;
    displayOptions?: JsonData;
    properties?: Record<string, boolean>;
    isLocked?: boolean;
    /**
     * Organization Project Relationship
     */
    project?: IOrganizationProject;
    /**
     * Organization Project ID
     */
    projectId?: ID;
    /**
     * Organization Team Relationship
     */
    organizationTeam?: IOrganizationTeam;
    /**
     * Organization Team ID
     */
    organizationTeamId?: ID;
    /**
     * Organization Project Module Relationship
     */
    projectModule?: IOrganizationProjectModule;
    /**
     * Organization Project Module ID
     */
    projectModuleId?: ID;
    /**
     * Organization Sprint Relationship
     */
    organizationSprint?: IOrganizationSprint;
    /**
     * Organization Sprint ID
     */
    organizationSprintId?: ID;
}
