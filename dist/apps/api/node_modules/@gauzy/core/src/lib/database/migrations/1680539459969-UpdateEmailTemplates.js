"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEmailTemplates1680539459969 = void 0;
const chalk = require("chalk");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const utils_1 = require("../../email-template/utils");
class UpdateEmailTemplates1680539459969 {
    constructor() {
        this.name = 'UpdateEmailTemplates1680539459969';
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
            case config_1.DatabaseTypeEnum.postgres:
                await this.sqlitePostgresUpdateEmailTemplates(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.mysql:
                await this.mysqlUpdateEmailTemplates(queryRunner);
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
     * Sqlite | better-sqlite3 | postgres Up Migration
     *
     * @param queryRunner
     */
    async sqlitePostgresUpdateEmailTemplates(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        // Migrate email templates for all templates
        const templates = Object.values(contracts_1.EmailTemplateEnum);
        // Iterate over each template and update it
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
     * MySQL Up Migration
     *
     * @param queryRunner
     */
    async mysqlUpdateEmailTemplates(queryRunner) { }
}
exports.UpdateEmailTemplates1680539459969 = UpdateEmailTemplates1680539459969;
//# sourceMappingURL=1680539459969-UpdateEmailTemplates.js.map