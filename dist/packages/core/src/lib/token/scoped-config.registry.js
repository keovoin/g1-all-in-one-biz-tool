"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopedTokenConfig = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
/**
 * Scoped Token Configuration
 * Provides access to a specific token type's configuration
 * Used for dependency injection with specific token types
 */
let ScopedTokenConfig = class ScopedTokenConfig {
    constructor(config) {
        this.config = config;
    }
    /**
     * Get the token type this config is scoped to
     */
    get tokenType() {
        return this.config.tokenType;
    }
    /**
     * Get the full configuration
     */
    get configuration() {
        return this.config;
    }
    /**
     * Get expiration in milliseconds
     */
    get expirationMs() {
        return this.config.expiration;
    }
    /**
     * Get inactivity threshold in milliseconds
     */
    get threshold() {
        return this.config.threshold;
    }
    /**
     * Check if rotation is allowed
     */
    get allowRotation() {
        return this.config.allowRotation;
    }
    /**
     * Check if multiple sessions are allowed
     */
    get allowMultipleSessions() {
        return this.config.allowMultipleSessions;
    }
    /**
     * Get max usage count
     */
    get maxUsageCount() {
        return this.config.maxUsageCount;
    }
};
exports.ScopedTokenConfig = ScopedTokenConfig;
exports.ScopedTokenConfig = ScopedTokenConfig = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], ScopedTokenConfig);
//# sourceMappingURL=scoped-config.registry.js.map