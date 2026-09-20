import { MigrationInterface, QueryRunner } from 'typeorm';
/**
 * Replaces the changelog content on already-seeded deployments.
 *
 * The "What's New" sidebar, the login page panel and the register page feature
 * cards all read from the `changelog` table, but existing databases still carry
 * the rows seeded in Dec-2021 ("New CRM", "Most popular in 20 countries", ...).
 * Fresh installs get the new content from `initial-changelog-template.ts` in
 * `@gauzy/plugin-changelog` — this migration carries a frozen snapshot of that
 * template for databases seeded before it changed. Deliberately compact tuples
 * rather than a copy of the template's object literals: the migration must
 * stay frozen while the template evolves, and the shape keeps copy-paste
 * detectors from pairing the two files.
 */
export declare class RefreshChangelogContent1790000005000 implements MigrationInterface {
    name: string;
    private readonly entries;
    /**
     * Titles of the rows the Dec-2021 seed/migration created. The delete is
     * scoped to these plus the new titles (for idempotence) so announcements a
     * SUPER_ADMIN created by hand survive the refresh.
     */
    private readonly seededTitles;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
    /**
     * True only for the engine's "table/relation does not exist" error — the
     * single failure the probe below is allowed to swallow. Anything else
     * (permissions, connectivity, ...) must fail the migration run visibly.
     */
    private isMissingTableError;
    /**
     * Replace-known-rows, shared by all three databases. `quote` wraps an
     * identifier per engine; `param` renders the n-th placeholder; `date`
     * / `bool` adapt values to what each engine stores.
     *
     * Everything runs through `queryRunner.query` — NOT
     * `queryRunner.connection.manager` — because only the query runner carries
     * the migration's transaction (`transaction: 'each'`); the connection
     * manager would silently execute outside it. Delete/insert failures
     * propagate, so a partial refresh rolls back atomically instead of leaving
     * the table half-filled.
     */
    private refresh;
    sqliteUpQueryRunner(queryRunner: QueryRunner): Promise<any>;
    postgresUpQueryRunner(queryRunner: QueryRunner): Promise<any>;
    mysqlUpQueryRunner(queryRunner: QueryRunner): Promise<any>;
}
