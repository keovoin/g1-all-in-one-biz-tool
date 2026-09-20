/**
 * Bucket used when a request cannot be attributed to any address we are willing to trust.
 *
 * Deliberately a CONSTANT: every such request shares one bucket, so an attacker who manages to hide
 * their address is rate-limited harder, not exempted. Returning something request-derived (a random
 * value, or the raw header) would hand out a fresh bucket per request — which is the defect this
 * module exists to close (GHSA-86mw-2crg-vmhc).
 */
export declare const UNRESOLVED_THROTTLER_TRACKER = "unresolved-client";
/**
 * How a request is resolved to a rate-limit bucket key.
 */
export interface ThrottlerTrackerOptions {
    /**
     * Whether `CF-Connecting-IP` may be believed. Only true when the deployment states that every
     * request reaches this process through Cloudflare, which is the only situation in which the
     * header is written by something other than the client.
     */
    readonly trustCloudflareConnectingIp: boolean;
}
/**
 * Prefix an IPv6 client is bucketed by, as a count of leading 16-bit groups (4 groups = a /64).
 *
 * A single IPv6 subscriber is routinely delegated a whole /64 (2^64 addresses) and may pick any
 * source address inside it, so an exact-address bucket is a fresh bucket per request for anyone on
 * IPv6 — the same bucket-rotation defect GHSA-86mw-2crg-vmhc describes, just without a header.
 * Aggregating by /64 is the conventional unit for per-client IPv6 rate limiting.
 */
export declare const IPV6_TRACKER_PREFIX_GROUPS = 4;
/**
 * Normalises one candidate address to a comparable, genuinely-an-IP bucket string.
 *
 * Rejects anything that is not a valid IPv4/IPv6 literal, so a header carrying a hostname, an empty
 * string or arbitrary junk cannot become a bucket of its own. IPv4-mapped IPv6 — in either the
 * dotted (`::ffff:1.2.3.4`) or the hex (`::ffff:102:304`) spelling — collapses to its IPv4 form so the
 * same client keeps one bucket regardless of the socket family. Any other IPv6 address is reduced to
 * its canonical /64 prefix (see {@link IPV6_TRACKER_PREFIX_GROUPS}), which also makes equivalent
 * spellings (`2001:DB8::1`, `2001:db8:0:0::1`) land in one bucket.
 *
 * @param value - A raw address candidate (header value or `req.ip`).
 * @returns The normalised bucket string, or `null` when it is not a usable IP.
 */
export declare function normalizeTrackerIp(value: unknown): string | null;
/**
 * Resolves the rate-limit bucket key for a request.
 *
 * The previous implementation read `CF-Connecting-IP` unconditionally and otherwise used
 * `req.ips[0]` — the LEFTMOST `X-Forwarded-For` entry, i.e. the value the client itself appended.
 * Both are client-writable on every deployment shape this repository ships, so varying either one
 * per request produced a fresh bucket per request and defeated the login throttle entirely.
 *
 * What this does instead:
 * - `CF-Connecting-IP` is consulted ONLY when the deployment declares it is behind Cloudflare.
 * - Otherwise the bucket is `req.ip`, which Express derives from the socket address and the
 *   `trust proxy` setting, so it is only as forgeable as the operator's configured hop count.
 * - Anything that does not parse as an IP falls back to a single shared bucket rather than
 *   becoming a bucket of its own.
 *
 * @param req - The incoming request (headers + Express-resolved `ip`).
 * @param options - Deployment-level trust settings.
 * @returns The bucket key for this request.
 */
export declare function resolveThrottlerTracker(req: Record<string, any>, options: ThrottlerTrackerOptions): string;
