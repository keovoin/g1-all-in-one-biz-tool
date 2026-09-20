"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrateEmailTemplatesData1643809486960 = void 0;
const chalk = require("chalk");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const utils_1 = require("../../email-template/utils");
class MigrateEmailTemplatesData1643809486960 {
    constructor() {
        this.name = 'MigrateEmailTemplatesData1643809486960';
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
     * Up Migration
     *
     * @param queryRunner
     */
    async postgresUpQueryRunner(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        // Migrate email templates for all templates
        const templates = Object.values(contracts_1.EmailTemplateEnum);
        // Iterate over each template and migrate the data
        for await (const template of templates) {
            try {
                await utils_1.EmailTemplateUtils.migrateEmailTemplates(queryRunner, template);
            }
            catch (error) {
                console.log(`Error while migrating missing email templates for ${template}`, error);
            }
        }
    }
    async postgresDownQueryRunner(queryRunner) { }
    /**
     * Up Migration
     *
     * @param queryRunner
     */
    async sqliteUpQueryRunner(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        const templates = Object.values(contracts_1.EmailTemplateEnum);
        for await (const template of templates) {
            try {
                await utils_1.EmailTemplateUtils.migrateEmailTemplates(queryRunner, template);
            }
            catch (error) {
                console.log(`Error while migrating missing email templates for ${template}`, error);
            }
        }
    }
    /**
     * SqliteDB Down Migration
     *
     * @param queryRunner
     */
    async sqliteDownQueryRunner(queryRunner) { }
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
exports.MigrateEmailTemplatesData1643809486960 = MigrateEmailTemplatesData1643809486960;
//# sourceMappingURL=1643809486960-MigrateEmailTemplatesData.js.map