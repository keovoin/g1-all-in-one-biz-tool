import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AlterTimeLogTable1673005639130 implements MigrationInterface {
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
