import { EventBus } from '@nestjs/cqrs';
import { ID, IScreeningTask, IScreeningTaskCreateInput, IScreeningTaskUpdateInput } from '@gauzy/contracts';
import { TenantAwareCrudService } from '../../core/crud';
import { TaskService } from '../task.service';
import { OrganizationProjectService } from '../../organization-project';
import { ActivityLogService } from '../../activity-log/activity-log.service';
import { MentionService } from '../../mention/mention.service';
import { ScreeningTask } from './screening-task.entity';
import { TypeOrmScreeningTaskRepository } from './repository/type-orm-screening-task.repository';
import { MikroOrmScreeningTaskRepository } from './repository/mikro-orm-screening-task.repository';
export declare class ScreeningTasksService extends TenantAwareCrudService<ScreeningTask> {
    readonly typeOrmScreeningTaskRepository: TypeOrmScreeningTaskRepository;
    readonly mikroOrmScreeningTaskRepository: MikroOrmScreeningTaskRepository;
    private readonly eventBus;
    private readonly taskService;
    private readonly organizationProjectService;
    private readonly mentionService;
    private readonly activityLogService;
    constructor(typeOrmScreeningTaskRepository: TypeOrmScreeningTaskRepository, mikroOrmScreeningTaskRepository: MikroOrmScreeningTaskRepository, eventBus: EventBus, taskService: TaskService, organizationProjectService: OrganizationProjectService, mentionService: MentionService, activityLogService: ActivityLogService);
    /**
     * Creates a new screening task along with its associated task, subscriptions, mentions, and activity logs.
     *
     * @param {IScreeningTaskCreateInput} input - The input data required to create the screening task.
     * @returns {Promise<IScreeningTask>} A promise that resolves to the created screening task.
     * @throws {HttpException} an exception if the creation process fails.
     */
    create(input: IScreeningTaskCreateInput): Promise<IScreeningTask>;
    /**
     * Updates an existing screening task and synchronizes related task data and activity logs.
     *
     * @param {ID} id - The unique identifier of the screening task to update.
     * @param {IScreeningTaskUpdateInput} input - The data to update the screening task with.
     * @returns {Promise<IScreeningTask>} A promise resolving to the updated screening task.
     * @throws {HttpException} a BadRequest exception if the update process fails.
     */
    update(id: ID, input: IScreeningTaskUpdateInput): Promise<IScreeningTask>;
}
