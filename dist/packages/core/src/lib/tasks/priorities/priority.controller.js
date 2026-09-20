"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskPriorityController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const crud_1 = require("../../core/crud");
const guards_1 = require("../../shared/guards");
const dto_1 = require("../../shared/dto");
const pipes_1 = require("../../shared/pipes");
const priority_service_1 = require("./priority.service");
const dto_2 = require("./dto");
let TaskPriorityController = class TaskPriorityController extends (0, crud_1.CrudFactory)(crud_1.BaseQueryDTO, dto_2.CreateTaskPriorityDTO, dto_2.UpdateTaskPriorityDTO, dto_1.CountQueryDTO) {
    constructor(taskPriorityService) {
        super(taskPriorityService);
        this.taskPriorityService = taskPriorityService;
    }
    /**
     * GET task priorities by filters
     * If parameters not match, retrieve global task priorities
     *
     * @param params
     * @returns
     */
    async fetchAll(params) {
        return await this.taskPriorityService.fetchAll(params);
    }
};
exports.TaskPriorityController = TaskPriorityController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find task priorities by filters.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found task priorities by filters.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)(),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_2.TaskPriorityQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskPriorityController.prototype, "fetchAll", null);
exports.TaskPriorityController = TaskPriorityController = tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, swagger_1.ApiTags)('Task Priority'),
    (0, common_1.Controller)('/task-priorities'),
    tslib_1.__metadata("design:paramtypes", [priority_service_1.TaskPriorityService])
], TaskPriorityController);
//# sourceMappingURL=priority.controller.js.map