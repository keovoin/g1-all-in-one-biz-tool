"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const better_sqlite_1 = require("@mikro-orm/better-sqlite");
const postgresql_1 = require("@mikro-orm/postgresql");
const mysql_1 = require("@mikro-orm/mysql");
const nest_knexjs_1 = require("nest-knexjs");
const config_1 = require("@gauzy/config");
const connection_entity_manager_1 = require("./connection-entity-manager");
/**
 * Resolves the MikroORM driver class based on the DB_TYPE environment variable.
 * Defaults to BetterSqliteDriver (matching the default DB_TYPE in database config).
 */
const mikroOrmDriverMap = {
    [config_1.DatabaseTypeEnum.postgres]: postgresql_1.PostgreSqlDriver,
    [config_1.DatabaseTypeEnum.mysql]: mysql_1.MySqlDriver,
    [config_1.DatabaseTypeEnum.sqlite]: better_sqlite_1.BetterSqliteDriver,
    [config_1.DatabaseTypeEnum.betterSqlite3]: better_sqlite_1.BetterSqliteDriver
};
const mikroOrmDriver = mikroOrmDriverMap[process.env.DB_TYPE] || better_sqlite_1.BetterSqliteDriver;
/**
 * Import and provide base typeorm related classes.
 *
 * @module
 */
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            /**
             * Configuration for MikroORM database connection.
             *
             * @type {MikroORMModuleOptions}
             */
            nestjs_1.MikroOrmModule.forRootAsync({
                // Explicit driver option required by @mikro-orm/nestjs v6+ when using useFactory + inject.
                // See: https://github.com/mikro-orm/nestjs/pull/204
                driver: mikroOrmDriver,
                // Use useFactory, useClass, or useExisting
                useFactory: async (configService) => {
                    const dbMikroOrmConnectionOptions = configService.getConfigValue('dbMikroOrmConnectionOptions');
                    return dbMikroOrmConnectionOptions;
                },
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService]
            }),
            /**
             * Configuration for TypeORM database connection.
             *
             * @type {TypeOrmModuleOptions}
             */
            typeorm_1.TypeOrmModule.forRootAsync({
                // Use useFactory, useClass, or useExisting
                useFactory: async (configService) => {
                    const dbConnectionOptions = configService.getConfigValue('dbConnectionOptions');
                    return dbConnectionOptions;
                },
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService]
            }),
            /**
             * Configure the Knex.js module for the application using asynchronous options.
             */
            nest_knexjs_1.KnexModule.forRootAsync({
                // Use useFactory, useClass, or useExisting
                useFactory: async (configService) => {
                    const dbKnexConnectionOptions = configService.getConfigValue('dbKnexConnectionOptions');
                    return dbKnexConnectionOptions;
                },
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService]
            })
        ],
        providers: [connection_entity_manager_1.ConnectionEntityManager],
        exports: [connection_entity_manager_1.ConnectionEntityManager]
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map