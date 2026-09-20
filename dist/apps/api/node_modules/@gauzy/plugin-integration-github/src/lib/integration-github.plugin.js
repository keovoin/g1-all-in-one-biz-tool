"use strict";
var IntegrationGithubPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationGithubPlugin = void 0;
const tslib_1 = require("tslib");
const chalk = require("chalk");
const plugin_1 = require("@gauzy/plugin");
const github_module_1 = require("./github/github.module");
const github_repository_entity_1 = require("./github/repository/github-repository.entity");
const github_repository_issue_entity_1 = require("./github/repository/issue/github-repository-issue.entity");
let IntegrationGithubPlugin = IntegrationGithubPlugin_1 = class IntegrationGithubPlugin {
    constructor() {
        // We disable by default additional logging for each event to avoid cluttering the logs
        this.logEnabled = true;
    }
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap() {
        if (this.logEnabled) {
            console.log(chalk.green(`${IntegrationGithubPlugin_1.name} is being bootstrapped...`));
        }
    }
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy() {
        if (this.logEnabled) {
            console.log(chalk.green(`${IntegrationGithubPlugin_1.name} is being destroyed...`));
        }
    }
};
exports.IntegrationGithubPlugin = IntegrationGithubPlugin;
exports.IntegrationGithubPlugin = IntegrationGithubPlugin = IntegrationGithubPlugin_1 = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({
        /**
         * An array of modules that will be imported and registered with the plugin.
         */
        imports: [github_module_1.GithubModule],
        /**
         * An array of Entity classes. The plugin (or ORM) will
         * register these entities for use within the application.
         */
        entities: [github_repository_entity_1.OrganizationGithubRepository, github_repository_issue_entity_1.OrganizationGithubRepositoryIssue],
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
            // Add a custom field to the OrganizationProject entity
            config.customFields.OrganizationProject.push({
                name: 'repository',
                type: 'relation',
                relationType: 'many-to-one',
                entity: github_repository_entity_1.OrganizationGithubRepository,
                nullable: true, // Determines whether the relation is nullable.
                onDelete: 'SET NULL' // Defines the database cascade action on delete.
            });
            // Add a custom field to the OrganizationProject entity
            config.customFields.OrganizationProject.push({
                name: 'repositoryId',
                type: 'string',
                relation: 'repository',
                nullable: true, // Determines whether the relation is nullable.
                relationId: true,
                index: true
            });
            return config;
        }
    })
], IntegrationGithubPlugin);
//# sourceMappingURL=integration-github.plugin.js.map