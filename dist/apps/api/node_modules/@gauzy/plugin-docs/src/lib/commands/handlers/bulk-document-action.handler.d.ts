import { ICommandHandler } from '@nestjs/cqrs';
import { IDocumentBulkResult } from '../../dto/bulk-action.dto';
import { DocumentService } from '../../services/document.service';
import { DocumentKnowledgeService } from '../../services/document-knowledge.service';
import { DocumentReviewService } from '../../services/document-review.service';
import { DocumentTreeService } from '../../services/document-tree.service';
import { BulkDocumentActionCommand } from '../bulk-document-action.command';
export declare class BulkDocumentActionHandler implements ICommandHandler<BulkDocumentActionCommand> {
    private readonly documentService;
    private readonly documentTreeService;
    private readonly documentKnowledgeService;
    private readonly documentReviewService;
    constructor(documentService: DocumentService, documentTreeService: DocumentTreeService, documentKnowledgeService: DocumentKnowledgeService, documentReviewService: DocumentReviewService);
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
    execute(command: BulkDocumentActionCommand): Promise<IDocumentBulkResult>;
    /**
     * Enforces the per-action permission matrix; violations raise 403 before any mutation.
     */
    private assertActionPermissions;
    /**
     * Enforces the per-action payload preconditions that a per-id failure could not express
     * safely. `MOVE` is the dangerous one: an omitted `parentId` used to coerce to `null` and
     * move the whole selection to the root, which is both destructive and indistinguishable
     * from success. `null` stays a legal value — it just has to be sent on purpose.
     */
    private assertActionPayload;
    /**
     * Applies one action to one id (per-id failures are collected by the caller).
     */
    private applyAction;
    /**
     * Extracts the stable `DOCS_*` code from a thrown exception (falls back to the exception name).
     */
    private errorCode;
}
