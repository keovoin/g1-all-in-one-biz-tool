"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const parse_json_pipe_1 = require("../../shared/pipes/parse-json.pipe");
const guards_1 = require("../../shared/guards");
const decorators_1 = require("../../shared/decorators");
const export_service_1 = require("./export.service");
/**
 * 🛑 Every handler here follows the same shape: take a job, do the work inside a `try`, and clean
 * the job's scratch directory up in a `finally`.
 *
 * Two defects are closed by that shape. The job makes each request use only its OWN files, where
 * the service used to keep the current csv/zip ids in shared singleton fields that a concurrent
 * request could overwrite mid-export (GHSA-g235-c4fm-4fc7). The `finally` makes the delete
 * unconditional, where a throw anywhere in the sequence used to leave the plaintext CSVs and the
 * archive on disk indefinitely.
 */
let ExportController = class ExportController {
    constructor(_exportService) {
        this._exportService = _exportService;
    }
    async exportAll(data, organizationId, res) {
        const job = await this._exportService.createExportJob();
        try {
            await this._exportService.exportTables(job, organizationId);
            await this._exportService.archiveAndDownload(job);
            await this._exportService.downloadToUser(job, res);
        }
        finally {
            await this._exportService.cleanup(job);
        }
    }
    async downloadTemplate(res) {
        const job = await this._exportService.createExportJob();
        try {
            await this._exportService.exportSpecificTablesSchema(job);
            await this._exportService.archiveAndDownload(job);
            await this._exportService.downloadToUser(job, res);
        }
        finally {
            await this._exportService.cleanup(job);
        }
    }
    async exportByName(data, headers, res) {
        const { entities: { names } } = data;
        // NOTE: Express lower-cases header names, so this is always undefined (and the Angular client never
        // sends it). It only stamps the global default rows; it never narrows the export. Tracked separately.
        const organizationId = headers['Organization-Id'];
        const job = await this._exportService.createExportJob();
        try {
            await this._exportService.exportSpecificTables(job, names, organizationId);
            await this._exportService.archiveAndDownload(job);
            await this._exportService.downloadToUser(job, res);
        }
        finally {
            await this._exportService.cleanup(job);
        }
    }
};
exports.ExportController = ExportController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all exports.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found tables'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('data', parse_json_pipe_1.ParseJsonPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__param(2, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ExportController.prototype, "exportAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Exports all tables schemas.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found tables schemas'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('template'),
    tslib_1.__param(0, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ExportController.prototype, "downloadTemplate", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find exports by name' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found specific tables'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('filter'),
    tslib_1.__param(0, (0, common_1.Query)('data', parse_json_pipe_1.ParseJsonPipe)),
    tslib_1.__param(1, (0, common_1.Headers)()),
    tslib_1.__param(2, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ExportController.prototype, "exportByName", null);
exports.ExportController = ExportController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Download'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.EXPORT_ADD),
    (0, common_1.Controller)('/export'),
    tslib_1.__metadata("design:paramtypes", [export_service_1.ExportService])
], ExportController);
//# sourceMappingURL=export.controller.js.map