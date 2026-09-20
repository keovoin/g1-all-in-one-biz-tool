"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedModule = seedModule;
// Modified code from https://github.com/alexitaylor/angular-graphql-nestjs-postgres-starter-kit.
// MIT License, see https://github.com/alexitaylor/angular-graphql-nestjs-postgres-starter-kit/blob/master/LICENSE
// Copyright (c) 2019 Alexi Taylor
const core_1 = require("@nestjs/core");
const yargs = require("yargs");
const chalk = require("chalk");
const bootstrap_1 = require("./../../bootstrap");
const seed_data_service_1 = require("./seed-data.service");
const seeder_module_1 = require("./seeder.module");
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
async function seedModule(devConfig) {
    try {
        // Register the plugin configuration
        await (0, bootstrap_1.registerPluginConfig)(devConfig);
        // Create the application context
        const app = await core_1.NestFactory.createApplicationContext(seeder_module_1.SeederModule.forPlugins(), {
            logger: ['log', 'error', 'warn', 'debug', 'verbose']
        });
        // Extract the module name from command-line arguments
        const { name: module } = yargs(process.argv).argv;
        if (!module) {
            console.log(chalk.red('No module name provided. Please specify a module name.'));
            await app.close();
            return;
        }
        // Build the seed method name dynamically
        const methodName = `run${module}Seed`;
        const seeder = app.get(seed_data_service_1.SeedDataService);
        // Check if the method exists in the SeedDataService
        if (typeof seeder[methodName] === 'function') {
            try {
                await seeder[methodName]();
                console.log(chalk.green(`Successfully ran seed method: ${methodName}`));
            }
            catch (error) {
                console.error(chalk.red(`Error executing ${methodName}: ${error.message}`));
                throw error;
            }
        }
        else {
            console.log(chalk.red(`Method ${methodName} not found in SeedDataService`));
        }
        // Close the application context
        await app.close();
    }
    catch (error) {
        console.error(chalk.red(`Failed to seed module: ${error.message}`));
        throw error;
    }
}
//# sourceMappingURL=seed-module.js.map