import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddActivityRecordedAtCompositeIndexes1784469645043 implements MigrationInterface {
    name: string;
    /**
     * Up Migration
     *
     * (1) Backfills `activity.recordedAt` from `date` + `time` for legacy rows where it is NULL,
     *     so the report/statistic queries — which now filter on `recordedAt` — do not silently
     *     omit those rows.
     * (2) Adds composite indexes on `activity` to support the Time & Activity reports and the
     *     dashboard activity statistics, which filter by `(organizationId, employeeId, recordedAt)`
     *     (per-employee) and `(organizationId, recordedAt)` (org-wide) over a date range.
     *
     * NOTE: On existing large deployments, create the indexes out-of-band first with
     * `CREATE INDEX CONCURRENTLY` (the Postgres/SQLite branches use `IF NOT EXISTS`, so this
     * migration is then a no-op for them) and run the backfill out-of-band too, so this migration's
     * in-transaction backfill + index build stays fast and does not hold a write lock.
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
     * Postgres and SQLite share identical index DDL (both accept double-quoted identifiers and
     * `IF NOT EXISTS`), so the creation/removal is factored out to avoid duplicated SQL.
     */
    private createStandardIndexes;
    private dropStandardIndexes;
    /**
     * PostgreSQL Up Migration
     *
     * @param queryRunner
     */
    postgresUpQueryRunner(queryRunner: QueryRunner): Promise<any>;
    /**
     * PostgreSQL Down Migration
     *
     * @param queryRunner
     */
    postgresDownQueryRunner(queryRunner: QueryRunner): Promise<any>;
    /**
     * SQLite Up Migration
     *
     * @param queryRunner
     */
    sqliteUpQueryRunner(queryRunner: QueryRunner): Promise<any>;
    /**
     * SQLite Down Migration
     *
     * @param queryRunner
     */
    sqliteDownQueryRunner(queryRunner: QueryRunner): Promise<any>;
    /**
     * MySQL Up Migration
     *
     * MySQL has no `CREATE INDEX ... IF NOT EXISTS`, so these run as plain statements. MySQL is not
     * part of the out-of-band `CREATE INDEX CONCURRENTLY` pre-creation path, so a fresh migration
     * run does not encounter pre-existing indexes.
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
