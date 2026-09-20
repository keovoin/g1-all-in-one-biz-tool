"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStatusController = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const guards_1 = require("./../../shared/guards");
const dto_1 = require("./../../shared/dto");
const pipes_1 = require("../../shared/pipes");
const crud_1 = require("./../../core/crud");
const status_service_1 = require("./status.service");
const queries_1 = require("./queries");
const dto_2 = require("./dto");
const reorder_dto_1 = require("./dto/reorder.dto");
let TaskStatusController = class TaskStatusController extends (0, crud_1.CrudFactory)(crud_1.BaseQueryDTO, dto_2.CreateStatusDTO, dto_2.UpdatesStatusDTO, dto_1.CountQueryDTO) {
    constructor(queryBus, taskStatusService) {
        super(taskStatusService);
        this.queryBus = queryBus;
        this.taskStatusService = taskStatusService;
    }
    /**
     * Reorder records based on the given input.
     * @param request - ReorderRequestDTO containing the reorder instructions.
     * @returns A success message indicating that the reordering operation completed successfully.
     */
    async reorder({ reorder }) {
        return await this.taskStatusService.reorder(reorder);
    }
    /**
     * GET statuses by filters
     * If parameters not match, retrieve global statuses
     *
     * @param params
     * @returns
     */
    async findTaskStatuses(params) {
        return await this.queryBus.execute(new queries_1.FindStatusesQuery(params));
    }
    /**
     *
     * @param id
     * @param input
     * @returns
     */
    async markAsDefault(id, input) {
        return await this.taskStatusService.markAsDefault(id, input);
    }
};
exports.TaskStatusController = TaskStatusController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Reorder records based on given input' }) // Corrects the summary
    ,
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Reordering was successful.' // Description for successful response
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. Check your request body.' // Description for bad request
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'An error occurred during reordering.' // Description for internal server error
    }),
    (0, common_1.Patch)('/reorder'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [reorder_dto_1.ReorderRequestDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskStatusController.prototype, "reorder", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find task statuses by filters.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found task statuses by filters.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'An error occurred during retrieving task statuses.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. Check your request body.'
    }),
    (0, common_1.Get)('/'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_2.StatusQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskStatusController.prototype, "findTaskStatuses", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Make task status default.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Task status marked as default'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Put)(':id/default'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_2.UpdatesStatusDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskStatusController.prototype, "markAsDefault", null);
exports.TaskStatusController = TaskStatusController = tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, swagger_1.ApiTags)('Task Status'),
    (0, common_1.Controller)('/task-statuses'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.QueryBus, status_service_1.TaskStatusService])
], TaskStatusController);
//# sourceMappingURL=status.controller.js.map