"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenamedTaskStatusTable1674749291896 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class RenamedTaskStatusTable1674749291896 {
    constructor() {
        this.name = 'RenamedTaskStatusTable1674749291896';
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
                await this.sqliteUpQueryRunner(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.postgres:
                await this.postgresUpQueryRunner(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.mysql:
                await this.mysqlUpQueryRunner(queryRunner);
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
    async down(queryRunner) {
        switch (queryRunner.dataSource.options.type) {
            case config_1.DatabaseTypeEnum.sqlite:
            case config_1.DatabaseTypeEnum.betterSqlite3:
                await this.sqliteDownQueryRunner(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.postgres:
                await this.postgresDownQueryRunner(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.mysql:
                await this.mysqlDownQueryRunner(queryRunner);
                break;
            default:
                throw Error(`Unsupported database: ${queryRunner.dataSource.options.type}`);
        }
    }
    /**
    * Sqlite Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        await queryRunner.query(`ALTER TABLE "status" RENAME TO "task_status"`);
    }
    /**
    * Sqlite Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "task_status" RENAME TO "status"`);
    }
    /**
    * Postgres Up Migration
    *
    * @param queryRunner
    */
    async postgresUpQueryRunner(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        await queryRunner.query(`ALTER TABLE "status" RENAME TO "task_status"`);
    }
    /**
    * postgres Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "task_status" RENAME TO "status"`);
    }
    /**
     * MySQL Up Migration
     *
     * @param queryRunner
     */
    async mysqlUpQueryRunner(queryRunner) { }
    /**
     * MySQL Down Migration
     *
     * @param queryRunner
     */
    async mysqlDownQueryRunner(queryRunner) { }
}
exports.RenamedTaskStatusTable1674749291896 = RenamedTaskStatusTable1674749291896;
//# sourceMappingURL=1674749291896-RenamedTaskStatusTable.js.map