import { ICommandHandler, EventBus } from '@nestjs/cqrs';
import { ID, IIntegrationMap, ITask, ITaskCreateInput, ITaskUpdateInput } from '@gauzy/contracts';
import { EntitySubscriptionService } from '../../../entity-subscription/entity-subscription.service';
import { AutomationTaskSyncCommand } from './../automation-task.sync.command';
import { EmployeeService } from '../../../employee/employee.service';
import { ActivityLogService } from '../../../activity-log/activity-log.service';
import { TaskService } from './../../task.service';
import { TypeOrmIntegrationMapRepository } from '../../../integration-map/repository/type-orm-integration-map.repository';
import { TypeOrmTaskStatusRepository } from '../../statuses/repository/type-orm-task-status.repository';
import { TypeOrmTaskRepository } from '../../repository/type-orm-task.repository';
export declare class AutomationTaskSyncHandler implements ICommandHandler<AutomationTaskSyncCommand> {
    readonly typeOrmTaskRepository: TypeOrmTaskRepository;
    readonly typeOrmTaskStatusRepository: TypeOrmTaskStatusRepository;
    readonly typeOrmIntegrationMapRepository: TypeOrmIntegrationMapRepository;
    private readonly _eventBus;
    private readonly _taskService;
    private readonly activityLogService;
    private readonly _employeeService;
    private readonly _entitySubscriptionService;
    constructor(typeOrmTaskRepository: TypeOrmTaskRepository, typeOrmTaskStatusRepository: TypeOrmTaskStatusRepository, typeOrmIntegrationMapRepository: TypeOrmIntegrationMapRepository, _eventBus: EventBus, _taskService: TaskService, activityLogService: ActivityLogService, _employeeService: EmployeeService, _entitySubscriptionService: EntitySubscriptionService);
    /**
     * Executes the synchronization of automation tasks with the integration map.
     *
     * @param {AutomationTaskSyncCommand} command - The command containing the input data.
     * @returns {Promise<IIntegrationMap>} - The integration map after synchronization.
     */
    execute(command: AutomationTaskSyncCommand): Promise<IIntegrationMap>;
    /**
     * Creates a new task within a project.
     *
     * @param options - An object containing parameters for task creation.
     * @returns A Promise that resolves to the newly created task.
     */
    createTask(options: {
        projectId: ID;
        organizationId: ID;
        tenantId: ID;
    }, entity: ITaskCreateInput | ITaskUpdateInput): Promise<ITask>;
    /**
     * Updates a task with new data.
     *
     * @param id - The ID of the task to update.
     * @param entity - The new data for the task.
     * @returns A Promise that resolves to the updated task.
     */
    updateTask(id: ID, entity: ITaskUpdateInput): Promise<ITask>;
}
