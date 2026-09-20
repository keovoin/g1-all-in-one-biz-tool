/**
 * Pure address parsing and matching for inbound capture.
 *
 * Deliberately free of any entity or ORM import: this is the security-critical half of inbound
 * routing (which tenant receives a message, and whether a sender may write to them), and it must
 * be directly unit-testable. The service that owns persistence delegates here.
 */
/**
 * Normalizes a recipient into the exact string stored in `document_inbound_address.address`.
 *
 * Handles the three shapes a real ESP sends:
 * - a bare address — `docs@acme.com`
 * - a display-name form — `"Docs Intake" <docs@acme.com>`
 * - a tagged address — `docs+invoices@acme.com`, which must resolve to `docs@acme.com`
 *
 * @returns the canonical `local@domain`, or `null` when the input is not a usable address.
 */
export declare const normalizeRecipientAddress: (recipient?: string) => string | null;
/**
 * Validates and lower-cases a domain, label by label.
 *
 * Deliberately strict rather than "contains a dot": this value decides which tenant receives
 * mail, so anything ambiguous is rejected outright.
 *
 * @returns the normalized domain, or `null` when invalid.
 */
export declare const normalizeInboundDomain: (value?: string) => string | null;
/**
 * Validates and lower-cases a mailbox name.
 *
 * @returns the normalized local part, or `null` when invalid.
 */
export declare const normalizeInboundLocalPart: (value?: string) => string | null;
/**
 * Is this sender permitted by this allowlist?
 *
 * An empty or absent allowlist means "any sender that already passed the SPF/DKIM gate" — the
 * documented default. Entries match either a full address (`ceo@acme.com`) or a whole domain,
 * written as `@acme.com` or bare `acme.com`.
 *
 * Domain comparison is exact: `acme.com` does NOT admit `evil-acme.com` or `acme.com.evil.tld`.
 */
export declare const isSenderAllowedBy: (allowlist: string[] | null | undefined, sender?: string) => boolean;
