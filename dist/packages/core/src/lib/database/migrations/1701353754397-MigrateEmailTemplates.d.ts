import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class MigrateEmailTemplates1701353754397 implements MigrationInterface {
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
    sqlitePostgresMigrateEmailTemplates(queryRunner: QueryRunner): Promise<any>;
    /**
     * MySQL Up Migration
     *
     * @param queryRunner
     */
    mysqlMigrateEmailTemplates(queryRunner: QueryRunner): Promise<any>;
}
