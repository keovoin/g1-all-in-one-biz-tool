import { Document } from '../../entities/document.entity';
import { TypeOrmDocumentCategoryRepository } from '../../repositories/type-orm-document-category.repository';
import { TypeOrmDocumentRepository } from '../../repositories/type-orm-document.repository';
import { DocsAiService } from '../ai/docs-ai.service';
import { IDocsClassifyJob } from '../queue/docs-job.types';
/** What one classification run did — the worker logs it and always continues the chain. */
export type ClassificationOutcome = 'classified' | 'low-confidence' | 'skipped' | 'unusable' | 'failed';
/**
 * LLM document classification (§5 of the AI-knowledge spec).
 *
 * Runs as the `docs.classify` job for FILE documents after successful extraction.
 * Classification is **best-effort by spec**: any failure leaves the document `READY` with
 * `aiConfidence = null` — the worker chain continues regardless of the outcome.
 *
 * Skipped entirely for PAGE documents (author-controlled), for `source: SYSTEM` documents
 * (deterministic system captures need no LLM), and whenever AI is disabled or no provider
 * resolves (degradation ladder — a debug log, never an error).
 *
 * Worker-safe: every repository access uses the explicit tenant/organization snapshot of
 * the job payload; `RequestContext` is never consulted.
 */
export declare class DocumentClassifierService {
    private readonly typeOrmDocumentRepository;
    private readonly typeOrmDocumentCategoryRepository;
    private readonly docsAiService;
    private readonly logger;
    constructor(typeOrmDocumentRepository: TypeOrmDocumentRepository, typeOrmDocumentCategoryRepository: TypeOrmDocumentCategoryRepository, docsAiService: DocsAiService);
    /**
     * Classifies one document (the `docs.classify` handler body).
     *
     * @param document The snapshot-loaded document row.
     * @param job The classify-job payload (tenant/org snapshot).
     * @returns The outcome — informational; the chain continues on every outcome.
     */
    classify(document: Document, job: IDocsClassifyJob): Promise<ClassificationOutcome>;
    /**
     * Persists the classification result: summary, confidence, `metadata.ai` block, and the
     * AI-suggested categories applied **additively** via the pivot (user-set categories are
     * never removed; tags are suggestions only — no `Tag` rows are auto-created).
     */
    private applyClassification;
    /**
     * Flips the document to `reviewStatus: PENDING / low-confidence` — the review circuit
     * breaker excludes it from retrieval until a human approves (§12).
     */
    private applyReviewGate;
    /**
     * Cost-accounting emission for one classification call (§7.4).
     */
    private emitUsage;
}
