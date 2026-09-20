import { MigrationInterface, QueryRunner } from 'typeorm';
/**
 * Migration: create the `terms_acceptance` table.
 *
 * ## Additive by construction
 *
 * This migration creates one new table and nothing else. It does not add,
 * rename, widen, narrow or drop a column on any existing table, and it does not
 * touch `user`. Registration previously discarded the terms checkbox entirely,
 * so there is no existing column to migrate *from* and no backfill to do: rows
 * start appearing the moment the new signup path is deployed, and every account
 * created before that has, correctly, no acceptance on file.
 *
 * ## Postgres uses the package's own DDL
 *
 * The Postgres branch replays `migrationSql.up` from `terms-acceptance/typeorm`
 * verbatim rather than restating it. Keeping one source of truth for the schema
 * matters here more than usual: the row's `fingerprint` is a digest over its own
 * fields, so a column that silently truncates a value makes the record read back
 * as tampered. That DDL also installs a `BEFORE UPDATE OR DELETE` trigger which
 * raises — application-level immutability is a convention, a trigger is a rule.
 *
 * MySQL and SQLite get hand-written equivalents (no `timestamptz`, no `jsonb`,
 * no plpgsql triggers). The append-only guarantee on those drivers therefore
 * rests on the adapter alone, which is a real difference and is why production
 * runs Postgres.
 *
 * ## `down()` destroys evidence
 *
 * Dropping the table is standard for a migration and is what `down()` does here,
 * but note what it means: it deletes the proof of who agreed to what. In
 * production prefer to leave the table in place and stop writing to it.
 */
export declare class CreateTermsAcceptanceTable1785000000000 implements MigrationInterface {
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
     * Replays the DDL published by `terms-acceptance/typeorm`, including the
     * append-only trigger.
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
     * SqliteDB and BetterSqlite3DB Up Migration
     *
     * `accepted_at` is `datetime`, which TypeORM stores as a string carrying
     * milliseconds — the precision the row's fingerprint is computed over.
     *
     * @param queryRunner
     */
    sqliteUpQueryRunner(queryRunner: QueryRunner): Promise<any>;
    /**
     * SqliteDB and BetterSqlite3DB Down Migration
     *
     * @param queryRunner
     */
    sqliteDownQueryRunner(queryRunner: QueryRunner): Promise<any>;
    /**
     * MySQL Up Migration
     *
     * `datetime(3)` and not plain `datetime`: MySQL defaults to zero fractional
     * seconds, which would truncate the milliseconds the fingerprint covers and
     * make every record read back as tampered.
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
