"use strict";
var DocumentClassifierService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentClassifierService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const docs_config_1 = require("../../docs.config");
const document_entity_1 = require("../../entities/document.entity");
const type_orm_document_category_repository_1 = require("../../repositories/type-orm-document-category.repository");
const type_orm_document_repository_1 = require("../../repositories/type-orm-document.repository");
const docs_ai_service_1 = require("../ai/docs-ai.service");
const knowledge_constants_1 = require("../knowledge.constants");
const classification_prompt_1 = require("./classification.prompt");
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
let DocumentClassifierService = DocumentClassifierService_1 = class DocumentClassifierService {
    constructor(typeOrmDocumentRepository, typeOrmDocumentCategoryRepository, docsAiService) {
        this.typeOrmDocumentRepository = typeOrmDocumentRepository;
        this.typeOrmDocumentCategoryRepository = typeOrmDocumentCategoryRepository;
        this.docsAiService = docsAiService;
        this.logger = new common_1.Logger(DocumentClassifierService_1.name);
    }
    /**
     * Classifies one document (the `docs.classify` handler body).
     *
     * @param document The snapshot-loaded document row.
     * @param job The classify-job payload (tenant/org snapshot).
     * @returns The outcome — informational; the chain continues on every outcome.
     */
    async classify(document, job) {
        const config = (0, docs_config_1.getDocsConfig)();
        if (!config.aiEnabled) {
            this.logger.debug(`docs.classify skipped for document ${document.id} — AI is disabled`);
            return 'skipped';
        }
        if (document.kind !== contracts_1.DocumentKindEnum.FILE) {
            this.logger.debug(`docs.classify skipped for document ${document.id} — not a FILE`);
            return 'skipped';
        }
        if (document.source === contracts_1.DocumentSourceEnum.SYSTEM) {
            this.logger.debug(`docs.classify skipped for document ${document.id} — SYSTEM source`);
            return 'skipped';
        }
        if (!document.extractedText) {
            this.logger.debug(`docs.classify skipped for document ${document.id} — no extracted text`);
            return 'skipped';
        }
        const resolved = await this.docsAiService.resolveChatModel(job.tenantId);
        const sdk = resolved ? await this.docsAiService.loadAiSdk() : null;
        if (!resolved || !sdk) {
            this.logger.debug(`docs.classify skipped for document ${document.id} — no AI provider resolves (lexical-only mode)`);
            return 'skipped';
        }
        // Tenant catalog → `slug: description` lines (system-seeded + user-added ride along).
        const catalog = await this.typeOrmDocumentCategoryRepository.find({
            where: { tenantId: job.tenantId, organizationId: job.organizationId }
        });
        const catalogLines = catalog
            .map((category) => `${category.slug}: ${category.description || category.name}`)
            .join('\n');
        const prompt = (0, classification_prompt_1.buildClassificationPrompt)({
            catalogLines,
            originalFilename: document.originalFilename ?? document.name,
            sampledMarkdown: (0, classification_prompt_1.sampleMarkdown)(document.extractedText, config.classifySampleChars)
        });
        const startedAt = Date.now();
        let rawOutput = '';
        let usage = {
            inputTokens: Math.ceil((prompt.system.length + prompt.user.length) / 4),
            outputTokens: 0,
            estimated: true
        };
        try {
            const result = await sdk.generateText({
                model: resolved.model,
                system: prompt.system,
                prompt: prompt.user,
                temperature: 0,
                maxOutputTokens: knowledge_constants_1.DOCS_CLASSIFY_MAX_OUTPUT_TOKENS
            });
            rawOutput = result.text ?? '';
            const reported = result.usage;
            if (Number.isFinite(reported?.inputTokens) && Number.isFinite(reported?.outputTokens)) {
                usage = { inputTokens: reported.inputTokens, outputTokens: reported.outputTokens, estimated: false };
            }
            else {
                usage.outputTokens = Math.ceil(rawOutput.length / 4);
            }
            this.emitUsage(job, resolved.providerId, resolved.modelId, usage, startedAt, true);
        }
        catch (error) {
            this.emitUsage(job, resolved.providerId, resolved.modelId, usage, startedAt, false);
            // Best-effort by spec (§5.3): the document stays READY with null confidence.
            this.logger.warn(`docs.classify failed for document ${document.id}: ${error.message}`);
            return 'failed';
        }
        const output = (0, classification_prompt_1.parseClassificationOutput)(rawOutput, catalog.map((category) => category.slug));
        if (!output) {
            // Unusable output gates the document for human review (§5.3).
            await this.applyReviewGate(document);
            this.logger.warn(`docs.classify produced unusable output for document ${document.id}`);
            return 'unusable';
        }
        await this.applyClassification(document, output, catalog);
        if (output.confidence === null || output.confidence < knowledge_constants_1.DOCS_LOW_CONFIDENCE_THRESHOLD) {
            await this.applyReviewGate(document);
            return 'low-confidence';
        }
        return 'classified';
    }
    /**
     * Persists the classification result: summary, confidence, `metadata.ai` block, and the
     * AI-suggested categories applied **additively** via the pivot (user-set categories are
     * never removed; tags are suggestions only — no `Tag` rows are auto-created).
     */
    async applyClassification(document, output, catalog) {
        const existing = (document.metadata && typeof document.metadata === 'object' ? document.metadata : {});
        const metadata = {
            ...existing,
            ai: {
                ...(existing.ai ?? {}),
                suggestedTags: output.suggestedTags,
                language: output.language,
                classifiedAt: new Date().toISOString()
            }
        };
        await this.typeOrmDocumentRepository.update({ id: document.id, tenantId: document.tenantId, organizationId: document.organizationId }, {
            summary: output.summary ?? document.summary ?? null,
            aiConfidence: output.confidence,
            // `.update()` bypasses entity subscribers — serialize for the sqlite text column.
            metadata: (0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)() ? JSON.stringify(metadata) : metadata
        });
        document.summary = output.summary ?? document.summary;
        document.aiConfidence = output.confidence ?? undefined;
        document.metadata = metadata;
        // Additive category application through the pivot.
        if (output.categories.length) {
            const bySlug = new Map(catalog
                .filter((category) => Boolean(category.id))
                .map((category) => [category.slug.toLowerCase(), category.id]));
            const targetIds = output.categories
                .map((slug) => bySlug.get(slug.toLowerCase()))
                .filter((id) => Boolean(id));
            if (targetIds.length) {
                const withCategories = await this.typeOrmDocumentRepository.findOne({
                    where: { id: document.id, tenantId: document.tenantId, organizationId: document.organizationId },
                    relations: { categories: true }
                });
                const current = new Set((withCategories?.categories ?? []).map((category) => category.id));
                const additions = targetIds.filter((id) => !current.has(id));
                if (additions.length) {
                    await this.typeOrmDocumentRepository
                        .createQueryBuilder()
                        .relation(document_entity_1.Document, 'categories')
                        .of(document.id)
                        .add(additions);
                }
            }
        }
    }
    /**
     * Flips the document to `reviewStatus: PENDING / low-confidence` — the review circuit
     * breaker excludes it from retrieval until a human approves (§12).
     */
    async applyReviewGate(document) {
        await this.typeOrmDocumentRepository.update({ id: document.id, tenantId: document.tenantId, organizationId: document.organizationId }, {
            reviewStatus: contracts_1.DocumentReviewStatusEnum.PENDING,
            reviewReason: contracts_1.DocumentReviewReasonEnum.LOW_CONFIDENCE
        });
        document.reviewStatus = contracts_1.DocumentReviewStatusEnum.PENDING;
        document.reviewReason = contracts_1.DocumentReviewReasonEnum.LOW_CONFIDENCE;
    }
    /**
     * Cost-accounting emission for one classification call (§7.4).
     */
    emitUsage(job, providerId, model, usage, startedAt, success) {
        this.docsAiService.emitUsage({
            tenantId: job.tenantId,
            organizationId: job.organizationId,
            feature: 'docs-classify',
            providerId,
            model,
            inputTokens: usage.inputTokens,
            outputTokens: usage.outputTokens,
            estimated: usage.estimated,
            durationMs: Date.now() - startedAt,
            success
        });
    }
};
exports.DocumentClassifierService = DocumentClassifierService;
exports.DocumentClassifierService = DocumentClassifierService = DocumentClassifierService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_document_repository_1.TypeOrmDocumentRepository,
        type_orm_document_category_repository_1.TypeOrmDocumentCategoryRepository,
        docs_ai_service_1.DocsAiService])
], DocumentClassifierService);
//# sourceMappingURL=document-classifier.service.js.map