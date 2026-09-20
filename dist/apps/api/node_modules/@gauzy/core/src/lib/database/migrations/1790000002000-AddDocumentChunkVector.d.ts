import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddDocumentChunkVector1790000002000 implements MigrationInterface {
    name: string;
    /**
     * Up Migration
     *
     * PostgreSQL only: converts "document_chunk"."embedding" from text to vector(1536)
     * (pgvector) and adds the ivfflat similarity index, plus the GIN full-text index on
     * "content" used by the lexical retrieval fallback. The pgvector part is guarded —
     * when the extension is unavailable (no superuser, managed instance without pgvector)
     * it logs a warning and leaves the column as text so boot is never blocked; the GIN
     * full-text index does not depend on the extension and is created either way.
     * MySQL and SQLite are explicit no-ops (the "embedding" column stays text).
     *
     * @param queryRunner
     */
    up(queryRunner: QueryRunner): Promise<void>;
    /**
     * Down Migration
     *
     * @param queryRunner
     */
    down(queryRunner: QueryRunner): Promise<void>;
    /**
    * PostgresDB Up Migration
    *
    * @param queryRunner
    */
    postgresUpQueryRunner(queryRunner: QueryRunner): Promise<any>;
    /**
    * PostgresDB Down Migration
    *
    * Drops both indexes and converts the column back to text. Never drops the extension.
    *
    * @param queryRunner
    */
    postgresDownQueryRunner(queryRunner: QueryRunner): Promise<any>;
}
