"use strict";
var RetrievalLogService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetrievalLogService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const core_1 = require("@gauzy/core");
const docs_config_1 = require("../docs.config");
const docs_ai_usage_event_1 = require("../knowledge/ai/docs-ai-usage.event");
/** Length of the one-way scope hashes emitted in the log lines. */
const SCOPE_HASH_LENGTH = 12;
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
let RetrievalLogService = RetrievalLogService_1 = class RetrievalLogService {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.id = 'structured-log';
        this.logger = new common_1.Logger(RetrievalLogService_1.name);
    }
    /**
     * Subscribes to the AI usage events the knowledge pipeline already emits
     * (`DocsAiUsageEvent`, published by `DocsAiService.emitUsage`) so classification,
     * embedding, query-embedding and OCR costs land on the same telemetry channel as
     * retrieval — one place to swap in P2.
     */
    onModuleInit() {
        if (!(0, docs_config_1.getDocsConfig)().retrievalLogEnabled) {
            this.logger.debug('Documents retrieval telemetry is disabled (GAUZY_DOCS_RETRIEVAL_LOG_ENABLED=false).');
            return;
        }
        try {
            // `DocsAiUsageEvent` is structurally BaseEvent-shaped; `ofType` matches on the
            // constructor identity, so the cast is safe and keeps the plugin free of the
            // non-exported core base class.
            this.aiUsageSubscription = this.eventBus.ofType(docs_ai_usage_event_1.DocsAiUsageEvent).subscribe({
                next: (event) => this.recordAiUsage({ ...event.payload }),
                // A telemetry stream error must never take the module down.
                error: (error) => this.logger.warn(`Docs AI usage telemetry stream error: ${error?.message}`)
            });
            this.logger.log(`Documents retrieval telemetry active (sink: ${this.id}).`);
        }
        catch (error) {
            this.logger.warn(`Failed to subscribe to DocsAiUsageEvent: ${error.message}`);
        }
    }
    /** Drops the AI-usage subscription on teardown. */
    onModuleDestroy() {
        this.aiUsageSubscription?.unsubscribe();
        this.aiUsageSubscription = undefined;
    }
    /**
     * Records one retrieval event. Fire-and-forget: any failure is swallowed to a debug
     * line — telemetry must never slow or fail a search.
     *
     * @param event The content-free retrieval event.
     */
    recordRetrieval(event) {
        if (!(0, docs_config_1.getDocsConfig)().retrievalLogEnabled) {
            return;
        }
        try {
            this.logger.log([
                'docs.retrieval',
                `tenant=${this.hashScope(event.tenantId)}`,
                `org=${this.hashScope(event.organizationId)}`,
                `consumer=${event.consumerKind}`,
                `qlen=${Math.max(0, Math.trunc(event.queryLength))}`,
                `results=${event.resultCount}`,
                `documents=${event.documentCount}`,
                `latencyMs=${Math.round(event.latencyMs)}`,
                `mode=${event.mode}`,
                `topScore=${event.topScore === null || event.topScore === undefined ? 'na' : event.topScore.toFixed(4)}`,
                `lowConfidence=${event.lowConfidence === true}`,
                `store=${event.storeId ?? 'na'}`
            ].join(' '));
        }
        catch (error) {
            this.logger.debug(`Retrieval telemetry line failed: ${error.message}`);
        }
    }
    /**
     * Records one AI usage event (cost accounting groundwork, §7.4/§16).
     *
     * @param event The usage event.
     */
    recordAiUsage(event) {
        if (!(0, docs_config_1.getDocsConfig)().retrievalLogEnabled) {
            return;
        }
        try {
            this.logger.log([
                'docs.ai.usage',
                `tenant=${this.hashScope(event.tenantId)}`,
                `org=${this.hashScope(event.organizationId)}`,
                `feature=${event.feature}`,
                `provider=${event.providerId}`,
                `model=${event.model}`,
                `inTokens=${event.inputTokens}`,
                `outTokens=${event.outputTokens}`,
                `estimated=${event.estimated === true}`,
                `durationMs=${Math.round(event.durationMs)}`,
                `success=${event.success === true}`
            ].join(' '));
        }
        catch (error) {
            this.logger.debug(`AI usage telemetry line failed: ${error.message}`);
        }
    }
    /**
     * One-way hash of a tenant/organization id — stable across lines (so events can be
     * grouped) but not reversible from a log export.
     *
     * @param id The raw scope id.
     * @returns A short hex digest, or `na` when absent.
     */
    hashScope(id) {
        if (!id) {
            return 'na';
        }
        return (0, crypto_1.createHash)('sha256').update(String(id)).digest('hex').slice(0, SCOPE_HASH_LENGTH);
    }
};
exports.RetrievalLogService = RetrievalLogService;
exports.RetrievalLogService = RetrievalLogService = RetrievalLogService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.EventBus])
], RetrievalLogService);
//# sourceMappingURL=retrieval-log.service.js.map