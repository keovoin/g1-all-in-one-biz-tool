"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMicrosoftConfig = exports.MicrosoftStrategy = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_microsoft_1 = require("passport-microsoft");
const rxjs_1 = require("rxjs");
let MicrosoftStrategy = class MicrosoftStrategy extends (0, passport_1.PassportStrategy)(passport_microsoft_1.Strategy, 'microsoft') {
    constructor(configService, _httpService) {
        super((0, exports.parseMicrosoftConfig)(configService));
        this.configService = configService;
        this._httpService = _httpService;
    }
    /**
     * Validates the provided tokens and retrieves the user's profile information
     * from the Microsoft Graph API.
     *
     * @param accessToken - The access token for Microsoft Graph API.
     * @param refreshToken - The refresh token (unused in this example).
     * @param profile - The initial profile information (may be overwritten).
     * @param done - The callback to pass either the error or the user object.
     */
    async validate(accessToken, refreshToken, profile, done) {
        try {
            const url = `${this.configService.get('microsoft.graphApiURL')}/me`;
            profile = await (0, rxjs_1.firstValueFrom)(this._httpService
                .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
                .pipe((0, rxjs_1.map)((response) => response.data)));
            const { userPrincipalName, displayName } = profile;
            const emails = [{ value: userPrincipalName, verified: Boolean(userPrincipalName) }];
            /** Create the user object to pass to the done callback */
            const user = {
                emails,
                displayName,
                accessToken,
                refreshToken
            };
            done(null, user);
        }
        catch (error) {
            done(error, false);
        }
    }
};
exports.MicrosoftStrategy = MicrosoftStrategy;
exports.MicrosoftStrategy = MicrosoftStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService, axios_1.HttpService])
], MicrosoftStrategy);
/**
 * Parses the Microsoft OAuth configuration using the provided ConfigService.
 *
 * Retrieves the Microsoft OAuth client ID, client secret, callback URL,
 * authorization URL, and token URL from the configuration service.
 * If any required configuration values are missing, a warning is logged and default values are applied.
 *
 * @param configService - An instance of ConfigService to access configuration values.
 * @returns An object containing the Microsoft OAuth configuration parameters.
 */
const parseMicrosoftConfig = (configService) => {
    const { clientId, clientSecret, callbackURL, authorizationURL, tokenURL } = {
        // Retrieve the Microsoft client ID from the configuration.
        clientId: configService.get('microsoft.clientId'),
        // Retrieve the Microsoft client Secret from the configuration.
        clientSecret: configService.get('microsoft.clientSecret'),
        // Retrieve the callback URL from the configuration.
        callbackURL: configService.get('microsoft.callbackURL'),
        // Retrieve the authorization URL from the configuration.
        authorizationURL: configService.get('microsoft.authorizationURL'),
        // Retrieve the token URL from the configuration.
        tokenURL: configService.get('microsoft.tokenURL')
    };
    // Log a warning if any required configuration values are missing.
    if (!clientId || !clientSecret || !callbackURL) {
        console.warn('⚠️ Microsoft OAuth configuration is incomplete. Defaulting to "disabled".');
    }
    // Return the configuration object for Microsoft OAuth.
    return {
        // Use the retrieved clientID, or default to 'disabled' if not provided.
        clientID: clientId || 'disabled',
        // Use the retrieved clientSecret, or default to 'disabled' if not provided.
        clientSecret: clientSecret || 'disabled',
        // Use the retrieved callbackURL, or default to the API_BASE_URL (or localhost) plus the callback path.
        callbackURL: callbackURL || `${process.env.API_BASE_URL ?? 'http://localhost:3000'}/api/auth/microsoft/callback`,
        // Authorization URL for Microsoft OAuth.
        authorizationURL,
        // Token URL where Microsoft exchanges the authorization code for an access token.
        tokenURL,
        // Include the request object in the callback.
        passReqToCallback: true,
        // Specify the scope for Microsoft OAuth.
        scope: ['openid', 'profile', 'email', 'user.read']
    };
};
exports.parseMicrosoftConfig = parseMicrosoftConfig;
//# sourceMappingURL=microsoft.strategy.js.map