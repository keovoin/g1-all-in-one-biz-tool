import { MigrationInterface, QueryRunner } from 'typeorm';
/**
 * Creates `timesheet_project_change_request` — the approval workflow that lets an employee move
 * the time they logged against one project over to another one (issue #9516).
 *
 * Pure additive DDL: one new table, its indexes and its foreign keys. No existing table, column
 * or row is touched, so the migration is safe to run against a populated database and `down()`
 * simply drops what `up()` created.
 *
 * `previousProjectId` is NOT NULL on purpose. A timesheet is a per-employee, per-period container
 * of `TimeLog` rows and the project lives on the log, so one timesheet routinely holds logs for
 * several projects. Recording the project the time is moving FROM is what allows an approval to
 * touch only the mis-booked logs instead of rewriting the whole timesheet.
 */
export declare class CreateTimesheetProjectChangeRequest1790000010000 implements MigrationInterface {
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
