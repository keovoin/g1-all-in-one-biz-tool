"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskSizeController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const crud_1 = require("../../core/crud");
const dto_1 = require("../../shared/dto");
const guards_1 = require("../../shared/guards");
const pipes_1 = require("../../shared/pipes");
const size_service_1 = require("./size.service");
const dto_2 = require("./dto");
let TaskSizeController = class TaskSizeController extends (0, crud_1.CrudFactory)(crud_1.BaseQueryDTO, dto_2.CreateTaskSizeDTO, dto_2.UpdateTaskSizeDTO, dto_1.CountQueryDTO) {
    constructor(taskSizeService) {
        super(taskSizeService);
        this.taskSizeService = taskSizeService;
    }
    /**
     * GET task sizes by filters
     * If parameters not match, retrieve global task sizes
     *
     * @param params
     * @returns
     */
    async fetchAll(params) {
        return await this.taskSizeService.fetchAll(params);
    }
};
exports.TaskSizeController = TaskSizeController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find task sizes by filters.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found task sizes by filters.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)(),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_2.TaskSizeQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskSizeController.prototype, "fetchAll", null);
exports.TaskSizeController = TaskSizeController = tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, swagger_1.ApiTags)('Task Size'),
    (0, common_1.Controller)('/task-sizes'),
    tslib_1.__metadata("design:paramtypes", [size_service_1.TaskSizeService])
], TaskSizeController);
//# sourceMappingURL=size.controller.js.map