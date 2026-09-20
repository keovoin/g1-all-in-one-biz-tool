"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const event_bus_1 = require("../../../event-bus");
const events_1 = require("../../../event-bus/events");
const base_entity_event_1 = require("../../../event-bus/base-entity-event");
const internal_1 = require("../../../core/entities/internal");
const context_1 = require("./../../../core/context");
const organization_project_service_1 = require("./../../../organization-project/organization-project.service");
const events_2 = require("../../../entity-subscription/events");
const task_create_command_1 = require("./../task-create.command");
const task_service_1 = require("../../task.service");
const employee_service_1 = require("../../../employee/employee.service");
const mention_service_1 = require("../../../mention/mention.service");
const activity_log_service_1 = require("../../../activity-log/activity-log.service");
const employee_notification_service_1 = require("../../../employee-notification/employee-notification.service");
let TaskCreateHandler = class TaskCreateHandler {
    constructor(_eventBus, _cqrsEventBus, _taskService, _organizationProjectService, _employeeService, mentionService, activityLogService, employeeNotificationService) {
        this._eventBus = _eventBus;
        this._cqrsEventBus = _cqrsEventBus;
        this._taskService = _taskService;
        this._organizationProjectService = _organizationProjectService;
        this._employeeService = _employeeService;
        this.mentionService = mentionService;
        this.activityLogService = activityLogService;
        this.employeeNotificationService = employeeNotificationService;
        this.logger = new common_1.Logger('TaskCreateCommand');
    }
    /**
     * Executes the task creation command, handling project association and event publishing.
     *
     * @param command The command containing task creation input and event triggering flag.
     * @returns The created task.
     */
    async execute(command) {
        try {
            // Destructure input and triggered event flag from the command
            const { input, triggeredEvent } = command;
            const { organizationId, mentionEmployeeIds = [], members = [], ...data } = input;
            // Retrieve current tenant ID from request context or use input tenant ID
            const tenantId = context_1.RequestContext.currentTenantId() ?? data.tenantId;
            // Retrieve current user and employee from the request context
            const user = context_1.RequestContext.currentUser();
            const employeeId = context_1.RequestContext.currentEmployeeId();
            if (employeeId) {
                try {
                    const employee = await this._employeeService.findOneByIdString(employeeId);
                    // Automatically add the current employee to members if not already included
                    if (employee && !members.find((member) => member.id === employeeId)) {
                        members.push(employee);
                    }
                }
                catch (error) {
                    this.logger.error(`Unable to retrieve employee for ID: ${employeeId}. Error: ${error.message}`, error.stack);
                    throw new common_1.HttpException('Error while retrieving employee information', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
            // Determine the project based on the provided data
            const project = data.projectId
                ? await this._organizationProjectService.findOneByIdString(data.projectId)
                : data.project ?? null;
            // Extract the project prefix (first 3 characters of the project name) if the project exists
            const projectPrefix = project?.name?.slice(0, 3) || null;
            // Log or throw an exception if both projectId and project are not provided (optional)
            if (!project) {
                this.logger.warn('No projectId or project provided. Proceeding without project information.');
            }
            // Retrieve the maximum task number for the specified project, or handle null projectId if no project
            const maxNumber = await this._taskService.getMaxTaskNumberByProject({
                tenantId,
                organizationId,
                projectId: project?.id ?? null // If no project is provided, this will pass null for projectId
            });
            // Create the task with incremented number, project prefix, and other task details
            const task = await this._taskService.create({
                ...data, // Spread the input properties
                members: members.map(({ id }) => new internal_1.Employee({ id })),
                number: maxNumber + 1, // Increment the task number
                prefix: projectPrefix, // Use the project prefix, or null if no project
                tenantId, // Pass the tenant ID
                organizationId // Pass the organization ID
            });
            // Publish a task created event if triggeredEvent flag is set
            if (triggeredEvent) {
                const ctx = context_1.RequestContext.currentRequestContext(); // Get current request context;
                this._eventBus.publish(new events_1.TaskEvent(ctx, task, base_entity_event_1.BaseEntityEventTypeEnum.CREATED, data)); // Publish the event using EventBus
            }
            // Apply mentions if needed
            if (mentionEmployeeIds.length > 0) {
                await Promise.all(mentionEmployeeIds.map((mentionedEmployeeId) => this.mentionService.publishMention({
                    entity: contracts_1.BaseEntityEnum.Task,
                    entityId: task.id,
                    mentionedEmployeeId,
                    entityName: task.title,
                    employeeId: user?.employeeId,
                    organizationId,
                    tenantId
                })));
            }
            // Subscribe creator to the task
            this._cqrsEventBus.publish(new events_2.CreateEntitySubscriptionEvent({
                entity: contracts_1.BaseEntityEnum.Task,
                entityId: task.id,
                employeeId: user?.employeeId,
                type: contracts_1.EntitySubscriptionTypeEnum.CREATED_ENTITY,
                organizationId,
                tenantId
            }));
            // Subscribe assignees to the task
            if (members.length > 0) {
                try {
                    // Map employee IDs to IDs
                    const employeeIds = members.map(({ id }) => id);
                    // Find active employees by employee IDs
                    const employees = await this._employeeService.findActiveEmployeesByEmployeeIds(employeeIds, organizationId, tenantId);
                    // Publish subscription events for each employee and send internal notification to users
                    await Promise.all(employees.map((employee) => {
                        this._cqrsEventBus.publish(new events_2.CreateEntitySubscriptionEvent({
                            entity: contracts_1.BaseEntityEnum.Task,
                            entityId: task.id,
                            employeeId: employee.id,
                            type: contracts_1.EntitySubscriptionTypeEnum.ASSIGNMENT,
                            organizationId,
                            tenantId
                        }));
                        this.employeeNotificationService.publishNotificationEvent({
                            entity: contracts_1.BaseEntityEnum.Task,
                            entityId: task.id,
                            type: contracts_1.EmployeeNotificationTypeEnum.ASSIGNMENT,
                            organizationId,
                            tenantId
                        }, contracts_1.NotificationActionTypeEnum.Assigned, task.title, user.name);
                    }));
                }
                catch (error) {
                    this.logger.error('Error while subscribing members to task', error);
                }
            }
            // Generate the activity log
            this.activityLogService.logActivity(contracts_1.BaseEntityEnum.Task, contracts_1.ActionTypeEnum.Created, contracts_1.ActorTypeEnum.User, // TODO : Since we have Github Integration, make sure we can also store "System" for actor
            task.id, task.title, task, organizationId, tenantId);
            return task; // Return the created task
        }
        catch (error) {
            // Handle errors during task creation
            this.logger.error(`Error while creating task: ${error.message}`, error.message);
            throw new common_1.HttpException({ message: error?.message, error }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.TaskCreateHandler = TaskCreateHandler;
exports.TaskCreateHandler = TaskCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(task_create_command_1.TaskCreateCommand),
    tslib_1.__metadata("design:paramtypes", [event_bus_1.EventBus,
        cqrs_1.EventBus,
        task_service_1.TaskService,
        organization_project_service_1.OrganizationProjectService,
        employee_service_1.EmployeeService,
        mention_service_1.MentionService,
        activity_log_service_1.ActivityLogService,
        employee_notification_service_1.EmployeeNotificationService])
], TaskCreateHandler);
//# sourceMappingURL=task-create.handler.js.map