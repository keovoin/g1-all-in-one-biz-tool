"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportCategoryController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const crud_1 = require("./../core/crud");
const report_category_service_1 = require("./report-category.service");
let ReportCategoryController = class ReportCategoryController {
    constructor(reportCategoryService) {
        this.reportCategoryService = reportCategoryService;
    }
    async findAll(filter) {
        return this.reportCategoryService.findAll(filter);
    }
};
exports.ReportCategoryController = ReportCategoryController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found records'
    }),
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ReportCategoryController.prototype, "findAll", null);
exports.ReportCategoryController = ReportCategoryController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Report Category'),
    (0, common_1.Controller)('/report/category'),
    tslib_1.__metadata("design:paramtypes", [report_category_service_1.ReportCategoryService])
], ReportCategoryController);
//# sourceMappingURL=report-category.controller.js.map