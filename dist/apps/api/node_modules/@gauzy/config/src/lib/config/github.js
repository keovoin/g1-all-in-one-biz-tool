"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
/**
 * Register GitHub OAuth configuration using @nestjs/config
 */
exports.default = (0, config_1.registerAs)('github', () => ({
    // GitHub OAuth Client ID
    clientId: process.env.GAUZY_GITHUB_OAUTH_CLIENT_ID,
    // GitHub OAuth Client Secret
    clientSecret: process.env.GAUZY_GITHUB_OAUTH_CLIENT_SECRET,
    // Callback URL for handling the OAuth response after authentication
    callbackURL: process.env.GAUZY_GITHUB_OAUTH_CALLBACK_URL || `${process.env.API_BASE_URL}/api/auth/github/callback`,
    // User Agent for GitHub API requests
    userAgent: process.env.CLIENT_BASE_URL
}));
//# sourceMappingURL=github.js.map