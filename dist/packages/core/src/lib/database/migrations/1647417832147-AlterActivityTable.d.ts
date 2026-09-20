import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AlterActivityTable1647417832147 implements MigrationInterface {
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
    sqliteUpQueryRunner(queryRunner: QueryRunner): Promise<any>;
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
