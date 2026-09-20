"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopedTokenService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const commands_1 = require("./commands");
const queries_1 = require("./queries");
const scoped_config_registry_1 = require("./scoped-config.registry");
/**
 * Scoped Token Service
 * Automatically uses the token type from ScopedTokenConfig
 * User doesn't need to specify tokenType in every call
 */
let ScopedTokenService = class ScopedTokenService {
    constructor(commandBus, queryBus, scopedConfig) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
        this.scopedConfig = scopedConfig;
    }
    /**
     * Get the token type this service is scoped to
     */
    get tokenType() {
        return this.scopedConfig.tokenType;
    }
    /**
     * Create a new token (tokenType automatically set)
     */
    async createToken(dto) {
        return this.commandBus.execute(new commands_1.CreateTokenCommand({
            ...dto,
            tokenType: this.tokenType
        }));
    }
    /**
     * Rotate an existing token (tokenType automatically set)
     */
    async rotateToken(dto) {
        return this.commandBus.execute(new commands_1.RotateTokenCommand({
            ...dto,
            tokenType: this.tokenType
        }));
    }
    /**
     * Revoke a token
     */
    async revokeToken(dto) {
        return this.commandBus.execute(new commands_1.RevokeTokenCommand(dto));
    }
    /**
     * Revoke all tokens for a user (tokenType automatically set)
     */
    async revokeAllUserTokens(userId, revokedById, reason) {
        return this.commandBus.execute(new commands_1.RevokeAllUserTokensCommand(userId, this.tokenType, revokedById, reason));
    }
    /**
     * Validate a token (tokenType automatically set)
     */
    async validateToken(dto) {
        return this.queryBus.execute(new queries_1.ValidateTokenQuery({
            ...dto,
            tokenType: this.tokenType
        }));
    }
    /**
     * Get active tokens for a user (tokenType automatically set)
     */
    async getActiveTokens(userId) {
        return this.queryBus.execute(new queries_1.GetActiveTokensQuery(userId, this.tokenType));
    }
};
exports.ScopedTokenService = ScopedTokenService;
exports.ScopedTokenService = ScopedTokenService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        cqrs_1.QueryBus,
        scoped_config_registry_1.ScopedTokenConfig])
], ScopedTokenService);
//# sourceMappingURL=scoped-token.service.js.map