import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class SeedIntegrationTable1691494801748 implements MigrationInterface {
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
     * Sqlite Upsert integrations and integration types
     *
     * @param queryRunner
     */
    sqliteUpsertIntegrationsAndIntegrationTypes(queryRunner: QueryRunner): Promise<any>;
    /**
     * Postgres Upsert integrations and integration types
     *
     * @param queryRunner
     */
    postgresUpsertIntegrationsAndIntegrationTypes(queryRunner: QueryRunner): Promise<any>;
    /**
     * Postgres Upsert integrations and integration types
     *
     * @param queryRunner
     */
    mysqlUpsertIntegrationsAndIntegrationTypes(queryRunner: QueryRunner): Promise<any>;
}
