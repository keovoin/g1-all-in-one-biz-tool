"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentTreeController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@gauzy/common");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const archive_document_command_1 = require("../commands/archive-document.command");
const delete_document_command_1 = require("../commands/delete-document.command");
const duplicate_document_command_1 = require("../commands/duplicate-document.command");
const move_document_command_1 = require("../commands/move-document.command");
const recover_document_command_1 = require("../commands/recover-document.command");
const reorder_documents_command_1 = require("../commands/reorder-documents.command");
const unarchive_document_command_1 = require("../commands/unarchive-document.command");
const dto_1 = require("../dto");
const document_entity_1 = require("../entities/document.entity");
let DocumentTreeController = class DocumentTreeController {
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    /**
     * Rewrites `index` for the listed siblings of one parent (`null` = root siblings).
     */
    async reorder(input) {
        return this.commandBus.execute(new reorder_documents_command_1.ReorderDocumentsCommand(input));
    }
    /**
     * Moves a node to a new parent (`null` = root); self or descendant targets are rejected
     * with 409 `DOCS_TREE_CYCLE`.
     */
    async move(id, input) {
        return this.commandBus.execute(new move_document_command_1.MoveDocumentCommand(id, input));
    }
    /**
     * Duplicates a node (optionally its whole subtree). Returns 201 with the new root node.
     */
    async duplicate(id, input) {
        return this.commandBus.execute(new duplicate_document_command_1.DuplicateDocumentCommand(id, input));
    }
    /**
     * Archives the node and cascades to the whole subtree. Idempotent.
     */
    async archive(id) {
        return this.commandBus.execute(new archive_document_command_1.ArchiveDocumentCommand(id));
    }
    /**
     * Clears the archive flags on the subtree. Idempotent.
     */
    async unarchive(id) {
        return this.commandBus.execute(new unarchive_document_command_1.UnarchiveDocumentCommand(id));
    }
    /**
     * Soft delete — **allowed only when archived** (else 409 `DOCS_DELETE_REQUIRES_ARCHIVE`).
     * `strategy=subtree` (default) soft-deletes descendants too; `strategy=promote-children`
     * re-parents children. Blobs are never deleted from storage by this endpoint.
     */
    async delete(id, query) {
        return this.commandBus.execute(new delete_document_command_1.DeleteDocumentCommand(id, query?.strategy ?? 'subtree'));
    }
    /**
     * Restores a soft-deleted document; re-parents to root if the original parent is still
     * deleted; the document returns in archived state.
     */
    async recover(id) {
        return this.commandBus.execute(new recover_document_command_1.RecoverDocumentCommand(id));
    }
};
exports.DocumentTreeController = DocumentTreeController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Reorder sibling documents.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Siblings reordered successfully.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_UPDATE),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
    (0, common_1.Post)('/reorder'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.ReorderDocumentsDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentTreeController.prototype, "reorder", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Move a document in the tree (cycle-guarded).' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Document moved successfully.', type: document_entity_1.Document }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: 'The move would create a cycle.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_UPDATE),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
    (0, common_1.Post)('/:id/move'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.MoveDocumentDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentTreeController.prototype, "move", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Duplicate a document (optionally deep).' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Document duplicated successfully.', type: document_entity_1.Document }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_CREATE),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
    (0, common_1.Post)('/:id/duplicate'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.DuplicateDocumentDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentTreeController.prototype, "duplicate", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Archive a document subtree.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Document archived successfully.', type: document_entity_1.Document }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_UPDATE),
    (0, common_1.Post)('/:id/archive'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentTreeController.prototype, "archive", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Unarchive a document subtree.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Document unarchived successfully.', type: document_entity_1.Document }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_UPDATE),
    (0, common_1.Post)('/:id/unarchive'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentTreeController.prototype, "unarchive", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Soft-delete an archived document.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Document soft-deleted successfully.', type: document_entity_1.Document }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: 'The document is not archived.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_DELETE),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true }),
    (0, common_1.Delete)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.DeleteDocumentQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentTreeController.prototype, "delete", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Recover a soft-deleted document.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Document recovered successfully.', type: document_entity_1.Document }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_DELETE),
    (0, common_1.Post)('/:id/recover'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentTreeController.prototype, "recover", null);
exports.DocumentTreeController = DocumentTreeController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Documents Plugin'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard, core_1.FeatureFlagGuard),
    (0, common_2.FeatureFlag)(contracts_1.FeatureEnum.FEATURE_DOCUMENTS),
    (0, common_1.Controller)('/plugins/docs/documents'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus, cqrs_1.QueryBus])
], DocumentTreeController);
//# sourceMappingURL=document-tree.controller.js.map