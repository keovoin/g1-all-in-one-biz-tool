"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
/**
 * Register Facebook OAuth configuration using @nestjs/config
 */
exports.default = (0, config_1.registerAs)('facebook', () => ({
    // Facebook OAuth Client ID
    clientId: process.env.FACEBOOK_CLIENT_ID,
    // Facebook OAuth Client Secret
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    // Callback URL for handling the OAuth response after authentication
    callbackURL: process.env.FACEBOOK_CALLBACK_URL
}));
//# sourceMappingURL=facebook.js.map