/**
 * SSRF guard for AI-provider endpoints — the NODE half.
 *
 * A URL-literal check cannot see through DNS: `https://evil.example.com` is a perfectly public
 * string that can resolve to `169.254.169.254`. The Make.com and Zapier fixes close that with an
 * `https.Agent` whose `lookup` re-checks the RESOLVED address (`createSsrfSafeHttpsAgent` in
 * `@gauzy/core`). The same rule is applied here, at two points:
 *
 * 1. A pre-flight: the URL-literal check, then resolve-then-check of the host, before any socket is
 *    opened. It refuses early and names nothing in its error.
 * 2. The connection itself. Requests are NOT made with the global `fetch`, which resolves the host a
 *    second time on its own when it connects; a hostname whose answer flips between two lookups (TTL
 *    0, alternating public and private answers) could pass the pre-flight and still reach loopback,
 *    RFC 1918, link-local or cloud-metadata addresses. They go through `fetchOverNodeHttp`, which
 *    connects with `node:http`/`node:https` and the {@link createSsrfSafeLookup} `lookup`. Node
 *    connects to exactly the addresses that `lookup` returns, and it returns none unless every
 *    resolved address is public, so the address judged IS the address used. Every redirect hop
 *    repeats both checks, connections are never pooled (a reused socket would skip the `lookup`), and
 *    nothing is cached that an attacker could outlive.
 *
 * That closes the rebinding residual the pre-flight alone left open. `allowPrivateHost` switches both
 * checks off together, and only server-side provenance may set it.
 *
 * Node's `dns`, `http` and `https` live in THIS plugin, never in `@gauzy/utils` — that package is
 * reachable from browser bundles and those imports would break them. The pure predicates stay next
 * door in `outbound-url-guard.ts`.
 */
import type { LookupFunction } from 'net';
import type { IAiProviderCredentials } from '../provider.types';
/** Thrown instead of performing a request the egress guard refuses. */
export declare class SsrfBlockedError extends Error {
    readonly code = "ESSRFBLOCKED";
    constructor(message: string);
}
/** Resolve a hostname to its addresses. Seam so specs need no network. */
export type HostnameResolver = (hostname: string) => Promise<string[]>;
export interface ISsrfSafeFetchOptions {
    /**
     * Permit loopback/private/link-local targets. Defaults to the deployment flag.
     *
     * Set it only from server-side provenance (see `isPrivateAiProviderEndpointAllowed`), never from
     * anything a tenant supplied: `true` skips the host-class rule, the DNS pre-flight and the
     * connection-time address check.
     */
    allowPrivateHost?: boolean;
    /**
     * Override the DNS resolver (tests). Defaults to `dns.lookup`. Used by the pre-flight AND by every
     * connection, so a spec can hand the two different answers.
     */
    resolver?: HostnameResolver;
}
/**
 * The `lookup` every guarded connection resolves its host through, redirect hops included.
 *
 * This is what binds the verdict to the connection. Node connects only to addresses a `lookup` hands
 * back, and this one hands back nothing unless EVERY address the host resolved to is public — so a
 * name that answered public to the pre-flight and private a moment later is refused at the socket,
 * on the answer the socket would have used. Fails closed like the pre-flight: only a definitive "no
 * such host" is passed through as a lookup failure (the request then fails as fetch would); any other
 * resolver error is refused. With `allowPrivateHost` it resolves and checks nothing.
 *
 * An IP-literal host never reaches a `lookup` (Node connects to it directly), which is why every hop
 * also passes the URL-literal check first.
 *
 * @param allowPrivateHost - Server-side provenance only; see {@link ISsrfSafeFetchOptions}.
 * @param resolver - Resolver override (tests); `dns.lookup` otherwise.
 */
export declare function createSsrfSafeLookup(allowPrivateHost: boolean, resolver?: HostnameResolver): LookupFunction;
/**
 * `fetch` with an SSRF egress guard: URL-literal check, resolve-then-check of the host, the same
 * check again on the address each connection actually uses, and redirects refused.
 *
 * Redirects matter as much as the host: `redirect: 'follow'` is fetch's default, so a public host
 * answering `302 http://169.254.169.254/` would be followed with no second check. The transport
 * re-checks every hop it follows, but this helper still refuses them outright — the same
 * `maxRedirects: 0` rule the Make.com and Zapier guards apply, spelled the way the fetch API spells it.
 *
 * @param url - Absolute URL to request.
 * @param init - Standard `fetch` init; `redirect` is forced to `'error'`, and `signal` also bounds
 *        the DNS pre-flight.
 * @param options - Egress-guard options.
 * @throws SsrfBlockedError when the target is refused, before any request reaches it.
 */
export declare function ssrfSafeFetch(url: string, init?: RequestInit, options?: ISsrfSafeFetchOptions): Promise<Response>;
/**
 * The `fetch` to hand an AI SDK provider factory (`create*({ baseURL, fetch })`) so chat completions
 * and embeddings get the same egress guard as the catalogue and dictation requests.
 *
 * Those sinks send their request to the SAME stored base URL, but through the SDK's own `fetch`: a
 * tenant base URL whose host is a public-looking name resolving to an internal address (a wildcard
 * DNS service is enough — no rebinding needed) passed the store-time and read-time LITERAL checks and
 * was then requested, redirects followed, by every chat turn (GHSA-w3mx-m5cr-3gxp).
 *
 * Only a TENANT-supplied base URL is guarded. For anything else — the operator's own `*_BASE_URL`, a
 * platform key, or a tenant key with no base URL, which the SDK sends to the vendor's built-in host —
 * this returns `undefined`, so the factory keeps its default transport and operator traffic is
 * unchanged. For a tenant URL, private targets follow the `GAUZY_AI_CHAT_ALLOW_PRIVATE_BASE_URLS` deployment
 * flag, exactly as `isPrivateAiProviderEndpointAllowed` decides for the catalogue and speech paths.
 *
 * The guard is the one {@link ssrfSafeFetch} applies, connection-time check included, so a name
 * that rebinds between the pre-flight and the connection is refused here too. Streaming responses
 * (server-sent events) stream through it unchanged.
 *
 * @param credentials - The credentials the provider model is being created with.
 * @param options.resolver - DNS resolver override (tests); `dns.lookup` otherwise.
 * @returns A guarded `fetch`, or `undefined` when the address was not chosen by a tenant.
 */
export declare function createAiProviderSdkFetch(credentials: IAiProviderCredentials | null | undefined, options?: Pick<ISsrfSafeFetchOptions, 'resolver'>): typeof fetch | undefined;
/** Whether an error came from the egress guard (duck-typed, so it survives bundle boundaries). */
export declare function isSsrfBlockedError(error: unknown): boolean;
