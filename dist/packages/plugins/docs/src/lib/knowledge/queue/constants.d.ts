/**
 * BullMQ queue and job-name constants for the `docs-processing` pipeline.
 *
 * Shared by the worker host (`docs-processing.worker.ts`), the recovery service, and
 * every enqueue site so producers/consumers agree on names.
 */
/** Name of the BullMQ queue that carries every Documents pipeline job. */
export declare const DOCS_PROCESSING_QUEUE = "docs-processing";
/** Load blob, run extraction, write `extractedText`; chains `docs.classify` (or `docs.chunk`). */
export declare const DOCS_JOB_EXTRACT = "docs.extract";
/** LLM classification: categories (additive), suggested tags, `summary`, `aiConfidence`. */
export declare const DOCS_JOB_CLASSIFY = "docs.classify";
/** Heading-aware split into ~512-token windows with 64-token overlap; chains `docs.embed`. */
export declare const DOCS_JOB_CHUNK = "docs.chunk";
/** Batch-embed all staged chunks; chains `docs.index`. */
export declare const DOCS_JOB_EMBED = "docs.embed";
/** Transactional chunk replace + `DocumentIndexState` upsert; sets `knowledgeStatus: INDEXED`. */
export declare const DOCS_JOB_INDEX = "docs.index";
/** Every-10-minutes reconcile sweep (stale rows re-enqueue + embedding-model drift check). */
export declare const DOCS_JOB_RECONCILE = "docs.reconcile";
/** P1: thumbnail generation — images + PDF first page; writes `thumbKey`. */
export declare const DOCS_JOB_THUMBNAIL = "docs.thumbnail";
