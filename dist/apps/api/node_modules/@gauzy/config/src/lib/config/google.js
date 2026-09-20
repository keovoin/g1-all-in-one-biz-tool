"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
/**
 * Register Google OAuth configuration using @nestjs/config
 */
exports.default = (0, config_1.registerAs)('google', () => ({
    // Google OAuth Client ID
    clientId: process.env.GOOGLE_CLIENT_ID,
    // Google OAuth Client Secret
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // Callback URL for handling the OAuth response after authentication
    callbackURL: process.env.GOOGLE_CALLBACK_URL || `${process.env.API_BASE_URL}/api/auth/google/callback`
}));
//# sourceMappingURL=google.js.map