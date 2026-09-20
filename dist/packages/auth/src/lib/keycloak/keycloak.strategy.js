"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseKeycloakConfig = exports.KeycloakStrategy = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_keycloak_oauth2_oidc_1 = require("passport-keycloak-oauth2-oidc");
let KeycloakStrategy = class KeycloakStrategy extends (0, passport_1.PassportStrategy)(passport_keycloak_oauth2_oidc_1.Strategy, 'keycloak') {
    constructor(configService) {
        super((0, exports.parseKeycloakConfig)(configService));
        this.configService = configService;
    }
    /**
     * Validates the provided tokens and user profile from the OAuth provider.
     *
     * @param _request - The HTTP request object.
     * @param accessToken - The access token from the provider.
     * @param refreshToken - The refresh token from the provider.
     * @param profile - The user profile information.
     * @param done - The callback function to return the user or an error.
     */
    async validate(_request, accessToken, refreshToken, profile, done) {
        try {
            // Destructure the profile to extract user details
            const { name, emails, photos } = profile;
            const [picture] = photos || [];
            // Construct the user object with the desired properties
            const user = {
                emails,
                firstName: name?.givenName,
                lastName: name?.familyName,
                picture,
                accessToken,
                refreshToken
            };
            // Invoke the callback with the user object
            done(null, user);
        }
        catch (error) {
            // In case of error, pass the error to the callback
            console.error('Error during Keycloak OAuth validation:', error);
            done(error, false);
        }
    }
};
exports.KeycloakStrategy = KeycloakStrategy;
exports.KeycloakStrategy = KeycloakStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService])
], KeycloakStrategy);
/**
 * Parses and returns the Keycloak configuration from the provided ConfigService.
 *
 * @param configService - The configuration service instance.
 * @returns A Keycloak configuration object.
 */
const parseKeycloakConfig = (configService) => {
    const { clientId, clientSecret, realm, authServerURL, cookieKey, callbackURL } = {
        // Retrieve the Keycloak client ID from the configuration.
        clientId: configService.get('keycloak.clientId'),
        // Retrieve the Keycloak client Secret from the configuration.
        clientSecret: configService.get('keycloak.clientSecret'),
        // Retrieve the Keycloak realm from the configuration.
        realm: configService.get('keycloak.realm'),
        // Retrieve the Keycloak auth server URL from the configuration.
        authServerURL: configService.get('keycloak.authServerURL', 'https://keycloak.example.com/auth'),
        // Retrieve the Keycloak cookie key from the configuration.
        cookieKey: configService.get('keycloak.cookieKey'),
        // Retrieve the callback URL from the configuration.
        callbackURL: configService.get('keycloak.callbackURL')
    };
    if (!clientId || !clientSecret) {
        console.warn('⚠️ Keycloak authentication configuration is incomplete. Defaulting to "disabled".');
    }
    return {
        clientID: clientId || 'disabled',
        clientSecret: clientSecret || 'disabled',
        realm,
        authServerURL,
        cookieKey,
        callbackURL: callbackURL || `${process.env.API_BASE_URL ?? 'http://localhost:3000'}/api/auth/keycloak/callback`
    };
};
exports.parseKeycloakConfig = parseKeycloakConfig;
//# sourceMappingURL=keycloak.strategy.js.map