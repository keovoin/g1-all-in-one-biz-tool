import { MigrationInterface, QueryRunner } from "typeorm";
export declare class SeedIntegrationsAndIntegrationTypes1695112275840 implements MigrationInterface {
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
    * Sqlite | better-sqlite3 | Postgres Up Migration
    *
    * @param queryRunner
    */
    sqlitePostgresUpsert(queryRunner: QueryRunner): Promise<any>;
    /**
    * MySQL Up Migration
    *
    * @param queryRunner
    */
    mysqlUpsert(queryRunner: QueryRunner): Promise<any>;
}
