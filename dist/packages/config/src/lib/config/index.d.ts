/**
 * This array contains individual configuration modules for different social login providers.
 */
declare const _default: (((() => {
    app_name: string;
    app_logo: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    app_name: string;
    app_logo: string;
}>) | ((() => import("dist/packages/common/src").IFacebookConfig) & import("@nestjs/config").ConfigFactoryKeyHost<import("dist/packages/common/src").IFacebookConfig>) | ((() => {
    app_name: string;
    app_id: string;
    debug: boolean;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    app_name: string;
    app_id: string;
    debug: boolean;
}>) | ((() => {
    email_password_login: boolean;
    magic_login: boolean;
    github_login: boolean;
    facebook_login: boolean;
    google_login: boolean;
    twitter_login: boolean;
    microsoft_login: boolean;
    linkedin_login: boolean;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    email_password_login: boolean;
    magic_login: boolean;
    github_login: boolean;
    facebook_login: boolean;
    google_login: boolean;
    twitter_login: boolean;
    microsoft_login: boolean;
    linkedin_login: boolean;
}>) | ((() => import("dist/packages/common/src").ITwitterConfig) & import("@nestjs/config").ConfigFactoryKeyHost<import("dist/packages/common/src").ITwitterConfig>) | ((() => import("dist/packages/common/src").IJiraIntegrationConfig) & import("@nestjs/config").ConfigFactoryKeyHost<import("dist/packages/common/src").IJiraIntegrationConfig>) | ((() => import("dist/packages/common/src").IZapierConfig) & import("@nestjs/config").ConfigFactoryKeyHost<import("dist/packages/common/src").IZapierConfig>))[];
export default _default;
