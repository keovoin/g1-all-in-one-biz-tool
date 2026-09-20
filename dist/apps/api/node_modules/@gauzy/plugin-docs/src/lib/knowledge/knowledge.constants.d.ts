/**
 * Constants of the AI-knowledge subsystem (classification, indexing, retrieval).
 */
/**
 * Classification confidence below this threshold flips the document to
 * `reviewStatus: PENDING` with `reviewReason: 'low-confidence'` — which also excludes it
 * from retrieval until a human approves it (the review circuit breaker).
 */
export declare const DOCS_LOW_CONFIDENCE_THRESHOLD = 0.5;
/**
 * Sentinel recorded on `document_index_state.embeddingModel` for documents indexed on the
 * lexical-only path (no embedding provider / no pgvector / AI disabled).
 *
 * The column is NOT NULL by migration, so `null` (the spec's wire value) cannot be stored —
 * this sentinel carries the same semantics: it never equals a real configured model id, so
 * the model-drift sweep picks these documents up for embedding as soon as a provider
 * becomes available.
 */
export declare const LEXICAL_ONLY_EMBEDDING_MODEL = "lexical-only";
/** Dimensionality recorded together with {@link LEXICAL_ONLY_EMBEDDING_MODEL}. */
export declare const LEXICAL_ONLY_EMBEDDING_DIMS = 0;
/** Vector-store provider ids shipped with the plugin. */
export declare const VECTOR_STORE_PGVECTOR = "pgvector";
export declare const VECTOR_STORE_LEXICAL = "lexical";
/** Classification LLM call limits. */
export declare const DOCS_CLASSIFY_MAX_OUTPUT_TOKENS = 600;
/** `docs_read`-style extracted-text paging (used by the knowledge read surface). */
export declare const DOCS_READ_PAGE_CHARS = 5000;
export declare const DOCS_READ_PAGE_HARD_CAP_CHARS = 8000;
/** Maximum `documentIds` restriction accepted by the knowledge search endpoint. */
export declare const DOCS_SEARCH_MAX_DOCUMENT_IDS = 20;
/** Matched-fraction low-confidence floor for the lexical-only degraded mode. */
export declare const DOCS_LEXICAL_CONFIDENCE_FLOOR = 0.34;
