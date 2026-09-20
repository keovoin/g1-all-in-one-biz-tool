import { ID, IDocument } from '@gauzy/contracts';
import { ApproveReviewDTO, RejectReviewDTO, RequestReviewDTO } from '../dto';
import { DocumentIndexService } from '../knowledge/indexing/document-index.service';
import { TypeOrmDocumentRepository } from '../repositories/type-orm-document.repository';
import { DocumentService } from './document.service';
/**
 * The human-review workflow (§4.9 of the backend spec, §12 of the AI-knowledge spec).
 *
 * State machine: `NONE → PENDING → APPROVED | REJECTED` (re-reviewable). Approve makes an
 * already-`INDEXED` document retrievable immediately — the circuit-breaker filter is
 * dynamic, no re-index needed. Reject never deletes the document; it forces
 * `knowledgeStatus: EXCLUDED` and physically removes the knowledge projection.
 */
export declare class DocumentReviewService {
    private readonly documentService;
    private readonly documentIndexService;
    private readonly typeOrmDocumentRepository;
    private readonly logger;
    constructor(documentService: DocumentService, documentIndexService: DocumentIndexService, typeOrmDocumentRepository: TypeOrmDocumentRepository);
    /**
     * `POST /documents/:id/review/request` — manual review request. Already PENDING →
     * 200 no-op (machine-set reasons come from the pipeline, never from this route).
     */
    requestReview(id: ID, input?: RequestReviewDTO): Promise<IDocument>;
    /**
     * `POST /documents/:id/review/approve` — PENDING → APPROVED; stamps `reviewedById` +
     * `reviewedAt`. An `INDEXED`-pending-gate document becomes retrievable immediately.
     * Non-PENDING → 409 `DOCS_REVIEW_NOT_PENDING`.
     */
    approve(id: ID, input?: ApproveReviewDTO): Promise<IDocument>;
    /**
     * `POST /documents/:id/review/reject` — PENDING → REJECTED; the document stays in the
     * hub but is excluded from AI retrieval: `knowledgeStatus` forced to `EXCLUDED` and the
     * knowledge projection removed. Re-reviewable via a new review request.
     */
    reject(id: ID, input?: RejectReviewDTO): Promise<IDocument>;
    /** Loads the document and enforces the PENDING precondition. */
    private requirePending;
    /** Scoped review-column update mirrored onto the in-memory entity. */
    private updateReview;
    /** Merges keys into `metadata.review` (sqlite-aware — `update` bypasses subscribers). */
    private mergeReviewMetadata;
    private emit;
}
