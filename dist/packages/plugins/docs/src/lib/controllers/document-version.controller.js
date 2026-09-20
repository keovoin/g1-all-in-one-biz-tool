"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentVersionController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@gauzy/common");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const restore_document_version_command_1 = require("../commands/restore-document-version.command");
const get_document_versions_query_dto_1 = require("../dto/get-document-versions-query.dto");
const get_document_version_query_1 = require("../queries/get-document-version.query");
const get_document_versions_query_1 = require("../queries/get-document-versions.query");
let DocumentVersionController = class DocumentVersionController {
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    /**
     * Paginated version history, newest first — the list projection never returns content columns.
     */
    async findAll(id, params) {
        return this.queryBus.execute(new get_document_versions_query_1.GetDocumentVersionsQuery(id, params));
    }
    /**
     * One full snapshot incl. `contentJson`/`contentHtml`.
     */
    async findById(id, versionId) {
        return this.queryBus.execute(new get_document_version_query_1.GetDocumentVersionQuery(id, versionId));
    }
    /**
     * **Non-destructive** restore: first snapshots the current content as a new version, then
     * copies the target snapshot onto the document. Locked page → 423 `DOCS_LOCKED`.
     */
    async restore(id, versionId) {
        return this.commandBus.execute(new restore_document_version_command_1.RestoreDocumentVersionCommand(id, versionId));
    }
};
exports.DocumentVersionController = DocumentVersionController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List PAGE version snapshots (newest first).' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Version history retrieved successfully.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_READ),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true }),
    (0, common_1.Get)('/:id/versions'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, get_document_versions_query_dto_1.GetDocumentVersionsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentVersionController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get one full version snapshot.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Version snapshot retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Version not found.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_READ),
    (0, common_1.Get)('/:id/versions/:versionId'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Param)('versionId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentVersionController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Restore a version snapshot (non-destructive).' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Version restored successfully.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_UPDATE),
    (0, common_1.Post)('/:id/versions/:versionId/restore'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Param)('versionId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentVersionController.prototype, "restore", null);
exports.DocumentVersionController = DocumentVersionController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Documents Plugin'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard, core_1.FeatureFlagGuard),
    (0, common_2.FeatureFlag)(contracts_1.FeatureEnum.FEATURE_DOCUMENTS),
    (0, common_1.Controller)('/plugins/docs/documents'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus, cqrs_1.QueryBus])
], DocumentVersionController);
//# sourceMappingURL=document-version.controller.js.map