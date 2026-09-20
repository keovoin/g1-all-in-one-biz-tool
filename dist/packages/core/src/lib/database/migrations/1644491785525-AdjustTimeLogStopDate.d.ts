import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AdjustTimeLogStopDate1644491785525 implements MigrationInterface {
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
    sqliteUpQueryRunner(queryRunner: QueryRunner): Promise<any>;
    sqliteDownQueryRunner(queryRunner: QueryRunner): Promise<any>;
    postgresUpQueryRunner(queryRunner: QueryRunner): Promise<any>;
    postgresDownQueryRunner(queryRunner: QueryRunner): Promise<any>;
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
