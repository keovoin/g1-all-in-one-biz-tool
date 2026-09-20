import { DynamicModule, Type } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { KnexModuleOptions } from 'nest-knexjs';
import { ApplicationPluginConfig, ApiServerConfigurationOptions, AssetConfigurationOptions, GraphqlConfigurationOptions } from '@gauzy/common';
import { IEnvironment } from './environments/ienvironment';
export declare class ConfigService {
    private readonly environment;
    private readonly logger;
    private config;
    constructor();
    /**
     * Initializes the configuration and environment variables.
     * Uses an async method since constructors cannot be async.
     */
    private initConfig;
    /**
     * Retrieves the entire configuration object as a read-only copy.
     *
     * @returns {Readonly<Partial<ApplicationPluginConfig>>} - The entire configuration object.
     */
    getConfig(): Readonly<Partial<ApplicationPluginConfig>>;
    /**
     * Retrieves a specific configuration value from the application configuration.
     *
     * @param {keyof ApplicationPluginConfig} key - The configuration key to fetch.
     * @returns {Readonly<ApplicationPluginConfig[keyof ApplicationPluginConfig]>} - The requested configuration value.
     */
    getConfigValue<K extends keyof ApplicationPluginConfig>(key: K): Readonly<ApplicationPluginConfig[K]>;
    /**
     * Get the API server configuration options.
     */
    get apiConfigOptions(): Readonly<ApiServerConfigurationOptions>;
    /**
     * Get the GraphQL configuration options.
     */
    get graphqlConfigOptions(): Readonly<GraphqlConfigurationOptions>;
    /**
     * Get the TypeORM connection options.
     */
    get dbConnectionOptions(): Readonly<TypeOrmModuleOptions>;
    /**
     * Get the MikroORM connection options.
     */
    get dbMikroOrmConnectionOptions(): Readonly<MikroOrmModuleOptions>;
    /**
     * Get the Knex connection options.
     */
    get dbKnexConnectionOptions(): Readonly<KnexModuleOptions>;
    /**
     * Get the plugins configuration.
     */
    get plugins(): Array<Type<any> | DynamicModule>;
    /**
     * Get the asset configuration options.
     */
    get assetOptions(): Readonly<AssetConfigurationOptions>;
    /**
     * Retrieves an environment variable value with proper type inference.
     *
     * @param {K} key - The environment variable key.
     * @returns {IEnvironment[K]} - The corresponding environment value.
     * @throws {Error} If the key does not exist in the environment.
     */
    get<K extends keyof IEnvironment>(key: K): IEnvironment[K];
    /**
     * Check if the application is running in production mode.
     *
     * @returns `true` if production mode, otherwise `false`.
     */
    isProd(): boolean;
}
