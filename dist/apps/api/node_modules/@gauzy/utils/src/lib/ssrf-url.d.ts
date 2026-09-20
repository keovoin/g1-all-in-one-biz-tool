/**
 * SSRF egress-guard helpers.
 *
 * Pure and dependency-free (uses only the global `URL`), so they are safe to bundle for both the
 * browser and Node. Use these to validate user-supplied outbound URLs (integration webhooks,
 * callbacks, …) BEFORE the server makes a request to them, to prevent Server-Side Request Forgery
 * (CWE-918) against internal services and cloud metadata endpoints.
 *
 * Note: this performs literal host/IP checks only and does NOT resolve DNS. For full protection
 * against DNS-rebinding / hostname-based SSRF, callers on the server should additionally resolve the
 * host and re-check the resolved IP at request time.
 */
/**
 * Whether the given hostname is a loopback / private / link-local host that must not be reachable
 * from a server-side request. Literal check only — does not resolve DNS.
 *
 * @param hostname - The hostname or IP literal to check (e.g. `parsedUrl.hostname`).
 */
export declare function isPrivateOrLoopbackHost(hostname: string): boolean;
/**
 * Returns a human-readable reason string if the given URL is NOT safe to use as a server-side
 * outbound request target (SSRF guard), or `null` if it is considered safe.
 *
 * Rejects: non-HTTPS schemes (unless `allowHttp`), embedded credentials, overly long URLs, and
 * loopback / private / link-local hosts.
 *
 * @param url - The URL to validate.
 * @param options.allowHttp - Allow plain `http:` in addition to `https:` (default `false`).
 */
export declare function getUnsafeOutboundUrlReason(url: string, options?: {
    allowHttp?: boolean;
}): string | null;
/**
 * Convenience guard: returns `true` if the URL is safe to use as a server-side outbound target.
 *
 * @param url - The URL to validate.
 * @param options.allowHttp - Allow plain `http:` in addition to `https:` (default `false`).
 */
export declare function isSafeOutboundUrl(url: string, options?: {
    allowHttp?: boolean;
}): boolean;
