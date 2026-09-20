"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentUploadController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const path = require("path");
const uuid_1 = require("uuid");
const common_2 = require("@gauzy/common");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const docs_config_1 = require("../docs.config");
const docs_constants_1 = require("../docs.constants");
const dto_1 = require("../dto");
const interceptors_1 = require("../interceptors");
const replace_document_file_command_1 = require("../commands/replace-document-file.command");
const reprocess_document_command_1 = require("../commands/reprocess-document.command");
const upload_documents_command_1 = require("../commands/upload-documents.command");
const document_upload_service_1 = require("../services/document-upload.service");
/**
 * Builds the per-request storage engine of the upload endpoint. Keys land under the
 * `documents/<tenantId>/<organizationId>/` prefix with a server-generated
 * `<uuid>.<ext>` object name — the client filename never enters the key.
 */
const documentsStorage = (ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const tenantId = core_1.RequestContext.currentTenantId() || (0, uuid_1.v4)();
    const rawOrganizationId = request?.headers?.['organization-id'] || (0, uuid_1.v4)();
    // Path-sanitize: ids are UUIDs, but never trust a header verbatim.
    const organizationId = String(rawOrganizationId).replace(/[^a-zA-Z0-9-]/g, '') || (0, uuid_1.v4)();
    return new core_1.FileStorage().storage({
        dest: () => path.join('documents', tenantId, organizationId),
        prefix: 'documents',
        filename: (_file, extension) => {
            const storedExtension = (0, core_1.toSafeStorageExtension)(extension);
            if (!storedExtension) {
                return `${(0, uuid_1.v4)()}`;
            }
            return `${(0, uuid_1.v4)()}.${storedExtension}`;
        }
    });
};
let DocumentUploadController = class DocumentUploadController {
    constructor(commandBus, documentUploadService) {
        this.commandBus = commandBus;
        this.documentUploadService = documentUploadService;
    }
    /**
     * Multi-file upload (field `files`, 1–10 files) with per-file accept/reject results.
     *
     * The magic-byte gauntlet never trusts the client MIME: sniffed canonical types only,
     * markup-in-image rejected, no SVG under any name. Oversize → per-file rejection with
     * 413 only when every file is oversize. `importToKnowledge` and `classifyWithAi` are
     * per-upload overrides of the org settings `importToKnowledgeDefault` / `autoClassify`
     * (omitted = follow the organization); accepted files are born `status: UPLOADED` and
     * enter the pipeline at `docs.extract`.
     */
    async upload(input, files) {
        return this.commandBus.execute(new upload_documents_command_1.UploadDocumentsCommand(input, files));
    }
    /**
     * Replace-in-place (R-UPL-05): swaps the stored blob of an existing FILE document for the
     * single uploaded file (multipart field `file`).
     *
     * The document id, name, parent, visibility, categories, tags, links, comments and favorites
     * are preserved by construction — only the blob and the columns derived from it change.
     * `version` increments, the extraction state resets, and the pipeline re-runs from
     * `docs.extract` (`reason: 'replace'`, which also forces a fresh thumbnail). The new bytes
     * face the same gauntlet as an upload; a rejected replacement leaves the document untouched
     * and its blob deleted. A PAGE/FOLDER target is a 409 `DOCS_NOT_A_FILE`.
     */
    async replaceFile(id, input, files) {
        return this.commandBus.execute(new replace_document_file_command_1.ReplaceDocumentFileCommand(id, input, files?.[0]));
    }
    /**
     * Resolves a provider URL for the stored blob and returns `{ url }` — signed with the
     * provider's `expiresIn` ceiling on S3-compatible storage, minted per request and never
     * cached. FILE documents only (409 `DOCS_NOT_A_FILE` otherwise); an id outside the
     * caller's tenant/organization/visibility scope is a 404.
     */
    async download(id) {
        return this.documentUploadService.getDownloadUrl(id);
    }
    /**
     * Authenticated byte stream of the stored blob — the path used by the preview modal and by
     * every image embedded in a wiki page.
     *
     * Hardening per `08-permissions-security.md` §5.5: `X-Content-Type-Options: nosniff` always,
     * the stored (sniffed) content type only for the render-safe allowlist, and `attachment` +
     * `application/octet-stream` for everything else — stored `text/html` is never served as
     * `text/html` from the API origin.
     */
    async raw(id, res) {
        const file = await this.documentUploadService.getRawFile(id);
        // Set explicitly rather than via `@Header()`: the handler owns the response object here.
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Cache-Control', 'private, no-store');
        res.setHeader('Content-Type', file.contentType);
        res.setHeader('Content-Length', file.buffer.length);
        res.setHeader('Content-Disposition', `${file.disposition}; filename="${file.fileName}"; filename*=UTF-8''${encodeURIComponent(file.fileName)}`);
        res.end(file.buffer);
    }
    /**
     * Re-runs the pipeline from `docs.extract` for a FILE document.
     * `extractedTextEdited && !overwriteEdited` → 409 `DOCS_EXTRACTED_TEXT_EDITED`.
     */
    async reprocess(id, input) {
        return this.commandBus.execute(new reprocess_document_command_1.ReprocessDocumentCommand(id, input));
    }
};
exports.DocumentUploadController = DocumentUploadController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Upload 1–10 FILE documents (multipart field `files`).' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Per-file upload results returned.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Every file in the batch was rejected.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.PAYLOAD_TOO_LARGE, description: 'Every file in the batch is oversize.' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_CREATE),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true })
    // The expensive intake path — storage + pipeline + AI spend (`08-permissions-security.md` §9).
    ,
    (0, throttler_1.Throttle)((0, docs_config_1.docsRateLimit)((0, docs_config_1.getDocsConfig)().uploadRateLimit)),
    (0, common_1.UseInterceptors)((0, interceptors_1.LazyFilesInterceptor)('files', docs_constants_1.DOCS_UPLOAD_MAX_FILES, {
        storage: documentsStorage,
        limits: {
            files: docs_constants_1.DOCS_UPLOAD_MAX_FILES,
            // DoS backstop only — the real per-file cap is enforced per file in the
            // service so one oversize file cannot abort the whole batch.
            fileSize: docs_constants_1.DOCS_UPLOAD_MAX_FILES * (0, docs_config_1.getDocsConfig)().maxFileSize + 10 * 1024 * 1024
        }
    })),
    (0, common_1.Post)('/upload'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, interceptors_1.UploadedFilesStorage)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.UploadDocumentsDTO, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentUploadController.prototype, "upload", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Replace the stored file of a FILE document in place (multipart field `file`).' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'File replaced; the pipeline was re-enqueued.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: 'The target document is not a FILE.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.PAYLOAD_TOO_LARGE, description: 'The replacement file is oversize.' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_UPDATE),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true })
    // Replace-in-place is the same intake cost as an upload, so it shares its budget (§9).
    ,
    (0, throttler_1.Throttle)((0, docs_config_1.docsRateLimit)((0, docs_config_1.getDocsConfig)().uploadRateLimit)),
    (0, common_1.UseInterceptors)((0, interceptors_1.LazyFilesInterceptor)('file', 1, {
        storage: documentsStorage,
        limits: {
            files: 1,
            // DoS backstop only — the real cap is enforced in the service so the rejection
            // carries the plugin's own `DOCS_FILE_TOO_LARGE` code.
            fileSize: (0, docs_config_1.getDocsConfig)().maxFileSize + 10 * 1024 * 1024
        }
    })),
    (0, common_1.Post)('/:id/file'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, interceptors_1.UploadedFilesStorage)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.ReplaceDocumentFileDTO, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentUploadController.prototype, "replaceFile", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get a short-lived download URL for a FILE document.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Download URL resolved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Document not found or has no stored file.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_READ),
    (0, common_1.Get)('/:id/download'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentUploadController.prototype, "download", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Stream the stored bytes of a FILE document.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'File streamed successfully.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Document not found or has no stored file.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_READ),
    (0, common_1.Get)('/:id/raw'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentUploadController.prototype, "raw", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Reprocess a FILE document from the extract stage.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Reprocess enqueued.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: 'Human-edited extraction would be overwritten.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_UPDATE),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
    (0, common_1.Post)('/:id/reprocess'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.ReprocessDocumentDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentUploadController.prototype, "reprocess", null);
exports.DocumentUploadController = DocumentUploadController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Documents Plugin'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard, core_1.FeatureFlagGuard),
    (0, common_2.FeatureFlag)(contracts_1.FeatureEnum.FEATURE_DOCUMENTS),
    (0, common_1.Controller)('/plugins/docs/documents'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        document_upload_service_1.DocumentUploadService])
], DocumentUploadController);
//# sourceMappingURL=document-upload.controller.js.map