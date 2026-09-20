"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTwitterConfig = exports.TwitterStrategy = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const passport_twitter_1 = require("passport-twitter");
let TwitterStrategy = class TwitterStrategy extends (0, passport_1.PassportStrategy)(passport_twitter_1.Strategy, 'twitter') {
    constructor(configService) {
        super((0, exports.parseTwitterConfig)(configService));
        this.configService = configService;
    }
    /**
     * Validates and extracts user information from Twitter OAuth profile.
     *
     * This method is called after successful authentication with Twitter.
     * It processes the profile data and constructs a user object.
     *
     * @param {string} accessToken - The OAuth access token received from Twitter.
     * @param {string} refreshToken - The refresh token (not used in Twitter OAuth).
     * @param {Profile} profile - The Twitter user's profile data.
     * @param {(err: any, user?: any, info?: any) => void} done - Callback function to indicate authentication success or failure.
     *
     * @returns {Promise<void>} - Resolves after processing the user profile.
     */
    async validate(accessToken, refreshToken, profile, done) {
        try {
            console.log('Twitter OAuth validate:', profile);
            // Extract relevant information from the user's profile
            const { emails } = profile;
            // Construct user object
            const user = {
                emails,
                accessToken,
                refreshToken
            };
            done(null, user);
        }
        catch (error) {
            console.error('Error during Twitter OAuth validation:', error);
            done(error, false);
        }
    }
};
exports.TwitterStrategy = TwitterStrategy;
exports.TwitterStrategy = TwitterStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService])
], TwitterStrategy);
/**
 * Parses the Twitter configuration using the provided ConfigService.
 *
 * Retrieves the consumer key, consumer secret, and callback URL for Twitter OAuth from the configuration.
 * If any of these values are missing, a warning is logged and default values are applied.
 *
 * @param configService - An instance of the ConfigService to access application configuration.
 * @returns An object containing the Twitter OAuth configuration.
 */
const parseTwitterConfig = (configService) => {
    // Retrieve Twitter configuration values from the configuration service
    const { consumerKey, consumerSecret, callbackURL } = {
        // Retrieve the consumer key from the configuration.
        consumerKey: configService.get('twitter.consumerKey'),
        // Retrieve the consumer secret from the configuration.
        consumerSecret: configService.get('twitter.consumerSecret'),
        // Retrieve the callback URL from the configuration.
        callbackURL: configService.get('twitter.callbackURL')
    };
    // If any of the required configuration values are missing, log a warning.
    if (!consumerKey || !consumerSecret || !callbackURL) {
        console.warn('⚠️ Twitter OAuth configuration is incomplete. Defaulting to "disabled".');
    }
    // Return the configuration object for Twitter OAuth.
    return {
        // Use the retrieved consumerKey, or default to 'disabled' if not present.
        consumerKey: consumerKey || 'disabled',
        // Use the retrieved consumerSecret, or default to 'disabled' if not present.
        consumerSecret: consumerSecret || 'disabled',
        // Use the retrieved callbackURL, or default to the API_BASE_URL (or localhost) plus the callback path.
        callbackURL: callbackURL || `${process.env.API_BASE_URL ?? 'http://localhost:3000'}/api/auth/twitter/callback`,
        // Always include the email field in the Twitter OAuth response.
        includeEmail: true
    };
};
exports.parseTwitterConfig = parseTwitterConfig;
//# sourceMappingURL=twitter.strategy.js.map