"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGithubConfig = exports.GithubStrategy = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const passport_github2_1 = require("passport-github2");
let GithubStrategy = class GithubStrategy extends (0, passport_1.PassportStrategy)(passport_github2_1.Strategy, 'github') {
    constructor(configService) {
        super((0, exports.parseGithubConfig)(configService));
        this.configService = configService;
    }
    /**
     * Validate user profile after OAuth2 authentication.
     * @param _request - The Express request object.
     * @param _accessToken - The access token obtained from the OAuth2 provider.
     * @param _refreshToken - The refresh token obtained from the OAuth2 provider.
     * @param profile - The user's profile information obtained from the OAuth2 provider.
     * @param done - Passport callback function to indicate success or failure.
     */
    async validate(_request, _accessToken, _refreshToken, profile, done) {
        try {
            // Extract relevant information from the user's profile
            const { id: providerId, provider, emails, displayName, username, photos } = profile;
            // Extract first name and last name from the display name
            const [firstName, lastName] = displayName.split(' ');
            // Extract the user's profile picture
            const [photo] = photos;
            // Construct user object
            const user = {
                emails,
                firstName,
                lastName,
                username,
                picture: photo?.value,
                providerId,
                provider
            };
            // Pass the user object to the callback to indicate successful authentication
            done(null, user);
        }
        catch (error) {
            // Pass the error to the callback to indicate authentication failure
            console.error('Error during Github OAuth validation:', error);
            done(error, false);
        }
    }
};
exports.GithubStrategy = GithubStrategy;
exports.GithubStrategy = GithubStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService])
], GithubStrategy);
/**
 * Parses the GitHub OAuth configuration using the provided ConfigService.
 *
 * Retrieves the GitHub client ID, client secret, callback URL, user agent, and additional parameters
 * from the configuration. If any required configuration is missing, a warning is logged and defaults are applied.
 *
 * @param configService - An instance of the ConfigService to access application configuration.
 * @returns An object containing the GitHub OAuth configuration.
 */
const parseGithubConfig = (configService) => {
    const { clientId, clientSecret, callbackURL, userAgent } = {
        // Retrieve the GitHub client ID from the configuration.
        clientId: configService.get('github.clientId'),
        // Retrieve the GitHub client Secret from the configuration.
        clientSecret: configService.get('github.clientSecret'),
        // Retrieve the callback URL from the configuration.
        callbackURL: configService.get('github.callbackURL'),
        // Retrieve the user agent from the configuration.
        userAgent: configService.get('github.userAgent')
    };
    // Log a warning if any of the required configuration values are missing.
    if (!clientId || !clientSecret || !callbackURL) {
        console.warn('⚠️ GitHub OAuth configuration is incomplete. Defaulting to "disabled".');
    }
    // Return the GitHub OAuth configuration object.
    return {
        // Use the retrieved clientID, or default to 'disabled' if not provided.
        clientID: clientId || 'disabled',
        // Use the retrieved clientSecret, or default to 'disabled' if not provided.
        clientSecret: clientSecret || 'disabled',
        // Use the retrieved callbackURL, or default to the API_BASE_URL (or localhost) plus the callback path.
        callbackURL: callbackURL || `${process.env.API_BASE_URL ?? 'http://localhost:3000'}/api/auth/github/callback`,
        // Include the request object in the callback.
        passReqToCallback: true,
        // Specify the scope for GitHub OAuth (read user data and user email).
        scope: ['read:user', 'user:email'],
        // Retrieve the GitHub user agent from the configuration.
        userAgent: userAgent
    };
};
exports.parseGithubConfig = parseGithubConfig;
//# sourceMappingURL=github.strategy.js.map