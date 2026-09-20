"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
/**
 * Register Twitter OAuth configuration using @nestjs/config
 */
exports.default = (0, config_1.registerAs)('twitter', () => ({
    // Twitter API Key (Consumer Key)
    consumerKey: process.env.TWITTER_CLIENT_ID,
    // Twitter API Secret Key (Consumer Secret)
    consumerSecret: process.env.TWITTER_CLIENT_SECRET,
    // Callback URL for handling the OAuth response after authentication
    callbackURL: process.env.TWITTER_CALLBACK_URL
}));
//# sourceMappingURL=twitter.js.map