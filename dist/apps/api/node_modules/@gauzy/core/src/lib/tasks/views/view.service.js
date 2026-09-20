"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskViewService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const decorators_1 = require("../../core/decorators");
const crud_1 = require("../../core/crud");
const context_1 = require("../../core/context");
const activity_log_service_1 = require("../../activity-log/activity-log.service");
const type_orm_task_view_repository_1 = require("./repository/type-orm-task-view.repository");
const mikro_orm_task_view_repository_1 = require("./repository/mikro-orm-task-view.repository");
let TaskViewService = class TaskViewService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmTaskViewRepository, mikroOrmTaskViewRepository, activityLogService) {
        super(typeOrmTaskViewRepository, mikroOrmTaskViewRepository);
        this.activityLogService = activityLogService;
    }
    /**
     * @description Creates a Task View based on provided input
     * @param {ITaskViewCreateInput} entity - Input data for creating the task view
     * @returns A promise resolving to the created Task View
     * @throws BadRequestException if there is an error in the creation process.
     * @memberof TaskViewService
     */
    async create(entity) {
        const tenantId = context_1.RequestContext.currentTenantId() || entity.tenantId;
        const { organizationId } = entity;
        try {
            const taskView = await super.create({ ...entity, tenantId });
            // Generate the activity log
            this.activityLogService.logActivity(contracts_1.BaseEntityEnum.TaskView, contracts_1.ActionTypeEnum.Created, contracts_1.ActorTypeEnum.User, taskView.id, taskView.name, taskView, organizationId, tenantId);
            // return the created task view
            return taskView;
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            throw new common_1.HttpException(`Failed to create view : ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * @description Update a Task View
     * @param {ID} id - The ID of the Task View to be updated
     * @param {ITaskViewUpdateInput} input - The updated information for the Task View
     * @throws NotFoundException if there's an error if requested update view was not found.
     * @throws BadRequest if there's an error during the update process.
     * @returns {Promise<ITaskView>} A Promise resolving to the updated Task View
     * @memberof TaskViewService
     */
    async update(id, input) {
        const tenantId = context_1.RequestContext.currentTenantId() || input.tenantId;
        try {
            // Retrieve existing view.
            const existingTaskView = await this.findOneByIdString(id);
            if (!existingTaskView) {
                throw new common_1.NotFoundException('View not found');
            }
            const updatedTaskView = await super.create({
                ...input,
                tenantId,
                id
            });
            // Generate the activity log
            const { organizationId } = updatedTaskView;
            this.activityLogService.logActivity(contracts_1.BaseEntityEnum.TaskView, contracts_1.ActionTypeEnum.Updated, contracts_1.ActorTypeEnum.User, updatedTaskView.id, updatedTaskView.name, updatedTaskView, organizationId, tenantId, existingTaskView, input);
            // return updated view
            return updatedTaskView;
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            throw new common_1.HttpException(`Failed to update view: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.TaskViewService = TaskViewService;
exports.TaskViewService = TaskViewService = tslib_1.__decorate([
    (0, decorators_1.FavoriteService)(contracts_1.BaseEntityEnum.TaskView),
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_task_view_repository_1.TypeOrmTaskViewRepository,
        mikro_orm_task_view_repository_1.MikroOrmTaskViewRepository,
        activity_log_service_1.ActivityLogService])
], TaskViewService);
//# sourceMappingURL=view.service.js.map