"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMultiTenantResetPasswordEmailTemplate1700462617037 = void 0;
const chalk = require("chalk");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("../../email-template/utils");
const config_1 = require("@gauzy/config");
class AddMultiTenantResetPasswordEmailTemplate1700462617037 {
    constructor() {
        this.name = 'AddMultiTenantResetPasswordEmailTemplate1700462617037';
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
            case config_1.DatabaseTypeEnum.postgres:
                await this.sqlitePostgresResetPasswordEmailTemplate(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.mysql:
                await this.mysqlResetPasswordEmailTemplate(queryRunner);
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
    async down(queryRunner) { }
    /**
    * Sqlite | better-sqlite3 | postgres Up Migration
    *
    * @param queryRunner
    */
    async sqlitePostgresResetPasswordEmailTemplate(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        // Migrate email templates for multi-tenant password reset
        try {
            await utils_1.EmailTemplateUtils.migrateEmailTemplates(queryRunner, contracts_1.EmailTemplateEnum.MULTI_TENANT_PASSWORD_RESET);
        }
        catch (error) {
            console.log(`Error while migrating missing email templates for ${contracts_1.EmailTemplateEnum.MULTI_TENANT_PASSWORD_RESET}`, error);
        }
        // Migrate email templates for regular password reset
        try {
            await utils_1.EmailTemplateUtils.migrateEmailTemplates(queryRunner, contracts_1.EmailTemplateEnum.PASSWORD_RESET);
        }
        catch (error) {
            console.log(`Error while migrating missing email templates for ${contracts_1.EmailTemplateEnum.PASSWORD_RESET}`, error);
        }
        // Migrate email templates for regular password less authentication
        try {
            await utils_1.EmailTemplateUtils.migrateEmailTemplates(queryRunner, contracts_1.EmailTemplateEnum.PASSWORD_LESS_AUTHENTICATION);
        }
        catch (error) {
            console.log(`Error while migrating missing email templates for ${contracts_1.EmailTemplateEnum.PASSWORD_LESS_AUTHENTICATION}`, error);
        }
    }
    /**
    * MySQL Up Migration
    *
    * @param queryRunner
    */
    async mysqlResetPasswordEmailTemplate(queryRunner) { }
}
exports.AddMultiTenantResetPasswordEmailTemplate1700462617037 = AddMultiTenantResetPasswordEmailTemplate1700462617037;
//# sourceMappingURL=1700462617037-AddMultiTenantResetPasswordEmailTemplate.js.map