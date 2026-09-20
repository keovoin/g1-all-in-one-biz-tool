import { ConfigService } from '@nestjs/config';
import { Strategy, StrategyOptionsWithRequest, VerifyCallback } from 'passport-google-oauth20';
declare const GoogleStrategy_base: new (...args: [options: StrategyOptionsWithRequest] | [options: import("passport-google-oauth20").StrategyOptions] | [options: import("passport-google-oauth20").StrategyOptions] | [options: StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class GoogleStrategy extends GoogleStrategy_base {
    protected readonly configService: ConfigService;
    constructor(configService: ConfigService);
    /**
     * Validates the OAuth profile and constructs a simplified user object.
     *
     * @param request - The incoming request object.
     * @param accessToken - The OAuth access token.
     * @param refreshToken - The OAuth refresh token.
     * @param profile - The user profile provided by the OAuth provider.
     * @param done - The callback to be invoked with the result.
     * @returns A Promise that resolves once validation is complete.
     */
    validate(request: any, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<void>;
}
/**
 * Parses the Google OAuth configuration using the provided ConfigService.
 *
 * Retrieves the Google client ID, client secret, and callback URL from the configuration.
 * If any required configuration is missing, a warning is logged and default values are applied.
 *
 * @param configService - An instance of ConfigService to access application configuration.
 * @returns An object containing the Google OAuth configuration parameters.
 */
export declare const parseGoogleConfig: (configService: ConfigService) => StrategyOptionsWithRequest;
export {};
