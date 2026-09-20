import { ID, ITaskView, ITaskViewCreateInput, ITaskViewUpdateInput } from '@gauzy/contracts';
import { TenantAwareCrudService } from '../../core/crud';
import { ActivityLogService } from '../../activity-log/activity-log.service';
import { TaskView } from './view.entity';
import { TypeOrmTaskViewRepository } from './repository/type-orm-task-view.repository';
import { MikroOrmTaskViewRepository } from './repository/mikro-orm-task-view.repository';
export declare class TaskViewService extends TenantAwareCrudService<TaskView> {
    private readonly activityLogService;
    constructor(typeOrmTaskViewRepository: TypeOrmTaskViewRepository, mikroOrmTaskViewRepository: MikroOrmTaskViewRepository, activityLogService: ActivityLogService);
    /**
     * @description Creates a Task View based on provided input
     * @param {ITaskViewCreateInput} entity - Input data for creating the task view
     * @returns A promise resolving to the created Task View
     * @throws BadRequestException if there is an error in the creation process.
     * @memberof TaskViewService
     */
    create(entity: ITaskViewCreateInput): Promise<ITaskView>;
    /**
     * @description Update a Task View
     * @param {ID} id - The ID of the Task View to be updated
     * @param {ITaskViewUpdateInput} input - The updated information for the Task View
     * @throws NotFoundException if there's an error if requested update view was not found.
     * @throws BadRequest if there's an error during the update process.
     * @returns {Promise<ITaskView>} A Promise resolving to the updated Task View
     * @memberof TaskViewService
     */
    update(id: ID, input: ITaskViewUpdateInput): Promise<ITaskView>;
}
