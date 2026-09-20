"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueTypeController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../shared/dto");
const pipes_1 = require("../../shared/pipes");
const guards_1 = require("../../shared/guards");
const crud_1 = require("./../../core/crud");
const issue_type_service_1 = require("./issue-type.service");
const dto_2 = require("./dto");
let IssueTypeController = class IssueTypeController extends (0, crud_1.CrudFactory)(crud_1.BaseQueryDTO, dto_2.CreateIssueTypeDTO, dto_2.UpdateIssueTypeDTO, dto_1.CountQueryDTO) {
    constructor(issueTypeService) {
        super(issueTypeService);
        this.issueTypeService = issueTypeService;
    }
    /**
     *
     * @param id
     * @param input
     * @returns
     */
    async markAsDefault(id, input) {
        return await this.issueTypeService.markAsDefault(id, input);
    }
    /**
     * GET issue types by filters
     * If parameters not match, retrieve global task sizes
     *
     * @param params
     * @returns
     */
    async findAllIssueTypes(params) {
        return await this.issueTypeService.fetchAll(params);
    }
};
exports.IssueTypeController = IssueTypeController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Make issue type default.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Task issue type marked as default'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Put)(':id/default'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, dto_2.UpdateIssueTypeDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], IssueTypeController.prototype, "markAsDefault", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find issue types by filters.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found task issue type by filters.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)(),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_2.IssueTypeQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], IssueTypeController.prototype, "findAllIssueTypes", null);
exports.IssueTypeController = IssueTypeController = tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, swagger_1.ApiTags)('Issue Type'),
    (0, common_1.Controller)('/issue-types'),
    tslib_1.__metadata("design:paramtypes", [issue_type_service_1.IssueTypeService])
], IssueTypeController);
//# sourceMappingURL=issue-type.controller.js.map