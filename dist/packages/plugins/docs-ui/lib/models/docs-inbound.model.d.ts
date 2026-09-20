import { DocumentInboundDomainStatusEnum, IDocumentInboundAddress, IDocumentInboundAddressSecret, IDocumentInboundDomainVerification } from '@gauzy/contracts';
/**
 * Plugin-local wire models for the inbound email capture endpoints (spec 07 §17.2).
 *
 * ```
 * GET    /api/plugins/docs/inbound-addresses                 DOCS_READ    (mints the platform row)
 * POST   /api/plugins/docs/inbound-addresses                 DOCS_MANAGE  (CUSTOM_DOMAIN only)
 * GET    /api/plugins/docs/inbound-addresses/:id/verification DOCS_READ
 * POST   /api/plugins/docs/inbound-addresses/:id/verify       DOCS_MANAGE
 * POST   /api/plugins/docs/inbound-addresses/:id/rotate-secret  DOCS_MANAGE
 * POST   /api/plugins/docs/inbound-addresses/:id/rotate-address DOCS_MANAGE (PLATFORM only)
 * PUT    /api/plugins/docs/inbound-addresses/:id              DOCS_MANAGE
 * ```
 *
 * The row entity (`IDocumentInboundAddress`), both inputs, the secret envelope and the
 * verification descriptor all already live in `@gauzy/contracts`. What is local here is the
 * *view* type, the create envelope and the client-side mirrors of the server's validation.
 */
/**
 * The only shape of an inbound address the UI is allowed to hold.
 *
 * 🛑 `webhookSecretHash` is `Omit`ed on purpose. The controller already strips it
 * (`DocumentInboundAddressController.toResponse()`), and a hash is still a verifier — omitting
 * it from the view type turns "render the hash" into a COMPILE error rather than something a
 * reviewer has to catch. `DocumentInboundAddressService` strips it again at runtime, so neither
 * an older deployment nor a future backend regression can put one in front of a component.
 */
export type IDocumentInboundAddressView = Omit<IDocumentInboundAddress, 'webhookSecretHash'>;
/**
 * `POST /inbound-addresses` response.
 *
 * 🛑 `secret.webhookSecret` is plaintext and this envelope is the **only** place it ever
 * exists — the server keeps a SHA-256 and nothing can recover the original. Whatever consumes
 * this must put it in front of the user immediately and must never persist it.
 */
export interface IDocumentInboundAddressCreateResult {
    address: IDocumentInboundAddressView;
    secret: IDocumentInboundAddressSecret;
    verification: IDocumentInboundDomainVerification;
}
/**
 * Mirrors `DOCS_INBOUND_LOCAL_PART_PATTERN`
 * (`packages/plugins/docs/src/lib/docs.constants.ts`).
 *
 * Duplicated rather than imported: a UI package must not take a dependency on the server
 * bundle. The server re-validates every field, so this exists only to stop a submit that is
 * certain to come back 400 — it is never the authority.
 */
export declare const DOCS_INBOUND_LOCAL_PART_PATTERN: RegExp;
/** Mirrors `normalizeInboundDomain()` in the backend's `capture/inbound-address.util.ts`. */
export declare const DOCS_INBOUND_DOMAIN_PATTERN: RegExp;
/** Mirrors `MAX_ALLOWLIST_ENTRIES` on `CreateDocumentInboundAddressDTO` (`@ArrayMaxSize`). */
export declare const DOCS_INBOUND_ALLOWLIST_MAX = 200;
/**
 * Validates and lower-cases a domain the way the server will.
 *
 * @param value Raw user input, with or without a leading `@` or a trailing dot.
 * @returns The normalized domain, or `null` when it is not usable.
 */
export declare function normalizeInboundDomain(value?: string | null): string | null;
/**
 * Validates and lower-cases a mailbox name the way the server will.
 *
 * @param value Raw user input.
 * @returns The normalized local part, or `null` when it is not usable.
 */
export declare function normalizeInboundLocalPart(value?: string | null): string | null;
/**
 * Validates one sender-allowlist entry.
 *
 * The server accepts three shapes and matches them differently (`isSenderAllowedBy()`): a full
 * address (`ceo@acme.com`), a domain written with a leading `@` (`@acme.com`), or a bare domain
 * (`acme.com`). All three are kept verbatim — rewriting `acme.com` into `@acme.com` here would
 * change nothing semantically but would make the saved list stop matching what was typed.
 *
 * @param value Raw user input.
 * @returns The normalized entry, or `null` when it is neither an address nor a domain.
 */
export declare function normalizeInboundAllowlistEntry(value?: string | null): string | null;
/**
 * Do two allowlists hold the same entries in the same order?
 *
 * Used to decide whether the editor is dirty. Order matters only because the server round-trips
 * the array verbatim; treating a reorder as clean would leave a Save button that does nothing.
 */
export declare function sameInboundAllowlist(left: readonly string[], right: readonly string[]): boolean;
/** Badge label per domain status. Written as literals so the i18n key scan can resolve them. */
export declare const DOCS_INBOUND_STATUS_LABEL_KEYS: Record<DocumentInboundDomainStatusEnum, string>;
/**
 * The sentence under the badge.
 *
 * Each one states what happens to *mail*, not what happened to the record: `PENDING` and
 * `FAILED` both mean deliveries are rejected right now, and that is the only fact an
 * administrator can act on.
 */
export declare const DOCS_INBOUND_STATUS_HINT_KEYS: Record<DocumentInboundDomainStatusEnum, string>;
/** Nebular status per domain status — `FAILED` is danger because mail that used to work now bounces. */
export declare const DOCS_INBOUND_STATUS_BADGES: Record<DocumentInboundDomainStatusEnum, 'warning' | 'success' | 'danger'>;
