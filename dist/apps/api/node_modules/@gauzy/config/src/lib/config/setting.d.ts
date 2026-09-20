/**
 * Configuration for Feature Flags
 *
 * Defines feature flags and settings related to user authentication methods.
 * The configuration values are registered using the @nestjs/config library.
 *
 * @returns {Object} Object representing the feature flags configuration.
 */
declare const _default: (() => {
    /** Flag indicating whether email/password login is enabled. */
    email_password_login: boolean;
    /** Flag indicating whether magic login is enabled. */
    magic_login: boolean;
    /** Flag indicating whether GitHub login is enabled. */
    github_login: boolean;
    /** Flag indicating whether Facebook login is enabled. */
    facebook_login: boolean;
    /** Flag indicating whether Google login is enabled. */
    google_login: boolean;
    /** Flag indicating whether Twitter login is enabled. */
    twitter_login: boolean;
    /** Flag indicating whether Microsoft login is enabled. */
    microsoft_login: boolean;
    /** Flag indicating whether LinkedIn login is enabled. */
    linkedin_login: boolean;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    /** Flag indicating whether email/password login is enabled. */
    email_password_login: boolean;
    /** Flag indicating whether magic login is enabled. */
    magic_login: boolean;
    /** Flag indicating whether GitHub login is enabled. */
    github_login: boolean;
    /** Flag indicating whether Facebook login is enabled. */
    facebook_login: boolean;
    /** Flag indicating whether Google login is enabled. */
    google_login: boolean;
    /** Flag indicating whether Twitter login is enabled. */
    twitter_login: boolean;
    /** Flag indicating whether Microsoft login is enabled. */
    microsoft_login: boolean;
    /** Flag indicating whether LinkedIn login is enabled. */
    linkedin_login: boolean;
}>;
export default _default;
