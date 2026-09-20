import type { TermsAcceptanceEntity as ITermsAcceptanceRow } from 'terms-acceptance/typeorm';
/**
 * An acceptance of a legal document: who agreed to which exact text, when, in
 * what language, from roughly where, and — the field people forget — *how*.
 *
 * ## Why this entity does not extend `TenantBaseEntity`
 *
 * Nearly every other entity in the core does, and gets `id` (a generated uuid),
 * `createdAt` / `updatedAt` / `deletedAt`, `isActive`, `isArchived` and a tenant
 * foreign key for free. This one deliberately does not:
 *
 * 1. **The row is evidence, and evidence is append-only.** `updatedAt`,
 *    `deletedAt` and `isArchived` all describe a row that can legitimately
 *    change after the fact. This one cannot — corrections are made by recording
 *    a *new* acceptance, never by editing an old one. On Postgres the migration
 *    installs a `BEFORE UPDATE OR DELETE` trigger that raises, so the guarantee
 *    is enforced by the database rather than by convention.
 * 2. **The id is not a uuid.** `terms-acceptance` mints its own sortable id
 *    (`ta_…`) and supplies it on insert, so the column is a `varchar(128)` and
 *    not a `@PrimaryGeneratedColumn('uuid')`.
 * 3. **`tenantId` is a scope string, not a foreign key.** Deleting a tenant must
 *    not cascade away the proof that its users once agreed to something.
 *
 * The column set is exactly the one `terms-acceptance/typeorm` publishes, and
 * the lengths are asserted against it at module load.
 */
export declare class TermsAcceptance implements ITermsAcceptanceRow {
    /**
     * Identifier minted by `terms-acceptance`, e.g. `ta_m8k2p10000a1b2c3d4e5f6`.
     *
     * Declared with both ORMs' own primary-key decorators rather than
     * `@MultiORMColumn({ primary: true })`. That option only ever reached TypeORM:
     * `MultiORMColumn` forwards its options to `@Column()` but always emits a plain
     * MikroORM `@Property()`, so MikroORM saw a table with no primary key and
     * `discoverEntities` refused to boot the API with
     * `MetadataError: TermsAcceptance entity is missing @PrimaryKey()`.
     *
     * `BaseEntity` stacks the two decorators the same way; it is the pattern in this
     * codebase for a primary key. The id is supplied on insert, not generated, so
     * this is `@PrimaryColumn` rather than `@PrimaryGeneratedColumn`.
     */
    id: string;
    /** The user the acceptance belongs to. Not an FK — see the class comment. */
    subjectId: string;
    /** Tenant scope, when one user can accept per tenant. */
    tenantId: string | null;
    /** Stable document id, `<document>:<product>` — e.g. `tos:gauzy`. */
    documentId: string;
    /** Published version of the document that was accepted. */
    version: string;
    /**
     * Lowercase hex sha256 of the exact document source that was shown.
     *
     * This is the field that turns the row from an assertion into evidence: with
     * it, the wording this person agreed to can be reproduced byte for byte from
     * the legal corpus years later.
     */
    sha256: string;
    /** ISO-8601 UTC instant the acceptance happened. */
    acceptedAt: Date | string;
    /** BCP-47 locale of the text that was shown. */
    locale: string;
    /** Salted sha256 of the client IP. Never a raw address. */
    ipHash: string | null;
    /** Client user-agent, truncated by the package to 512 characters. */
    userAgent: string | null;
    /** How consent was obtained — `signup-checkbox`, `invite-accept`, … */
    method: string;
    /** Free-form, non-authoritative context. Never anything sensitive. */
    metadata: Record<string, unknown> | null;
    /**
     * sha256 over the canonical form of every other field. The service
     * recomputes it on every read, so a row rewritten by someone with database
     * access fails loudly instead of lying quietly.
     */
    fingerprint: string;
}
