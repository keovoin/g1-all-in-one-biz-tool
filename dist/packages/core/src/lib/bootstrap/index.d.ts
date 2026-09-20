/**
 * Start tracing using if OTEL is enabled.
 */
export declare function startTracing(): void;
import { INestApplication, Type } from '@nestjs/common';
import { ApplicationPluginConfig } from '@gauzy/common';
/**
 * Bootstrap the NestJS application, configuring various settings and initializing the server.
 *
 * @param pluginConfig - Optional plugin configuration.
 * @returns A promise that resolves to the initialized NestJS application.
 */
export declare function bootstrap(pluginConfig?: Partial<ApplicationPluginConfig>): Promise<INestApplication>;
/** The only Cross-Origin-Resource-Policy values helmet accepts. */
declare const CORP_POLICIES: readonly ["same-origin", "same-site", "cross-origin"];
export type CorpPolicy = (typeof CORP_POLICIES)[number];
/**
 * Resolves the Cross-Origin-Resource-Policy from the environment, falling back to the per-environment
 * default. The value is VALIDATED rather than asserted: helmet throws while initializing on an
 * unknown policy, so a typo in `CORP_POLICY` would stop the API from starting at all.
 *
 * @param value - The raw `CORP_POLICY` environment value.
 * @param isProduction - Whether the API runs in production.
 * @returns A policy helmet accepts.
 */
export declare function resolveCorpPolicy(value: string | undefined, isProduction: boolean): CorpPolicy;
/**
 * Registers a plugin configuration, applying pre-bootstrap operations to ensure it's ready for use.
 *
 * @param config - The partial application configuration to be pre-bootstrapped.
 * @returns A promise that resolves to the pre-bootstrapped application configuration.
 */
export declare function registerPluginConfig(config: Partial<ApplicationPluginConfig>): Promise<ApplicationPluginConfig>;
/**
 * Prepares the application configuration before initializing plugins.
 * Configures migration settings, registers entities and subscribers,
 * and applies additional plugin configurations.
 *
 * @param applicationConfig - The initial application configuration.
 * @returns A promise that resolves to the final application configuration after pre-bootstrap operations.
 */
export declare function preBootstrapApplicationConfig(applicationConfig: Partial<ApplicationPluginConfig>): Promise<ApplicationPluginConfig>;
/**
 * Register entities from core and plugin configurations.
 * Ensures no conflicts between core entities and plugin entities.
 *
 * Uses a Set for O(1) conflict detection instead of Array.some() which is O(n).
 *
 * @param config - Plugin configuration containing plugin entities.
 * @returns A promise that resolves to an array of registered entity types.
 * @throws ConflictException if a plugin entity conflicts with a core entity.
 */
export declare function preBootstrapRegisterEntities(config: Partial<ApplicationPluginConfig>): Promise<Array<Type<any>>>;
/**
 * Gets the migrations directory and CLI migration paths.
 *
 * @returns An object containing paths for migrations and CLI migrations directory.
 */
export declare function getMigrationsConfig(): {
    migrations: string[];
    cli: {
        migrationsDir: string;
    };
};
export {};
