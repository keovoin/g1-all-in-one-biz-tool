"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskLinkedIssueController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("../../core/crud");
const guards_1 = require("../../shared/guards");
const pipes_1 = require("../../shared/pipes");
const decorators_1 = require("../../shared/decorators");
const task_linked_issue_entity_1 = require("./task-linked-issue.entity");
const task_linked_issue_service_1 = require("./task-linked-issue.service");
const dto_1 = require("./dto");
const commands_1 = require("./commands");
let TaskLinkedIssueController = class TaskLinkedIssueController extends crud_1.CrudController {
    constructor(taskLinkedIssueService, commandBus) {
        super(taskLinkedIssueService);
        this.taskLinkedIssueService = taskLinkedIssueService;
        this.commandBus = commandBus;
    }
    /**
     * Finds all task linked issues based on the provided query parameters.
     *
     * @param params - The pagination and filter parameters for the query.
     * @returns A promise that resolves to a paginated list of task linked issues.
     */
    async findAll(params) {
        return this.taskLinkedIssueService.findAll(params);
    }
    /**
     * Creates a new task linked issue.
     *
     * @param entity - The input data for creating a task linked issue.
     * @returns A promise that resolves to the created task linked issue.
     */
    async create(entity) {
        return this.commandBus.execute(new commands_1.TaskLinkedIssueCreateCommand(entity));
    }
    /**
     * Updates an existing task linked issue.
     *
     * @param id - The ID of the task linked issue to update.
     * @param entity - The input data for updating the task linked issue.
     * @returns A promise that resolves to the updated task linked issue.
     */
    async update(id, entity) {
        return this.commandBus.execute(new commands_1.TaskLinkedIssueUpdateCommand(id, entity));
    }
    /**
     * Deletes a task linked issue.
     *
     * @param id - The ID of the task linked issue to delete.
     * @returns A promise that resolves to the result of the delete operation.
     */
    async delete(id) {
        return this.taskLinkedIssueService.delete(id);
    }
    /**
     * Soft deletes a task linked issue record.
     *
     * @param id - The ID of the task linked issue to soft delete.
     * @returns A promise that resolves to the result of the soft delete operation.
     */
    async softRemove(id) {
        return this.taskLinkedIssueService.softDelete(id);
    }
};
exports.TaskLinkedIssueController = TaskLinkedIssueController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found task linked issues',
        type: task_linked_issue_entity_1.TaskLinkedIssue
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_TASK_VIEW),
    (0, common_1.Get)(),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskLinkedIssueController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create Task Linked Issue' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. The response body may contain clues as to what went wrong.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TASK_ADD),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateTaskLinkedIssueDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskLinkedIssueController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing task linked issue' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully edited.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. The response body may contain clues as to what went wrong.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TASK_EDIT),
    (0, common_1.Put)(':id'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateTaskLinkedIssueDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskLinkedIssueController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete Task Linked Issue' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'The record has been successfully deleted'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TASK_DELETE),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskLinkedIssueController.prototype, "delete", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete Task Linked Issue record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The record has been successfully soft-deleted'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Task Linked Issue record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TASK_DELETE),
    (0, common_1.Delete)(':id/soft'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskLinkedIssueController.prototype, "softRemove", null);
exports.TaskLinkedIssueController = TaskLinkedIssueController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Linked Issue'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TASK_EDIT),
    (0, common_1.Controller)('/task-linked-issue'),
    tslib_1.__metadata("design:paramtypes", [task_linked_issue_service_1.TaskLinkedIssueService,
        cqrs_1.CommandBus])
], TaskLinkedIssueController);
//# sourceMappingURL=task-linked-issue.controller.js.map