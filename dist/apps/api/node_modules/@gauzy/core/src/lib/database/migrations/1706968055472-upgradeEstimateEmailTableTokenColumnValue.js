"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpgradeEstimateEmailTableTokenColumnValue1706968055472 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class UpgradeEstimateEmailTableTokenColumnValue1706968055472 {
    constructor() {
        this.name = 'UpgradeEstimateEmailTableTokenColumnValue1706968055472';
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
    /**
    * PostgresDB Up Migration
    *
    * @param queryRunner
    */
    async postgresUpQueryRunner(queryRunner) {
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
    }
    /**
    * SqliteDB and BetterSQlite3DB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
    }
    /**
    * SqliteDB and BetterSQlite3DB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
    }
    /**
     * MySQL Up Migration
     *
     * @param queryRunner
     */
    async mysqlUpQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`estimate_email\` DROP COLUMN \`token\``);
        await queryRunner.query(`ALTER TABLE \`estimate_email\` ADD \`token\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`activity\` CHANGE \`time\` \`time\` time(6) NOT NULL DEFAULT '0'`);
    }
    /**
     * MySQL Down Migration
     *
     * @param queryRunner
     */
    async mysqlDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`activity\` CHANGE \`time\` \`time\` time(6) NOT NULL DEFAULT '00:00:00.000000'`);
        await queryRunner.query(`ALTER TABLE \`estimate_email\` DROP COLUMN \`token\``);
        await queryRunner.query(`ALTER TABLE \`estimate_email\` ADD \`token\` longtext NOT NULL`);
    }
}
exports.UpgradeEstimateEmailTableTokenColumnValue1706968055472 = UpgradeEstimateEmailTableTokenColumnValue1706968055472;
//# sourceMappingURL=1706968055472-upgradeEstimateEmailTableTokenColumnValue.js.map