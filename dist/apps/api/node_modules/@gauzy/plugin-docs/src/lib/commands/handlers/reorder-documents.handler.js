"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReorderDocumentsHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const core_1 = require("@gauzy/core");
const document_tree_service_1 = require("../../services/document-tree.service");
const reorder_documents_command_1 = require("../reorder-documents.command");
let ReorderDocumentsHandler = class ReorderDocumentsHandler {
    constructor(documentTreeService) {
        this.documentTreeService = documentTreeService;
    }
    /**
     * Handles the `ReorderDocumentsCommand`: rewrites `index` for the listed siblings.
     *
     * @param command - The command carrying the parent and ordered sibling ids.
     */
    async execute(command) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        await this.documentTreeService.reorderDocuments(command.input.parentId, command.input.orderedIds, tenantId, organizationId);
    }
};
exports.ReorderDocumentsHandler = ReorderDocumentsHandler;
exports.ReorderDocumentsHandler = ReorderDocumentsHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(reorder_documents_command_1.ReorderDocumentsCommand),
    tslib_1.__metadata("design:paramtypes", [document_tree_service_1.DocumentTreeService])
], ReorderDocumentsHandler);
//# sourceMappingURL=reorder-documents.handler.js.map