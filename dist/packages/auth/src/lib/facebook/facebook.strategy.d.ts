import { ConfigService } from '@nestjs/config';
import { Profile, Strategy, StrategyOptions } from 'passport-facebook';
declare const FacebookStrategy_base: new (...args: [options: import("passport-facebook").StrategyOptionsWithRequest] | [options: StrategyOptions]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class FacebookStrategy extends FacebookStrategy_base {
    readonly configService: ConfigService;
    constructor(configService: ConfigService);
    /**
     * Validates and extracts user information from Facebook OAuth profile.
     *
     * This method is called after successful authentication with Facebook.
     * It processes the profile data and constructs a user object.
     *
     * @param {string} accessToken - The OAuth access token received from Facebook.
     * @param {string} refreshToken - The refresh token (not used in Facebook OAuth).
     * @param {Profile} profile - The Facebook user's profile data.
     * @param {(err: any, user?: any, info?: any) => void} done - Callback function to indicate authentication success or failure.
     *
     * @returns {Promise<void>} - Resolves after processing the user profile.
     */
    validate(accessToken: string, refreshToken: string, profile: Profile, done: (err: any, user?: any, info?: any) => void): Promise<void>;
}
/**
 * Generates the configuration object for Facebook OAuth authentication.
 *
 * @param {ConfigService} configService - The configuration service instance.
 * @returns {StrategyOption} - The Facebook OAuth configuration object.
 */
export declare const parseFacebookConfig: (configService: ConfigService) => StrategyOptions;
export {};
