"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const report_service_1 = require("./report.service");
const report_organization_service_1 = require("./report-organization.service");
let ReportController = class ReportController {
    constructor(_reportService, _reportOrganizationService) {
        this._reportService = _reportService;
        this._reportOrganizationService = _reportOrganizationService;
    }
    /**
     * Get all reports
     *
     * @param options
     * @returns
     */
    async findAllReports(options) {
        return await this._reportService.findAllReports(options);
    }
    /**
     *
     * @param filter
     * @returns
     */
    async getMenuItems(filter) {
        return await this._reportService.getMenuItems(filter);
    }
    /**
     *
     * @param input
     * @returns
     */
    async updateReportMenu(input) {
        return await this._reportOrganizationService.updateReportMenu(input);
    }
};
exports.ReportController = ReportController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found records'
    }),
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ReportController.prototype, "findAllReports", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found records'
    }),
    (0, common_1.Get)('/menu-items'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ReportController.prototype, "getMenuItems", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found records'
    }),
    (0, common_1.Post)('/menu-item'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ReportController.prototype, "updateReportMenu", null);
exports.ReportController = ReportController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Report'),
    (0, common_1.Controller)('/report'),
    tslib_1.__metadata("design:paramtypes", [report_service_1.ReportService,
        report_organization_service_1.ReportOrganizationService])
], ReportController);
//# sourceMappingURL=report.controller.js.map