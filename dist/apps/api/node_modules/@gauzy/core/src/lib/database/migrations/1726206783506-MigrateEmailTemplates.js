"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrateEmailTemplates1726206783506 = void 0;
const chalk = require("chalk");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("../../email-template/utils");
class MigrateEmailTemplates1726206783506 {
    constructor() {
        this.name = 'MigrateEmailTemplates1726206783506';
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
            await utils_1.EmailTemplateUtils.migrateEmailTemplates(queryRunner, contracts_1.EmailTemplateEnum.REJECT_CANDIDATE);
        }
        catch (error) {
            console.error(`Error while migrating email templates for ${contracts_1.EmailTemplateEnum.REJECT_CANDIDATE}:`, error);
        }
    }
    /**
     * Down Migration
     *
     * @param queryRunner
     */
    async down(queryRunner) { }
}
exports.MigrateEmailTemplates1726206783506 = MigrateEmailTemplates1726206783506;
//# sourceMappingURL=1726206783506-MigrateEmailTemplates.js.map