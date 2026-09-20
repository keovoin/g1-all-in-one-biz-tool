"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevokeTokenHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const interfaces_1 = require("../../interfaces");
const shared_1 = require("../../shared");
const token_hasher_1 = require("../../shared/token-hasher");
const revoke_token_command_1 = require("../revoke-token.command");
let RevokeTokenHandler = class RevokeTokenHandler {
    constructor(tokenReadRepository, tokenWriteRepository, tokenHasher) {
        this.tokenReadRepository = tokenReadRepository;
        this.tokenWriteRepository = tokenWriteRepository;
        this.tokenHasher = tokenHasher;
    }
    async execute(command) {
        const { dto } = command;
        const rawToken = dto.rawToken;
        const tokenDigest = this.tokenHasher.hashToken(rawToken);
        const token = await this.tokenReadRepository.findByHash(tokenDigest);
        if (!token) {
            throw new common_1.NotFoundException('Token not found');
        }
        if (!token.canRevoke()) {
            return; // Already revoked/expired
        }
        const updated = await this.tokenWriteRepository.updateStatus(token.id, interfaces_1.TokenStatus.REVOKED, token.version, {
            revokedById: dto.revokedById,
            revokedReason: dto.reason
        });
        if (!updated) {
            throw new common_1.ConflictException('Failed to revoke token - concurrent modification');
        }
    }
};
exports.RevokeTokenHandler = RevokeTokenHandler;
exports.RevokeTokenHandler = RevokeTokenHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(revoke_token_command_1.RevokeTokenCommand),
    tslib_1.__param(0, (0, common_1.Inject)(shared_1.TokenReadRepositoryToken)),
    tslib_1.__param(1, (0, common_1.Inject)(shared_1.TokenWriteRepositoryToken)),
    tslib_1.__param(2, (0, common_1.Inject)(token_hasher_1.TokenHasher)),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object])
], RevokeTokenHandler);
//# sourceMappingURL=revoke-token-command.handler.js.map