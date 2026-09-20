"use strict";
/**
 * BullMQ queue and job-name constants for the `docs-processing` pipeline.
 *
 * Shared by the worker host (`docs-processing.worker.ts`), the recovery service, and
 * every enqueue site so producers/consumers agree on names.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOCS_JOB_THUMBNAIL = exports.DOCS_JOB_RECONCILE = exports.DOCS_JOB_INDEX = exports.DOCS_JOB_EMBED = exports.DOCS_JOB_CHUNK = exports.DOCS_JOB_CLASSIFY = exports.DOCS_JOB_EXTRACT = exports.DOCS_PROCESSING_QUEUE = void 0;
/** Name of the BullMQ queue that carries every Documents pipeline job. */
exports.DOCS_PROCESSING_QUEUE = 'docs-processing';
/** Load blob, run extraction, write `extractedText`; chains `docs.classify` (or `docs.chunk`). */
exports.DOCS_JOB_EXTRACT = 'docs.extract';
/** LLM classification: categories (additive), suggested tags, `summary`, `aiConfidence`. */
exports.DOCS_JOB_CLASSIFY = 'docs.classify';
/** Heading-aware split into ~512-token windows with 64-token overlap; chains `docs.embed`. */
exports.DOCS_JOB_CHUNK = 'docs.chunk';
/** Batch-embed all staged chunks; chains `docs.index`. */
exports.DOCS_JOB_EMBED = 'docs.embed';
/** Transactional chunk replace + `DocumentIndexState` upsert; sets `knowledgeStatus: INDEXED`. */
exports.DOCS_JOB_INDEX = 'docs.index';
/** Every-10-minutes reconcile sweep (stale rows re-enqueue + embedding-model drift check). */
exports.DOCS_JOB_RECONCILE = 'docs.reconcile';
/** P1: thumbnail generation — images + PDF first page; writes `thumbKey`. */
exports.DOCS_JOB_THUMBNAIL = 'docs.thumbnail';
//# sourceMappingURL=constants.js.map