"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLinkedinConfig = exports.LinkedinStrategy = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const passport_jwt_1 = require("passport-jwt");
const passport_linkedin_oauth2_1 = require("passport-linkedin-oauth2");
const config_2 = require("@gauzy/config");
let LinkedinStrategy = class LinkedinStrategy extends (0, passport_1.PassportStrategy)(passport_linkedin_oauth2_1.Strategy, 'linkedin') {
    constructor(configService) {
        super((0, exports.parseLinkedinConfig)(configService));
        this.configService = configService;
    }
    /**
     * Validates the provided OAuth profile and constructs a simplified user object.
     *
     * This function extracts the user's email(s) from the OAuth profile and combines it
     * with the access token. If validation succeeds, the user object is passed to the callback.
     * Otherwise, the error is forwarded to the callback.
     *
     * @param _request - The incoming request object.
     * @param accessToken - The OAuth access token.
     * @param refreshToken - The OAuth refresh token.
     * @param profile - The user profile returned by the OAuth provider.
     * @param done - The callback to be invoked with either an error or the user object.
     * @returns A promise that resolves when the validation process is complete.
     */
    async validate(_request, accessToken, refreshToken, profile, done) {
        try {
            // Extract emails from the OAuth profile.
            const { emails } = profile;
            // Create a user object with the required properties.
            const user = {
                emails,
                accessToken,
                refreshToken
            };
            // Invoke the callback with no error and the constructed user.
            done(null, user);
        }
        catch (error) {
            // If an error occurs, pass the error to the callback.
            console.error('Error during LinkedIn OAuth validation:', error);
            done(error, false);
        }
    }
};
exports.LinkedinStrategy = LinkedinStrategy;
exports.LinkedinStrategy = LinkedinStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService])
], LinkedinStrategy);
/**
 * Parses the LinkedIn OAuth configuration using the provided ConfigService.
 *
 * Retrieves the LinkedIn client ID, client secret, callback URL, and other related settings
 * from the configuration. If any required configuration is missing, a warning is logged and default values are applied.
 *
 * @param configService - An instance of the ConfigService used to access application configuration.
 * @returns An object containing the LinkedIn OAuth configuration parameters.
 */
const parseLinkedinConfig = (configService) => {
    const { clientId, clientSecret, callbackURL } = {
        // Retrieve the LinkedIn client ID from the configuration.
        clientId: configService.get('linkedin.clientId'),
        // Retrieve the LinkedIn client Secret from the configuration.
        clientSecret: configService.get('linkedin.clientSecret'),
        // Retrieve the callback URL from the configuration.
        callbackURL: configService.get('linkedin.callbackURL')
    };
    // Validate required LinkedIn configurations. Log a warning if any are missing.
    if (!clientId || !clientSecret || !callbackURL) {
        console.warn('⚠️ LinkedIn OAuth configuration is incomplete. Defaulting to "disabled".');
    }
    // Return the configuration object with defaults as needed.
    return {
        // Use the retrieved clientID, or default to 'disabled' if not provided.
        clientID: clientId || 'disabled',
        // Use the retrieved clientSecret, or default to 'disabled' if not provided.
        clientSecret: clientSecret || 'disabled',
        // Use the retrieved callbackURL, or default to a constructed URL based on API_BASE_URL.
        callbackURL: callbackURL || `${process.env.API_BASE_URL ?? 'http://localhost:3000'}/api/auth/linkedin/callback`,
        // Include the request object in the OAuth callback.
        passReqToCallback: true,
        // Specify the scope for LinkedIn OAuth (for reading basic profile and email).
        scope: ['r_liteprofile', 'r_emailaddress'],
        // Use the JWT secret from the environment for LinkedIn OAuth.
        secretOrKey: config_2.environment.JWT_SECRET,
        // Define how to extract the JWT from the request's Authorization header.
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()
    };
};
exports.parseLinkedinConfig = parseLinkedinConfig;
//# sourceMappingURL=linkedin.strategy.js.map