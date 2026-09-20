import { EntityRepositoryType } from '@mikro-orm/core';
import { ID, IOrganizationProject, IOrganizationTeam, ITaskStatus, TaskStatusEnum } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../../core/entities/internal';
import { MikroOrmTaskStatusRepository } from './repository/mikro-orm-task-status.repository';
export declare class TaskStatus extends TenantOrganizationBaseEntity implements ITaskStatus {
    [EntityRepositoryType]?: MikroOrmTaskStatusRepository;
    name: string;
    value: string;
    description?: string;
    order?: number;
    icon?: string;
    color?: string;
    isSystem?: boolean;
    isCollapsed?: boolean;
    isDefault?: boolean;
    isTodo?: boolean;
    isInProgress?: boolean;
    isDone?: boolean;
    /** Additional virtual columns */
    template?: TaskStatusEnum;
    fullIconUrl?: string;
    /**
     * Organization Project Relationship
     */
    project?: IOrganizationProject;
    /**
     * Organization Project ID
     */
    projectId?: ID;
    /**
     * Organization Team
     */
    organizationTeam?: IOrganizationTeam;
    organizationTeamId?: ID;
}
