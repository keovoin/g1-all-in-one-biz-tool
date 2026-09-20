"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevokeAllUserTokensHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const shared_1 = require("../../shared");
const revoke_all_user_token_command_1 = require("../revoke-all-user-token.command");
let RevokeAllUserTokensHandler = class RevokeAllUserTokensHandler {
    constructor(tokenRepository) {
        this.tokenRepository = tokenRepository;
    }
    async execute(command) {
        return this.tokenRepository.revokeAllByUserAndType(command.userId, command.tokenType, command.revokedById, command.reason);
    }
};
exports.RevokeAllUserTokensHandler = RevokeAllUserTokensHandler;
exports.RevokeAllUserTokensHandler = RevokeAllUserTokensHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(revoke_all_user_token_command_1.RevokeAllUserTokensCommand),
    tslib_1.__param(0, (0, common_1.Inject)(shared_1.TokenWriteRepositoryToken)),
    tslib_1.__metadata("design:paramtypes", [Object])
], RevokeAllUserTokensHandler);
//# sourceMappingURL=revoke-all-user-token-command.handler.js.map