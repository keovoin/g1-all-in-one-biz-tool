"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRelatedIssueTypeController = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const guards_1 = require("../../shared/guards");
const dto_1 = require("../../shared/dto");
const pipes_1 = require("../../shared/pipes");
const crud_1 = require("../../core/crud");
const related_issue_type_service_1 = require("./related-issue-type.service");
const queries_1 = require("./queries");
const dto_2 = require("./dto");
let TaskRelatedIssueTypeController = class TaskRelatedIssueTypeController extends (0, crud_1.CrudFactory)(crud_1.BaseQueryDTO, dto_2.CreateRelatedIssueTypeDTO, dto_2.UpdatesRelatedIssueTypeDTO, dto_1.CountQueryDTO) {
    constructor(queryBus, TaskRelatedIssueTypeService) {
        super(TaskRelatedIssueTypeService);
        this.queryBus = queryBus;
        this.TaskRelatedIssueTypeService = TaskRelatedIssueTypeService;
    }
    /**
     * GET statuses by filters
     * If parameters not match, retrieve global statuses
     *
     * @param params
     * @returns
     */
    async findTaskRelatedIssueType(params) {
        return await this.queryBus.execute(new queries_1.FindRelatedIssueTypesQuery(params));
    }
};
exports.TaskRelatedIssueTypeController = TaskRelatedIssueTypeController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find task statuses by filters.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found task statuses by filters.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)(),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_2.RelatedIssueTypeQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskRelatedIssueTypeController.prototype, "findTaskRelatedIssueType", null);
exports.TaskRelatedIssueTypeController = TaskRelatedIssueTypeController = tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, swagger_1.ApiTags)('Task RelatedIssueTypes'),
    (0, common_1.Controller)('/task-related-issue-types'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.QueryBus,
        related_issue_type_service_1.TaskRelatedIssueTypeService])
], TaskRelatedIssueTypeController);
//# sourceMappingURL=related-issue-type.controller.js.map