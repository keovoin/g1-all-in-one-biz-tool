import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class SeedDefaultGlobalTaskStatus1674044473393 implements MigrationInterface {
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
     * Sqlite Seed Default task status
     *
     * @param queryRunner
     */
    sqliteSeedDefaultTaskStatus(queryRunner: QueryRunner): Promise<any>;
    /**
     * Postgres Seed default task status
     *
     * @param queryRunner
     */
    postgresSeedDefaultTaskStatus(queryRunner: QueryRunner): Promise<any>;
    /**
     * MySQL Seed default task status
     *
     * @param queryRunner
     */
    mysqlSeedDefaultTaskStatus(queryRunner: QueryRunner): Promise<any>;
}
