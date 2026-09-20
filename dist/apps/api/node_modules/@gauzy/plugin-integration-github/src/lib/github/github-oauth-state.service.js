"use strict";
var GithubOAuthStateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubOAuthStateService = void 0;
const tslib_1 = require("tslib");
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const core_1 = require("@gauzy/core");
let GithubOAuthStateService = GithubOAuthStateService_1 = class GithubOAuthStateService {
    constructor(cacheManager, redisClient) {
        this.cacheManager = cacheManager;
        this.redisClient = redisClient;
        this.logger = new common_1.Logger(GithubOAuthStateService_1.name);
    }
    /** Build the namespaced cache key for a nonce. */
    key(nonce) {
        return `${GithubOAuthStateService_1.CACHE_PREFIX}${nonce}`;
    }
    /** Reject anything that is not a well-formed minted nonce (cache-key / log hygiene). */
    isValidNonce(nonce) {
        return !!nonce && GithubOAuthStateService_1.NONCE_PATTERN.test(nonce);
    }
    /**
     * Mint a cryptographically-random, single-use state nonce and persist the initiating
     * tenant/organization (and user) against it.
     *
     * @param state The tenant/organization (and optional user) that initiated the install flow.
     * @returns The opaque nonce to pass to GitHub as the `state` query parameter.
     */
    async create(state) {
        const nonce = (0, crypto_1.randomBytes)(32).toString('hex');
        const value = JSON.stringify(state);
        const cacheKey = this.key(nonce);
        if (this.redisClient) {
            // Authoritative, cross-replica store with TTL (matches the AuthService OAuth pattern).
            await this.redisClient.set(cacheKey, value, { PX: GithubOAuthStateService_1.TTL_MS });
        }
        else {
            await this.cacheManager.set(cacheKey, value, GithubOAuthStateService_1.TTL_MS);
        }
        return nonce;
    }
    /**
     * Resolve the tenant/organization bound to a nonce WITHOUT invalidating it. Used by the public
     * post-install callback to reject forged callbacks (and to avoid using `state` as a redirect
     * target) while leaving the nonce to be consumed when the installation is finalized.
     *
     * @returns The bound state, or `null` for an unknown, malformed or expired nonce.
     */
    async peek(nonce) {
        if (!this.isValidNonce(nonce)) {
            return null;
        }
        const cacheKey = this.key(nonce);
        const value = this.redisClient
            ? await this.redisClient.get(cacheKey)
            : (await this.cacheManager.get(cacheKey)) ?? null;
        return this.deserialize(value);
    }
    /**
     * Atomically resolve and invalidate a nonce so it binds at most one installation (single-use).
     *
     * @returns The bound state, or `null` for an unknown, malformed or expired nonce.
     */
    async consume(nonce) {
        if (!this.isValidNonce(nonce)) {
            return null;
        }
        const cacheKey = this.key(nonce);
        if (this.redisClient) {
            // Atomic single-use: GETDEL guarantees exactly one caller resolves a given nonce, even
            // across replicas, so a replay cannot reuse it (matches AuthService single-use OAuth codes).
            return this.deserialize(await this.redisClient.getDel(cacheKey));
        }
        // Non-Redis fallback (single-node dev): the get+del is not atomic, so guard it with an
        // in-process lock — a second concurrent consume of the same nonce returns null (single-use).
        if (GithubOAuthStateService_1.inFlightConsume.has(cacheKey)) {
            return null;
        }
        GithubOAuthStateService_1.inFlightConsume.add(cacheKey);
        try {
            const value = (await this.cacheManager.get(cacheKey)) ?? null;
            if (value) {
                await this.cacheManager.del(cacheKey);
            }
            return this.deserialize(value);
        }
        finally {
            GithubOAuthStateService_1.inFlightConsume.delete(cacheKey);
        }
    }
    /** Safely parse a cached state value, returning `null` for anything malformed. */
    deserialize(value) {
        if (!value || typeof value !== 'string') {
            return null;
        }
        try {
            const parsed = JSON.parse(value);
            return parsed && parsed.tenantId && parsed.organizationId ? parsed : null;
        }
        catch (error) {
            this.logger.warn(`Failed to parse GitHub OAuth state: ${error?.message}`);
            return null;
        }
    }
};
exports.GithubOAuthStateService = GithubOAuthStateService;
/** Cache key prefix for pending GitHub install state nonces. */
GithubOAuthStateService.CACHE_PREFIX = 'github_oauth_state:';
/** Single-use nonce lifetime: long enough to complete the GitHub install, short enough to limit replay. */
GithubOAuthStateService.TTL_MS = 10 * 60 * 1000; // 10 minutes
/** Minted nonces are 32 random bytes rendered as lowercase hex (64 chars). */
GithubOAuthStateService.NONCE_PATTERN = /^[a-f0-9]{64}$/;
/** In-process guard for the non-Redis fallback so concurrent consumes can't both resolve a nonce. */
GithubOAuthStateService.inFlightConsume = new Set();
exports.GithubOAuthStateService = GithubOAuthStateService = GithubOAuthStateService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    tslib_1.__param(1, (0, common_1.Optional)()),
    tslib_1.__param(1, (0, common_1.Inject)(core_1.EVER_REDIS_CLIENT)),
    tslib_1.__metadata("design:paramtypes", [Object, Object])
], GithubOAuthStateService);
//# sourceMappingURL=github-oauth-state.service.js.map