import { ICommandHandler, EventBus as CqrsEventBus } from '@nestjs/cqrs';
import { ITask } from '@gauzy/contracts';
import { EventBus } from '../../../event-bus';
import { OrganizationProjectService } from './../../../organization-project/organization-project.service';
import { TaskCreateCommand } from './../task-create.command';
import { TaskService } from '../../task.service';
import { EmployeeService } from '../../../employee/employee.service';
import { MentionService } from '../../../mention/mention.service';
import { ActivityLogService } from '../../../activity-log/activity-log.service';
import { EmployeeNotificationService } from '../../../employee-notification/employee-notification.service';
export declare class TaskCreateHandler implements ICommandHandler<TaskCreateCommand> {
    private readonly _eventBus;
    private readonly _cqrsEventBus;
    private readonly _taskService;
    private readonly _organizationProjectService;
    private readonly _employeeService;
    private readonly mentionService;
    private readonly activityLogService;
    private readonly employeeNotificationService;
    private readonly logger;
    constructor(_eventBus: EventBus, _cqrsEventBus: CqrsEventBus, _taskService: TaskService, _organizationProjectService: OrganizationProjectService, _employeeService: EmployeeService, mentionService: MentionService, activityLogService: ActivityLogService, employeeNotificationService: EmployeeNotificationService);
    /**
     * Executes the task creation command, handling project association and event publishing.
     *
     * @param command The command containing task creation input and event triggering flag.
     * @returns The created task.
     */
    execute(command: TaskCreateCommand): Promise<ITask>;
}
