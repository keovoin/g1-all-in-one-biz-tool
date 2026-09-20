import { Cache } from 'cache-manager';
import { ID } from '@gauzy/contracts';
/**
 * Server-side state recorded when a GitHub App installation flow is initiated by an authenticated
 * tenant. The opaque `state` nonce is handed to GitHub and echoed back on the post-install
 * callback, letting us bind the resulting installation to the tenant/organization that actually
 * started the flow — instead of trusting client-supplied identifiers (cross-tenant installation
 * hijack, GHSA-4rwq-65wh-45h4).
 */
export interface IGithubOAuthState {
    tenantId: ID;
    organizationId: ID;
    userId?: ID;
}
/**
 * Minimal slice of the (node-redis) client we use for ATOMIC single-use nonce operations. The raw
 * client is provided globally as EVER_REDIS_CLIENT (null when REDIS_ENABLED!='true').
 */
interface IRedisAtomicClient {
    get(key: string): Promise<string | null>;
    getDel(key: string): Promise<string | null>;
    set(key: string, value: string, options: {
        PX: number;
    }): Promise<unknown>;
}
export declare class GithubOAuthStateService {
    private readonly cacheManager;
    private readonly redisClient;
    private readonly logger;
    /** Cache key prefix for pending GitHub install state nonces. */
    private static readonly CACHE_PREFIX;
    /** Single-use nonce lifetime: long enough to complete the GitHub install, short enough to limit replay. */
    private static readonly TTL_MS;
    /** Minted nonces are 32 random bytes rendered as lowercase hex (64 chars). */
    private static readonly NONCE_PATTERN;
    /** In-process guard for the non-Redis fallback so concurrent consumes can't both resolve a nonce. */
    private static readonly inFlightConsume;
    constructor(cacheManager: Cache, redisClient: IRedisAtomicClient | null);
    /** Build the namespaced cache key for a nonce. */
    private key;
    /** Reject anything that is not a well-formed minted nonce (cache-key / log hygiene). */
    private isValidNonce;
    /**
     * Mint a cryptographically-random, single-use state nonce and persist the initiating
     * tenant/organization (and user) against it.
     *
     * @param state The tenant/organization (and optional user) that initiated the install flow.
     * @returns The opaque nonce to pass to GitHub as the `state` query parameter.
     */
    create(state: IGithubOAuthState): Promise<string>;
    /**
     * Resolve the tenant/organization bound to a nonce WITHOUT invalidating it. Used by the public
     * post-install callback to reject forged callbacks (and to avoid using `state` as a redirect
     * target) while leaving the nonce to be consumed when the installation is finalized.
     *
     * @returns The bound state, or `null` for an unknown, malformed or expired nonce.
     */
    peek(nonce?: string): Promise<IGithubOAuthState | null>;
    /**
     * Atomically resolve and invalidate a nonce so it binds at most one installation (single-use).
     *
     * @returns The bound state, or `null` for an unknown, malformed or expired nonce.
     */
    consume(nonce?: string): Promise<IGithubOAuthState | null>;
    /** Safely parse a cached state value, returning `null` for anything malformed. */
    private deserialize;
}
export {};
