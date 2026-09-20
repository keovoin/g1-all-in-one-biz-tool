"use strict";
var ImportController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const import_service_1 = require("./import.service");
const import_archive_file_name_1 = require("./import-archive-file-name");
const context_1 = require("../../core/context");
const file_storage_1 = require("../../core/file-storage");
const guards_1 = require("../../shared/guards");
const decorators_1 = require("../../shared/decorators");
const import_history_1 = require("../import-history");
const platform_express_1 = require("@nestjs/platform-express");
const path = require("node:path");
let ImportController = ImportController_1 = class ImportController {
    constructor(_importService, _commandBus) {
        this._importService = _importService;
        this._commandBus = _commandBus;
        this.logger = new common_1.Logger(ImportController_1.name);
    }
    /**
     *
     * @param param0
     * @param file
     * @returns
     */
    async parse({ importType }, file) {
        const { key, originalname, size } = file;
        const history = {
            file: originalname,
            path: key,
            size: size,
            tenantId: context_1.RequestContext.currentTenantId()
        };
        /**
         * 🛑 The extraction directory belongs to THIS request and is removed in the `finally`.
         *
         * It used to be a field on the singleton `ImportService`, always resolving to the same
         * `<assetPublicPath>/import/csv` path: concurrent imports read one another's CSVs, and the
         * cleanup sat inside the `try` so a failed import left a full tenant dump readable at
         * `GET /public/import/csv/<table>.csv` with no authentication at all (GHSA-g235-c4fm-4fc7).
         */
        let extractPath;
        try {
            extractPath = await this._importService.createExtractDirectory();
            await this._importService.unzipAndParse(extractPath, key, importType === contracts_1.ImportTypeEnum.CLEAN);
            await this._importService.addCurrentUserToImportedOrganizations(extractPath);
            return await this._commandBus.execute(new import_history_1.ImportHistoryCreateCommand({
                ...history,
                status: contracts_1.ImportStatusEnum.SUCCESS
            }));
        }
        catch (error) {
            this.logger.error('Error while importing tenant data', error?.stack ?? String(error));
            return await this._commandBus.execute(new import_history_1.ImportHistoryCreateCommand({
                ...history,
                status: contracts_1.ImportStatusEnum.FAILED
            }));
        }
        finally {
            // Only the extraction directory is removed. The uploaded archive is kept on purpose: the
            // Import page re-downloads it through the authorized `GET /import/history/:id/download`.
            await this._importService.removeExtractedFiles(extractPath);
        }
    }
};
exports.ImportController = ImportController;
tslib_1.__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: new file_storage_1.FileStorage().storage({
            dest: path.join('import'),
            prefix: 'import',
            // An unguessable dotfile name: the archive is a tenant dump that is kept for re-download
            // through an authorized route, never at a public URL. See generateImportArchiveFileName().
            filename: () => (0, import_archive_file_name_1.generateImportArchiveFileName)()
        }),
        // The import format is a ZIP of CSVs; the local provider keeps the client's extension and
        // the file lands under /public, so anything else is refused before it is stored.
        fileFilter: file_storage_1.archiveUploadFileFilter
    })),
    (0, swagger_1.ApiOperation)({ summary: 'Imports templates records.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found tables'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, file_storage_1.UploadedFileStorage)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ImportController.prototype, "parse", null);
exports.ImportController = ImportController = ImportController_1 = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Import'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.IMPORT_ADD),
    (0, common_1.Controller)('/import'),
    tslib_1.__metadata("design:paramtypes", [import_service_1.ImportService, cqrs_1.CommandBus])
], ImportController);
//# sourceMappingURL=import.controller.js.map