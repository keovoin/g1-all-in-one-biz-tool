"use strict";
var LexicalStoreProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LexicalStoreProvider = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const type_orm_document_chunk_repository_1 = require("../../../repositories/type-orm-document-chunk.repository");
const knowledge_constants_1 = require("../../knowledge.constants");
const retrieval_filters_1 = require("../../retrieval/retrieval-filters");
const pgvector_provider_1 = require("./pgvector.provider");
/** Maximum query terms considered on the ILIKE/LIKE fallback path. */
const MAX_QUERY_TERMS = 12;
/**
 * The always-available lexical store (the retrieval degradation floor, §9.3/§10).
 *
 * - PostgreSQL: `websearch_to_tsquery('simple', :q)` against the GIN expression index
 *   (`to_tsvector('simple', content)`), ranked by `ts_rank_cd`. When the parsed tsquery is
 *   empty (stop-words-only or a < 3-char query), fall back to an ILIKE OR-list over up to
 *   12 query terms, ranked by matched-term count.
 * - MySQL / SQLite: the LIKE variant only.
 *
 * `upsertChunks`/`deleteByDocument` are no-ops — the `document_chunk` rows ARE this store.
 */
let LexicalStoreProvider = LexicalStoreProvider_1 = class LexicalStoreProvider {
    constructor(typeOrmDocumentChunkRepository) {
        this.typeOrmDocumentChunkRepository = typeOrmDocumentChunkRepository;
        this.id = knowledge_constants_1.VECTOR_STORE_LEXICAL;
        this.logger = new common_1.Logger(LexicalStoreProvider_1.name);
    }
    /**
     * @inheritdoc — the lexical store is the floor of the ladder: always available.
     */
    async isAvailable() {
        return true;
    }
    /** No-op: chunk rows are written by the index service. */
    async upsertChunks(_scope, _documentId, _chunks) {
        // The database rows are the store.
    }
    /** No-op: chunk rows are removed by the index service. */
    async deleteByDocument(_scope, _documentId) {
        // The database rows are the store.
    }
    /**
     * @inheritdoc
     */
    async query(query) {
        const text = (query.text ?? '').trim();
        if (!text) {
            return [];
        }
        if ((0, config_1.isPostgres)() && text.length >= 3) {
            try {
                if (await this.tsQueryParses(text)) {
                    return await this.fullTextQuery(query, text);
                }
            }
            catch (error) {
                this.logger.debug(`tsquery leg failed — falling back to ILIKE: ${error.message}`);
            }
        }
        return this.likeQuery(query, text);
    }
    /**
     * True when `websearch_to_tsquery('simple', text)` parses to a non-empty query.
     */
    async tsQueryParses(text) {
        const rows = await this.typeOrmDocumentChunkRepository.manager.query(`SELECT websearch_to_tsquery('simple', $1)::text AS q`, [text]);
        return Boolean(rows?.[0]?.q && String(rows[0].q).trim().length);
    }
    /**
     * PostgreSQL full-text leg: GIN-indexed tsvector match ranked by `ts_rank_cd`
     * (clamped into [0, 1]).
     */
    async fullTextQuery(query, text) {
        const qb = this.typeOrmDocumentChunkRepository.createQueryBuilder('chunk');
        (0, retrieval_filters_1.applyRetrievalFilters)(qb, query);
        qb.andWhere(`to_tsvector('simple', "chunk"."content") @@ websearch_to_tsquery('simple', :ftsQuery)`, {
            ftsQuery: text
        });
        qb.select('chunk.id', 'chunkId')
            .addSelect('chunk.documentId', 'documentId')
            .addSelect('chunk.chunkIndex', 'chunkIndex')
            .addSelect('chunk.content', 'content')
            .addSelect('chunk.metadata', 'metadata')
            .addSelect(`ts_rank_cd(to_tsvector('simple', "chunk"."content"), websearch_to_tsquery('simple', :ftsQuery))`, 'rank');
        qb.orderBy('rank', 'DESC');
        qb.limit(query.topK);
        const rows = await qb.getRawMany();
        return rows.map((row) => this.toHit(row, Math.min(1, Math.max(0, Number(row.rank)))));
    }
    /**
     * The ILIKE/LIKE floor: an OR-list over up to 12 terms, ranked by matched-term
     * fraction (score = matched / total ∈ [0, 1]).
     */
    async likeQuery(query, text) {
        const terms = [...new Set(text.toLowerCase().split(/\s+/).filter(Boolean))].slice(0, MAX_QUERY_TERMS);
        if (!terms.length) {
            return [];
        }
        const qb = this.typeOrmDocumentChunkRepository.createQueryBuilder('chunk');
        (0, retrieval_filters_1.applyRetrievalFilters)(qb, query);
        const likeClauses = [];
        const caseClauses = [];
        terms.forEach((term, index) => {
            const param = `likeTerm${index}`;
            likeClauses.push((0, core_1.prepareSQLQuery)(`LOWER("chunk"."content") LIKE :${param}`));
            caseClauses.push((0, core_1.prepareSQLQuery)(`(CASE WHEN LOWER("chunk"."content") LIKE :${param} THEN 1 ELSE 0 END)`));
            qb.setParameter(param, `%${term}%`);
        });
        qb.andWhere(`(${likeClauses.join(' OR ')})`);
        qb.select('chunk.id', 'chunkId')
            .addSelect('chunk.documentId', 'documentId')
            .addSelect('chunk.chunkIndex', 'chunkIndex')
            .addSelect('chunk.content', 'content')
            .addSelect('chunk.metadata', 'metadata')
            .addSelect(caseClauses.join(' + '), 'matched');
        qb.orderBy('matched', 'DESC');
        qb.limit(query.topK);
        const rows = await qb.getRawMany();
        return rows.map((row) => this.toHit(row, Math.min(1, Math.max(0, Number(row.matched) / terms.length))));
    }
    toHit(row, score) {
        return {
            chunkId: row.chunkId,
            documentId: row.documentId,
            chunkIndex: Number(row.chunkIndex),
            content: row.content,
            metadata: (0, pgvector_provider_1.parseMetadata)(row.metadata),
            score
        };
    }
};
exports.LexicalStoreProvider = LexicalStoreProvider;
exports.LexicalStoreProvider = LexicalStoreProvider = LexicalStoreProvider_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_document_chunk_repository_1.TypeOrmDocumentChunkRepository])
], LexicalStoreProvider);
//# sourceMappingURL=lexical.provider.js.map