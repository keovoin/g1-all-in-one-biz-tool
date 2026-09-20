import { MigrationInterface, QueryRunner } from 'typeorm';
/**
 * Creates `payroll_run` and `payroll_item` — the payroll module of issue #2453.
 *
 * Pure additive DDL: two new tables, their indexes and their foreign keys. No existing table,
 * column or row is touched, and `down()` drops exactly what `up()` created.
 *
 * Money columns are `numeric(14,2)` (`decimal(14,2)` on MySQL), never a floating point type.
 * `payroll_item.quantity` gets four decimal places because an hourly line can be a fraction of an
 * hour, while every currency amount stays at two.
 *
 * `payroll_item.employeeId` is nullable with `ON DELETE SET NULL` on purpose: a paid payroll run
 * is a financial record and must survive the removal of the employee record it paid.
 */
export declare class CreatePayrollTables1790000012000 implements MigrationInterface {
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
