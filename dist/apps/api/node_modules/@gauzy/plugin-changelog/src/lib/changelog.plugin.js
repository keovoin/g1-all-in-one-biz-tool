"use strict";
var ChangelogPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangelogPlugin = void 0;
const tslib_1 = require("tslib");
const chalk = require("chalk");
const core_1 = require("@gauzy/core");
const plugin_1 = require("@gauzy/plugin");
const changelog_module_1 = require("./changelog.module");
const changelog_entity_1 = require("./changelog.entity");
const changelog_seeder_service_1 = require("./changelog-seeder.service");
let ChangelogPlugin = ChangelogPlugin_1 = class ChangelogPlugin {
    constructor(changelogSeederService) {
        this.changelogSeederService = changelogSeederService;
        // We disable by default additional logging for each event to avoid cluttering the logs
        this.logEnabled = true;
    }
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap() {
        if (this.logEnabled) {
            console.log(chalk.green(`${ChangelogPlugin_1.name} is being bootstrapped...`));
        }
    }
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy() {
        if (this.logEnabled) {
            console.log(chalk.green(`${ChangelogPlugin_1.name} is being destroyed...`));
        }
    }
    /**
     * Seed basic default data using the Changelog seeder service.
     * This method is intended to be invoked during the basic seed phase of the plugin lifecycle.
     */
    async onPluginBasicSeed() {
        try {
            await this.changelogSeederService.createBasicDefault();
            if (this.logEnabled) {
                console.log(chalk.green(`Basic default data seeded successfully for ${ChangelogPlugin_1.name}.`));
            }
        }
        catch (error) {
            console.error(chalk.red('Error seeding basic default data:', error));
        }
    }
};
exports.ChangelogPlugin = ChangelogPlugin;
exports.ChangelogPlugin = ChangelogPlugin = ChangelogPlugin_1 = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({
        imports: [changelog_module_1.ChangelogModule, core_1.SeederModule],
        entities: [changelog_entity_1.Changelog],
        providers: [changelog_seeder_service_1.ChangelogSeederService]
    }),
    tslib_1.__metadata("design:paramtypes", [changelog_seeder_service_1.ChangelogSeederService])
], ChangelogPlugin);
//# sourceMappingURL=changelog.plugin.js.map