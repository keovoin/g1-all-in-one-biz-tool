"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddColumnToRoleTable1640007378352 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AddColumnToRoleTable1640007378352 {
    constructor() {
        this.name = 'AddColumnToRoleTable1640007378352';
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
        await queryRunner.query(`ALTER TABLE "role" ADD "isSystem" boolean NOT NULL DEFAULT false`);
    }
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "isSystem"`);
    }
    async postgresUpQueryRunner(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        await queryRunner.query(`ALTER TABLE "role" ADD "isSystem" boolean NOT NULL DEFAULT false`);
    }
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "isSystem"`);
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
exports.AddColumnToRoleTable1640007378352 = AddColumnToRoleTable1640007378352;
//# sourceMappingURL=1640007378352-AddColumnToRoleTable.js.map