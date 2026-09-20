import { ApplicationPluginConfig } from '@gauzy/common';
/**
 * Seeds data for a specified module using the provided configuration.
 *
 * This function dynamically executes a seeding method in the `SeedDataService`
 * based on the module name provided as a command-line argument. The method must
 * exist in the `SeedDataService` and be named in the format `run<ModuleName>Seed`.
 *
 * @param {Partial<ApplicationPluginConfig>} devConfig - The development configuration
 *        for plugins, which will be registered before running the seeding process.
 * @returns {Promise<void>} - A promise that resolves when the seeding process is complete.
 *
 * ## Usage:
 * Run the command with `yarn` and specify the module name:
 * ```
 * yarn seed:module All
 * yarn seed:module Default
 * yarn seed:module Jobs
 * yarn seed:module Reports
 * yarn seed:module Ever
 * ```
 */
export declare function seedModule(devConfig: Partial<ApplicationPluginConfig>): Promise<void>;
