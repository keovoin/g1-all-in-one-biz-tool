import { ConfigService } from '@nestjs/config';
declare const LinkedinStrategy_base: new (...args: any) => any;
export declare class LinkedinStrategy extends LinkedinStrategy_base {
    protected readonly configService: ConfigService;
    constructor(configService: ConfigService);
    /**
     * Validates the provided OAuth profile and constructs a simplified user object.
     *
     * This function extracts the user's email(s) from the OAuth profile and combines it
     * with the access token. If validation succeeds, the user object is passed to the callback.
     * Otherwise, the error is forwarded to the callback.
     *
     * @param _request - The incoming request object.
     * @param accessToken - The OAuth access token.
     * @param refreshToken - The OAuth refresh token.
     * @param profile - The user profile returned by the OAuth provider.
     * @param done - The callback to be invoked with either an error or the user object.
     * @returns A promise that resolves when the validation process is complete.
     */
    validate(_request: any, accessToken: string, refreshToken: string, profile: any, done: (err: unknown, user?: unknown) => void): Promise<void>;
}
/**
 * Parses the LinkedIn OAuth configuration using the provided ConfigService.
 *
 * Retrieves the LinkedIn client ID, client secret, callback URL, and other related settings
 * from the configuration. If any required configuration is missing, a warning is logged and default values are applied.
 *
 * @param configService - An instance of the ConfigService used to access application configuration.
 * @returns An object containing the LinkedIn OAuth configuration parameters.
 */
export declare const parseLinkedinConfig: (configService: ConfigService) => Record<string, any>;
export {};
