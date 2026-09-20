"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportHistoryController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const guards_1 = require("./../../shared/guards");
const decorators_1 = require("./../../shared/decorators");
const pipes_1 = require("./../../shared/pipes");
const import_history_service_1 = require("./import-history.service");
let ImportHistoryController = class ImportHistoryController {
    constructor(_importHistoryService) {
        this._importHistoryService = _importHistoryService;
    }
    /**
     *
     * @returns
     */
    async findAll() {
        return await this._importHistoryService.findAll();
    }
    /**
     * Downloads the archive an import was made from.
     *
     * Replaces the public `fullUrl` link the Import page used to hand to the browser: the archive is a
     * full tenant data dump, so it is served only here — behind the same tenant and permission guards
     * as the history list (the class-level `@Permissions` applies to this handler too), and only for the
     * caller's own tenant's rows.
     *
     * @param id - The import-history row.
     * @param res - The Express response the archive is written to.
     */
    async download(id, res) {
        const { file, content } = await this._importHistoryService.getArchive(id);
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        // `attachment()` encodes the client-supplied original name per RFC 6266, so it cannot inject headers.
        res.attachment(file || 'import.zip');
        res.send(content);
    }
};
exports.ImportHistoryController = ImportHistoryController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all imports history.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found import history'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ImportHistoryController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Download the archive of one import.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The import archive (application/zip)'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record or archive not found'
    }),
    (0, common_1.Get)(':id/download'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ImportHistoryController.prototype, "download", null);
exports.ImportHistoryController = ImportHistoryController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Import History'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.IMPORT_ADD),
    (0, common_1.Controller)('/import/history'),
    tslib_1.__metadata("design:paramtypes", [import_history_service_1.ImportHistoryService])
], ImportHistoryController);
//# sourceMappingURL=import-history.controller.js.map