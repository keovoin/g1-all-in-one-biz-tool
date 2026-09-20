"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskLinkedIssueService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("../../core/crud");
const context_1 = require("../../core/context");
const activity_log_service_1 = require("../../activity-log/activity-log.service");
const mikro_orm_linked_issue_repository_1 = require("./repository/mikro-orm-linked-issue.repository");
const type_orm_linked_issue_repository_1 = require("./repository/type-orm-linked-issue.repository");
const task_linked_issue_helper_1 = require("./task-linked-issue.helper");
let TaskLinkedIssueService = class TaskLinkedIssueService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmTaskLinkedIssueRepository, mikroOrmTaskLinkedIssueRepository, activityLogService) {
        super(typeOrmTaskLinkedIssueRepository, mikroOrmTaskLinkedIssueRepository);
        this.activityLogService = activityLogService;
    }
    /**
     * Creates a task linked to an issue.
     *
     * @param {ITaskLinkedIssueCreateInput} entity - The input data for creating a task linked issue.
     * @returns {Promise<ITaskLinkedIssue>} The created task linked issue.
     * @throws {HttpException} Throws a Bad Request exception if task creation fails.
     *
     */
    async create(entity) {
        const tenantId = context_1.RequestContext.currentTenantId() || entity.tenantId;
        const { organizationId } = entity;
        try {
            const taskLinkedIssue = await super.create({ ...entity, tenantId });
            // Generate the activity log
            this.activityLogService.logActivity(contracts_1.BaseEntityEnum.TaskLinkedIssue, contracts_1.ActionTypeEnum.Created, contracts_1.ActorTypeEnum.User, taskLinkedIssue.id, (0, task_linked_issue_helper_1.taskRelatedIssueRelationMap)(taskLinkedIssue.action), taskLinkedIssue, organizationId, tenantId);
            // Return the created task linked issue
            return taskLinkedIssue;
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            throw new common_1.HttpException(`Failed to create task linked issue : ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Updates a task linked issue.
     *
     * @param {ID} id - The ID of the task linked issue to update.
     * @param {ITaskLinkedIssueUpdateInput} input - The input data for updating the task linked issue.
     * @returns {Promise<ITaskLinkedIssue>} The updated task linked issue.
     * @throws {HttpException} Throws a Bad Request exception if the update fails.
     * @throws {NotFoundException} Throws a Not Found exception if the task linked issue does not exist.
     *
     */
    async update(id, input) {
        const tenantId = context_1.RequestContext.currentTenantId() || input.tenantId;
        try {
            // Retrieve existing task linked issue
            const existingTaskLinkedIssue = await this.findOneByIdString(id);
            if (!existingTaskLinkedIssue) {
                throw new common_1.NotFoundException('Task linked issue not found');
            }
            const updatedTaskLinkedIssue = await super.create({ ...input, tenantId, id });
            // Generate the activity log
            const { organizationId } = updatedTaskLinkedIssue;
            this.activityLogService.logActivity(contracts_1.BaseEntityEnum.TaskLinkedIssue, contracts_1.ActionTypeEnum.Updated, contracts_1.ActorTypeEnum.User, updatedTaskLinkedIssue.id, (0, task_linked_issue_helper_1.taskRelatedIssueRelationMap)(updatedTaskLinkedIssue.action), updatedTaskLinkedIssue, organizationId, tenantId, existingTaskLinkedIssue, input);
            // return the updated task linked issue
            return updatedTaskLinkedIssue;
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            throw new common_1.HttpException(`Failed to update task linked issue: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Deletes a task linked issue and logs the deletion activity.
     *
     * @param id - The ID of the task linked issue to delete.
     * @param options - Optional find options for the task linked issue.
     * @returns A promise that resolves to the result of the delete operation.
     */
    async delete(id, options) {
        try {
            await this.deleteActivityLog(id);
            return super.delete(id, options);
        }
        catch (error) {
            console.error(`Failed to delete task linked issue (ID: ${id}):`, error);
            throw new common_1.HttpException(`Failed to delete task linked issue: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Soft deletes a task linked issue and logs the deletion activity.
     *
     * @param id - The ID of the task linked issue to soft delete.
     * @returns A promise that resolves to the result of the soft delete operation or the deleted entity.
     */
    async softDelete(id) {
        try {
            await this.deleteActivityLog(id);
            return super.softDelete(id);
        }
        catch (error) {
            console.error(`Failed to soft delete task linked issue (ID: ${id}):`, error);
            throw new common_1.HttpException(`Failed to soft delete task linked issue: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Deletes an activity log for a given task linked issue.
     *
     * @param id - The ID of the task linked issue to delete.
     */
    async deleteActivityLog(id) {
        const tenantId = context_1.RequestContext.currentTenantId();
        try {
            // Retrieve existing task linked issue
            const existingTaskLinkedIssue = await this.findOneByIdString(id);
            if (!existingTaskLinkedIssue) {
                throw new common_1.NotFoundException('Task linked issue not found');
            }
            // Generate deleted activity log
            const { organizationId } = existingTaskLinkedIssue;
            this.activityLogService.logActivity(contracts_1.BaseEntityEnum.TaskLinkedIssue, contracts_1.ActionTypeEnum.Deleted, contracts_1.ActorTypeEnum.User, id, (0, task_linked_issue_helper_1.taskRelatedIssueRelationMap)(existingTaskLinkedIssue.action), existingTaskLinkedIssue, organizationId, tenantId);
        }
        catch (error) {
            console.error(`Failed to create activity log for deletion (ID: ${id}):`, error);
        }
    }
};
exports.TaskLinkedIssueService = TaskLinkedIssueService;
exports.TaskLinkedIssueService = TaskLinkedIssueService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_linked_issue_repository_1.TypeOrmTaskLinkedIssueRepository,
        mikro_orm_linked_issue_repository_1.MikroOrmTaskLinkedIssueRepository,
        activity_log_service_1.ActivityLogService])
], TaskLinkedIssueService);
//# sourceMappingURL=task-linked-issue.service.js.map