"use strict";
var ValidateTokenHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateTokenHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const token_interface_1 = require("../../interfaces/token.interface");
const shared_1 = require("../../shared");
const token_hasher_1 = require("../../shared/token-hasher");
const token_config_registry_1 = require("../../token-config.registry");
const validate_token_query_1 = require("../validate-token.query");
let ValidateTokenHandler = ValidateTokenHandler_1 = class ValidateTokenHandler {
    constructor(configRegistry, tokenReadRepository, tokenWriteRepository, tokenHasher) {
        this.configRegistry = configRegistry;
        this.tokenReadRepository = tokenReadRepository;
        this.tokenWriteRepository = tokenWriteRepository;
        this.tokenHasher = tokenHasher;
        this.logger = new common_1.Logger(ValidateTokenHandler_1.name);
    }
    async execute(query) {
        const { dto } = query;
        const { rawToken, tokenType, checkInactivity } = dto;
        const jwtService = this.configRegistry.getJwtService(tokenType);
        const config = this.configRegistry.getConfig(tokenType);
        // -----------------------------------------------------------------------
        // Step 1: Verify JWT cryptographic signature and built-in expiry claim.
        // Any tampered or malformed token is rejected here before touching the DB.
        // -----------------------------------------------------------------------
        let payload;
        try {
            payload = await jwtService.verify(rawToken);
        }
        catch (error) {
            // Do NOT log the raw token; it may contain sensitive info and should be redacted if needed.
            this.logger.warn(`JWT verification failed [type=${tokenType}]: ${error?.message}`);
            return { isValid: false, reason: error?.message ?? 'Invalid token signature' };
        }
        // Guard against tokens presented to the wrong endpoint/type.
        if (payload.tokenType !== tokenType) {
            this.logger.warn(`Token type mismatch — expected=${tokenType} got=${payload.tokenType} tokenId=${payload.tokenId}`);
            return { isValid: false, reason: 'Token type mismatch' };
        }
        // -----------------------------------------------------------------------
        // Step 2: Database look-up — confirms the token hasn't been revoked,
        // rotated, or purged since the JWT was issued.
        // -----------------------------------------------------------------------
        const tokenHash = this.tokenHasher.hashToken(rawToken);
        const tokenRecord = await this.tokenReadRepository.findByHash(tokenHash);
        if (!tokenRecord) {
            this.logger.warn(`Token not found in database [tokenId=${payload.tokenId}]`);
            return { isValid: false, reason: 'Token not found in database' };
        }
        const payloadUserId = this.getPayloadUserId(payload);
        if (payloadUserId && payloadUserId !== tokenRecord.userId) {
            this.logger.warn(`Token user mismatch — payloadUserId=${payloadUserId} dbUserId=${tokenRecord.userId} tokenId=${tokenRecord.id}`);
            return { isValid: false, reason: 'Token user mismatch' };
        }
        if (payload.tokenId && payload.tokenId !== tokenRecord.id) {
            this.logger.warn(`Token id mismatch — payload=${payload.tokenId} db=${tokenRecord.id}`);
            return { isValid: false, reason: 'Token id mismatch' };
        }
        // -----------------------------------------------------------------------
        // Step 3: Domain-method gate — delegates all business rules (status,
        // expiry, inactivity, usage cap) to the entity so the handler stays thin.
        // -----------------------------------------------------------------------
        // isUsable() checks: isActivated() && !isExpired() && usageLimit && threshold
        const usabilityConfig = {
            maxUsageCount: config.maxUsageCount,
            threshold: checkInactivity ? config.threshold : undefined
        };
        if (!tokenRecord.isUsable(usabilityConfig)) {
            // Determine the precise failure reason for the side-effect and response.
            return this.handleUnusableToken(tokenRecord, usabilityConfig, checkInactivity);
        }
        // -----------------------------------------------------------------------
        // Step 4: Record usage.
        // For usage-capped tokens we must await this write, otherwise persistent
        // failures can bypass maxUsageCount enforcement.
        // -----------------------------------------------------------------------
        if (config.maxUsageCount != null) {
            try {
                await this.tokenWriteRepository.updateLastUsed(tokenRecord.id);
            }
            catch (error) {
                this.logger.error(`updateLastUsed failed for tokenId=${tokenRecord.id}: ${error?.message}`, error?.stack);
                return { isValid: false, reason: 'Token usage update failed' };
            }
        }
        else {
            this.tokenWriteRepository.updateLastUsed(tokenRecord.id).catch((error) => {
                // A failed write here is non-fatal but should alert on-call if persistent.
                this.logger.error(`updateLastUsed failed for tokenId=${tokenRecord.id}: ${error?.message}`, error?.stack);
            });
        }
        this.logger.debug(`Token validated — id=${tokenRecord.id} user=${tokenRecord.userId} type=${tokenType}`);
        return { isValid: true, token: payload };
    }
    // ---------------------------------------------------------------------------
    // Private helpers
    // ---------------------------------------------------------------------------
    /**
     * Identifies which specific domain rule caused isUsable() to return false,
     * persists the appropriate status transition, and returns a typed failure.
     *
     * Keeping this in a helper preserves single-responsibility in execute() while
     * avoiding duplicated domain-method calls.
     */
    async handleUnusableToken(tokenRecord, config, checkInactivity) {
        // Order matters: a non-active token might also be expired, but we report
        // the status first because that's the authoritative source of truth.
        if (!tokenRecord.isActivated()) {
            this.logger.warn(`Token is not active — id=${tokenRecord.id} status=${tokenRecord.status}`);
            return { isValid: false, reason: `Token is ${tokenRecord.status.toLowerCase()}` };
        }
        if (tokenRecord.isExpired()) {
            this.logger.log(`Marking token as expired — id=${tokenRecord.id}`);
            await this.tokenWriteRepository
                .updateStatus(tokenRecord.id, token_interface_1.TokenStatus.EXPIRED, tokenRecord.version)
                .catch((error) => {
                // Log but don't rethrow — the caller still gets the correct
                // invalid response, and the record will be caught by the next
                // validation or a background sweep.
                this.logger.error(`Failed to mark token expired id=${tokenRecord.id}: ${error?.message}`, error?.stack);
            });
            return { isValid: false, reason: 'Token has expired' };
        }
        if (checkInactivity && config.threshold != null && tokenRecord.isInactive(config.threshold)) {
            const inactiveMs = tokenRecord.getInactivityTime();
            this.logger.log(`Revoking inactive token — id=${tokenRecord.id} inactiveMs=${inactiveMs} threshold=${config.threshold}`);
            await this.tokenWriteRepository
                .updateStatus(tokenRecord.id, token_interface_1.TokenStatus.REVOKED, tokenRecord.version, {
                revokedReason: 'Inactivity timeout'
            })
                .catch((error) => {
                this.logger.error(`Failed to revoke inactive token id=${tokenRecord.id}: ${error?.message}`, error?.stack);
            });
            return { isValid: false, reason: 'Token revoked due to inactivity' };
        }
        if (config.maxUsageCount != null && tokenRecord.isAtUsageLimit(config.maxUsageCount)) {
            this.logger.log(`Revoking over-limit token — id=${tokenRecord.id} usageCount=${tokenRecord.usageCount} max=${config.maxUsageCount}`);
            await this.tokenWriteRepository
                .updateStatus(tokenRecord.id, token_interface_1.TokenStatus.REVOKED, tokenRecord.version, {
                revokedReason: 'Maximum usage count reached'
            })
                .catch((error) => {
                this.logger.error(`Failed to revoke over-limit token id=${tokenRecord.id}: ${error?.message}`, error?.stack);
            });
            return { isValid: false, reason: 'Token maximum usage count reached' };
        }
        // isUsable() returned false but none of the above conditions matched —
        // shouldn't happen, but surface it clearly rather than returning a
        // misleading "valid" response or a cryptic 500.
        this.logger.warn(`isUsable() returned false for unknown reason — id=${tokenRecord.id}`);
        return { isValid: false, reason: 'Token is not usable' };
    }
    getPayloadUserId(payload) {
        if (typeof payload.userId === 'string' && payload.userId.length > 0) {
            return payload.userId;
        }
        const legacyId = payload['id'];
        if (typeof legacyId === 'string' && legacyId.length > 0) {
            return legacyId;
        }
        const legacySub = payload['sub'];
        if (typeof legacySub === 'string' && legacySub.length > 0) {
            return legacySub;
        }
        return undefined;
    }
};
exports.ValidateTokenHandler = ValidateTokenHandler;
exports.ValidateTokenHandler = ValidateTokenHandler = ValidateTokenHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(validate_token_query_1.ValidateTokenQuery),
    tslib_1.__param(1, (0, common_1.Inject)(shared_1.TokenReadRepositoryToken)),
    tslib_1.__param(2, (0, common_1.Inject)(shared_1.TokenWriteRepositoryToken)),
    tslib_1.__param(3, (0, common_1.Inject)(token_hasher_1.TokenHasher)),
    tslib_1.__metadata("design:paramtypes", [token_config_registry_1.TokenConfigRegistry, Object, Object, Object])
], ValidateTokenHandler);
//# sourceMappingURL=validate-token-query.handler.js.map