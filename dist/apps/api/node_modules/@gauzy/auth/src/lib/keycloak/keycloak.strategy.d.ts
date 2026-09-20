import { ConfigService } from '@nestjs/config';
import { StrategyOptions } from 'passport-keycloak-oauth2-oidc';
declare const KeycloakStrategy_base: new (...args: any) => any;
export declare class KeycloakStrategy extends KeycloakStrategy_base {
    protected readonly configService: ConfigService;
    constructor(configService: ConfigService);
    /**
     * Validates the provided tokens and user profile from the OAuth provider.
     *
     * @param _request - The HTTP request object.
     * @param accessToken - The access token from the provider.
     * @param refreshToken - The refresh token from the provider.
     * @param profile - The user profile information.
     * @param done - The callback function to return the user or an error.
     */
    validate(_request: any, accessToken: string, refreshToken: string, profile: any, done: (err: unknown, user?: unknown) => void): Promise<void>;
}
/**
 * Parses and returns the Keycloak configuration from the provided ConfigService.
 *
 * @param configService - The configuration service instance.
 * @returns A Keycloak configuration object.
 */
export declare const parseKeycloakConfig: (configService: ConfigService) => StrategyOptions;
export {};
