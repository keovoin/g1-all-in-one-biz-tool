import { Strategy, StrategyOptionsWithRequest } from 'passport-google-oauth20';
import { ConfigService } from '@gauzy/config';
declare const FiverrStrategy_base: new (...args: [options: StrategyOptionsWithRequest] | [options: import("passport-google-oauth20").StrategyOptions] | [options: import("passport-google-oauth20").StrategyOptions] | [options: StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class FiverrStrategy extends FiverrStrategy_base {
    readonly configService: ConfigService;
    constructor(configService: ConfigService);
    /**
     * Validates and extracts user information from Fiverr's OAuth profile.
     *
     * @param {any} profile - The user profile returned by Fiverr.
     * @param {Function} done - The callback function to complete authentication.
     */
    validate(profile: any, done: (error: any, user?: any) => void): Promise<void>;
}
/**
 * Retrieves the configuration for the Fiverr OAuth strategy.
 *
 * @param {ConfigService} configService - The configuration service instance.
 * @returns {StrategyOptionsWithRequest} - The configuration object for Fiverr authentication.
 */
export declare const parseFiverrConfig: (configService: ConfigService) => StrategyOptionsWithRequest;
export {};
