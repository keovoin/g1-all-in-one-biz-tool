"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOCS_RETRIEVAL_LOG = void 0;
/**
 * Telemetry groundwork for `07-ai-knowledge.md` §16.
 *
 * P1 ships the **seam plus a structured-logger implementation** — no tables, no migrations.
 * P2 replaces the provider bound to `DOCS_RETRIEVAL_LOG` with the `document_retrieval_log` /
 * `document_citation` table-backed writer; nothing at the call sites changes because the
 * call sites only ever see this interface.
 *
 * Two invariants hold for every implementation:
 *
 * 1. **Never slow or fail a search** — every method is fire-and-forget and returns `void`;
 *    an implementation that throws is a bug, and the call sites additionally guard.
 * 2. **Never record content** — no query text, no document names, no chunk text. Tenant and
 *    organization identifiers are one-way hashed; only the query *length* is recorded.
 */
/** DI token the retrieval + AI call sites resolve the log through (swappable in P2). */
exports.DOCS_RETRIEVAL_LOG = 'DOCS_RETRIEVAL_LOG';
//# sourceMappingURL=retrieval-log.types.js.map