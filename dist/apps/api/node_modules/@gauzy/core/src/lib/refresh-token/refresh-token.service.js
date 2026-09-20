"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const scoped_token_service_1 = require("../token/scoped-token.service");
const current_user_provider_1 = require("./current-user.provider");
const type_token_1 = require("./type.token");
let RefreshTokenService = class RefreshTokenService {
    constructor(tokenService, currentUserProvider) {
        this.tokenService = tokenService;
        this.currentUserProvider = currentUserProvider;
    }
    async verify(rawToken) {
        return this.tokenService.validateToken({
            rawToken,
            checkInactivity: true
        });
    }
    async generate(userId, metadata) {
        const created = await this.tokenService.createToken({
            metadata,
            userId
        });
        return created.token;
    }
    async rotate(rawOldToken, metadata) {
        const userId = this.getUserId();
        const { isValid, reason } = await this.verify(rawOldToken);
        if (!isValid) {
            throw new common_1.UnauthorizedException(reason ?? 'Invalid refresh token');
        }
        const rotated = await this.tokenService.rotateToken({
            rawOldToken,
            userId,
            metadata
        });
        return rotated.token;
    }
    async revoke(rawToken, reason, revokedById = this.getUserId()) {
        await this.tokenService.revokeToken({
            revokedById,
            rawToken,
            reason
        });
    }
    getUserId() {
        return this.currentUserProvider.getCurrentUserId();
    }
};
exports.RefreshTokenService = RefreshTokenService;
exports.RefreshTokenService = RefreshTokenService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(type_token_1.REFRESH_TOKEN)),
    tslib_1.__param(1, (0, common_1.Inject)(current_user_provider_1.CURRENT_USER_PROVIDER)),
    tslib_1.__metadata("design:paramtypes", [scoped_token_service_1.ScopedTokenService, Object])
], RefreshTokenService);
//# sourceMappingURL=refresh-token.service.js.map