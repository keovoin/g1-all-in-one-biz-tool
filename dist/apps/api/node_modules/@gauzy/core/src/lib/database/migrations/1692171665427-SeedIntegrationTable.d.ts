import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class SeedIntegrationTable1692171665427 implements MigrationInterface {
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
     * Sqlite integrations and integration types
     *
     * @param queryRunner
     */
    sqliteUpsertIntegrationsAndIntegrationTypes(queryRunner: QueryRunner): Promise<any>;
    /**
     * Postgres integrations and integration types
     *
     * @param queryRunner
     */
    postgresUpsertIntegrationsAndIntegrationTypes(queryRunner: QueryRunner): Promise<any>;
    /**
     * MySQL integrations and integration types
     *
     * @param queryRunner
     */
    mysqlUpsertIntegrationsAndIntegrationTypes(queryRunner: QueryRunner): Promise<any>;
}
