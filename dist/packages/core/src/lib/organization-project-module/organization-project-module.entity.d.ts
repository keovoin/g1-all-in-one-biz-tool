import { EntityRepositoryType } from '@mikro-orm/core';
import { ID, IOrganizationProject, IOrganizationProjectModule, IOrganizationProjectModuleEmployee, IOrganizationSprint, IOrganizationTeam, ITask, ITaskView, ProjectModuleStatusEnum } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
import { MikroOrmOrganizationProjectModuleRepository } from './repository/mikro-orm-organization-project-module.repository';
export declare class OrganizationProjectModule extends TenantOrganizationBaseEntity implements IOrganizationProjectModule {
    [EntityRepositoryType]?: MikroOrmOrganizationProjectModuleRepository;
    /**
     * Name of the project module
     */
    name: string;
    /**
     * Description of the project module
     */
    description?: string;
    /**
     * Status of the project module
     */
    status?: ProjectModuleStatusEnum;
    /**
     * Start date of the project module
     */
    startDate?: Date;
    /**
     * End date of the project module
     */
    endDate?: Date;
    /**
     * Indicates if the project module is public
     */
    public?: boolean;
    /**
     * Indicates if the project module is favorite
     */
    isFavorite?: boolean;
    /**
     * The parent module. This property is used to determine the hierarchy of modules.
     */
    parent?: OrganizationProjectModule;
    /**
     * The ID of the parent module.
     */
    parentId?: ID;
    /**
     * The project associated with the module.
     */
    project?: IOrganizationProject;
    /**
     * The ID of the project associated with the module.
     */
    projectId?: ID;
    /**
     * The children modules.
     */
    children?: OrganizationProjectModule[];
    /**
     * The views of the module.
     */
    views?: ITaskView[];
    /**
     * The members of the module.
     */
    members?: IOrganizationProjectModuleEmployee[];
    /**
     * The tasks of the module.
     */
    tasks?: ITask[];
    /**
     * The organization sprints of the module.
     */
    organizationSprints?: IOrganizationSprint[];
    /**
     * The organization teams of the module.
     */
    teams?: IOrganizationTeam[];
}
