"use strict";
/**
 * Constants of the AI-knowledge subsystem (classification, indexing, retrieval).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOCS_LEXICAL_CONFIDENCE_FLOOR = exports.DOCS_SEARCH_MAX_DOCUMENT_IDS = exports.DOCS_READ_PAGE_HARD_CAP_CHARS = exports.DOCS_READ_PAGE_CHARS = exports.DOCS_CLASSIFY_MAX_OUTPUT_TOKENS = exports.VECTOR_STORE_LEXICAL = exports.VECTOR_STORE_PGVECTOR = exports.LEXICAL_ONLY_EMBEDDING_DIMS = exports.LEXICAL_ONLY_EMBEDDING_MODEL = exports.DOCS_LOW_CONFIDENCE_THRESHOLD = void 0;
/**
 * Classification confidence below this threshold flips the document to
 * `reviewStatus: PENDING` with `reviewReason: 'low-confidence'` — which also excludes it
 * from retrieval until a human approves it (the review circuit breaker).
 */
exports.DOCS_LOW_CONFIDENCE_THRESHOLD = 0.5;
/**
 * Sentinel recorded on `document_index_state.embeddingModel` for documents indexed on the
 * lexical-only path (no embedding provider / no pgvector / AI disabled).
 *
 * The column is NOT NULL by migration, so `null` (the spec's wire value) cannot be stored —
 * this sentinel carries the same semantics: it never equals a real configured model id, so
 * the model-drift sweep picks these documents up for embedding as soon as a provider
 * becomes available.
 */
exports.LEXICAL_ONLY_EMBEDDING_MODEL = 'lexical-only';
/** Dimensionality recorded together with {@link LEXICAL_ONLY_EMBEDDING_MODEL}. */
exports.LEXICAL_ONLY_EMBEDDING_DIMS = 0;
/** Vector-store provider ids shipped with the plugin. */
exports.VECTOR_STORE_PGVECTOR = 'pgvector';
exports.VECTOR_STORE_LEXICAL = 'lexical';
/** Classification LLM call limits. */
exports.DOCS_CLASSIFY_MAX_OUTPUT_TOKENS = 600;
/** `docs_read`-style extracted-text paging (used by the knowledge read surface). */
exports.DOCS_READ_PAGE_CHARS = 5000;
exports.DOCS_READ_PAGE_HARD_CAP_CHARS = 8000;
/** Maximum `documentIds` restriction accepted by the knowledge search endpoint. */
exports.DOCS_SEARCH_MAX_DOCUMENT_IDS = 20;
/** Matched-fraction low-confidence floor for the lexical-only degraded mode. */
exports.DOCS_LEXICAL_CONFIDENCE_FLOOR = 0.34;
//# sourceMappingURL=knowledge.constants.js.map