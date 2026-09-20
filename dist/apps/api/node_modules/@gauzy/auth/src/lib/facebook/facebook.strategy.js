"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFacebookConfig = exports.FacebookStrategy = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_facebook_1 = require("passport-facebook");
let FacebookStrategy = class FacebookStrategy extends (0, passport_1.PassportStrategy)(passport_facebook_1.Strategy, 'facebook') {
    constructor(configService) {
        super((0, exports.parseFacebookConfig)(configService));
        this.configService = configService;
    }
    /**
     * Validates and extracts user information from Facebook OAuth profile.
     *
     * This method is called after successful authentication with Facebook.
     * It processes the profile data and constructs a user object.
     *
     * @param {string} accessToken - The OAuth access token received from Facebook.
     * @param {string} refreshToken - The refresh token (not used in Facebook OAuth).
     * @param {Profile} profile - The Facebook user's profile data.
     * @param {(err: any, user?: any, info?: any) => void} done - Callback function to indicate authentication success or failure.
     *
     * @returns {Promise<void>} - Resolves after processing the user profile.
     */
    async validate(accessToken, refreshToken, profile, done) {
        try {
            // Extract relevant information from the user's profile
            const { emails } = profile;
            // Construct user object
            const user = {
                emails,
                accessToken,
                refreshToken
            };
            // Pass the user object to the callback to indicate successful authentication
            done(null, user);
        }
        catch (error) {
            console.error('Error during Facebook OAuth validation:', error);
            done(error, false);
        }
    }
};
exports.FacebookStrategy = FacebookStrategy;
exports.FacebookStrategy = FacebookStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService])
], FacebookStrategy);
/**
 * Generates the configuration object for Facebook OAuth authentication.
 *
 * @param {ConfigService} configService - The configuration service instance.
 * @returns {StrategyOption} - The Facebook OAuth configuration object.
 */
const parseFacebookConfig = (configService) => {
    const { clientId, clientSecret, callbackURL } = {
        clientId: configService.get('facebook.clientId'),
        clientSecret: configService.get('facebook.clientSecret'),
        callbackURL: configService.get('facebook.callbackURL')
    };
    if (!clientId || !clientSecret || !callbackURL) {
        console.warn('⚠️ Facebook OAuth configuration is incomplete. Defaulting to "disabled".');
    }
    return {
        clientID: clientId || 'disabled',
        clientSecret: clientSecret || 'disabled',
        callbackURL: callbackURL || `${process.env.API_BASE_URL ?? 'http://localhost:3000'}/api/auth/facebook/callback`,
        profileFields: ['id', 'emails', 'name'],
        scope: ['email'],
        enableProof: true
    };
};
exports.parseFacebookConfig = parseFacebookConfig;
//# sourceMappingURL=facebook.strategy.js.map