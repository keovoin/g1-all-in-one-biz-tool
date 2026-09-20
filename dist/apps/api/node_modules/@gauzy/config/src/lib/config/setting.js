"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const common_1 = require("@gauzy/common");
/**
 * Configuration for Feature Flags
 *
 * Defines feature flags and settings related to user authentication methods.
 * The configuration values are registered using the @nestjs/config library.
 *
 * @returns {Object} Object representing the feature flags configuration.
 */
exports.default = (0, config_1.registerAs)('setting', () => ({
    /** Flag indicating whether email/password login is enabled. */
    email_password_login: common_1.flagFeatures.FEATURE_EMAIL_PASSWORD_LOGIN,
    /** Flag indicating whether magic login is enabled. */
    magic_login: common_1.flagFeatures.FEATURE_MAGIC_LOGIN,
    /** Flag indicating whether GitHub login is enabled. */
    github_login: common_1.flagFeatures.FEATURE_GITHUB_LOGIN,
    /** Flag indicating whether Facebook login is enabled. */
    facebook_login: common_1.flagFeatures.FEATURE_FACEBOOK_LOGIN,
    /** Flag indicating whether Google login is enabled. */
    google_login: common_1.flagFeatures.FEATURE_GOOGLE_LOGIN,
    /** Flag indicating whether Twitter login is enabled. */
    twitter_login: common_1.flagFeatures.FEATURE_TWITTER_LOGIN,
    /** Flag indicating whether Microsoft login is enabled. */
    microsoft_login: common_1.flagFeatures.FEATURE_MICROSOFT_LOGIN,
    /** Flag indicating whether LinkedIn login is enabled. */
    linkedin_login: common_1.flagFeatures.FEATURE_LINKEDIN_LOGIN
}));
//# sourceMappingURL=setting.js.map