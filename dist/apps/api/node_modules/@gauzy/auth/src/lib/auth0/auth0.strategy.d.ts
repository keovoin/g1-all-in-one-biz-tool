import { ConfigService } from '@gauzy/config';
declare const Auth0Strategy_base: new (...args: any) => any;
export declare class Auth0Strategy extends Auth0Strategy_base {
    readonly configService: ConfigService;
    constructor(configService: ConfigService);
}
/**
 * Generates the configuration object for Auth0 authentication.
 *
 * @param {ConfigService} configService - The configuration service instance.
 * @returns {Record<string, string>} - The Auth0 configuration object.
 * @throws {Error} If required Auth0 configuration values are missing.
 */
export declare const parseAuth0Config: (configService: ConfigService) => Record<string, string>;
export {};
