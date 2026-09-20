import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class UpdateEmailTemplates1680539459969 implements MigrationInterface {
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
    sqlitePostgresUpdateEmailTemplates(queryRunner: QueryRunner): Promise<any>;
    /**
     * MySQL Up Migration
     *
     * @param queryRunner
     */
    mysqlUpdateEmailTemplates(queryRunner: QueryRunner): Promise<any>;
}
