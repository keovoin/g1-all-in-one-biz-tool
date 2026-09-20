"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
/**
 * Register Keycloak OAuth configuration using @nestjs/config
 */
exports.default = (0, config_1.registerAs)('keycloak', () => ({
    // Keycloak OAuth Client ID
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    // Keycloak OAuth Client Secret
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
    // Keycloak OAuth Realm
    realm: process.env.KEYCLOAK_REALM,
    // Keycloak OAuth Auth Server URL
    authServerURL: process.env.KEYCLOAK_AUTH_SERVER_URL || 'https://keycloak.example.com/auth',
    // Keycloak OAuth Cookie Key
    cookieKey: process.env.KEYCLOAK_COOKIE_KEY,
    // Keycloak OAuth Callback URL
    callbackURL: process.env.KEYCLOAK_CALLBACK_URL
}));
//# sourceMappingURL=keycloak.js.map