import { DynamicModule, FactoryProvider, ModuleMetadata } from '@nestjs/common';
import { ITokenConfig } from './interfaces';
type TokenProviderToken = string | symbol;
type AsyncInjectTokens = NonNullable<FactoryProvider['inject']>;
type TokenConfigFactory = (...args: unknown[]) => Promise<ITokenConfig> | ITokenConfig;
type TokenSecretFactory = (...args: unknown[]) => Promise<string> | string;
export interface TokenModuleOptions {
    enableScheduler?: boolean;
}
export interface TokenModuleFeatureOptions {
    /**
     * Token configuration for this feature module
     */
    config: ITokenConfig;
    /**
     * JWT secret for this token type
     * If not provided, uses the global JWT_SECRET from environment
     */
    jwtSecret?: string;
    /**
     * Injection token for the scoped service
     * Example: 'REFRESH_TOKEN_SERVICE'
     * Default: {tokenType}_SERVICE
     */
    serviceToken?: string | symbol;
    /**
     * Injection token for the scoped config
     * Example: 'REFRESH_TOKEN_CONFIG'
     * Default: {tokenType}_CONFIG
     */
    configToken?: TokenProviderToken;
    /**
     * Injection token for the scoped JWT service
     * Example: 'REFRESH_TOKEN_JWT_SERVICE'
     * Default: {tokenType}_JWT_SERVICE
     */
    jwtServiceToken?: string | symbol;
}
export interface TokenModuleFeatureAsyncOptions {
    imports?: ModuleMetadata['imports'];
    inject?: AsyncInjectTokens;
    useFactory: TokenConfigFactory;
    jwtSecret?: string | TokenSecretFactory;
    serviceToken?: TokenProviderToken;
    configToken?: TokenProviderToken;
    jwtServiceToken?: TokenProviderToken;
}
export declare class TokenModule {
    private static buildBaseProviders;
    private static buildFeatureImports;
    private static buildScopedConfigProvider;
    private static buildScopedJwtProviders;
    private static buildJwtRegistrationProvider;
    private static buildScopedProviders;
    private static importScheduler;
    /**
     * Register token module with options
     */
    static forRoot(options?: TokenModuleOptions): DynamicModule;
    /**
     * Register token module for feature modules with factory-based configuration
     *
     * @example Basic usage without configuration (old style)
     * ```typescript
     * @Module({
     *   imports: [TokenModule.forFeature()],
     * })
     * export class MyModule {}
     * ```
     *
     * @example With scoped configuration (new style - RECOMMENDED)
     * ```typescript
     * @Module({
     *   imports: [
     *     TokenModule.forFeature({
     *       config: {
     *         tokenType: 'REFRESH_TOKEN',
     *         expirationMs: 30 * 24 * 60 * 60 * 1000,
     *         allowRotation: true,
     *         allowMultipleSessions: false,
     *       },
     *       jwtSecret: process.env.REFRESH_TOKEN_SECRET, // Custom JWT secret
     *       serviceToken: 'REFRESH_TOKEN_SERVICE',
     *       configToken: 'REFRESH_TOKEN_CONFIG',
     *     }),
     *   ],
     * })
     * export class RefreshTokenModule {}
     * ```
     */
    static forFeature(options?: TokenModuleFeatureOptions): DynamicModule;
    /**
     * Register token module for feature modules with async configuration
     *
     * @example Async configuration with ConfigService
     * ```typescript
     * @Module({
     *   imports: [
     *     TokenModule.forFeatureAsync({
     *       imports: [ConfigModule],
     *       inject: [ConfigService],
     *       useFactory: (configService: ConfigService) => ({
     *         tokenType: 'REFRESH_TOKEN',
     *         expirationMs: 30 * 24 * 60 * 60 * 1000,
     *         allowRotation: true,
     *         allowMultipleSessions: false,
     *       }),
     *       jwtSecret: (configService: ConfigService) =>
     *         configService.get('REFRESH_TOKEN_SECRET'),
     *       serviceToken: 'REFRESH_TOKEN_SERVICE',
     *     }),
     *   ],
     * })
     * export class RefreshTokenModule {}
     * ```
     */
    static forFeatureAsync(options: TokenModuleFeatureAsyncOptions): DynamicModule;
}
export {};
