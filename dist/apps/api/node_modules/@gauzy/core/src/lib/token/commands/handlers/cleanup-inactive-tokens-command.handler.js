"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanupInactiveTokensHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const token_repository_token_1 = require("../../shared/token-repository.token");
const cleanup_inactive_tokens_command_1 = require("../cleanup-inactive-tokens.command");
let CleanupInactiveTokensHandler = class CleanupInactiveTokensHandler {
    constructor(tokenRepository) {
        this.tokenRepository = tokenRepository;
    }
    async execute(command) {
        return this.tokenRepository.revokeInactiveTokens(command.tokenType, command.threshold);
    }
};
exports.CleanupInactiveTokensHandler = CleanupInactiveTokensHandler;
exports.CleanupInactiveTokensHandler = CleanupInactiveTokensHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(cleanup_inactive_tokens_command_1.CleanupInactiveTokensCommand),
    tslib_1.__param(0, (0, common_1.Inject)(token_repository_token_1.TokenMaintenanceRepositoryToken)),
    tslib_1.__metadata("design:paramtypes", [Object])
], CleanupInactiveTokensHandler);
//# sourceMappingURL=cleanup-inactive-tokens-command.handler.js.map