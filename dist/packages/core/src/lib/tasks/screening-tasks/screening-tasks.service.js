"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreeningTasksService = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const context_1 = require("../../core/context");
const crud_1 = require("../../core/crud");
const task_service_1 = require("../task.service");
const organization_project_1 = require("../../organization-project");
const activity_log_service_1 = require("../../activity-log/activity-log.service");
const mention_service_1 = require("../../mention/mention.service");
const events_1 = require("../../entity-subscription/events");
const type_orm_screening_task_repository_1 = require("./repository/type-orm-screening-task.repository");
const mikro_orm_screening_task_repository_1 = require("./repository/mikro-orm-screening-task.repository");
let ScreeningTasksService = class ScreeningTasksService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmScreeningTaskRepository, mikroOrmScreeningTaskRepository, eventBus, taskService, organizationProjectService, mentionService, activityLogService) {
        super(typeOrmScreeningTaskRepository, mikroOrmScreeningTaskRepository);
        this.typeOrmScreeningTaskRepository = typeOrmScreeningTaskRepository;
        this.mikroOrmScreeningTaskRepository = mikroOrmScreeningTaskRepository;
        this.eventBus = eventBus;
        this.taskService = taskService;
        this.organizationProjectService = organizationProjectService;
        this.mentionService = mentionService;
        this.activityLogService = activityLogService;
    }
    /**
     * Creates a new screening task along with its associated task, subscriptions, mentions, and activity logs.
     *
     * @param {IScreeningTaskCreateInput} input - The input data required to create the screening task.
     * @returns {Promise<IScreeningTask>} A promise that resolves to the created screening task.
     * @throws {HttpException} an exception if the creation process fails.
     */
    async create(input) {
        try {
            // Extract the current user from the request context
            const user = context_1.RequestContext.currentUser();
            // Extract the current tenant ID from the request context or use the provided tenant ID
            const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
            // Extract the organization ID from the input or use the current organization ID
            const { organizationId, mentionEmployeeIds = [], ...data } = input;
            // Check if projectId is provided, if not use the provided project object from the input.
            // If neither is provided, set project to null.
            const project = data.task.projectId
                ? await this.organizationProjectService.findOneByIdString(data.task.projectId)
                : data.task.project || null;
            // Check if the project exists and extract the project prefix
            const prefix = project?.name?.substring(0, 3) ?? null;
            // Log info if both projectId and project are not provided
            if (!project) {
                console.warn('No projectId or project provided. Proceeding without project information');
            }
            // Retrieve the maximum task number for the specified project, or handle null projectId if no project
            const maxNumber = await this.taskService.getMaxTaskNumberByProject({
                tenantId,
                organizationId,
                projectId: project?.id ?? null
            });
            // Create task
            const task = await this.taskService.create({
                ...data.task,
                prefix,
                number: maxNumber + 1, // Increment the task number
                isScreeningTask: true,
                tenantId,
                organizationId
            });
            // Create the screening task
            const { task: _, ...screeningTaskData } = data;
            const screeningTask = await super.create({
                ...screeningTaskData,
                status: contracts_1.ScreeningTaskStatusEnum.PENDING,
                taskId: task.id,
                organizationId,
                tenantId
            });
            // Apply mentions if needed
            const mentionPromises = mentionEmployeeIds.map((mentionedEmployeeId) => this.mentionService.publishMention({
                entity: contracts_1.BaseEntityEnum.Task,
                entityId: task.id,
                entityName: task.title,
                mentionedEmployeeId,
                employeeId: user?.employeeId
            }));
            // Subscribe creator to the task
            this.eventBus.publish(new events_1.CreateEntitySubscriptionEvent({
                entity: contracts_1.BaseEntityEnum.Task,
                entityId: task.id,
                employeeId: user?.employeeId,
                type: contracts_1.EntitySubscriptionTypeEnum.CREATED_ENTITY,
                organizationId,
                tenantId
            }));
            // Generate the activity logs
            const activityLogPromises = [
                this.activityLogService.logActivity(contracts_1.BaseEntityEnum.Task, contracts_1.ActionTypeEnum.Created, contracts_1.ActorTypeEnum.User, task.id, task.title, task, organizationId, tenantId),
                this.activityLogService.logActivity(contracts_1.BaseEntityEnum.ScreeningTask, contracts_1.ActionTypeEnum.Created, contracts_1.ActorTypeEnum.User, screeningTask.id, `Screening task for #${task.taskNumber} ${task.title}`, screeningTask, organizationId, tenantId)
            ];
            await Promise.all([...mentionPromises, ...activityLogPromises]);
            // Return the created screening task
            return screeningTask;
        }
        catch (error) {
            throw new common_1.HttpException('Screening task creation failed', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Updates an existing screening task and synchronizes related task data and activity logs.
     *
     * @param {ID} id - The unique identifier of the screening task to update.
     * @param {IScreeningTaskUpdateInput} input - The data to update the screening task with.
     * @returns {Promise<IScreeningTask>} A promise resolving to the updated screening task.
     * @throws {HttpException} a BadRequest exception if the update process fails.
     */
    async update(id, input) {
        try {
            const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
            // Find the screening task by ID
            const screeningTask = await this.findOneByIdString(id, { relations: { task: true } });
            // Extract the task from the screening task
            const task = screeningTask.task;
            // Create a new screening task with the updated input
            const updatedScreeningTask = await super.create({ ...input, id });
            // Update the task accordingly to the screening status
            if (input.status !== updatedScreeningTask.status) {
                const isScreeningTask = [input.status, updatedScreeningTask.status].includes(contracts_1.ScreeningTaskStatusEnum.PENDING) ||
                    [input.status, updatedScreeningTask.status].includes(contracts_1.ScreeningTaskStatusEnum.SNOOZED);
                const taskStatus = [contracts_1.ScreeningTaskStatusEnum.DECLINED, contracts_1.ScreeningTaskStatusEnum.DUPLICATED].includes(input.status)
                    ? contracts_1.TaskStatusEnum.CANCELLED
                    : task.status;
                await this.taskService.update(task.id, { isScreeningTask, status: taskStatus });
            }
            // Generate the activity log
            this.activityLogService.logActivity(contracts_1.BaseEntityEnum.ScreeningTask, contracts_1.ActionTypeEnum.Updated, contracts_1.ActorTypeEnum.User, updatedScreeningTask.id, `Screening task for #${task.number} ${task.title}`, updatedScreeningTask, updatedScreeningTask.organizationId, tenantId, updatedScreeningTask, input);
            // Return the updated screening task
            return updatedScreeningTask;
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to update screening task with ID ${id}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.ScreeningTasksService = ScreeningTasksService;
exports.ScreeningTasksService = ScreeningTasksService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_screening_task_repository_1.TypeOrmScreeningTaskRepository,
        mikro_orm_screening_task_repository_1.MikroOrmScreeningTaskRepository,
        cqrs_1.EventBus,
        task_service_1.TaskService,
        organization_project_1.OrganizationProjectService,
        mention_service_1.MentionService,
        activity_log_service_1.ActivityLogService])
], ScreeningTasksService);
//# sourceMappingURL=screening-tasks.service.js.map