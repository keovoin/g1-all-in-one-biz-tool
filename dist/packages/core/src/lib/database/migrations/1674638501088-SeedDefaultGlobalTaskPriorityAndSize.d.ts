import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class SeedDefaultGlobalTaskPriorityAndSize1674638501088 implements MigrationInterface {
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
     * Sqlite default task priorities
     *
     * @param queryRunner
     */
    sqliteSeedDefaultTaskPriorities(queryRunner: QueryRunner): Promise<void>;
    /**
     * Sqlite default task sizes
     *
     * @param queryRunner
     */
    sqliteSeedDefaultTaskSizes(queryRunner: QueryRunner): Promise<void>;
    /**
     * Postgres default task priorities
     *
     * @param queryRunner
     */
    postgresSeedDefaultTaskPriorities(queryRunner: QueryRunner): Promise<void>;
    /**
     * Postgres default task sizes
     *
     * @param queryRunner
     */
    postgresSeedDefaultTaskSizes(queryRunner: QueryRunner): Promise<void>;
    /**
     * MySQL default task priorities
     *
     * @param queryRunner
     */
    mysqlSeedDefaultTastPriorities(queryRunner: QueryRunner): Promise<any>;
    /**
     * MySQL default task sizes
     *
     * @param queryRunner
     */
    mysqlSeedDefaultTaskSizes(queryRunner: QueryRunner): Promise<any>;
}
