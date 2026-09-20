"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigratePasswordResetEmailTemplates1728024420021 = void 0;
const chalk = require("chalk");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("../../email-template/utils");
class MigratePasswordResetEmailTemplates1728024420021 {
    constructor() {
        this.name = 'MigratePasswordResetEmailTemplates1728024420021';
    }
    /**
     * Up Migration
     *
     * @param queryRunner
     */
    async up(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        // Migrate each template
        try {
            await utils_1.EmailTemplateUtils.migrateEmailTemplates(queryRunner, contracts_1.EmailTemplateEnum.PASSWORD_RESET);
        }
        catch (error) {
            console.error(`Error while migrating email templates for ${contracts_1.EmailTemplateEnum.PASSWORD_RESET}:`, error);
        }
    }
    /**
     * Down Migration
     *
     * @param queryRunner
     */
    async down(queryRunner) { }
}
exports.MigratePasswordResetEmailTemplates1728024420021 = MigratePasswordResetEmailTemplates1728024420021;
//# sourceMappingURL=1728024420021-MigratePasswordResetEmailTemplates.js.map