"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenConfigRegistry = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
let TokenConfigRegistry = class TokenConfigRegistry {
    constructor() {
        this.configs = new Map();
        this.jwtServices = new Map();
    }
    /**
     * Register a new token type configuration
     */
    register(config) {
        if (this.configs.has(config.tokenType)) {
            throw new Error(`Token type ${config.tokenType} is already registered`);
        }
        this.configs.set(config.tokenType, config);
    }
    /**
     * Register JWT service for a token type
     */
    registerJwtService(tokenType, jwtService) {
        if (this.jwtServices.has(tokenType)) {
            throw new Error(`JWT service for token type ${tokenType} is already registered`);
        }
        this.jwtServices.set(tokenType, jwtService);
    }
    /**
     * Get configuration for a token type
     */
    getConfig(tokenType) {
        const config = this.configs.get(tokenType);
        if (!config) {
            throw new common_1.NotFoundException(`Token type ${tokenType} is not registered`);
        }
        return config;
    }
    /**
     * Get JWT service for a token type
     */
    getJwtService(tokenType) {
        const jwtService = this.jwtServices.get(tokenType);
        if (!jwtService) {
            throw new common_1.NotFoundException(`JWT service for token type ${tokenType} is not registered`);
        }
        return jwtService;
    }
    /**
     * Check if a token type is registered
     */
    hasConfig(tokenType) {
        return this.configs.has(tokenType);
    }
    /**
     * Get all registered token types
     */
    getRegisteredTypes() {
        return Array.from(this.configs.keys());
    }
    /**
     * Unregister a token type (for testing or dynamic configurations)
     */
    unregister(tokenType) {
        this.configs.delete(tokenType);
        this.jwtServices.delete(tokenType);
    }
};
exports.TokenConfigRegistry = TokenConfigRegistry;
exports.TokenConfigRegistry = TokenConfigRegistry = tslib_1.__decorate([
    (0, common_1.Injectable)()
], TokenConfigRegistry);
//# sourceMappingURL=token-config.registry.js.map