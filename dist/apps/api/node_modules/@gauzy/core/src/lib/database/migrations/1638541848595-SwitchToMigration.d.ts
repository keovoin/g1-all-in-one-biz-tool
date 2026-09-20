import { MigrationInterface, QueryRunner } from "typeorm";
export declare class SwitchToMigration1638541848595 implements MigrationInterface {
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
    private postgresUpQueryRunner;
    /**
     * PostgresDB Down Migration
     *
     * @param queryRunner
     */
    private postgresDownQueryRunner;
    /**
     * SqliteDB Up Migration
     *
     * @param queryRunner
     */
    private sqliteUpQueryRunner;
    /**
    * SqliteDB Down Migration
    *
    * @param queryRunner
    */
    private sqliteDownQueryRunner;
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
