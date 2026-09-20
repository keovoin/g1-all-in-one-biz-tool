"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGoogleConfig = exports.GoogleStrategy = void 0;
const tslib_1 = require("tslib");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
let GoogleStrategy = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    constructor(configService) {
        super((0, exports.parseGoogleConfig)(configService));
        this.configService = configService;
    }
    /**
     * Validates the OAuth profile and constructs a simplified user object.
     *
     * @param request - The incoming request object.
     * @param accessToken - The OAuth access token.
     * @param refreshToken - The OAuth refresh token.
     * @param profile - The user profile provided by the OAuth provider.
     * @param done - The callback to be invoked with the result.
     * @returns A Promise that resolves once validation is complete.
     */
    async validate(request, accessToken, refreshToken, profile, done) {
        try {
            // Destructure name, emails, and photos from the profile with default values.
            const { name, emails, photos } = profile;
            const { givenName, familyName } = name;
            // Safely extract the first photo as the picture if available.
            const picture = Array.isArray(photos) && photos.length > 0 ? photos[0] : null;
            // Construct a user object with the necessary properties.
            const user = {
                emails,
                firstName: givenName,
                lastName: familyName,
                picture,
                accessToken
            };
            // Invoke the callback with the user object.
            done(null, user);
        }
        catch (error) {
            // If an error occurs, pass the error to the callback.
            console.error('Error during Google OAuth validation:', error);
            done(error, false);
        }
    }
};
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService])
], GoogleStrategy);
/**
 * Parses the Google OAuth configuration using the provided ConfigService.
 *
 * Retrieves the Google client ID, client secret, and callback URL from the configuration.
 * If any required configuration is missing, a warning is logged and default values are applied.
 *
 * @param configService - An instance of ConfigService to access application configuration.
 * @returns An object containing the Google OAuth configuration parameters.
 */
const parseGoogleConfig = (configService) => {
    const { clientId, clientSecret, callbackURL } = {
        // Retrieve the Google client ID from the configuration.
        clientId: configService.get('google.clientId'),
        // Retrieve the Google client Secret from the configuration.
        clientSecret: configService.get('google.clientSecret'),
        // Retrieve the callback URL from the configuration.
        callbackURL: configService.get('google.callbackURL')
    };
    // Log a warning if any of the required configuration values are missing.
    if (!clientId || !clientSecret || !callbackURL) {
        console.warn('⚠️ Google OAuth configuration is incomplete. Defaulting to "disabled".');
    }
    // Return the Google OAuth configuration object.
    return {
        // Use the retrieved clientID, or default to 'disabled' if not provided.
        clientID: clientId || 'disabled',
        // Use the retrieved clientSecret, or default to 'disabled' if not provided.
        clientSecret: clientSecret || 'disabled',
        // Use the retrieved callbackURL, or default to the API_BASE_URL (or localhost) plus the callback path.
        callbackURL: callbackURL || `${process.env.API_BASE_URL ?? 'http://localhost:3000'}/api/auth/google/callback`,
        // Include the request object in the callback.
        passReqToCallback: true,
        // Specify the scope for Google OAuth (request email and profile information).
        scope: ['email', 'profile']
    };
};
exports.parseGoogleConfig = parseGoogleConfig;
//# sourceMappingURL=google.strategy.js.map