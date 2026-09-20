"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const dev_config_1 = require("../dev-config");
const migration_executor_1 = require("./migration-executor");
yargs
    .command({
    command: 'migration:run',
    describe: 'Runs all pending migrations command.',
    // function for your command
    handler() {
        (0, migration_executor_1.runDatabaseMigrations)(dev_config_1.devConfig);
    }
})
    .command({
    command: 'migration:revert',
    describe: 'Reverts last migration command.',
    // function for your command
    handler() {
        (0, migration_executor_1.revertLastDatabaseMigration)(dev_config_1.devConfig);
    }
})
    .command({
    command: 'migration:generate',
    describe: 'Generates a new migration file with sql needs to be executed to update schema.',
    builder: {
        n: {
            alias: 'name',
            describe: 'Name of the migration class.',
            type: 'string',
            require: true
        },
        d: {
            alias: 'dir',
            describe: 'Directory where migration should be created.'
        }
    },
    // function for your command
    handler(argv) {
        const name = argv['name'];
        (0, migration_executor_1.generateMigration)(dev_config_1.devConfig, { name });
    }
})
    .command({
    command: 'migration:create',
    describe: 'Create a new blank migration file to be executed to create/update schema.',
    builder: {
        n: {
            alias: 'name',
            describe: 'Name of the migration class.',
            type: 'string',
            require: true
        },
        d: {
            alias: 'dir',
            describe: 'Directory where migration should be created.'
        }
    },
    // function for your command
    handler(argv) {
        const name = argv['name'];
        (0, migration_executor_1.createMigration)(dev_config_1.devConfig, { name });
    }
})
    .argv; // To set above changes
//# sourceMappingURL=migration.js.map