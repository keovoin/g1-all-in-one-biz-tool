"use strict";
var KnowledgeBasePlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeBasePlugin = void 0;
const tslib_1 = require("tslib");
const chalk = require("chalk");
const core_1 = require("@gauzy/core");
const plugin_1 = require("@gauzy/plugin");
const help_center_author_1 = require("./help-center-author");
const help_center_1 = require("./help-center");
const help_center_article_1 = require("./help-center-article");
const help_center_seeder_service_1 = require("./help-center-seeder.service");
let KnowledgeBasePlugin = KnowledgeBasePlugin_1 = class KnowledgeBasePlugin {
    constructor(helpCenterSeederService) {
        this.helpCenterSeederService = helpCenterSeederService;
        // We disable by default additional logging for each event to avoid cluttering the logs
        this.logEnabled = true;
    }
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap() {
        if (this.logEnabled) {
            console.log(chalk.green(`${KnowledgeBasePlugin_1.name} is being bootstrapped...`));
        }
    }
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy() {
        if (this.logEnabled) {
            console.log(chalk.red(`${KnowledgeBasePlugin_1.name} is being destroyed...`));
        }
    }
    /**
     * Seed default data using the Help Center seeder service.
     * This method is intended to be invoked during the default seed phase of the plugin lifecycle.
     */
    async onPluginDefaultSeed() {
        try {
            await this.helpCenterSeederService.createDefault();
            if (this.logEnabled) {
                console.log(chalk.green(`Default data seeded successfully for ${KnowledgeBasePlugin_1.name}.`));
            }
        }
        catch (error) {
            console.error(chalk.red('Error seeding default data:', error));
        }
    }
    /**
     * Seed random data using the Help Center seeder service.
     * This method is intended to be invoked during the random seed phase of the plugin lifecycle.
     */
    async onPluginRandomSeed() {
        try {
            await this.helpCenterSeederService.createRandom();
            if (this.logEnabled) {
                console.log(chalk.green(`Random data seeded successfully for ${KnowledgeBasePlugin_1.name}.`));
            }
        }
        catch (error) {
            console.error(chalk.red('Error seeding random data:', error));
        }
    }
};
exports.KnowledgeBasePlugin = KnowledgeBasePlugin;
exports.KnowledgeBasePlugin = KnowledgeBasePlugin = KnowledgeBasePlugin_1 = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({
        imports: [help_center_1.HelpCenterModule, help_center_article_1.HelpCenterArticleModule, help_center_author_1.HelpCenterAuthorModule, core_1.SeederModule],
        entities: [help_center_1.HelpCenter, help_center_article_1.HelpCenterArticle, help_center_article_1.HelpCenterArticleVersion, help_center_author_1.HelpCenterAuthor],
        subscribers: [help_center_article_1.HelpCenterArticleSubscriber, help_center_article_1.HelpCenterArticleVersionSubscriber],
        providers: [help_center_seeder_service_1.HelpCenterSeederService]
    }),
    tslib_1.__metadata("design:paramtypes", [help_center_seeder_service_1.HelpCenterSeederService])
], KnowledgeBasePlugin);
//# sourceMappingURL=knowledge-base.plugin.js.map