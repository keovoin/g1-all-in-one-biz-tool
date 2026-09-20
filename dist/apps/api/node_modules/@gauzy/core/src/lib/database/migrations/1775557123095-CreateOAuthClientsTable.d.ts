import { MigrationInterface, QueryRunner } from 'typeorm';
/**
 * Migration: create the `oauth_clients` table.
 *
 * What changed from the single-app version:
 * Previously there was no DB table — the one OAuth client was stored as
 * `GAUZY_OAUTH_APP_*` env vars. This migration introduces a real registry
 * so multiple third-party apps (Activepieces, n8n, Make.com, …) can each
 * have isolated credentials, redirect URIs, and scopes.
 *
 * The `oauth_clients` table inherits the standard audit columns from
 * `TenantBaseEntity` / `BaseEntity` (id, createdAt, updatedAt, deletedAt,
 * isActive, isArchived, archivedAt, createdByUserId, updatedByUserId,
 * deletedByUserId, tenantId — nullable so a client can be either tenant-
 * scoped or global / cross-tenant), plus the OAuth-specific columns
 * defined on the `OAuthClient` entity.
 *
 * Index/FK hash names below come from the TypeORM generator output for
 * postgres and are reused verbatim across mysql / sqlite so future
 * generator runs stay idempotent.
 */
export declare class CreateOAuthClientsTable1775557123095 implements MigrationInterface {
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
    * SqliteDB and BetterSQlite3DB Up Migration
    *
    * @param queryRunner
    */
    sqliteUpQueryRunner(queryRunner: QueryRunner): Promise<any>;
    /**
    * SqliteDB and BetterSQlite3DB Down Migration
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
