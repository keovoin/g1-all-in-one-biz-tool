"use strict";
var PgVectorStoreProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgVectorStoreProvider = void 0;
exports.parseMetadata = parseMetadata;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const type_orm_document_chunk_repository_1 = require("../../../repositories/type-orm-document-chunk.repository");
const retrieval_filters_1 = require("../../retrieval/retrieval-filters");
const knowledge_constants_1 = require("../../knowledge.constants");
/**
 * The built-in pgvector store: cosine similarity over the `document_chunk.embedding`
 * `vector(1536)` column (ivfflat index, `vector_cosine_ops`), written and queried with
 * raw SQL — the entity declares the column `simple-json` so the ORM stays ignorant of the
 * vector type (§8.3).
 *
 * Availability = PostgreSQL dialect + the `vector` extension present (probed once and
 * cached; consumed by resolution and by `GET /knowledge/status`).
 */
let PgVectorStoreProvider = PgVectorStoreProvider_1 = class PgVectorStoreProvider {
    constructor(typeOrmDocumentChunkRepository) {
        this.typeOrmDocumentChunkRepository = typeOrmDocumentChunkRepository;
        this.id = knowledge_constants_1.VECTOR_STORE_PGVECTOR;
        this.logger = new common_1.Logger(PgVectorStoreProvider_1.name);
        this.availability = null;
    }
    /**
     * @inheritdoc
     */
    async isAvailable() {
        if (this.availability !== null) {
            return this.availability;
        }
        if (!(0, config_1.isPostgres)()) {
            this.availability = false;
            return false;
        }
        try {
            const rows = await this.typeOrmDocumentChunkRepository.manager.query(`SELECT 1 FROM pg_extension WHERE extname = 'vector'`);
            this.availability = Array.isArray(rows) && rows.length > 0;
        }
        catch (error) {
            this.logger.warn(`pgvector capability probe failed: ${error.message}`);
            this.availability = false;
        }
        if (!this.availability) {
            this.logger.log('pgvector extension not present — the platform runs lexical-only.');
        }
        return this.availability;
    }
    /** Test/ops seam: clears the cached capability probe. */
    resetAvailabilityProbe() {
        this.availability = null;
    }
    /**
     * Writes chunk embeddings with raw SQL (`UPDATE … SET embedding = $vec::vector`),
     * tenant/org-scoped, idempotent per chunk. Chunks without an embedding are skipped.
     */
    async upsertChunks(scope, documentId, chunks) {
        const embedded = chunks.filter((chunk) => Array.isArray(chunk.embedding) && chunk.embedding.length > 0);
        if (!embedded.length) {
            return;
        }
        const manager = this.typeOrmDocumentChunkRepository.manager;
        for (const chunk of embedded) {
            await manager.query(`UPDATE "document_chunk" SET "embedding" = $1::vector ` +
                `WHERE "id" = $2 AND "tenantId" = $3 AND "organizationId" = $4 AND "documentId" = $5`, [toVectorLiteral(chunk.embedding), chunk.chunkId, scope.tenantId, scope.organizationId, documentId]);
        }
    }
    /**
     * Clears one document's vectors (the chunk rows themselves are owned by the index
     * service's transactional replace).
     */
    async deleteByDocument(scope, documentId) {
        await this.typeOrmDocumentChunkRepository.manager.query(`UPDATE "document_chunk" SET "embedding" = NULL ` +
            `WHERE "tenantId" = $1 AND "organizationId" = $2 AND "documentId" = $3`, [scope.tenantId, scope.organizationId, documentId]);
    }
    /**
     * Cosine-distance query (`embedding <=> :vec`) under the full mandatory filter set;
     * similarity = `1 - distance`, clamped into [0, 1].
     */
    async query(query) {
        if (!query.embedding?.length || !(await this.isAvailable())) {
            return [];
        }
        const qb = this.typeOrmDocumentChunkRepository.createQueryBuilder('chunk');
        (0, retrieval_filters_1.applyRetrievalFilters)(qb, query);
        qb.andWhere((0, core_1.prepareSQLQuery)(`"chunk"."embedding" IS NOT NULL`));
        qb.select('chunk.id', 'chunkId')
            .addSelect('chunk.documentId', 'documentId')
            .addSelect('chunk.chunkIndex', 'chunkIndex')
            .addSelect('chunk.content', 'content')
            .addSelect('chunk.metadata', 'metadata')
            .addSelect(`"chunk"."embedding" <=> :queryEmbedding`, 'distance');
        qb.setParameter('queryEmbedding', toVectorLiteral(query.embedding));
        qb.orderBy(`"chunk"."embedding" <=> :queryEmbedding`, 'ASC');
        qb.limit(query.topK);
        const rows = await qb.getRawMany();
        return rows.map((row) => ({
            chunkId: row.chunkId,
            documentId: row.documentId,
            chunkIndex: Number(row.chunkIndex),
            content: row.content,
            metadata: parseMetadata(row.metadata),
            score: Math.min(1, Math.max(0, 1 - Number(row.distance)))
        }));
    }
};
exports.PgVectorStoreProvider = PgVectorStoreProvider;
exports.PgVectorStoreProvider = PgVectorStoreProvider = PgVectorStoreProvider_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_document_chunk_repository_1.TypeOrmDocumentChunkRepository])
], PgVectorStoreProvider);
/**
 * Serializes a number array into the pgvector text literal (`[0.1,0.2,…]`).
 */
function toVectorLiteral(embedding) {
    return `[${embedding.join(',')}]`;
}
/**
 * Parses the chunk metadata column, which arrives as a JSON string on some drivers.
 */
function parseMetadata(value) {
    if (typeof value !== 'string') {
        return value ?? undefined;
    }
    try {
        return JSON.parse(value);
    }
    catch {
        return undefined;
    }
}
//# sourceMappingURL=pgvector.provider.js.map