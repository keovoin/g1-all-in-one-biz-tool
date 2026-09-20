import { MigrationInterface, QueryRunner } from "typeorm";
export declare class RenamedTaskStatusTable1674749291896 implements MigrationInterface {
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
    * Sqlite Up Migration
    *
    * @param queryRunner
    */
    sqliteUpQueryRunner(queryRunner: QueryRunner): Promise<any>;
    /**
    * Sqlite Down Migration
    *
    * @param queryRunner
    */
    sqliteDownQueryRunner(queryRunner: QueryRunner): Promise<any>;
    /**
    * Postgres Up Migration
    *
    * @param queryRunner
    */
    postgresUpQueryRunner(queryRunner: QueryRunner): Promise<any>;
    /**
    * postgres Down Migration
    *
    * @param queryRunner
    */
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
