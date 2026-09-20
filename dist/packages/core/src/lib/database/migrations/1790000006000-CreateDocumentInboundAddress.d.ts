import { MigrationInterface, QueryRunner } from 'typeorm';
/**
 * Creates `document_inbound_address` — the per-organization inbound email capture address.
 *
 * Replaces the previous `tenant_setting`-encoded capture token, which had no `organizationId`
 * column (the id was parsed out of the setting *name*), no index, and no uniqueness guarantee.
 *
 * 🛑 `IDX_document_inbound_address_address` is UNIQUE deliberately. An inbound message is routed
 * solely by its recipient address; two rows sharing one address would make the destination tenant
 * depend on row order, i.e. a cross-tenant delivery. This is a security control, not a hint.
 *
 * Pure DDL — no `INSERT ... SELECT`, no bind parameters, nothing to mis-infer. (The Documents seed
 * migration once reused a single bind parameter across two clauses and PostgreSQL could not infer
 * its type, which took stage down; this migration deliberately has no parameters at all.)
 */
export declare class CreateDocumentInboundAddress1790000006000 implements MigrationInterface {
    name: string;
    /**
     * Up Migration
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
     * @param queryRunner
     */
    postgresDownQueryRunner(queryRunner: QueryRunner): Promise<any>;
    /**
     * SqliteDB Up Migration
     *
     * @param queryRunner
     */
    sqliteUpQueryRunner(queryRunner: QueryRunner): Promise<any>;
    /**
     * SqliteDB Down Migration
     *
     * @param queryRunner
     */
    sqliteDownQueryRunner(queryRunner: QueryRunner): Promise<any>;
    /**
     * MySQL Up Migration
     *
     * @param queryRunner
     */
    mysqlUpQueryRunner(queryRunner: QueryRunner): Promise<any>;
    /**
     * MySQL Down Migration
     *
     * @param queryRunner
     */
    mysqlDownQueryRunner(queryRunner: QueryRunner): Promise<any>;
}
