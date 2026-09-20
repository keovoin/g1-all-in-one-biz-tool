"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevokeAllUserTokensCommand = void 0;
class RevokeAllUserTokensCommand {
    constructor(userId, tokenType, revokedById, reason) {
        this.userId = userId;
        this.tokenType = tokenType;
        this.revokedById = revokedById;
        this.reason = reason;
    }
}
exports.RevokeAllUserTokensCommand = RevokeAllUserTokensCommand;
//# sourceMappingURL=revoke-all-user-token.command.js.map