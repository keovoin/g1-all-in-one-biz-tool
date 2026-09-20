"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedDefaultGlobalTaskPriorityAndSize1674638501088 = void 0;
const chalk = require("chalk");
const uuid_1 = require("uuid");
const default_global_priorities_1 = require("../../tasks/priorities/default-global-priorities");
const default_global_sizes_1 = require("../../tasks/sizes/default-global-sizes");
const config_1 = require("@gauzy/config");
class SeedDefaultGlobalTaskPriorityAndSize1674638501088 {
    constructor() {
        this.name = 'SeedDefaultGlobalTaskPriorityAndSize1674638501088';
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
                await this.sqliteSeedDefaultTaskPriorities(queryRunner);
                await this.sqliteSeedDefaultTaskSizes(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.postgres:
                await this.postgresSeedDefaultTaskPriorities(queryRunner);
                await this.postgresSeedDefaultTaskSizes(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.mysql:
                await this.mysqlSeedDefaultTastPriorities(queryRunner);
                await this.mysqlSeedDefaultTaskSizes(queryRunner);
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
     * Sqlite default task priorities
     *
     * @param queryRunner
     */
    async sqliteSeedDefaultTaskPriorities(queryRunner) {
        try {
            const DEFAULT_GLOBAL_PRIORITIES_SQLITE = default_global_priorities_1.DEFAULT_GLOBAL_PRIORITIES.map((priority) => {
                return {
                    ...priority,
                    isSystem: 1 // Transform boolean true to integer 1
                };
            });
            for await (const priority of DEFAULT_GLOBAL_PRIORITIES_SQLITE) {
                const payload = Object.values(priority);
                payload.push((0, uuid_1.v4)());
                const query = `INSERT INTO "task_priority" ("name", "value", "description", "icon", "color", "isSystem", "id") VALUES(?, ?, ?, ?, ?, ?, ?)`;
                await queryRunner.dataSource.manager.query(query, payload);
            }
        }
        catch (error) {
            // since we have errors let's rollback changes we made
            console.log('Error while insert default global task priorities in production server', error);
        }
    }
    /**
     * Sqlite default task sizes
     *
     * @param queryRunner
     */
    async sqliteSeedDefaultTaskSizes(queryRunner) {
        try {
            const DEFAULT_GLOBAL_SIZES_SQLITE = default_global_sizes_1.DEFAULT_GLOBAL_SIZES.map((priority) => {
                return {
                    ...priority,
                    isSystem: 1 // Transform boolean true to integer 1
                };
            });
            for await (const size of DEFAULT_GLOBAL_SIZES_SQLITE) {
                const payload = Object.values(size);
                payload.push((0, uuid_1.v4)());
                const query = `INSERT INTO "task_size" ("name", "value", "description", "icon", "color", "isSystem", "id") VALUES(?, ?, ?, ?, ?, ?, ?)`;
                await queryRunner.dataSource.manager.query(query, payload);
            }
        }
        catch (error) {
            // since we have errors let's rollback changes we made
            console.log('Error while insert default global task sizes in production server', error);
        }
    }
    /**
     * Postgres default task priorities
     *
     * @param queryRunner
     */
    async postgresSeedDefaultTaskPriorities(queryRunner) {
        try {
            for await (const priority of default_global_priorities_1.DEFAULT_GLOBAL_PRIORITIES) {
                const payload = Object.values(priority);
                const query = `INSERT INTO "task_priority" ("name", "value", "description", "icon", "color", "isSystem") VALUES($1, $2, $3, $4, $5, $6)`;
                await queryRunner.dataSource.manager.query(query, payload);
            }
        }
        catch (error) {
            // since we have errors let's rollback changes we made
            console.log('Error while insert default global task priorities in production server', error);
        }
    }
    /**
     * Postgres default task sizes
     *
     * @param queryRunner
     */
    async postgresSeedDefaultTaskSizes(queryRunner) {
        try {
            for await (const size of default_global_sizes_1.DEFAULT_GLOBAL_SIZES) {
                const payload = Object.values(size);
                const query = `INSERT INTO "task_size" ("name", "value", "description", "icon", "color", "isSystem") VALUES($1, $2, $3, $4, $5, $6)`;
                await queryRunner.dataSource.manager.query(query, payload);
            }
        }
        catch (error) {
            // since we have errors let's rollback changes we made
            console.log('Error while insert default global task sizes in production server', error);
        }
    }
    /**
     * MySQL default task priorities
     *
     * @param queryRunner
     */
    async mysqlSeedDefaultTastPriorities(queryRunner) {
    }
    /**
     * MySQL default task sizes
     *
     * @param queryRunner
     */
    async mysqlSeedDefaultTaskSizes(queryRunner) {
    }
}
exports.SeedDefaultGlobalTaskPriorityAndSize1674638501088 = SeedDefaultGlobalTaskPriorityAndSize1674638501088;
//# sourceMappingURL=1674638501088-SeedDefaultGlobalTaskPriorityAndSize.js.map