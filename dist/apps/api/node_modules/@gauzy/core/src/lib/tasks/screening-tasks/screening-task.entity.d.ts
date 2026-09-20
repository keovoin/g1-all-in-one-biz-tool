import { EntityRepositoryType } from '@mikro-orm/core';
import { ID, IScreeningTask, ITask, ScreeningTaskStatusEnum } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../../core/entities/internal';
import { MikroOrmScreeningTaskRepository } from './repository/mikro-orm-screening-task.repository';
export declare class ScreeningTask extends TenantOrganizationBaseEntity implements IScreeningTask {
    [EntityRepositoryType]?: MikroOrmScreeningTaskRepository;
    /**
     * Represents the current state or phase of the screening task.
     */
    status: ScreeningTaskStatusEnum;
    /**
     * Represents the date and time when the screening task is set to on hold.
     */
    onHoldUntil?: Date;
    /**
     * The task associated with the screening task.
     */
    task: ITask;
    /**
     * The ID unique identifier of the associated task.
     */
    taskId: ID;
}
