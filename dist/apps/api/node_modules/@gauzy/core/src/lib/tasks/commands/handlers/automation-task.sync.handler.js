"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationTaskSyncHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const chalk = require("chalk");
const contracts_1 = require("@gauzy/contracts");
const context_1 = require("../../../core/context");
const internal_1 = require("../../../core/entities/internal");
const events_1 = require("../../../entity-subscription/events");
const entity_subscription_service_1 = require("../../../entity-subscription/entity-subscription.service");
const automation_task_sync_command_1 = require("./../automation-task.sync.command");
const employee_service_1 = require("../../../employee/employee.service");
const activity_log_service_1 = require("../../../activity-log/activity-log.service");
const task_service_1 = require("./../../task.service");
const task_entity_1 = require("./../../task.entity");
const type_orm_integration_map_repository_1 = require("../../../integration-map/repository/type-orm-integration-map.repository");
const type_orm_task_status_repository_1 = require("../../statuses/repository/type-orm-task-status.repository");
const type_orm_task_repository_1 = require("../../repository/type-orm-task.repository");
let AutomationTaskSyncHandler = class AutomationTaskSyncHandler {
    constructor(typeOrmTaskRepository, typeOrmTaskStatusRepository, typeOrmIntegrationMapRepository, _eventBus, _taskService, activityLogService, _employeeService, _entitySubscriptionService) {
        this.typeOrmTaskRepository = typeOrmTaskRepository;
        this.typeOrmTaskStatusRepository = typeOrmTaskStatusRepository;
        this.typeOrmIntegrationMapRepository = typeOrmIntegrationMapRepository;
        this._eventBus = _eventBus;
        this._taskService = _taskService;
        this.activityLogService = activityLogService;
        this._employeeService = _employeeService;
        this._entitySubscriptionService = _entitySubscriptionService;
    }
    /**
     * Executes the synchronization of automation tasks with the integration map.
     *
     * @param {AutomationTaskSyncCommand} command - The command containing the input data.
     * @returns {Promise<IIntegrationMap>} - The integration map after synchronization.
     */
    async execute(command) {
        try {
            const { input } = command;
            const { sourceId, integrationId, organizationId, entity } = input;
            const { projectId } = entity;
            const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
            try {
                const taskStatus = await this.typeOrmTaskStatusRepository.findOneBy({
                    tenantId,
                    organizationId,
                    projectId,
                    name: entity.status
                });
                entity.taskStatus = taskStatus;
            }
            catch (error) {
                console.log(chalk.red(`Syncing GitHub Automation Task Status: %s`), entity.status);
            }
            try {
                // Check if an integration map already exists for the issue
                const integrationMap = await this.typeOrmIntegrationMapRepository.findOneByOrFail({
                    entity: command.entity,
                    sourceId,
                    integrationId,
                    organizationId,
                    tenantId
                });
                // Try to find the corresponding task
                try {
                    await this._taskService.findOneByIdString(integrationMap.gauzyId);
                    // Update the corresponding task with the new input data
                    await this.updateTask(integrationMap.gauzyId, {
                        ...entity,
                        projectId,
                        organizationId,
                        tenantId
                    });
                }
                catch (error) {
                    // Create a new task with the provided entity data
                    await this.createTask({ projectId, organizationId, tenantId }, {
                        ...entity,
                        id: integrationMap.gauzyId
                    });
                }
                // Return the integration map
                return integrationMap;
            }
            catch (error) {
                // Create a new task with the provided entity data
                const task = await this.createTask({ projectId, organizationId, tenantId }, entity);
                // Create a new integration map for the issue
                return await this.typeOrmIntegrationMapRepository.save(this.typeOrmIntegrationMapRepository.create({
                    gauzyId: task.id,
                    entity: command.entity,
                    integrationId,
                    sourceId,
                    organizationId,
                    tenantId
                }));
            }
        }
        catch (error) {
            console.log('Failed to sync in issues and labels', error.message);
        }
    }
    /**
     * Creates a new task within a project.
     *
     * @param options - An object containing parameters for task creation.
     * @returns A Promise that resolves to the newly created task.
     */
    async createTask(options, entity) {
        try {
            // Retrieve current user
            const user = context_1.RequestContext.currentUser();
            // Retrieve the maximum task number for the project
            const maxNumber = await this._taskService.getMaxTaskNumberByProject(options);
            // Create a new task with the provided entity data
            const newTask = this.typeOrmTaskRepository.create({
                ...entity,
                number: maxNumber + 1,
                organizationId: options.organizationId,
                tenantId: options.tenantId
            });
            console.log(chalk.magenta(`Syncing GitHub Automation Task: %s`), newTask);
            // Save the new task
            const createdTask = await this.typeOrmTaskRepository.save(newTask);
            // Subscribe creator to the task
            const { organizationId, tenantId } = createdTask;
            this._eventBus.publish(new events_1.CreateEntitySubscriptionEvent({
                entity: contracts_1.BaseEntityEnum.Task,
                entityId: createdTask.id,
                employeeId: user.employeeId,
                type: contracts_1.EntitySubscriptionTypeEnum.CREATED_ENTITY,
                organizationId,
                tenantId
            }));
            // Subscribe assignees to the task
            if (entity.members.length > 0) {
                try {
                    const employeeIds = entity.members.map(({ id }) => id);
                    const employees = await this._employeeService.findActiveEmployeesByEmployeeIds(employeeIds, organizationId, tenantId);
                    await Promise.all(employees.map((employee) => this._eventBus.publish(new events_1.CreateEntitySubscriptionEvent({
                        entity: contracts_1.BaseEntityEnum.Task,
                        entityId: createdTask.id,
                        employeeId: employee.id,
                        type: contracts_1.EntitySubscriptionTypeEnum.ASSIGNMENT,
                        organizationId,
                        tenantId
                    }))));
                }
                catch (error) {
                    console.error('Error subscribing new members to the task:', error);
                }
            }
            // Activity Log Task Creation
            this.activityLogService.logActivity(contracts_1.BaseEntityEnum.Task, contracts_1.ActionTypeEnum.Created, contracts_1.ActorTypeEnum.System, createdTask.id, createdTask.title, createdTask, organizationId, tenantId);
            // Return the created Task
            return createdTask;
        }
        catch (error) {
            // Handle and log errors, and return a rejected promise or throw an exception.
            console.log(chalk.red(`Error while creating task using Automation Task: %s`, error.message), entity);
        }
    }
    /**
     * Updates a task with new data.
     *
     * @param id - The ID of the task to update.
     * @param entity - The new data for the task.
     * @returns A Promise that resolves to the updated task.
     */
    async updateTask(id, entity) {
        try {
            const { members = [] } = entity;
            // Find task relations
            const relations = {
                tags: true,
                members: true,
                teams: true,
                modules: true,
                parent: true,
                project: true,
                organizationSprint: true,
                taskStatus: true,
                taskSize: true,
                taskPriority: true,
                linkedIssues: true,
                dailyPlans: true
            };
            // Find the existing task by its ID
            const existingTask = await this._taskService.findOneByIdString(id, { relations });
            if (!existingTask) {
                return;
            }
            const taskMembers = existingTask.members;
            // Separate members into removed and new members
            const memberIds = members.map(({ id }) => id);
            const existingMemberIds = taskMembers.map(({ id }) => id);
            const removedMembers = taskMembers.filter((member) => !memberIds.includes(member.id));
            const newMembers = members.filter((member) => !existingMemberIds.includes(member.id));
            // Update the existing task with the new entity data
            this.typeOrmTaskRepository.merge(existingTask, entity);
            // Save the updated task
            const updatedTask = await this.typeOrmTaskRepository.save(existingTask);
            const { organizationId, tenantId } = updatedTask;
            // Unsubscribe members who were unassigned from task
            if (removedMembers.length > 0) {
                try {
                    await Promise.all(removedMembers.map(async (member) => await this._entitySubscriptionService.delete({
                        entity: contracts_1.BaseEntityEnum.Task,
                        entityId: updatedTask.id,
                        employeeId: member.id,
                        type: contracts_1.EntitySubscriptionTypeEnum.ASSIGNMENT,
                        organizationId,
                        tenantId
                    })));
                }
                catch (error) {
                    console.error('Error subscribing new members to the task:', error);
                }
            }
            // Subscribe new assignees to the task
            if (newMembers.length) {
                try {
                    await Promise.all(newMembers.map((employee) => this._eventBus.publish(new events_1.CreateEntitySubscriptionEvent({
                        entity: contracts_1.BaseEntityEnum.Task,
                        entityId: updatedTask.id,
                        employeeId: employee.id,
                        type: contracts_1.EntitySubscriptionTypeEnum.ASSIGNMENT,
                        organizationId,
                        tenantId
                    }))));
                }
                catch (error) {
                    console.error('Error subscribing new members to the task:', error);
                }
            }
            // Activity Log Task Update
            this.activityLogService.logActivity(contracts_1.BaseEntityEnum.Task, contracts_1.ActionTypeEnum.Updated, contracts_1.ActorTypeEnum.System, updatedTask.id, updatedTask.title, updatedTask, organizationId, tenantId, existingTask, entity);
            // Return the updated Task
            return updatedTask;
        }
        catch (error) {
            // Handle and log errors, and return a rejected promise or throw an exception.
            console.log(chalk.red(`Error while updating task using Automation Task: %s`), error.message);
        }
    }
};
exports.AutomationTaskSyncHandler = AutomationTaskSyncHandler;
exports.AutomationTaskSyncHandler = AutomationTaskSyncHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(automation_task_sync_command_1.AutomationTaskSyncCommand),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    tslib_1.__param(1, (0, typeorm_1.InjectRepository)(internal_1.TaskStatus)),
    tslib_1.__param(2, (0, typeorm_1.InjectRepository)(internal_1.IntegrationMap)),
    tslib_1.__metadata("design:paramtypes", [type_orm_task_repository_1.TypeOrmTaskRepository,
        type_orm_task_status_repository_1.TypeOrmTaskStatusRepository,
        type_orm_integration_map_repository_1.TypeOrmIntegrationMapRepository,
        cqrs_1.EventBus,
        task_service_1.TaskService,
        activity_log_service_1.ActivityLogService,
        employee_service_1.EmployeeService,
        entity_subscription_service_1.EntitySubscriptionService])
], AutomationTaskSyncHandler);
//# sourceMappingURL=automation-task.sync.handler.js.map