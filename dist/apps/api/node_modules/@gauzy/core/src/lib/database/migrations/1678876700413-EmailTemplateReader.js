"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplateReader1678876700413 = void 0;
const chalk = require("chalk");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const utils_1 = require("../../email-template/utils");
class EmailTemplateReader1678876700413 {
    constructor() {
        this.name = 'EmailTemplateReader1678876700413';
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
                await this.sqlitePostgresMigrateEmailTemplate(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.mysql:
                await this.mysqlMigrateEmailTemplate(queryRunner);
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
     * Sqlite | better-sqlite3 | MySQL Up Migration
     *
     * @param queryRunner
     */
    async sqlitePostgresMigrateEmailTemplate(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        try {
            await utils_1.EmailTemplateUtils.migrateEmailTemplates(queryRunner, contracts_1.EmailTemplateEnum.EMAIL_RESET);
        }
        catch (error) {
            console.log(`Error while migrating missing email templates for ${contracts_1.EmailTemplateEnum.EMAIL_RESET}`, error);
        }
        try {
            await utils_1.EmailTemplateUtils.migrateEmailTemplates(queryRunner, contracts_1.EmailTemplateEnum.ORGANIZATION_TEAM_JOIN_REQUEST);
        }
        catch (error) {
            console.log(`Error while migrating email template for ${contracts_1.EmailTemplateEnum.ORGANIZATION_TEAM_JOIN_REQUEST}`, error);
        }
    }
    /**
     * MySQL Up Migration
     *
     * @param queryRunner
     */
    async mysqlMigrateEmailTemplate(queryRunner) { }
}
exports.EmailTemplateReader1678876700413 = EmailTemplateReader1678876700413;
//# sourceMappingURL=1678876700413-EmailTemplateReader.js.map