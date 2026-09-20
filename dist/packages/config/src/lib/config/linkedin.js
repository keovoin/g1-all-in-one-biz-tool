"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
/**
 * Register LinkedIn OAuth configuration using @nestjs/config
 */
exports.default = (0, config_1.registerAs)('linkedin', () => ({
    // LinkedIn OAuth Client ID
    clientId: process.env.LINKEDIN_CLIENT_ID,
    // LinkedIn OAuth Client Secret
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    // Callback URL for handling the OAuth response after authentication
    callbackURL: process.env.LINKEDIN_CALLBACK_URL || `${process.env.API_BASE_URL}/api/auth/linkedin/callback`
}));
//# sourceMappingURL=linkedin.js.map