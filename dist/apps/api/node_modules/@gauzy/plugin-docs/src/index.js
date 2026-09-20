"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canonicalExtension = exports.isProbablyUtf8Text = exports.isMarkupContent = exports.sniffFile = exports.DocsPipelineService = exports.DocsRecoveryService = exports.DocsQueueService = exports.stripChatTemplateMarkers = exports.neutralizeUntrustedContent = exports.fenceDocumentContent = exports.fenceDocChunk = exports.breakClosingFence = exports.UNTRUSTED_EXCERPT_NOTICE = exports.LexicalStoreProvider = exports.PgVectorStoreProvider = exports.DocumentVectorStoreRegistry = exports.DocsAiUsageEvent = exports.DocsAiService = exports.DocumentIndexService = exports.buildClassificationPrompt = exports.sampleMarkdown = exports.parseClassificationOutput = exports.DocumentClassifierService = exports.EmbeddingService = exports.isRetrievable = exports.isBlockedByReviewCircuitBreaker = exports.applyRetrievalFilters = exports.DocumentKnowledgeSearchService = exports.stripPromptControlMarkers = exports.hardenUntrustedContent = exports.fenceUntrustedContent = exports.UNTRUSTED_CONTENT_NOTICE = exports.DOCS_CHAT_TOOL_FACTORY_ID = exports.DocsChatToolsService = exports.UploadDocumentsCommand = exports.ReplaceDocumentFileCommand = exports.CreateDocumentLinkCommand = exports.CreateDocumentCommand = exports.buildShareGrantExistsSql = exports.DocumentQuotaService = exports.DocumentAccessService = exports.DocumentShareService = exports.DocumentReviewService = exports.DocumentKnowledgeService = exports.DocumentProcessingService = exports.DocumentUploadService = exports.DocumentLinkService = exports.DocumentService = exports.DocsFeatureService = void 0;
const tslib_1 = require("tslib");
/**
 * Public API Surface of @gauzy/plugin-docs
 */
