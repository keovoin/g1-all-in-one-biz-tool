import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventBus } from '@gauzy/core';
import { IDocsAiUsageLogEvent, IDocsRetrievalLog, IDocsRetrievalLogEvent } from './retrieval-log.types';
/**
 * The P1 telemetry sink of `07-ai-knowledge.md` §16: **structured logger lines, no tables**.
 *
 * Emits exactly one line per retrieval event and one per AI-usage event, in a stable
 * `key=value` shape so log pipelines can aggregate them without a schema:
 *
 * ```
 * docs.retrieval tenant=8f3c1d2e4a5b org=1a2b3c4d5e6f consumer=knowledge-search qlen=34 \
 *   results=6 documents=4 latencyMs=87 mode=hybrid topScore=0.0312 lowConfidence=false store=pgvector
 * docs.ai.usage tenant=8f3c1d2e4a5b org=1a2b3c4d5e6f feature=docs-embed provider=openai \
 *   model=text-embedding-3-small inTokens=812 outTokens=0 estimated=false durationMs=131 success=true
 * ```
 *
 * Content hygiene (§16): no query text, no document names, no chunk text ever reaches a
 * line — the query contributes its **length** only, and tenant/organization ids are one-way
 * hashed so a log export cannot be correlated back to a customer without the database.
 *
 * The service is bound behind the `DOCS_RETRIEVAL_LOG` token, so the P2 table-backed
 * implementation replaces it without touching a single call site.
 *
 * `GAUZY_DOCS_RETRIEVAL_LOG_ENABLED=false` is the kill-switch: the subscription is not
 * created and every record call returns immediately.
 */
export declare class RetrievalLogService implements IDocsRetrievalLog, OnModuleInit, OnModuleDestroy {
    private readonly eventBus;
    readonly id = "structured-log";
    private readonly logger;
    private aiUsageSubscription?;
    constructor(eventBus: EventBus);
    /**
     * Subscribes to the AI usage events the knowledge pipeline already emits
     * (`DocsAiUsageEvent`, published by `DocsAiService.emitUsage`) so classification,
     * embedding, query-embedding and OCR costs land on the same telemetry channel as
     * retrieval — one place to swap in P2.
     */
    onModuleInit(): void;
    /** Drops the AI-usage subscription on teardown. */
    onModuleDestroy(): void;
    /**
     * Records one retrieval event. Fire-and-forget: any failure is swallowed to a debug
     * line — telemetry must never slow or fail a search.
     *
     * @param event The content-free retrieval event.
     */
    recordRetrieval(event: IDocsRetrievalLogEvent): void;
    /**
     * Records one AI usage event (cost accounting groundwork, §7.4/§16).
     *
     * @param event The usage event.
     */
    recordAiUsage(event: IDocsAiUsageLogEvent): void;
    /**
     * One-way hash of a tenant/organization id — stable across lines (so events can be
     * grouped) but not reversible from a log export.
     *
     * @param id The raw scope id.
     * @returns A short hex digest, or `na` when absent.
     */
    private hashScope;
}
