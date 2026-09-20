import { ConfigService } from '@nestjs/config';
declare const TwitterStrategy_base: new (...args: any) => any;
export declare class TwitterStrategy extends TwitterStrategy_base {
    protected readonly configService: ConfigService;
    constructor(configService: ConfigService);
    /**
     * Validates and extracts user information from Twitter OAuth profile.
     *
     * This method is called after successful authentication with Twitter.
     * It processes the profile data and constructs a user object.
     *
     * @param {string} accessToken - The OAuth access token received from Twitter.
     * @param {string} refreshToken - The refresh token (not used in Twitter OAuth).
     * @param {Profile} profile - The Twitter user's profile data.
     * @param {(err: any, user?: any, info?: any) => void} done - Callback function to indicate authentication success or failure.
     *
     * @returns {Promise<void>} - Resolves after processing the user profile.
     */
    validate(accessToken: string, refreshToken: string, profile: any, done: (err: any, user: any, info?: any) => void): Promise<void>;
}
/**
 * Parses the Twitter configuration using the provided ConfigService.
 *
 * Retrieves the consumer key, consumer secret, and callback URL for Twitter OAuth from the configuration.
 * If any of these values are missing, a warning is logged and default values are applied.
 *
 * @param configService - An instance of the ConfigService to access application configuration.
 * @returns An object containing the Twitter OAuth configuration.
 */
export declare const parseTwitterConfig: (configService: ConfigService) => Record<string, any>;
export {};
