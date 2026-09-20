import { SelectQueryBuilder } from 'typeorm';
import { DocumentChunk } from '../../entities/document-chunk.entity';
import { IVectorStoreQuery } from '../vector-store/vector-store.interface';
/**
 * The mandatory retrieval filter set (§9.2 of the AI-knowledge spec), applied identically
 * to BOTH legs (lexical and vector) in SQL — never relying on ORM defaults alone.
 * The pure predicate mirror lives in `retrieval-gate.ts` (re-exported here).
 */
export { IRetrievalGateDocument, isBlockedByReviewCircuitBreaker, isRetrievable } from './retrieval-gate';
/**
 * Applies the mandatory + optional filters to a `document_chunk` query builder (alias
 * `chunk`) joined to `document` (alias `doc`). Both retrieval legs share this builder so
 * the filter sets can never drift apart.
 *
 * @param qb A query builder rooted at `DocumentChunk` with alias `chunk`.
 * @param query The store query (tenant/org scope + optional facet filters).
 * @returns The same query builder, filtered.
 */
export declare function applyRetrievalFilters(qb: SelectQueryBuilder<DocumentChunk>, query: IVectorStoreQuery): SelectQueryBuilder<DocumentChunk>;
