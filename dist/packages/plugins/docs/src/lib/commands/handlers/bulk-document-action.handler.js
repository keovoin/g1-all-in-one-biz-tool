"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkDocumentActionHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const docs_constants_1 = require("../../docs.constants");
const bulk_action_dto_1 = require("../../dto/bulk-action.dto");
const document_service_1 = require("../../services/document.service");
const document_knowledge_service_1 = require("../../services/document-knowledge.service");
const document_review_service_1 = require("../../services/document-review.service");
const document_tree_service_1 = require("../../services/document-tree.service");
const bulk_document_action_command_1 = require("../bulk-document-action.command");
let BulkDocumentActionHandler = class BulkDocumentActionHandler {
    constructor(documentService, documentTreeService, documentKnowledgeService, documentReviewService) {
        this.documentService = documentService;
        this.documentTreeService = documentTreeService;
        this.documentKnowledgeService = documentKnowledgeService;
        this.documentReviewService = documentReviewService;
    }
    /**
     * Handles the `BulkDocumentActionCommand` with per-id partial failure (one HTTP 200).
     *
     * Per-action permission enforcement (the route guard only checks the any-of set):
     * `REVIEW_APPROVE`/`REVIEW_REJECT` require `DOCS_REVIEW` only; every other action requires
     * `DOCS_MANAGE` as base, with escalations: `DELETE` also requires `DOCS_DELETE`;
     * `KNOWLEDGE_IMPORT`/`KNOWLEDGE_EXCLUDE` also require `DOCS_AI_IMPORT` — missing → 403
     * before any work.
     *
     * @param command - The command carrying the bulk payload.
     * @returns The per-id result envelope.
     */
    async execute(command) {
        const { input } = command;
        this.assertActionPermissions(input.action);
        this.assertActionPayload(input.action, input);
        const results = [];
        for (const id of input.ids) {
            try {
                await this.applyAction(id, command);
                results.push({ id, ok: true });
            }
            catch (error) {
                results.push({ id, ok: false, code: this.errorCode(error) });
            }
        }
        const succeeded = results.filter((result) => result.ok).length;
        return {
            requested: input.ids.length,
            succeeded,
            failed: results.length - succeeded,
            results
        };
    }
    /**
     * Enforces the per-action permission matrix; violations raise 403 before any mutation.
     */
    assertActionPermissions(action) {
        const isReviewAction = [bulk_action_dto_1.DocumentBulkActionEnum.REVIEW_APPROVE, bulk_action_dto_1.DocumentBulkActionEnum.REVIEW_REJECT].includes(action);
        if (isReviewAction) {
            if (!core_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.DOCS_REVIEW)) {
                throw new common_1.ForbiddenException('Bulk review actions require the DOCS_REVIEW permission');
            }
            return;
        }
        if (!core_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.DOCS_MANAGE)) {
            throw new common_1.ForbiddenException('Bulk actions require the DOCS_MANAGE permission');
        }
        if (action === bulk_action_dto_1.DocumentBulkActionEnum.DELETE && !core_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.DOCS_DELETE)) {
            throw new common_1.ForbiddenException('Bulk delete requires the DOCS_DELETE permission');
        }
        if ([bulk_action_dto_1.DocumentBulkActionEnum.KNOWLEDGE_IMPORT, bulk_action_dto_1.DocumentBulkActionEnum.KNOWLEDGE_EXCLUDE].includes(action) &&
            !core_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.DOCS_AI_IMPORT)) {
            throw new common_1.ForbiddenException('Bulk knowledge actions require the DOCS_AI_IMPORT permission');
        }
    }
    /**
     * Enforces the per-action payload preconditions that a per-id failure could not express
     * safely. `MOVE` is the dangerous one: an omitted `parentId` used to coerce to `null` and
     * move the whole selection to the root, which is both destructive and indistinguishable
     * from success. `null` stays a legal value — it just has to be sent on purpose.
     */
    assertActionPayload(action, input) {
        if (action === bulk_action_dto_1.DocumentBulkActionEnum.MOVE && input.parentId === undefined) {
            throw new common_1.BadRequestException({
                message: 'A bulk MOVE requires an explicit parentId (send null to move to the root)',
                code: docs_constants_1.DOCS_BULK_MOVE_PARENT_REQUIRED
            });
        }
    }
    /**
     * Applies one action to one id (per-id failures are collected by the caller).
     */
    async applyAction(id, command) {
        const { action, categoryIds, tagIds, parentId, reason } = command.input;
        switch (action) {
            case bulk_action_dto_1.DocumentBulkActionEnum.ARCHIVE: {
                const document = await this.documentService.findOneScoped(id);
                await this.documentService.assertCanWrite(document);
                await this.documentTreeService.archiveSubtree(document); // idempotent-success
                return;
            }
            case bulk_action_dto_1.DocumentBulkActionEnum.UNARCHIVE: {
                const document = await this.documentService.findOneScoped(id);
                await this.documentService.assertCanWrite(document);
                await this.documentTreeService.unarchiveSubtree(document); // idempotent-success
                return;
            }
            case bulk_action_dto_1.DocumentBulkActionEnum.SET_CATEGORIES: {
                const document = await this.documentService.findOneScoped(id, ['categories']);
                await this.documentService.assertCanWrite(document);
                document.categories = (categoryIds ?? []).map((categoryId) => ({ id: categoryId }));
                await this.documentService.save(document);
                return;
            }
            case bulk_action_dto_1.DocumentBulkActionEnum.ADD_TAGS: {
                const document = await this.documentService.findOneScoped(id, ['tags']);
                await this.documentService.assertCanWrite(document);
                const existing = new Set((document.tags ?? []).map((tag) => tag.id));
                const additions = (tagIds ?? []).filter((tagId) => !existing.has(tagId));
                document.tags = [...(document.tags ?? []), ...additions.map((tagId) => ({ id: tagId }))];
                await this.documentService.save(document);
                return;
            }
            case bulk_action_dto_1.DocumentBulkActionEnum.REMOVE_TAGS: {
                const document = await this.documentService.findOneScoped(id, ['tags']);
                await this.documentService.assertCanWrite(document);
                const removals = new Set(tagIds ?? []);
                document.tags = (document.tags ?? []).filter((tag) => !removals.has(tag.id));
                await this.documentService.save(document);
                return;
            }
            case bulk_action_dto_1.DocumentBulkActionEnum.MOVE: {
                const document = await this.documentService.findOneScoped(id);
                await this.documentService.assertCanWrite(document);
                // `assertActionPayload` already rejected an omitted parentId, so this is an
                // explicit target (a document id, or `null` meaning "the root").
                await this.documentTreeService.moveDocument(document, parentId);
                return;
            }
            case bulk_action_dto_1.DocumentBulkActionEnum.DELETE: {
                const document = await this.documentService.findOneScoped(id);
                await this.documentService.assertCanWrite(document);
                const deleted = await this.documentTreeService.deleteDocument(document, 'subtree');
                this.documentService.emitDocumentEvent(deleted, 'deleted');
                return;
            }
            case bulk_action_dto_1.DocumentBulkActionEnum.KNOWLEDGE_IMPORT: {
                await this.documentKnowledgeService.importToKnowledge(id);
                return;
            }
            case bulk_action_dto_1.DocumentBulkActionEnum.KNOWLEDGE_EXCLUDE: {
                await this.documentKnowledgeService.excludeFromKnowledge(id);
                return;
            }
            case bulk_action_dto_1.DocumentBulkActionEnum.REVIEW_APPROVE: {
                // The §4.9 review state machine per id — non-PENDING ids fail with
                // DOCS_REVIEW_NOT_PENDING and are collected by the caller.
                await this.documentReviewService.approve(id);
                return;
            }
            case bulk_action_dto_1.DocumentBulkActionEnum.REVIEW_REJECT: {
                await this.documentReviewService.reject(id, { reason });
                return;
            }
            default:
                throw new common_1.HttpException({ code: docs_constants_1.DOCS_BULK_ACTION_UNSUPPORTED }, 400);
        }
    }
    /**
     * Extracts the stable `DOCS_*` code from a thrown exception (falls back to the exception name).
     */
    errorCode(error) {
        const response = error?.getResponse?.();
        if (response && typeof response === 'object' && response.code) {
            return response.code;
        }
        return error?.name ?? 'DOCS_BULK_ITEM_FAILED';
    }
};
exports.BulkDocumentActionHandler = BulkDocumentActionHandler;
exports.BulkDocumentActionHandler = BulkDocumentActionHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(bulk_document_action_command_1.BulkDocumentActionCommand),
    tslib_1.__metadata("design:paramtypes", [document_service_1.DocumentService,
        document_tree_service_1.DocumentTreeService,
        document_knowledge_service_1.DocumentKnowledgeService,
        document_review_service_1.DocumentReviewService])
], BulkDocumentActionHandler);
//# sourceMappingURL=bulk-document-action.handler.js.map