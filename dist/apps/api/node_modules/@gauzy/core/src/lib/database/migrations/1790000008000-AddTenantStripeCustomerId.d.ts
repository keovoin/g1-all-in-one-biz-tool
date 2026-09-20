import { MigrationInterface, QueryRunner } from 'typeorm';
/**
 * `tenant.stripeCustomerId` — the Stripe customer a tenant bills through on hosted deployments.
 *
 * Persisted rather than resolved from the owner's email on each request: an email is mutable and is
 * not unique across Stripe customers, so it cannot identify a billing account reliably. The
 * registration guard still matches on email, but only because at that point no tenant exists yet.
 *
 * Nullable with no default, and nothing in the platform requires it: every self-hosted install, and
 * every tenant created before billing was configured, simply leaves it NULL.
 *
 * Indexed because both the billing endpoints and the Stripe webhook resolve a tenant by this value.
 *
 * SQLite takes a plain `ALTER TABLE … ADD COLUMN` here — nullable, no constraint — so the table is
 * not rebuilt through a `temporary_*` copy. That copy would have to restate `tenant`'s full current
 * DDL and every one of its indexes, and one stale column there silently drops data. The matching
 * `DROP COLUMN` needs SQLite >= 3.35; the bundled better-sqlite3 ships 3.51.
 */
export declare class AddTenantStripeCustomerId1790000008000 implements MigrationInterface {
    name: string;
    /** Each driver's four statements, already quoted the way that driver expects. */
    private static readonly DIALECTS;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
    /** Resolves the connection's driver to its dialect entry; both SQLite drivers share one. */
    private dialectFor;
}
