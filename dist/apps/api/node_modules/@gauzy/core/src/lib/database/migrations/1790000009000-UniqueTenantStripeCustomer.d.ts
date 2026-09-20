import { MigrationInterface, QueryRunner } from 'typeorm';
/**
 * Make `tenant.stripeCustomerId` unique.
 *
 * Two tenants must never point at one Stripe customer. Whichever of them opened the billing page
 * would be reading the other's invoices, card and subscription, and could cancel it — so this is a
 * tenant-isolation boundary, not a tidiness constraint, and it belongs in the schema rather than
 * only in the two code paths that write the column.
 *
 * Both of those paths already refuse to create a duplicate. They are checks-then-write, though, so
 * two concurrent requests can both pass the check before either writes; the database is the only
 * place that can actually make it impossible. Application code keeps the friendly refusal, this
 * keeps the guarantee.
 *
 * A UNIQUE index still permits many NULLs on every dialect we support (Postgres, MySQL and SQLite
 * all treat NULLs as distinct here), which matters because NULL is the normal state: every
 * self-hosted install and every tenant created before billing was configured leaves it unset.
 *
 * There is nothing to clean up first. The column was introduced one migration ago and is written
 * only when a Stripe key is configured, so no deployment can hold a duplicate yet — which is exactly
 * why this is worth doing now rather than after the first collision.
 */
export declare class UniqueTenantStripeCustomer1790000009000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    /** Tenant ids that would violate the unique index, smallest id per customer excluded. */
    private findDuplicates;
    /** Sets those same rows back to NULL. Same predicate, so the two cannot drift apart. */
    private clearDuplicatesSql;
    down(queryRunner: QueryRunner): Promise<void>;
}