tslib_1.__exportStar(require("./lib/docs.plugin"), exports);
tslib_1.__exportStar(require("./lib/docs.module"), exports);
tslib_1.__exportStar(require("./lib/docs.config"), exports);
tslib_1.__exportStar(require("./lib/docs.constants"), exports);
// Entities (exported for typing only — other plugins must not register them again)
tslib_1.__exportStar(require("./lib/entities"), exports);
// Public services (available via DocsModule exports)
var docs_feature_service_1 = require("./lib/services/docs-feature.service");
Object.defineProperty(exports, "DocsFeatureService", { enumerable: true, get: function () { return docs_feature_service_1.DocsFeatureService; } });
var document_service_1 = require("./lib/services/document.service");
Object.defineProperty(exports, "DocumentService", { enumerable: true, get: function () { return document_service_1.DocumentService; } });
var document_link_service_1 = require("./lib/services/document-link.service");
Object.defineProperty(exports, "DocumentLinkService", { enumerable: true, get: function () { return document_link_service_1.DocumentLinkService; } });
var document_upload_service_1 = require("./lib/services/document-upload.service");
Object.defineProperty(exports, "DocumentUploadService", { enumerable: true, get: function () { return document_upload_service_1.DocumentUploadService; } });
var document_processing_service_1 = require("./lib/services/document-processing.service");
Object.defineProperty(exports, "DocumentProcessingService", { enumerable: true, get: function () { return document_processing_service_1.DocumentProcessingService; } });
var document_knowledge_service_1 = require("./lib/services/document-knowledge.service");
Object.defineProperty(exports, "DocumentKnowledgeService", { enumerable: true, get: function () { return document_knowledge_service_1.DocumentKnowledgeService; } });
var document_review_service_1 = require("./lib/services/document-review.service");
Object.defineProperty(exports, "DocumentReviewService", { enumerable: true, get: function () { return document_review_service_1.DocumentReviewService; } });
var document_share_service_1 = require("./lib/services/document-share.service");
Object.defineProperty(exports, "DocumentShareService", { enumerable: true, get: function () { return document_share_service_1.DocumentShareService; } });
var document_access_service_1 = require("./lib/services/document-access.service");
Object.defineProperty(exports, "DocumentAccessService", { enumerable: true, get: function () { return document_access_service_1.DocumentAccessService; } });
var document_quota_service_1 = require("./lib/services/document-quota.service");
Object.defineProperty(exports, "DocumentQuotaService", { enumerable: true, get: function () { return document_quota_service_1.DocumentQuotaService; } });
// Visibility + share composition (08 §3) — the pure truth-table predicates and their SQL
// mirror, exported so other surfaces can never re-derive a different rule.
tslib_1.__exportStar(require("./lib/services/document-access.predicate"), exports);
var document_access_sql_1 = require("./lib/services/document-access.sql");
Object.defineProperty(exports, "buildShareGrantExistsSql", { enumerable: true, get: function () { return document_access_sql_1.buildShareGrantExistsSql; } });
// Organization storage-quota arithmetic (08 §5.7) — pure, unit-tested.
tslib_1.__exportStar(require("./lib/services/quota.calculator"), exports);
// Events
tslib_1.__exportStar(require("./lib/events/document.event"), exports);
// Activity log (R-COL-03) — the `DocumentEvent` subscriber that writes the detail panel's
// timeline through the platform's own `ActivityLogService`.
tslib_1.__exportStar(require("./lib/activity"), exports);
// Commands intended for cross-plugin dispatch
var create_document_command_1 = require("./lib/commands/create-document.command");
Object.defineProperty(exports, "CreateDocumentCommand", { enumerable: true, get: function () { return create_document_command_1.CreateDocumentCommand; } });
var create_document_link_command_1 = require("./lib/commands/create-document-link.command");
Object.defineProperty(exports, "CreateDocumentLinkCommand", { enumerable: true, get: function () { return create_document_link_command_1.CreateDocumentLinkCommand; } });
var replace_document_file_command_1 = require("./lib/commands/replace-document-file.command");
Object.defineProperty(exports, "ReplaceDocumentFileCommand", { enumerable: true, get: function () { return replace_document_file_command_1.ReplaceDocumentFileCommand; } });
var upload_documents_command_1 = require("./lib/commands/upload-documents.command");
Object.defineProperty(exports, "UploadDocumentsCommand", { enumerable: true, get: function () { return upload_documents_command_1.UploadDocumentsCommand; } });
// AI-chat tool contribution (docs_search / docs_read) + the retrieval-service seam
var docs_chat_tools_service_1 = require("./lib/knowledge/chat-tools/docs-chat-tools.service");
Object.defineProperty(exports, "DocsChatToolsService", { enumerable: true, get: function () { return docs_chat_tools_service_1.DocsChatToolsService; } });
Object.defineProperty(exports, "DOCS_CHAT_TOOL_FACTORY_ID", { enumerable: true, get: function () { return docs_chat_tools_service_1.DOCS_CHAT_TOOL_FACTORY_ID; } });
tslib_1.__exportStar(require("./lib/knowledge/chat-tools/docs-knowledge-search.types"), exports);
var untrusted_content_1 = require("./lib/knowledge/chat-tools/untrusted-content");
Object.defineProperty(exports, "UNTRUSTED_CONTENT_NOTICE", { enumerable: true, get: function () { return untrusted_content_1.UNTRUSTED_CONTENT_NOTICE; } });
Object.defineProperty(exports, "fenceUntrustedContent", { enumerable: true, get: function () { return untrusted_content_1.fenceUntrustedContent; } });
Object.defineProperty(exports, "hardenUntrustedContent", { enumerable: true, get: function () { return untrusted_content_1.hardenUntrustedContent; } });
Object.defineProperty(exports, "stripPromptControlMarkers", { enumerable: true, get: function () { return untrusted_content_1.stripPromptControlMarkers; } });
// AI-knowledge pipeline: retrieval, RRF, chunking, embedding, classification seams
var retrieval_service_1 = require("./lib/knowledge/retrieval/retrieval.service");
Object.defineProperty(exports, "DocumentKnowledgeSearchService", { enumerable: true, get: function () { return retrieval_service_1.DocumentKnowledgeSearchService; } });
tslib_1.__exportStar(require("./lib/knowledge/retrieval/rrf"), exports);
var retrieval_filters_1 = require("./lib/knowledge/retrieval/retrieval-filters");
Object.defineProperty(exports, "applyRetrievalFilters", { enumerable: true, get: function () { return retrieval_filters_1.applyRetrievalFilters; } });
Object.defineProperty(exports, "isBlockedByReviewCircuitBreaker", { enumerable: true, get: function () { return retrieval_filters_1.isBlockedByReviewCircuitBreaker; } });
Object.defineProperty(exports, "isRetrievable", { enumerable: true, get: function () { return retrieval_filters_1.isRetrievable; } });
tslib_1.__exportStar(require("./lib/knowledge/chunking/markdown-chunker"), exports);
tslib_1.__exportStar(require("./lib/knowledge/chunking/token-counter"), exports);
var embedding_service_1 = require("./lib/knowledge/embedding/embedding.service");
Object.defineProperty(exports, "EmbeddingService", { enumerable: true, get: function () { return embedding_service_1.EmbeddingService; } });
var document_classifier_service_1 = require("./lib/knowledge/classification/document-classifier.service");
Object.defineProperty(exports, "DocumentClassifierService", { enumerable: true, get: function () { return document_classifier_service_1.DocumentClassifierService; } });
var classification_prompt_1 = require("./lib/knowledge/classification/classification.prompt");
Object.defineProperty(exports, "parseClassificationOutput", { enumerable: true, get: function () { return classification_prompt_1.parseClassificationOutput; } });
Object.defineProperty(exports, "sampleMarkdown", { enumerable: true, get: function () { return classification_prompt_1.sampleMarkdown; } });
Object.defineProperty(exports, "buildClassificationPrompt", { enumerable: true, get: function () { return classification_prompt_1.buildClassificationPrompt; } });
var document_index_service_1 = require("./lib/knowledge/indexing/document-index.service");
Object.defineProperty(exports, "DocumentIndexService", { enumerable: true, get: function () { return document_index_service_1.DocumentIndexService; } });
var docs_ai_service_1 = require("./lib/knowledge/ai/docs-ai.service");
Object.defineProperty(exports, "DocsAiService", { enumerable: true, get: function () { return docs_ai_service_1.DocsAiService; } });
var docs_ai_usage_event_1 = require("./lib/knowledge/ai/docs-ai-usage.event");
Object.defineProperty(exports, "DocsAiUsageEvent", { enumerable: true, get: function () { return docs_ai_usage_event_1.DocsAiUsageEvent; } });
tslib_1.__exportStar(require("./lib/knowledge/knowledge.constants"), exports);
// Vector-store provider seam — third parties register additional stores via
// `DocumentVectorStoreRegistry.register()`
tslib_1.__exportStar(require("./lib/knowledge/vector-store/vector-store.interface"), exports);
var vector_store_registry_1 = require("./lib/knowledge/vector-store/vector-store.registry");
Object.defineProperty(exports, "DocumentVectorStoreRegistry", { enumerable: true, get: function () { return vector_store_registry_1.DocumentVectorStoreRegistry; } });
var pgvector_provider_1 = require("./lib/knowledge/vector-store/providers/pgvector.provider");
Object.defineProperty(exports, "PgVectorStoreProvider", { enumerable: true, get: function () { return pgvector_provider_1.PgVectorStoreProvider; } });
var lexical_provider_1 = require("./lib/knowledge/vector-store/providers/lexical.provider");
Object.defineProperty(exports, "LexicalStoreProvider", { enumerable: true, get: function () { return lexical_provider_1.LexicalStoreProvider; } });
// Prompt-injection hardening helpers (shared untrusted-content fencing, §18.1)
var untrusted_content_2 = require("./lib/knowledge/security/untrusted-content");
Object.defineProperty(exports, "UNTRUSTED_EXCERPT_NOTICE", { enumerable: true, get: function () { return untrusted_content_2.UNTRUSTED_EXCERPT_NOTICE; } });
Object.defineProperty(exports, "breakClosingFence", { enumerable: true, get: function () { return untrusted_content_2.breakClosingFence; } });
Object.defineProperty(exports, "fenceDocChunk", { enumerable: true, get: function () { return untrusted_content_2.fenceDocChunk; } });
Object.defineProperty(exports, "fenceDocumentContent", { enumerable: true, get: function () { return untrusted_content_2.fenceDocumentContent; } });
Object.defineProperty(exports, "neutralizeUntrustedContent", { enumerable: true, get: function () { return untrusted_content_2.neutralizeUntrustedContent; } });
Object.defineProperty(exports, "stripChatTemplateMarkers", { enumerable: true, get: function () { return untrusted_content_2.stripChatTemplateMarkers; } });
// Queue constants, job payload types, and the enqueue seam
tslib_1.__exportStar(require("./lib/knowledge/queue/constants"), exports);
tslib_1.__exportStar(require("./lib/knowledge/queue/docs-job.types"), exports);
var docs_queue_service_1 = require("./lib/knowledge/queue/docs-queue.service");
Object.defineProperty(exports, "DocsQueueService", { enumerable: true, get: function () { return docs_queue_service_1.DocsQueueService; } });
var docs_recovery_service_1 = require("./lib/knowledge/queue/docs-recovery.service");
Object.defineProperty(exports, "DocsRecoveryService", { enumerable: true, get: function () { return docs_recovery_service_1.DocsRecoveryService; } });
// The single definition of every pipeline stage + the transport-neutral job surface both the
// BullMQ worker host and the inline runner dispatch through.
var docs_pipeline_service_1 = require("./lib/knowledge/queue/docs-pipeline.service");
Object.defineProperty(exports, "DocsPipelineService", { enumerable: true, get: function () { return docs_pipeline_service_1.DocsPipelineService; } });
tslib_1.__exportStar(require("./lib/knowledge/queue/docs-pipeline.types"), exports);
tslib_1.__exportStar(require("./lib/knowledge/queue/docs-recovery.predicate"), exports);
// Pipeline error classification
tslib_1.__exportStar(require("./lib/knowledge/errors"), exports);
// Telemetry seam (07 §16): the swappable retrieval/AI-usage log. P1 ships the structured
// logger; P2 binds a table-backed implementation to the same `DOCS_RETRIEVAL_LOG` token.
tslib_1.__exportStar(require("./lib/telemetry"), exports);
// Capture channels (07 §17): the importer contract + registry that integration plugins
// implement, the provider-agnostic inbound-email adapter seam with its reference
// implementation, and the AI-chat attachment subscriber.
tslib_1.__exportStar(require("./lib/capture"), exports);
// Extraction provider registry — third parties add providers via
// `ExtractionRegistryService.register()`. Also carries the provider-vision OCR seam
// (scanned PDFs + images) and the shared PDF rasterizer.
tslib_1.__exportStar(require("./lib/knowledge/extraction"), exports);
// Thumbnail generation (07 §4.4) — images + the first page of PDFs, written through the
// FileStorage provider onto `document.thumbKey`. Cosmetic by contract: it never changes
// `status` or `knowledgeStatus`.
tslib_1.__exportStar(require("./lib/knowledge/thumbnail"), exports);
// Upload helpers (multi-file interceptor + decorator, magic-byte sniffing)
tslib_1.__exportStar(require("./lib/interceptors"), exports);
var file_sniffer_1 = require("./lib/services/file-sniffer");
Object.defineProperty(exports, "sniffFile", { enumerable: true, get: function () { return file_sniffer_1.sniffFile; } });
Object.defineProperty(exports, "isMarkupContent", { enumerable: true, get: function () { return file_sniffer_1.isMarkupContent; } });
Object.defineProperty(exports, "isProbablyUtf8Text", { enumerable: true, get: function () { return file_sniffer_1.isProbablyUtf8Text; } });
Object.defineProperty(exports, "canonicalExtension", { enumerable: true, get: function () { return file_sniffer_1.canonicalExtension; } });
//# sourceMappingURL=index.js.map