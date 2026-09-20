import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class SeedDocumentsFeature1790000004000 implements MigrationInterface {
    name: string;
    /**
     * The `FEATURE_DOCUMENTS` catalog row, mirroring its `DEFAULT_FEATURES` entry
     * (packages/core/src/lib/feature/default-features.ts). Fresh installs get the row
     * from the normal `feature.seed.ts` path; this migration inserts it (guarded, so it
     * is idempotent) for already-seeded deployments.
     */
    private readonly feature;
    /**
     * Up Migration
     *
     * Seeds the `FEATURE_DOCUMENTS` catalog row AND the per-tenant `feature_organization`
     * toggle rows that actually switch the feature on. There is no lazy-creation path for
     * those toggle rows: `Store.hasFeatureEnabled()` resolves a feature from the rows the
     * API returns (`tenant.featureOrganizations` / `organization.featureOrganizations`), so
     * a missing row reads as "disabled" and both the Documents nav item and its route stay
     * hidden on every already-seeded deployment.
     *
     * Rows are created tenant-scoped (`organizationId` NULL), exactly like `feature.seed.ts`
     * does for a fresh install — organization-scoped rows only ever exist once someone
     * toggles the feature for a specific organization.
     *
     * @param queryRunner
     */
    up(queryRunner: QueryRunner): Promise<void>;
    /**
     * Down Migration
     *
     * Removes the seeded `FEATURE_DOCUMENTS` row (and its per-org toggle rows).
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
     * SqliteDB and BetterSQlite3DB Up Migration
     *
     * @param queryRunner
     */
    sqliteUpQueryRunner(queryRunner: QueryRunner): Promise<any>;
    /**
     * MySQL Up Migration
     *
     * @param queryRunner
     */
    mysqlUpQueryRunner(queryRunner: QueryRunner): Promise<any>;
}
