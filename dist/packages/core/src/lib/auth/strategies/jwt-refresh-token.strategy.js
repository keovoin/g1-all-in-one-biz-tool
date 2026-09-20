"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtRefreshTokenStrategy = void 0;
const tslib_1 = require("tslib");
const config_1 = require("@gauzy/config");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const refresh_token_service_1 = require("../../refresh-token/refresh-token.service");
const user_service_1 = require("./../../user/user.service");
let JwtRefreshTokenStrategy = class JwtRefreshTokenStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-refresh-token') {
    constructor(userService, refreshTokenService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromBodyField('refresh_token'),
            secretOrKey: config_1.environment.JWT_REFRESH_TOKEN_SECRET,
            passReqToCallback: true,
            ignoreExpiration: false
        });
        this.userService = userService;
        this.refreshTokenService = refreshTokenService;
    }
    /**
     * Validates the refresh token and payload to ensure user authorization.
     *
     * @param request - The incoming request, expected to contain the refresh token in its body.
     * @param payload - The JWT payload to validate.
     * @param done - The callback function to be called upon validation completion.
     */
    async validate(request, payload, done) {
        try {
            const { refresh_token } = request.body; // Extract the refresh token
            const { isValid, token, reason } = await this.refreshTokenService.verify(refresh_token); // Validate the refresh token against the service
            if (!isValid) {
                return done(new common_1.UnauthorizedException(reason ?? 'Unauthorized'), false); // Return unauthorized if validation fails
            }
            const verifiedUserId = token?.userId;
            const payloadUserId = (typeof payload?.['userId'] === 'string' && payload['userId']) ||
                (typeof payload?.['id'] === 'string' && payload['id']) ||
                (typeof payload?.sub === 'string' && payload.sub) ||
                null;
            // Defense in depth: make sure the JWT identity resolved by passport matches
            // the identity resolved by the token validation path.
            if (!verifiedUserId || (payloadUserId && payloadUserId !== verifiedUserId)) {
                return done(new common_1.UnauthorizedException('Unauthorized'), false);
            }
            const user = await this.userService.findOneByIdString(verifiedUserId); // Fetch the user based on the payload ID
            // A deactivated or archived account must not be able to mint anything, and must not be
            // attached to the request context either. `getAccessTokenFromRefreshToken` happens to filter
            // on the same predicates further down the call chain today, but a refresh-route handler must
            // not inherit an authenticated identity this strategy was willing to hand out.
            // Exact predicates, as at issuance: an unknown (NULL) status is refused too.
            if (!user || user.isActive !== true || user.isArchived !== false) {
                return done(new common_1.UnauthorizedException('Unauthorized'), false); // Return unauthorized if validation fails
            }
            done(null, user); // Return user if validation is successful
        }
        catch (err) {
            // Handle errors and provide a meaningful response
            const message = err instanceof Error ? err.message : String(err);
            return done(new common_1.UnauthorizedException('Unauthorized', message), false);
        }
    }
};
exports.JwtRefreshTokenStrategy = JwtRefreshTokenStrategy;
exports.JwtRefreshTokenStrategy = JwtRefreshTokenStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [user_service_1.UserService, refresh_token_service_1.RefreshTokenService])
], JwtRefreshTokenStrategy);
//# sourceMappingURL=jwt-refresh-token.strategy.js.map