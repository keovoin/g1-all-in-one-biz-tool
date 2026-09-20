import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class EmailTemplateReader1678876700413 implements MigrationInterface {
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
     * Sqlite | better-sqlite3 | MySQL Up Migration
     *
     * @param queryRunner
     */
    sqlitePostgresMigrateEmailTemplate(queryRunner: QueryRunner): Promise<any>;
    /**
     * MySQL Up Migration
     *
     * @param queryRunner
     */
    mysqlMigrateEmailTemplate(queryRunner: QueryRunner): Promise<any>;
}
