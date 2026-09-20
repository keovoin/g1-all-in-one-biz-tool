"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrateEmailTemplates1701353754397 = void 0;
const chalk = require("chalk");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const utils_1 = require("../../email-template/utils");
class MigrateEmailTemplates1701353754397 {
    constructor() {
        this.name = 'MigrateEmailTemplates1701353754397';
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
                await this.sqlitePostgresMigrateEmailTemplates(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.mysql:
                await this.mysqlMigrateEmailTemplates(queryRunner);
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
    async sqlitePostgresMigrateEmailTemplates(queryRunner) {
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
    /**
     * MySQL Up Migration
     *
     * @param queryRunner
     */
    async mysqlMigrateEmailTemplates(queryRunner) { }
}
exports.MigrateEmailTemplates1701353754397 = MigrateEmailTemplates1701353754397;
//# sourceMappingURL=1701353754397-MigrateEmailTemplates.js.map