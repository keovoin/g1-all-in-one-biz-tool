import { ID, IDocument } from '@gauzy/contracts';
import { BulkKnowledgeReindexDTO, KnowledgeSearchDTO, ReindexDocumentKnowledgeDTO } from '../dto';
import { DocumentKnowledgeSearchService, IKnowledgeSearchResult } from '../knowledge/retrieval/retrieval.service';
import { DocumentKnowledgeService, IBulkReindexResult, IKnowledgeStatus } from '../services/document-knowledge.service';
/**
 * Knowledge operations of the Documents plugin (§4.8 of the backend spec): hybrid
 * retrieval, per-document import/exclude/reindex, the bulk model-drift sweep, and the
 * deployment capability probe.
 */
export declare class DocumentKnowledgeController {
    private readonly knowledgeSearchService;
    private readonly knowledgeService;
    constructor(knowledgeSearchService: DocumentKnowledgeSearchService, knowledgeService: DocumentKnowledgeService);
    /**
     * Hybrid lexical + vector retrieval with RRF fusion. Zero hits is HTTP 200 with an
     * empty, well-formed envelope — never an error (degradation ladder §10).
     */
    search(input: KnowledgeSearchDTO): Promise<IKnowledgeSearchResult>;
    /**
     * Bulk model-drift / full re-index sweep (§8.4 of the AI-knowledge spec).
     */
    bulkReindex(input: BulkKnowledgeReindexDTO): Promise<IBulkReindexResult>;
    /**
     * Deployment/index capability probe: `{ vectorCapable, embeddingProviderConfigured,
     * embeddingModel }` — no counts payload.
     */
    status(): Promise<IKnowledgeStatus>;
    /**
     * Imports one document into AI knowledge (explicit choice — never a side effect).
     */
    importToKnowledge(id: ID): Promise<IDocument>;
    /**
     * Excludes one document from AI knowledge — chunks and index state are removed
     * physically in the same transaction. Idempotent.
     */
    excludeFromKnowledge(id: ID): Promise<IDocument>;
    /**
     * Re-runs `chunk → embed → index` for one document. `force: false` (default) keeps the
     * `contentHash` skip-if-unchanged short-circuit.
     */
    reindexDocument(id: ID, input: ReindexDocumentKnowledgeDTO): Promise<IDocument>;
}
