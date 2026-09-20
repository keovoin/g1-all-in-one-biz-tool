"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const scoped_token_service_1 = require("../token/scoped-token.service");
const type_token_1 = require("./type.token");
let AccessTokenService = class AccessTokenService {
    constructor(tokenService) {
        this.tokenService = tokenService;
    }
    async generate(userId, metadata) {
        const created = await this.tokenService.createToken({
            metadata,
            userId
        });
        return created.token;
    }
    async verify(rawToken) {
        const { isValid, reason, token } = await this.tokenService.validateToken({
            rawToken,
            checkInactivity: true
        });
        if (!isValid) {
            throw new common_1.UnauthorizedException(reason ?? 'Invalid token');
        }
        return token;
    }
    async revoke(rawToken, reason, revokedById) {
        await this.tokenService.revokeToken({
            revokedById,
            rawToken,
            reason
        });
    }
};
exports.AccessTokenService = AccessTokenService;
exports.AccessTokenService = AccessTokenService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(type_token_1.ACCESS_TOKEN)),
    tslib_1.__metadata("design:paramtypes", [scoped_token_service_1.ScopedTokenService])
], AccessTokenService);
//# sourceMappingURL=access-token.service.js.map