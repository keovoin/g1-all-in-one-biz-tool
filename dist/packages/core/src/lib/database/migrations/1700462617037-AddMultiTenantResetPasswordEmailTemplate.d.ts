import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddMultiTenantResetPasswordEmailTemplate1700462617037 implements MigrationInterface {
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
    * Sqlite | better-sqlite3 | postgres Up Migration
    *
    * @param queryRunner
    */
    sqlitePostgresResetPasswordEmailTemplate(queryRunner: QueryRunner): Promise<any>;
    /**
    * MySQL Up Migration
    *
    * @param queryRunner
    */
    mysqlResetPasswordEmailTemplate(queryRunner: QueryRunner): Promise<any>;
}
