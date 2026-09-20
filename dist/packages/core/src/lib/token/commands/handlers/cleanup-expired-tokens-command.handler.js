"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanupExpiredTokensHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const token_repository_token_1 = require("../../shared/token-repository.token");
const cleanup_expired_tokens_command_1 = require("../cleanup-expired-tokens.command");
let CleanupExpiredTokensHandler = class CleanupExpiredTokensHandler {
    constructor(tokenRepository) {
        this.tokenRepository = tokenRepository;
    }
    async execute(command) {
        return this.tokenRepository.markExpiredTokens();
    }
};
exports.CleanupExpiredTokensHandler = CleanupExpiredTokensHandler;
exports.CleanupExpiredTokensHandler = CleanupExpiredTokensHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(cleanup_expired_tokens_command_1.CleanupExpiredTokensCommand),
    tslib_1.__param(0, (0, common_1.Inject)(token_repository_token_1.TokenMaintenanceRepositoryToken)),
    tslib_1.__metadata("design:paramtypes", [Object])
], CleanupExpiredTokensHandler);
//# sourceMappingURL=cleanup-expired-tokens-command.handler.js.map