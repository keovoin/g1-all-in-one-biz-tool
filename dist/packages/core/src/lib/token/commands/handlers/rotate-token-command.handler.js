"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RotateTokenHandler = void 0;
const tslib_1 = require("tslib");
const config_1 = require("@gauzy/config");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const node_crypto_1 = require("node:crypto");
const interfaces_1 = require("../../interfaces");
const shared_1 = require("../../shared");
const token_hasher_1 = require("../../shared/token-hasher");
const token_config_registry_1 = require("../../token-config.registry");
const rotate_token_command_1 = require("../rotate-token.command");
let RotateTokenHandler = class RotateTokenHandler {
    constructor(tokenRepository, configRegistry, tokenHasher) {
        this.tokenRepository = tokenRepository;
        this.configRegistry = configRegistry;
        this.tokenHasher = tokenHasher;
    }
    async execute(command) {
        const { dto } = command;
        if (!dto.rawOldToken) {
            throw new common_1.BadRequestException('rawOldToken is required');
        }
        const config = this.configRegistry.getConfig(dto.tokenType);
        const jwtService = this.configRegistry.getJwtService(dto.tokenType);
        if (!config.allowRotation) {
            throw new common_1.UnauthorizedException(`Token type ${dto.tokenType} does not support rotation`);
        }
        // Use pessimistic locking for atomic rotation
        const rawOldToken = dto.rawOldToken;
        const oldTokenDigest = this.tokenHasher.hashToken(rawOldToken);
        return this.tokenRepository.transaction(async (repository) => {
            const oldToken = await ((0, config_1.isBetterSqlite3)()
                ? repository.findByHash(oldTokenDigest)
                : repository.findByHashWithLock(oldTokenDigest));
            if (!oldToken) {
                throw new common_1.UnauthorizedException('Token not found');
            }
            if (!oldToken.isActivated()) {
                throw new common_1.UnauthorizedException('Token is not active');
            }
            if (!oldToken.canRotate()) {
                throw new common_1.UnauthorizedException('Token cannot be rotated');
            }
            if (oldToken.userId !== dto.userId) {
                throw new common_1.UnauthorizedException('Token does not belong to user');
            }
            if (oldToken.tokenType !== dto.tokenType) {
                throw new common_1.UnauthorizedException('Token type mismatch');
            }
            if (!config.allowMultipleSessions) {
                const activeTokens = await repository.findActiveByUserAndType(dto.userId, dto.tokenType);
                const activeTokensToRevoke = activeTokens.filter((token) => token.id !== oldToken.id);
                for (const token of activeTokensToRevoke) {
                    await repository.updateStatus(token.id, interfaces_1.TokenStatus.REVOKED, token.version, {
                        revokedReason: 'Token rotated - single session only'
                    });
                }
            }
            // Calculate expiration for new token
            const expiresAt = config.expiration ? new Date(Date.now() + config.expiration) : null;
            // Metadata can come from the DTO (for client-provided metadata) or be copied from the old token if not provided
            const metadata = dto.metadata || oldToken.metadata;
            // Create new token
            const newTokenRecord = await repository.create({
                ...(metadata && { metadata }),
                userId: dto.userId,
                tokenType: dto.tokenType,
                tokenHash: (0, node_crypto_1.randomUUID)(), // Temporary hash, will be replaced after JWT is generated
                status: interfaces_1.TokenStatus.ACTIVE,
                expiresAt,
                rotatedFromTokenId: oldToken.id,
                lastUsedAt: new Date()
            });
            // Generate new JWT
            const payload = {
                ...newTokenRecord.metadata,
                userId: dto.userId,
                tokenType: dto.tokenType,
                tokenId: newTokenRecord.id
            };
            const expiresInMs = expiresAt ? expiresAt.getTime() - Date.now() : undefined;
            const expiresInSeconds = expiresInMs ? Math.max(1, Math.ceil(expiresInMs / 1000)) : undefined;
            const jwt = await jwtService.sign(payload, expiresInSeconds);
            const tokenHash = this.tokenHasher.hashToken(jwt);
            // Update new token with hash
            newTokenRecord.tokenHash = tokenHash;
            await repository.save(newTokenRecord);
            // Mark old token as rotated
            const updated = await repository.updateStatus(oldToken.id, interfaces_1.TokenStatus.ROTATED, oldToken.version, {
                rotatedToTokenId: newTokenRecord.id
            });
            if (!updated) {
                throw new common_1.UnauthorizedException('Failed to rotate token - concurrent modification');
            }
            return {
                token: jwt,
                tokenId: newTokenRecord.id,
                expiresAt: newTokenRecord.expiresAt,
                createdAt: newTokenRecord.createdAt
            };
        });
    }
};
exports.RotateTokenHandler = RotateTokenHandler;
exports.RotateTokenHandler = RotateTokenHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(rotate_token_command_1.RotateTokenCommand),
    tslib_1.__param(0, (0, common_1.Inject)(shared_1.TokenWriteRepositoryToken)),
    tslib_1.__param(2, (0, common_1.Inject)(token_hasher_1.TokenHasher)),
    tslib_1.__metadata("design:paramtypes", [Object, token_config_registry_1.TokenConfigRegistry, Object])
], RotateTokenHandler);
//# sourceMappingURL=rotate-token-command.handler.js.map