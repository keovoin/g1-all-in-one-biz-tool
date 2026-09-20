import * as https from 'https';
/**
 * Creates an HTTPS agent whose DNS resolver rejects any hostname that resolves to a private,
 * loopback or link-local address.
 *
 * Validating the RESOLVED IP at connection time — not just the URL literal — is what closes
 * DNS-rebinding / hostname-based SSRF: a public-looking hostname that resolves to an internal
 * address is refused before the socket connects, with no time-of-check/time-of-use gap. Use it
 * alongside a URL-level check (see `getUnsafeOutboundUrlReason` in `@gauzy/utils`) and
 * `maxRedirects: 0`, since a 30x to an internal host would otherwise be followed by the default
 * agent (GHSA-534m-c6mh-mp98, GHSA-6gg6-vv4f-2x74).
 *
 * Lives in `@gauzy/core` rather than `@gauzy/utils` because it depends on the Node `https`/`dns`
 * built-ins: `@gauzy/utils` is reachable from browser bundles, which those imports would break.
 * The pure URL predicates stay in `@gauzy/utils` and are safe to share with the web app.
 *
 * @returns An `https.Agent` that blocks connections to non-public addresses.
 */
export declare function createSsrfSafeHttpsAgent(): https.Agent;
