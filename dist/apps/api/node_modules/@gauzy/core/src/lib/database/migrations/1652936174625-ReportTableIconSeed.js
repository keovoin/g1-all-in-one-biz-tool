"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportTableIconSeed1652936174625 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class ReportTableIconSeed1652936174625 {
    constructor() {
        this.name = 'ReportTableIconSeed1652936174625';
    }
    /**
     * Up Migration
     *
     * @param queryRunner
     */
    async up(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        switch (queryRunner.connection.options.type) {
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
                throw Error(`Unsupported database: ${queryRunner.connection.options.type}`);
        }
    }
    /**
     * Down Migration
     *
     * @param queryRunner
     */
    async down(queryRunner) {
        switch (queryRunner.connection.options.type) {
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
                throw Error(`Unsupported database: ${queryRunner.connection.options.type}`);
        }
    }
    async sqliteUpQueryRunner(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = ? WHERE "slug" = ?`, ['far fa-clock', 'time-activity']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = ? WHERE "slug" = ?`, ['fas fa-calendar-alt', 'weekly']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = ? WHERE "slug" = ?`, ['far fa-window-maximize', 'apps-urls']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = ? WHERE "slug" = ?`, ['far fa-window-maximize', 'manual-time-edits']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = ? WHERE "slug" = ?`, ['far fa-credit-card', 'expense']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = ? WHERE "slug" = ?`, ['far fa-credit-card', 'amounts-owed']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = ? WHERE "slug" = ?`, ['far fa-credit-card', 'payments']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = ? WHERE "slug" = ?`, ['far fa-clock', 'weekly-limits']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = ? WHERE "slug" = ?`, ['far fa-clock', 'daily-limits']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = ? WHERE "slug" = ?`, ['far fa-credit-card', 'project-budgets']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = ? WHERE "slug" = ?`, ['far fa-credit-card', 'client-budgets']);
    }
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = ? WHERE "slug" = ?`, ['clock-outline', 'time-activity']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = ? WHERE "slug" = ?`, ['calendar-outline', 'weekly']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = ? WHERE "slug" = ?`, ['browser-outline', 'apps-urls']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = ? WHERE "slug" = ?`, ['browser-outline', 'manual-time-edits']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = ? WHERE "slug" = ?`, ['credit-card-outline', 'expense']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = ? WHERE "slug" = ?`, ['credit-card-outline', 'amounts-owed']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = ? WHERE "slug" = ?`, ['credit-card-outline', 'payments']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = ? WHERE "slug" = ?`, ['clock-outline', 'weekly-limits']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = ? WHERE "slug" = ?`, ['clock-outline', 'daily-limits']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = ? WHERE "slug" = ?`, ['credit-card-outline', 'project-budgets']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = ? WHERE "slug" = ?`, ['credit-card-outline', 'client-budgets']);
    }
    async postgresUpQueryRunner(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = $1 WHERE "slug" = $2`, ['far fa-clock', 'time-activity']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = $1 WHERE "slug" = $2`, ['fas fa-calendar-alt', 'weekly']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = $1 WHERE "slug" = $2`, ['far fa-window-maximize', 'apps-urls']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = $1 WHERE "slug" = $2`, ['far fa-window-maximize', 'manual-time-edits']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = $1 WHERE "slug" = $2`, ['far fa-credit-card', 'expense']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = $1 WHERE "slug" = $2`, ['far fa-credit-card', 'amounts-owed']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = $1 WHERE "slug" = $2`, ['far fa-credit-card', 'payments']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = $1 WHERE "slug" = $2`, ['far fa-clock', 'weekly-limits']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = $1 WHERE "slug" = $2`, ['far fa-clock', 'daily-limits']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = $1 WHERE "slug" = $2`, ['far fa-credit-card', 'project-budgets']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = $1 WHERE "slug" = $2`, ['far fa-credit-card', 'client-budgets']);
    }
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = $1 WHERE "slug" = $2`, ['clock-outline', 'time-activity']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = $1 WHERE "slug" = $2`, ['calendar-outline', 'weekly']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = $1 WHERE "slug" = $2`, ['browser-outline', 'apps-urls']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = $1 WHERE "slug" = $2`, ['browser-outline', 'manual-time-edits']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = $1 WHERE "slug" = $2`, ['credit-card-outline', 'expense']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = $1 WHERE "slug" = $2`, ['credit-card-outline', 'amounts-owed']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = $1 WHERE "slug" = $2`, ['credit-card-outline', 'payments']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = $1 WHERE "slug" = $2`, ['clock-outline', 'weekly-limits']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = $1 WHERE "slug" = $2`, ['clock-outline', 'daily-limits']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = $1 WHERE "slug" = $2`, ['credit-card-outline', 'project-budgets']);
        await queryRunner.connection.query(`UPDATE "report" SET "iconClass" = $1 WHERE "slug" = $2`, ['credit-card-outline', 'client-budgets']);
    }
    /**
     * MySQL Up Migration
     *
     * @param queryRunner
     */
    async mysqlUpQueryRunner(queryRunner) {
    }
    /**
     * MySQL Down Migration
     *
     * @param queryRunner
     */
    async mysqlDownQueryRunner(queryRunner) {
    }
}
exports.ReportTableIconSeed1652936174625 = ReportTableIconSeed1652936174625;
//# sourceMappingURL=1652936174625-ReportTableIconSeed.js.map