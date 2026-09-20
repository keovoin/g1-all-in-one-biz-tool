"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOCS_KNOWLEDGE_SEARCH_SERVICE = void 0;
/**
 * Minimal local contract for the Documents knowledge retrieval service
 * (spec `07-ai-knowledge.md` §9 — file `knowledge/retrieval/retrieval.service.ts`,
 * class `DocumentKnowledgeSearchService`), typed against the §9.5 response contract.
 *
 * The chat tools depend on the retrieval service ONLY through this interface plus the
 * {@link DOCS_KNOWLEDGE_SEARCH_SERVICE} optional injection token, so this folder never
 * imports the implementation and degrades gracefully in a process that does not provide it.
 *
 * `DocumentKnowledgeSearchService` has landed and IS bound — `docs.module.ts` provides
 * `{ provide: DOCS_KNOWLEDGE_SEARCH_SERVICE, useExisting: DocumentKnowledgeSearchService }`.
 * Keep that binding in place: because the injection is `@Optional()`, dropping it does not
 * fail at boot — the chat tools would silently answer with no results instead.
 */
/** Optional-injection token under which the retrieval service is bound. */
exports.DOCS_KNOWLEDGE_SEARCH_SERVICE = 'DOCS_KNOWLEDGE_SEARCH_SERVICE';
//# sourceMappingURL=docs-knowledge-search.types.js.map