import { DataSource } from 'typeorm';
import { ApplicationPluginConfig } from '@gauzy/common';
import { IMigrationOptions } from './migration-interface';
/**
 * @description
 * Run pending database migrations. See [TypeORM migration docs](https://typeorm.io/#/migrations)
 *
 * @param pluginConfig - Partial application plugin config
 */
export declare function runDatabaseMigrations(pluginConfig: Partial<ApplicationPluginConfig>): Promise<void>;
/**
 * @description
 * Reverts last applied database migration. See [TypeORM migration docs](https://typeorm.io/#/migrations)
 *
 * @param pluginConfig - Partial application plugin config
 */
export declare function revertLastDatabaseMigration(pluginConfig: Partial<ApplicationPluginConfig>): Promise<void>;
/**
 * @description
 * Generates a new migration file with SQL required to update the schema.
 *
 * @param pluginConfig - Partial application plugin configuration
 * @param options - Migration generation options including name and output directory
 */
export declare function generateMigration(pluginConfig: Partial<ApplicationPluginConfig>, options: IMigrationOptions): Promise<void>;
/**
 * Resolves the directory where migration files should be generated.
 *
 * @param options - Migration options that may include a `dir` path
 * @param config - Plugin configuration containing possible CLI migration settings
 * @returns The resolved directory path or `undefined` if not found
 */
export declare function resolveMigrationDirectory(options: IMigrationOptions, config: Partial<ApplicationPluginConfig>): string | undefined;
/**
 * @description
 * Creates a new blank migration file to be used for schema changes.
 *
 * @param pluginConfig - Partial application plugin configuration
 * @param options - Migration creation options including name and optional directory
 */
export declare function createMigration(pluginConfig: Partial<ApplicationPluginConfig>, options: IMigrationOptions): Promise<void>;
/**
 * @description
 * Initializes a new database connection. See [TypeORM migration docs](https://typeorm.io/#/connection)
 *
 * @param config - Partial application plugin configuration
 * @returns An initialized TypeORM DataSource instance
 */
export declare function initializeDatabaseConnection(config: Partial<ApplicationPluginConfig>): Promise<DataSource>;
/**
 * @description
 * Gracefully shuts down the database connection after use.
 *
 * @param dataSource - An initialized TypeORM DataSource
 */
export declare function shutdownDatabaseConnection(dataSource: DataSource): Promise<void>;
