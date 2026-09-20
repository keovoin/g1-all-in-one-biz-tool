import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Profile, Strategy, StrategyOptionsWithRequest } from 'passport-github2';
declare const GithubStrategy_base: new (...args: [options: StrategyOptionsWithRequest] | [options: import("passport-github2").StrategyOptions]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class GithubStrategy extends GithubStrategy_base {
    protected readonly configService: ConfigService;
    constructor(configService: ConfigService);
    /**
     * Validate user profile after OAuth2 authentication.
     * @param _request - The Express request object.
     * @param _accessToken - The access token obtained from the OAuth2 provider.
     * @param _refreshToken - The refresh token obtained from the OAuth2 provider.
     * @param profile - The user's profile information obtained from the OAuth2 provider.
     * @param done - Passport callback function to indicate success or failure.
     */
    validate(_request: Request, _accessToken: string, _refreshToken: string, profile: Profile, done: (error: any, user: any, info?: any) => void): Promise<void>;
}
/**
 * Parses the GitHub OAuth configuration using the provided ConfigService.
 *
 * Retrieves the GitHub client ID, client secret, callback URL, user agent, and additional parameters
 * from the configuration. If any required configuration is missing, a warning is logged and defaults are applied.
 *
 * @param configService - An instance of the ConfigService to access application configuration.
 * @returns An object containing the GitHub OAuth configuration.
 */
export declare const parseGithubConfig: (configService: ConfigService) => StrategyOptionsWithRequest;
export {};
