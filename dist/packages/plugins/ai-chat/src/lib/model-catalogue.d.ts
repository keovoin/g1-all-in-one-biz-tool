/**
 * Shared plumbing for fetching a provider's model catalogue.
 *
 * Six providers need the same three things — a bounded HTTP GET, a cache keyed by credential, and a
 * failure mode that never empties the dropdown — so it lives here once rather than being re-derived
 * (and subtly mis-derived) per provider.
 *
 * The pattern is lifted from the OpenRouter free-model fetch that already proved it out: TTL cache,
 * in-flight de-duplication so a burst makes ONE network call, and a previously cached list preferred
 * over a pinned fallback because stale-but-real beats a guess.
 */
import type { IAiChatModel } from '@gauzy/contracts';
import type { IAiChatModelList, IAiProviderCredentials } from './provider.types';
import type { HostnameResolver } from './ssrf';
export interface ICatalogueResult<T> {
    value: T;
    /** True when a refresh failed and this is a previously cached value. */
    stale: boolean;
}
export interface ICatalogueCache<T> {
    /**
     * Return the cached value, or load it.
     *
     * `load` is called at most once per key at a time. A rejection is remembered briefly so a downed
     * provider does not re-time-out on every call, and the previous value (if any) is served as stale.
     */
    get(key: string, load: () => Promise<T>): Promise<ICatalogueResult<T>>;
    /** Testing seam. */
    clear(): void;
}
export declare function createCatalogueCache<T>(options?: {
    ttlMs?: number;
    negativeTtlMs?: number;
    maxEntries?: number;
}): ICatalogueCache<T>;
/**
 * A cache key for a credential, WITHOUT the credential in it.
 *
 * Catalogues are account-specific — two tenants' keys can see different models — so the key has to
 * vary per credential. It must never contain the secret itself: cache keys end up in logs, heap
 * dumps and debuggers. A short non-cryptographic digest is enough to distinguish keys; this is not a
 * security boundary, it is a bucket label.
 */
export declare function credentialCacheKey(credentials: IAiProviderCredentials | null): string;
/**
 * GET JSON from a provider's catalogue endpoint, bounded in both time and size.
 *
 * Throws on any non-2xx. Callers are expected to catch and fall back to a curated list — a catalogue
 * is a convenience, never a gate.
 *
 * The request goes through the SSRF egress guard because for the self-hosted providers this URL is
 * built from a TENANT-SUPPLIED base URL: loopback/private/link-local targets are refused, the host
 * is re-checked after DNS resolution, and redirects are not followed (GHSA-w3mx-m5cr-3gxp).
 *
 * @param url - Absolute catalogue URL.
 * @param init.headers - Extra request headers (auth).
 * @param init.allowPrivateHost - Permit a private target. Pass
 *        `isPrivateAiProviderEndpointAllowed(credentials)`, which allows operator-chosen and built-in
 *        addresses and leaves a tenant-supplied one to the `GAUZY_AI_CHAT_ALLOW_PRIVATE_BASE_URLS` flag.
 * @param init.resolver - DNS resolver for the egress pre-flight; `dns.lookup` when unset (tests inject one).
 */
export declare function fetchCatalogueJson<T>(url: string, init?: {
    headers?: Record<string, string>;
    allowPrivateHost?: boolean;
    resolver?: HostnameResolver;
}): Promise<T>;
/**
 * Resolve a catalogue that lives behind a PUBLIC endpoint (no credential required).
 *
 * Fails open to `curated`: an empty dropdown must never be how "the fetch failed" is expressed.
 */
export declare function publicCatalogue(options: {
    curated: IAiChatModel[];
    cache: ICatalogueCache<IAiChatModel[]>;
    load: () => Promise<IAiChatModel[]>;
}): Promise<IAiChatModelList>;
/**
 * Resolve a catalogue that requires the tenant's API key.
 *
 * Two rules live here rather than in each provider, because getting either wrong is a real bug and
 * four near-identical copies is four chances to get it wrong:
 *
 * 1. **No credential → curated.** These endpoints answer 401 without one, so calling them is a
 *    guaranteed timeout-then-fallback on a settings page that has not been configured yet — which is
 *    exactly when it is most often opened.
 * 2. **A custom `baseUrl` → curated.** The key then belongs to *that* endpoint, not to the vendor.
 *    Sending it to the vendor's official catalogue host would hand a third party a credential it
 *    never issued, and a proxy's model list is not the vendor's list anyway. This is the one rule
 *    here that is a security property rather than an ergonomic one.
 *
 * Fails open: any error yields `curated`.
 */
export declare function keyedCatalogue(options: {
    credentials: IAiProviderCredentials | null;
    curated: IAiChatModel[];
    cache: ICatalogueCache<IAiChatModel[]>;
    load: (credentials: IAiProviderCredentials) => Promise<IAiChatModel[]>;
}): Promise<IAiChatModelList>;
/**
 * Resolve the catalogue of a SELF-HOSTED / local server (Speaches, LocalAI, whisper.cpp, an
 * OpenAI-compatible gateway) — the exact case {@link keyedCatalogue} deliberately refuses.
 *
 * `keyedCatalogue` returns curated whenever a custom `baseUrl` is set, because for a VENDOR provider
 * the key then belongs to that endpoint and must not be sent to the vendor's official catalogue host.
 * For a local server there is no vendor host: the tenant's base URL IS the server, and its `/models`
 * is the only list worth showing (which whisper models are actually installed, which chat models are
 * loaded). So this calls `load(baseUrl, credentials)` against that base URL — and NOTHING is fetched
 * when there is no base URL to fetch from.
 *
 * Fails open like the others: any error yields `curated`. The cache key includes the base URL as
 * well as the (hashed) key, since two tenants can point at two different servers.
 */
export declare function selfHostedCatalogue(options: {
    credentials: IAiProviderCredentials | null;
    /** Address used when the credential carries none (a provider's conventional local default). */
    defaultBaseUrl?: string;
    curated: IAiChatModel[];
    cache: ICatalogueCache<IAiChatModel[]>;
    load: (baseUrl: string, credentials: IAiProviderCredentials | null) => Promise<IAiChatModel[]>;
}): Promise<IAiChatModelList>;
/**
 * Merge a curated list with a fetched one, curated first and ids de-duplicated.
 *
 * For providers whose catalogue endpoint cannot express "supports tool calling": the curated entries
 * are the ones we have actually verified work with the agent, so they lead, and the fetched remainder
 * is offered below them rather than replacing them.
 */
export declare function mergeCatalogue(curated: IAiChatModel[], fetched: IAiChatModel[]): IAiChatModel[];
/** Turn a raw model id into something readable when the provider offers no display name. */
export declare function prettifyModelId(id: string): string;
