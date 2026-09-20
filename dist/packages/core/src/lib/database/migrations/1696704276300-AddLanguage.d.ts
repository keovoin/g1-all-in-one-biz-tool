import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddLanguage1696704276300 implements MigrationInterface {
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
     * Sqlite | better-sqlite3 | Postgres Up Migration
     *
     * @param queryRunner
     */
    sqlitePostgresUpAddLanguage(queryRunner: QueryRunner): Promise<any>;
    /**
     * MySQL Up Migration
     *
     * @param queryRunner
     */
    mysqlUpAddLanguage(queryRunner: QueryRunner): Promise<any>;
}
