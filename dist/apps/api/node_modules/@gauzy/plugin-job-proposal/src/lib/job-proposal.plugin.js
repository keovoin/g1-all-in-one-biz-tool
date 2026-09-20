"use strict";
var JobProposalPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobProposalPlugin = void 0;
const tslib_1 = require("tslib");
const chalk = require("chalk");
const plugin_1 = require("@gauzy/plugin");
const proposal_entity_1 = require("./proposal/proposal.entity");
const proposal_module_1 = require("./proposal/proposal.module");
const employee_proposal_template_module_1 = require("./proposal-template/employee-proposal-template.module");
const employee_proposal_template_entity_1 = require("./proposal-template/employee-proposal-template.entity");
const proposal_seeder_service_1 = require("./proposal/proposal-seeder.service");
let JobProposalPlugin = JobProposalPlugin_1 = class JobProposalPlugin {
    constructor(_proposalSeederService) {
        this._proposalSeederService = _proposalSeederService;
        // We disable by default additional logging for each event to avoid cluttering the logs
        this.logEnabled = true;
    }
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap() {
        if (this.logEnabled) {
            console.log(chalk.green(`${JobProposalPlugin_1.name} is being bootstrapped...`));
        }
    }
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy() {
        if (this.logEnabled) {
            console.log(chalk.red(`${JobProposalPlugin_1.name} is being destroyed...`));
        }
    }
    /**
     * Seed default data for the plugin.
     */
    async onPluginDefaultSeed() {
        try {
            await this._proposalSeederService.createDefaultProposals();
            if (this.logEnabled) {
                console.log(chalk.green(`Default data seeded successfully for ${JobProposalPlugin_1.name}.`));
            }
        }
        catch (error) {
            console.error(chalk.red(`Error seeding default data for ${JobProposalPlugin_1.name}:`, error));
        }
    }
    /**
     * Seed random data for the plugin.
     */
    async onPluginRandomSeed() {
        try {
            await this._proposalSeederService.createRandomProposals();
            if (this.logEnabled) {
                console.log(chalk.green(`Random data seeded successfully for ${JobProposalPlugin_1.name}.`));
            }
        }
        catch (error) {
            console.error(chalk.red(`Error seeding random data for ${JobProposalPlugin_1.name}:`, error));
        }
    }
};
exports.JobProposalPlugin = JobProposalPlugin;
exports.JobProposalPlugin = JobProposalPlugin = JobProposalPlugin_1 = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({
        /**
         * An array of modules that will be imported and registered with the plugin.
         */
        imports: [proposal_module_1.ProposalModule, employee_proposal_template_module_1.EmployeeProposalTemplateModule],
        /**
         * An array of Entity classes. The plugin (or ORM) will
         * register these entities for use within the application.
         */
        entities: [proposal_entity_1.Proposal, employee_proposal_template_entity_1.EmployeeProposalTemplate],
        /**
         * A callback that receives the main plugin configuration object and allows
         * custom modifications before returning the final configuration.
         *
         * @param {ApplicationPluginConfig} config - The initial plugin configuration object.
         * @returns {ApplicationPluginConfig} - The modified plugin configuration object.
         *
         * In this example, we're adding a custom relation field (`proposals`) to the `Tag` entity.
         */
        configuration: (config) => {
            // Add a new 'proposals' tag to the 'Tag' entity
            config.customFields.Tag.push({
                name: 'proposals',
                type: 'relation',
                relationType: 'many-to-many',
                pivotTable: 'tag_proposal',
                joinColumn: 'proposalId',
                inverseJoinColumn: 'tagId',
                entity: proposal_entity_1.Proposal,
                inverseSide: (it) => it.tags
            });
            return config;
        }
    }),
    tslib_1.__metadata("design:paramtypes", [proposal_seeder_service_1.ProposalSeederService])
], JobProposalPlugin);
//# sourceMappingURL=job-proposal.plugin.js.map