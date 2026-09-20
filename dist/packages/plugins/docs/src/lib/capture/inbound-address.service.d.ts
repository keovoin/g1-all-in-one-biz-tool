import { Repository } from 'typeorm';
import { ID, IDocumentInboundAddressCreateInput, IDocumentInboundAddressSecret, IDocumentInboundAddressUpdateInput, IDocumentInboundDomainVerification } from '@gauzy/contracts';
import { DocumentInboundAddress } from '../entities/document-inbound-address.entity';
import { IInboundAddressResolver } from './inbound-email.types';
/**
 * Owns the lifecycle of an organization's inbound capture address — minting, resolving, verifying
 * and rotating it.
 *
 * ## Why this exists
 *
 * The capture channel shipped with a resolver but no provisioner: `inbound-email.service.ts` read a
 * `tenant_setting` row named `docs.<organizationId>.inboundToken` that **nothing in the codebase
 * ever wrote**. Every real delivery therefore 404'd at the unknown-recipient gate; the feature only
 * appeared to work in a unit test that stubbed the lookup. This service is the missing half.
 *
 * ## Two kinds of address
 *
 * - **PLATFORM** — zero-config. Minted on first read for any organization, on the deployment-wide
 *   `GAUZY_DOCS_INBOUND_DOMAIN`, distinguished by 128 bits of CSPRNG entropy:
 *   `docs-<token>@<platform domain>`. The address itself is the credential, so it is unguessable
 *   by construction.
 * - **CUSTOM_DOMAIN** — the organization publishes its own domain. The local part is theirs to
 *   choose (`docs@acme.com`), which makes the address guessable, so it is inert until a DNS TXT
 *   record proves they control the domain.
 *
 * ## The per-address secret
 *
 * Each address carries its own relay secret, stored only as SHA-256. A single deployment-wide
 * `GAUZY_DOCS_INBOUND_WEBHOOK_SECRET` means one leak lets an attacker post mail *as any tenant*;
 * a per-address secret contains that blast radius to one organization. The global secret remains
 * supported so existing relays keep working.
 */
export declare class InboundAddressService implements IInboundAddressResolver {
    private readonly repository;
    private readonly logger;
    constructor(repository: Repository<DocumentInboundAddress>);
    /**
     * Returns the organization's addresses, minting the PLATFORM one on first call.
     *
     * Provisioning on read (rather than at organization-creation time) means every existing
     * organization gets an address the moment someone looks, with no backfill migration over the
     * `organization` table.
     */
    listForOrganization(tenantId: ID, organizationId: ID): Promise<DocumentInboundAddress[]>;
    /**
     * Mints the PLATFORM address. Retries once on a unique-index collision, which can only happen
     * if two requests race — the database, not the read-then-write, is what makes this safe.
     */
    private mintPlatformAddress;
    /**
     * Registers a tenant-owned domain. The address is created PENDING and rejects mail until
     * {@link verifyDomain} observes the TXT record.
     *
     * @returns the row plus the one-time plaintext relay secret.
     */
    createCustomDomain(tenantId: ID, organizationId: ID, input: IDocumentInboundAddressCreateInput): Promise<{
        row: DocumentInboundAddress;
        secret: IDocumentInboundAddressSecret;
    }>;
    /**
     * The DNS record the organization must publish, plus current status.
     */
    describeVerification(row: DocumentInboundAddress): IDocumentInboundDomainVerification;
    /**
     * Looks up `_gauzy-docs.<domain>` IN TXT and arms the address if the expected value is present.
     *
     * Re-checking a VERIFIED domain that has lost its record moves it to FAILED, so a domain that is
     * transferred away stops accepting mail rather than remaining armed forever.
     */
    verifyDomain(tenantId: ID, organizationId: ID, id: ID): Promise<IDocumentInboundDomainVerification>;
    /**
     * Issues a fresh relay secret, invalidating the previous one. Returned in plaintext exactly once.
     */
    rotateSecret(tenantId: ID, organizationId: ID, id: ID): Promise<IDocumentInboundAddressSecret>;
    /**
     * Rotates a PLATFORM address itself (new token ⇒ new address), for when an address leaks and
     * starts receiving junk. The old address stops resolving immediately.
     */
    rotateAddress(tenantId: ID, organizationId: ID, id: ID): Promise<DocumentInboundAddress>;
    update(tenantId: ID, organizationId: ID, id: ID, input: IDocumentInboundAddressUpdateInput): Promise<DocumentInboundAddress>;
    /**
     * Resolves a recipient address to its owning scope — the hot path, run on every delivery.
     *
     * Replaces the previous untenanted `LIKE 'docs.%.inboundToken'` scan of `tenant_setting` with a
     * single lookup on a unique index. Deliberately matches on the **whole address**, not just the
     * local part: the old parser discarded the domain entirely, so `docs-<token>@anything-at-all`
     * resolved just as well as the real domain.
     *
     * Returns `null` for anything not armed — unknown, inactive, or an unverified custom domain —
     * so the caller answers with the same 404 it gives an unknown route.
     */
    resolveByAddress(recipient?: string): Promise<DocumentInboundAddress | null>;
    /**
     * Constant-time check of a presented relay secret against the address's stored hash.
     *
     * @returns `false` when the address has no per-address secret — the caller then falls back to
     * the deployment-wide secret, so this returning `false` is "not proven here", not "rejected".
     */
    verifySecret(row: DocumentInboundAddress, presented?: string): boolean;
    /**
     * Is this sender permitted for this address? An empty/absent allowlist means "any sender that
     * passed the SPF/DKIM gate". Matches a bare address (`ceo@acme.com`) or a whole domain
     * (`@acme.com` / `acme.com`).
     */
    isSenderAllowed(row: DocumentInboundAddress, sender?: string): boolean;
    /**
     * Records a successful delivery. Best-effort — a counter must never fail an accepted message.
     */
    recordDelivery(row: DocumentInboundAddress): Promise<void>;
    private findOneOrFail;
    private mintSecret;
    private requirePlatformDomain;
    private normalizeDomain;
    private normalizeLocalPart;
    /**
     * Lower-cases the address and strips any `+tag` suffix, so `docs+invoices@acme.com` resolves to
     * `docs@acme.com` — senders routinely add tags and each one must not look like a new address.
     */
    private normalizeRecipient;
    private resolveTxtWithTimeout;
}
