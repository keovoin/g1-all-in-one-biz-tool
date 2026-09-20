"use strict";
var CreateTokenHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTokenHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const node_crypto_1 = require("node:crypto");
const interfaces_1 = require("../../interfaces");
const shared_1 = require("../../shared");
const token_hasher_1 = require("../../shared/token-hasher");
const token_config_registry_1 = require("../../token-config.registry");
const create_token_command_1 = require("../create-token.command");
let CreateTokenHandler = CreateTokenHandler_1 = class CreateTokenHandler {
    constructor(tokenWriteRepository, configRegistry, tokenHasher) {
        this.tokenWriteRepository = tokenWriteRepository;
        this.configRegistry = configRegistry;
        this.tokenHasher = tokenHasher;
        this.logger = new common_1.Logger(CreateTokenHandler_1.name);
    }
    async execute(command) {
        const { dto } = command;
        // Resolve config & JWT service up-front so misconfigured types fail fast,
        // before any database work begins.
        const config = this.configRegistry.getConfig(dto.tokenType);
        const jwtService = this.configRegistry.getJwtService(dto.tokenType);
        // Honour the explicit expiry from the DTO; fall back to the type-level
        // configuration; null means the token never expires.
        const expiresAt = dto.expiresAt ?? (config.expiration ? new Date(Date.now() + config.expiration) : null);
        return this.tokenWriteRepository.transaction(async (manager) => {
            // Single-session enforcement: atomically revoke every other active
            // token of this type for the user before issuing the new one.
            if (!config.allowMultipleSessions) {
                this.logger.debug(`Single-session mode active — revoking existing tokens for user=${dto.userId} type=${dto.tokenType}`);
                await manager.revokeAllByUserAndType(dto.userId, dto.tokenType, null, // revokedById — system-initiated
                'New token created - single session only');
            }
            // Step 1: Persist a placeholder record so we obtain a stable tokenId
            // that can be embedded in the JWT payload.
            const tokenRecord = await manager.create({
                userId: dto.userId,
                tokenType: dto.tokenType,
                tokenHash: (0, node_crypto_1.randomUUID)(), // Temporary; replaced after JWT generation.
                status: interfaces_1.TokenStatus.ACTIVE,
                expiresAt,
                metadata: dto.metadata ?? null,
                lastUsedAt: new Date()
            });
            this.logger.debug(`Token record created with id=${tokenRecord.id} for user=${dto.userId}`);
            // Step 2: Generate the signed JWT, binding it to the persisted record.
            const payload = {
                ...dto.metadata,
                userId: dto.userId,
                tokenType: dto.tokenType,
                tokenId: tokenRecord.id
            };
            const expiresInMs = expiresAt ? expiresAt.getTime() - Date.now() : undefined;
            // Clamp to at least 1 second so JWT libraries never receive 0 or a
            // negative value.
            const expiresInSeconds = expiresInMs ? Math.max(1, Math.ceil(expiresInMs / 1000)) : undefined;
            let jwt;
            try {
                jwt = await jwtService.sign(payload, expiresInSeconds);
            }
            catch (error) {
                this.logger.error(`JWT signing failed for user=${dto.userId}: ${error?.message}`, error?.stack);
                throw new common_1.InternalServerErrorException('Failed to sign token');
            }
            // Step 3: Replace the placeholder hash with the real hash derived from
            // the signed JWT so validation look-ups work correctly.
            const tokenHash = this.tokenHasher.hashToken(jwt);
            tokenRecord.tokenHash = tokenHash;
            try {
                await manager.save(tokenRecord);
            }
            catch (error) {
                this.logger.error(`Failed to persist token hash for id=${tokenRecord.id}: ${error?.message}`, error?.stack);
                throw new common_1.InternalServerErrorException('Failed to persist token');
            }
            this.logger.log(`Token issued — id=${tokenRecord.id} user=${dto.userId} type=${dto.tokenType}`);
            return {
                token: jwt,
                tokenId: tokenRecord.id,
                expiresAt: tokenRecord.expiresAt,
                createdAt: tokenRecord.createdAt
            };
        });
    }
};
exports.CreateTokenHandler = CreateTokenHandler;
exports.CreateTokenHandler = CreateTokenHandler = CreateTokenHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(create_token_command_1.CreateTokenCommand),
    tslib_1.__param(0, (0, common_1.Inject)(shared_1.TokenWriteRepositoryToken)),
    tslib_1.__param(2, (0, common_1.Inject)(token_hasher_1.TokenHasher)),
    tslib_1.__metadata("design:paramtypes", [Object, token_config_registry_1.TokenConfigRegistry, Object])
], CreateTokenHandler);
//# sourceMappingURL=create-token-command.handler.js.map