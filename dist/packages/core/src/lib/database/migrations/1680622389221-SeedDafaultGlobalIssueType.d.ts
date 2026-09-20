import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class SeedDafaultGlobalIssueType1680622389221 implements MigrationInterface {
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
     * Sqlite default global issue types
     *
     * @param queryRunner
     */
    sqliteSeedDefaultIssueTypes(queryRunner: QueryRunner): Promise<void>;
    /**
     * Postgres default global issue types
     *
     * @param queryRunner
     */
    postgresSeedDefaultIssueTypes(queryRunner: QueryRunner): Promise<void>;
    /**
     * MySQL default global issue types
     *
     * @param queryRunner
     */
    mysqlSeedDefaultIssueTypes(queryRunner: QueryRunner): Promise<void>;
}
