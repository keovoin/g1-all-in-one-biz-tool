import { CommandBus } from '@nestjs/cqrs';
import { ID, IDocument } from '@gauzy/contracts';
import { ApproveReviewDTO, RejectReviewDTO, RequestReviewDTO, UpdateExtractedTextDTO } from '../dto';
import { DocumentKnowledgeService } from '../services/document-knowledge.service';
import { DocumentReviewService } from '../services/document-review.service';
import { DocumentService } from '../services/document.service';
/**
 * Review-workflow surface of the Documents plugin (§4.9 of the backend spec): the manual
 * review request, the approve/reject decisions (the human side of the AI review circuit
 * breaker), the extracted-text read/correction endpoints, and AI summary regeneration.
 */
export declare class DocumentReviewController {
    private readonly commandBus;
    private readonly documentService;
    private readonly documentReviewService;
    private readonly documentKnowledgeService;
    constructor(commandBus: CommandBus, documentService: DocumentService, documentReviewService: DocumentReviewService, documentKnowledgeService: DocumentKnowledgeService);
    /**
     * Manual review request: `reviewStatus → PENDING`, `reviewReason: 'manual'`
     * (machine-set reasons come from the pipeline). Already PENDING → 200 no-op.
     */
    requestReview(id: ID, input: RequestReviewDTO): Promise<IDocument>;
    /**
     * Approves a PENDING review — an already-INDEXED document becomes retrievable
     * immediately (the circuit breaker opens; no re-index needed).
     */
    approveReview(id: ID, input: ApproveReviewDTO): Promise<IDocument>;
    /**
     * Rejects a PENDING review — the document stays stored but is excluded from AI
     * retrieval (`knowledgeStatus` forced to `EXCLUDED`).
     */
    rejectReview(id: ID, input: RejectReviewDTO): Promise<IDocument>;
    /**
     * Re-runs the classification stage to regenerate the AI summary of a FILE document.
     */
    regenerateSummary(id: ID): Promise<IDocument>;
    /**
     * The one endpoint that returns the full extracted markdown (review/correction UI).
     */
    getExtractedText(id: ID): Promise<{
        extractedText: string | null;
        extractedTextEdited: boolean;
        status: string;
        statusMessage: string | null;
    }>;
    /**
     * Human correction of the extraction: stores the markdown, sets
     * `extractedTextEdited: true` (permanently protects it from pipeline overwrite),
     * forces `status: READY`, and re-enqueues from `docs.chunk` when the document is in
     * knowledge. FILE kind only (409 `DOCS_NOT_A_FILE`).
     */
    updateExtractedText(id: ID, input: UpdateExtractedTextDTO): Promise<IDocument>;
}
