"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedDefaultGlobalTaskStatus1674044473393 = void 0;
const chalk = require("chalk");
const uuid_1 = require("uuid");
const default_global_statuses_1 = require("../../tasks/statuses/default-global-statuses");
const config_1 = require("@gauzy/config");
class SeedDefaultGlobalTaskStatus1674044473393 {
    constructor() {
        this.name = 'SeedDefaultGlobalTaskStatus1674044473393';
    }
    /**
     * Up Migration
     *
     * @param queryRunner
     */
    async up(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        switch (queryRunner.dataSource.options.type) {
            case config_1.DatabaseTypeEnum.sqlite:
            case config_1.DatabaseTypeEnum.betterSqlite3:
                await this.sqliteSeedDefaultTaskStatus(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.postgres:
                await this.postgresSeedDefaultTaskStatus(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.mysql:
                await this.mysqlSeedDefaultTaskStatus(queryRunner);
                break;
            default:
                throw Error(`Unsupported database: ${queryRunner.dataSource.options.type}`);
        }
    }
    /**
     * Down Migration
     *
     * @param queryRunner
     */
    async down(queryRunner) { }
    /**
     * Sqlite Seed Default task status
     *
     * @param queryRunner
     */
    async sqliteSeedDefaultTaskStatus(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        try {
            const DEFAULT_STATUSES = default_global_statuses_1.DEFAULT_GLOBAL_STATUSES.map(({ name, value, description, icon, color, isSystem }) => ({
                name,
                value,
                description,
                icon,
                color,
                isSystem
            }));
            const DEFAULT_STATUSES_SQLITE = DEFAULT_STATUSES.map((status) => ({
                ...status,
                isSystem: status.isSystem === true ? 1 : 0 // Transform boolean true to integer 1, if the given database connection type is SQLite.
            }));
            for await (const status of DEFAULT_STATUSES_SQLITE) {
                const payload = Object.values(status);
                payload.push((0, uuid_1.v4)());
                const query = `INSERT INTO "status" ("name", "value", "description", "icon", "color", "isSystem", "id") VALUES(?, ?, ?, ?, ?, ?, ?)`;
                await queryRunner.dataSource.manager.query(query, payload);
            }
        }
        catch (error) {
            // since we have errors let's rollback changes we made
            console.log('Error while insert default global task statuses in production server', error);
        }
    }
    /**
     * Postgres Seed default task status
     *
     * @param queryRunner
     */
    async postgresSeedDefaultTaskStatus(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        try {
            const DEFAULT_STATUSES = default_global_statuses_1.DEFAULT_GLOBAL_STATUSES.map(({ name, value, description, icon, color, isSystem }) => ({
                name,
                value,
                description,
                icon,
                color,
                isSystem
            }));
            for await (const status of DEFAULT_STATUSES) {
                const payload = Object.values(status);
                const query = `INSERT INTO "status" ("name", "value", "description", "icon", "color", "isSystem") VALUES($1, $2, $3, $4, $5, $6)`;
                await queryRunner.dataSource.manager.query(query, payload);
            }
        }
        catch (error) {
            // since we have errors let's rollback changes we made
            console.log('Error while insert default global task statuses in production server', error);
        }
    }
    /**
     * MySQL Seed default task status
     *
     * @param queryRunner
     */
    async mysqlSeedDefaultTaskStatus(queryRunner) { }
}
exports.SeedDefaultGlobalTaskStatus1674044473393 = SeedDefaultGlobalTaskStatus1674044473393;
//# sourceMappingURL=1674044473393-SeedDefaultGlobalTaskStatus.js.map