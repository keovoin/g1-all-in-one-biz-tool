import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { StrategyOptionsWithRequest } from 'passport-microsoft';
declare const MicrosoftStrategy_base: new (...args: any) => any;
export declare class MicrosoftStrategy extends MicrosoftStrategy_base {
    protected readonly configService: ConfigService;
    private readonly _httpService;
    constructor(configService: ConfigService, _httpService: HttpService);
    /**
     * Validates the provided tokens and retrieves the user's profile information
     * from the Microsoft Graph API.
     *
     * @param accessToken - The access token for Microsoft Graph API.
     * @param refreshToken - The refresh token (unused in this example).
     * @param profile - The initial profile information (may be overwritten).
     * @param done - The callback to pass either the error or the user object.
     */
    validate(accessToken: string, refreshToken: string, profile: any, done: (error: any, user: any, info?: any) => void): Promise<void>;
}
/**
 * Parses the Microsoft OAuth configuration using the provided ConfigService.
 *
 * Retrieves the Microsoft OAuth client ID, client secret, callback URL,
 * authorization URL, and token URL from the configuration service.
 * If any required configuration values are missing, a warning is logged and default values are applied.
 *
 * @param configService - An instance of ConfigService to access configuration values.
 * @returns An object containing the Microsoft OAuth configuration parameters.
 */
export declare const parseMicrosoftConfig: (configService: ConfigService) => StrategyOptionsWithRequest;
export {};
