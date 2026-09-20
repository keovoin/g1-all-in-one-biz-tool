import { MigrationInterface, QueryRunner } from 'typeorm';
/**
 * Leave management backend for issue #314:
 *
 *  - `official_holiday` — the "OfficialHolidays" table the issue asks for, so the "Add Holidays"
 *    dialog can offer a predefined list per country and pre-fill the From/To dates.
 *  - `time_off_balance` — accrued / taken / carried-forward days per employee, per policy, per
 *    year. `(tenantId, organizationId, employeeId, policyId, year)` is UNIQUE: without it two
 *    concurrent allocations would each insert a row, and days deducted from one balance would
 *    still look available on the other.
 *  - Seven additive, NULLABLE columns on `time_off_policy` carrying the entitlement and accrual
 *    configuration the balances are computed from.
 *
 * Additive only. Two new tables plus nullable columns — nothing is dropped, renamed or retyped
 * and no row is written, so this is safe to run against a populated database.
 *
 * SQLite has no `ALTER TABLE ... ADD COLUMN` limitation that matters here (all seven columns are
 * nullable or carry a constant default), so the policy columns are added in place rather than by
 * rebuilding the table — a rebuild would have to copy every existing policy row for no reason.
 */
export declare class CreateTimeOffLeaveManagement1790000011000 implements MigrationInterface {
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
