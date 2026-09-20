"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopedJwtService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
/**
 * Scoped JWT Service
 * Allows each token type to have its own JWT secret
 */
let ScopedJwtService = class ScopedJwtService {
    constructor(secret, tokenType, jwtService) {
        this.secret = secret;
        this.tokenType = tokenType;
        this.jwtService = jwtService;
    }
    async sign(payload, expiresIn) {
        const options = {
            secret: this.secret
        };
        if (expiresIn) {
            options.expiresIn = expiresIn;
        }
        return this.jwtService.signAsync(payload, options);
    }
    async verify(token) {
        let decoded;
        try {
            decoded = (await this.jwtService.verifyAsync(token, { secret: this.secret }));
        }
        catch (error) {
            if (error instanceof jwt_1.TokenExpiredError) {
                throw new common_1.UnauthorizedException('Token has expired');
            }
            if (error instanceof jwt_1.JsonWebTokenError) {
                throw new common_1.UnauthorizedException('Invalid token');
            }
            throw new common_1.UnauthorizedException('Token verification failed');
        }
        // Verify token type matches (outside try/catch so application errors are not swallowed)
        if (decoded.tokenType !== this.tokenType) {
            throw new common_1.UnauthorizedException('Token type mismatch');
        }
        return decoded;
    }
    decode(token) {
        try {
            const decoded = this.jwtService.decode(token);
            return decoded;
        }
        catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    }
};
exports.ScopedJwtService = ScopedJwtService;
exports.ScopedJwtService = ScopedJwtService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [String, String, jwt_1.JwtService])
], ScopedJwtService);
//# sourceMappingURL=scoped-jwt.service.js.map