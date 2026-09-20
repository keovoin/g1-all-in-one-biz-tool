"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskVersionController = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const crud_1 = require("../../core/crud");
const guards_1 = require("../../shared/guards");
const dto_1 = require("../../shared/dto");
const pipes_1 = require("../../shared/pipes");
const version_service_1 = require("./version.service");
const queries_1 = require("./queries");
const dto_2 = require("./dto");
let TaskVersionController = class TaskVersionController extends (0, crud_1.CrudFactory)(crud_1.BaseQueryDTO, dto_2.CreateVersionDTO, dto_2.UpdatesVersionDTO, dto_1.CountQueryDTO) {
    constructor(queryBus, taskVersionService) {
        super(taskVersionService);
        this.queryBus = queryBus;
        this.taskVersionService = taskVersionService;
    }
    /**
     * GET versions by filters
     * If parameters not match, retrieve global versions
     *
     * @param params
     * @returns
     */
    async findTaskVersions(params) {
        return await this.queryBus.execute(new queries_1.FindVersionsQuery(params));
    }
};
exports.TaskVersionController = TaskVersionController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find task versions by filters.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found task versions by filters.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)(),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_2.VersionQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskVersionController.prototype, "findTaskVersions", null);
exports.TaskVersionController = TaskVersionController = tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, swagger_1.ApiTags)('Task Version'),
    (0, common_1.Controller)('/task-versions'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.QueryBus, version_service_1.TaskVersionService])
], TaskVersionController);
//# sourceMappingURL=version.controller.js.map