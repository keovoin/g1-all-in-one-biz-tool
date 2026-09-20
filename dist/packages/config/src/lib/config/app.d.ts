/**
 * Application Configuration
 *
 * Defines configuration settings for the application using the @nestjs/config library.
 * This configuration includes properties such as the application name and logo URL.
 * The configuration values are retrieved from environment variables, with default values provided.
 *
 * @returns An object representing the application configuration.
 */
declare const _default: (() => {
    /**
     * The name of the application.
     * If not provided through the environment variable APP_NAME, defaults to 'Sastra Solution'.
     */
    app_name: string;
    /**
     * The URL of the application's logo.
     * If not provided through the environment variable APP_LOGO,
     * defaults to a URL constructed using the CLIENT_BASE_URL environment variable.
     */
    app_logo: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    /**
     * The name of the application.
     * If not provided through the environment variable APP_NAME, defaults to 'Sastra Solution'.
     */
    app_name: string;
    /**
     * The URL of the application's logo.
     * If not provided through the environment variable APP_LOGO,
     * defaults to a URL constructed using the CLIENT_BASE_URL environment variable.
     */
    app_logo: string;
}>;
export default _default;
