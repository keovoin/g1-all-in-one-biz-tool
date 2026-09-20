import { DocumentInboundDomainStatusEnum } from '@gauzy/contracts';
/**
 * Mirrors `DOCS_INBOUND_LOCAL_PART_PATTERN`
 * (`packages/plugins/docs/src/lib/docs.constants.ts`).
 *
 * Duplicated rather than imported: a UI package must not take a dependency on the server
 * bundle. The server re-validates every field, so this exists only to stop a submit that is
 * certain to come back 400 — it is never the authority.
 */
export const DOCS_INBOUND_LOCAL_PART_PATTERN = /^[a-z0-9]([a-z0-9._-]{0,62}[a-z0-9])?$/;
/** Mirrors `normalizeInboundDomain()` in the backend's `capture/inbound-address.util.ts`. */
export const DOCS_INBOUND_DOMAIN_PATTERN = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;
/** Mirrors `MAX_ALLOWLIST_ENTRIES` on `CreateDocumentInboundAddressDTO` (`@ArrayMaxSize`). */
export const DOCS_INBOUND_ALLOWLIST_MAX = 200;
/**
 * Validates and lower-cases a domain the way the server will.
 *
 * @param value Raw user input, with or without a leading `@` or a trailing dot.
 * @returns The normalized domain, or `null` when it is not usable.
 */
export function normalizeInboundDomain(value) {
    const domain = String(value ?? '')
        .trim()
        .toLowerCase()
        .replace(/^@/, '')
        .replace(/\.$/, '');
    return DOCS_INBOUND_DOMAIN_PATTERN.test(domain) ? domain : null;
}
/**
 * Validates and lower-cases a mailbox name the way the server will.
 *
 * @param value Raw user input.
 * @returns The normalized local part, or `null` when it is not usable.
 */
export function normalizeInboundLocalPart(value) {
    const localPart = String(value ?? '')
        .trim()
        .toLowerCase();
    return DOCS_INBOUND_LOCAL_PART_PATTERN.test(localPart) ? localPart : null;
}
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
export function normalizeInboundAllowlistEntry(value) {
    const entry = String(value ?? '')
        .trim()
        .toLowerCase();
    if (!entry || /\s/.test(entry)) {
        return null;
    }
    // `@acme.com` — a whole domain.
    if (entry.startsWith('@')) {
        return DOCS_INBOUND_DOMAIN_PATTERN.test(entry.slice(1)) ? entry : null;
    }
    // Split on the LAST '@', exactly as the server does, so a quoted local part cannot confuse it.
    const atIndex = entry.lastIndexOf('@');
    if (atIndex < 0) {
        // `acme.com` — a bare domain.
        return DOCS_INBOUND_DOMAIN_PATTERN.test(entry) ? entry : null;
    }
    const local = entry.slice(0, atIndex);
    const domain = entry.slice(atIndex + 1);
    if (!local) {
        return null;
    }
    return DOCS_INBOUND_DOMAIN_PATTERN.test(domain) ? entry : null;
}
/**
 * Do two allowlists hold the same entries in the same order?
 *
 * Used to decide whether the editor is dirty. Order matters only because the server round-trips
 * the array verbatim; treating a reorder as clean would leave a Save button that does nothing.
 */
export function sameInboundAllowlist(left, right) {
    return left.length === right.length && left.every((entry, index) => entry === right[index]);
}
/** Badge label per domain status. Written as literals so the i18n key scan can resolve them. */
export const DOCS_INBOUND_STATUS_LABEL_KEYS = {
    [DocumentInboundDomainStatusEnum.PENDING]: 'DOCS.INBOUND.STATUS_PENDING',
    [DocumentInboundDomainStatusEnum.VERIFIED]: 'DOCS.INBOUND.STATUS_VERIFIED',
    [DocumentInboundDomainStatusEnum.FAILED]: 'DOCS.INBOUND.STATUS_FAILED'
};
/**
 * The sentence under the badge.
 *
 * Each one states what happens to *mail*, not what happened to the record: `PENDING` and
 * `FAILED` both mean deliveries are rejected right now, and that is the only fact an
 * administrator can act on.
 */
export const DOCS_INBOUND_STATUS_HINT_KEYS = {
    [DocumentInboundDomainStatusEnum.PENDING]: 'DOCS.INBOUND.STATUS_PENDING_HINT',
    [DocumentInboundDomainStatusEnum.VERIFIED]: 'DOCS.INBOUND.STATUS_VERIFIED_HINT',
    [DocumentInboundDomainStatusEnum.FAILED]: 'DOCS.INBOUND.STATUS_FAILED_HINT'
};
/** Nebular status per domain status — `FAILED` is danger because mail that used to work now bounces. */
export const DOCS_INBOUND_STATUS_BADGES = {
    [DocumentInboundDomainStatusEnum.PENDING]: 'warning',
    [DocumentInboundDomainStatusEnum.VERIFIED]: 'success',
    [DocumentInboundDomainStatusEnum.FAILED]: 'danger'
};
//# sourceMappingURL=docs-inbound.model.js.map