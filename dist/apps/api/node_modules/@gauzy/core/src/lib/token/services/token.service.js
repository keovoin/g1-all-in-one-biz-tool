"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const commands_1 = require("../commands");
const queries_1 = require("../queries");
/**
 * Token Service - Facade for CQRS operations
 * Implements Facade Pattern - provides simplified interface to complex CQRS subsystem
 */
let TokenService = class TokenService {
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    /**
     * Create a new token
     */
    async createToken(dto) {
        return this.commandBus.execute(new commands_1.CreateTokenCommand(dto));
    }
    /**
     * Rotate an existing token
     */
    async rotateToken(dto) {
        return this.commandBus.execute(new commands_1.RotateTokenCommand(dto));
    }
    /**
     * Revoke a token
     */
    async revokeToken(dto) {
        return this.commandBus.execute(new commands_1.RevokeTokenCommand(dto));
    }
    /**
     * Revoke all tokens for a user by type
     */
    async revokeAllUserTokens(userId, tokenType, revokedBy, reason) {
        return this.commandBus.execute(new commands_1.RevokeAllUserTokensCommand(userId, tokenType, revokedBy, reason));
    }
    /**
     * Validate a token
     */
    async validateToken(dto) {
        return this.queryBus.execute(new queries_1.ValidateTokenQuery(dto));
    }
    /**
     * Get token by ID
     */
    async getTokenById(tokenId) {
        return this.queryBus.execute(new queries_1.GetTokenByIdQuery(tokenId));
    }
    /**
     * Get active tokens for a user by type
     */
    async getActiveTokens(userId, tokenType) {
        return this.queryBus.execute(new queries_1.GetActiveTokensQuery(userId, tokenType));
    }
    /**
     * Query tokens with filters
     */
    async queryTokens(filters, limit, offset) {
        return this.queryBus.execute(new queries_1.GetTokensQuery(filters, limit, offset));
    }
    /**
     * Get audit trail for a token (rotation history)
     */
    async getTokenAuditTrail(tokenId) {
        return this.queryBus.execute(new queries_1.GetTokenAuditTrailQuery(tokenId));
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus, cqrs_1.QueryBus])
], TokenService);
//# sourceMappingURL=token.service.js.map