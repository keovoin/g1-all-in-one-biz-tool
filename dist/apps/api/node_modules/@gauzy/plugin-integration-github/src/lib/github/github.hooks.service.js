"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubHooksService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const chalk = require("chalk");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const github_sync_service_1 = require("./github-sync.service");
let GithubHooksService = class GithubHooksService {
    constructor(_commandBus, _githubSyncService) {
        this._commandBus = _commandBus;
        this._githubSyncService = _githubSyncService;
        this.logger = new common_1.Logger('GithubHooksService');
    }
    /**
     * Handles the 'installation.deleted' event by deleting a GitHub installation,
     * its associated repositories, and the integration setting.
     *
     * @param context - The context object containing event information.
     */
    async installationDeleted(context) {
        // Extract necessary data from the context
        const installation = context.payload['installation'];
        const repositories = context.payload['repositories'];
        try {
            const installation_id = installation.id;
            // Retrieve the integration settings associated with the GitHub installation.
            const settings = await this._commandBus.execute(new core_1.IntegrationSettingGetManyCommand({
                where: {
                    settingsName: contracts_1.GithubPropertyMapEnum.INSTALLATION_ID,
                    settingsValue: installation_id,
                    isActive: true,
                    isArchived: false,
                    integration: {
                        isActive: true,
                        isArchived: false
                    }
                },
                relations: {
                    integration: {
                        settings: true,
                        entitySettings: {
                            tiedEntities: true
                        }
                    }
                }
            }));
            return await Promise.all(settings.map(async (setting) => {
                if (!setting || !setting.integration) {
                    // No integration or setting found; no action needed.
                    return;
                }
                const integration = setting.integration;
                // Delete the GitHub integration associated with the installation and its repositories
                await this._githubSyncService.installationDeleted({
                    installation,
                    integration,
                    repositories
                });
            }));
        }
        catch (error) {
            // Handle errors
            this.logger.error(`Failed to delete GitHub integration for installation: ${installation?.id}`, error);
        }
    }
    /**
     * Handles the 'issues.opened' event from GitHub, syncs automation issues and labels.
     *
     * @param context - The GitHub webhook event context.
     */
    async issuesOpened(context) {
        try {
            // Extract necessary data from the context
            const installation = context.payload['installation'];
            const issue = context.payload['issue'];
            const repository = context.payload['repository'];
            console.log(chalk.magenta(`Syncing GitHub Automation ID: %s`), context.payload['action']);
            /** Synchronizes automation issues for a GitHub installation. */
            await this.syncAutomationIssue({ installation, issue, repository });
        }
        catch (error) {
            this.logger.error('Failed to sync in issues and labels', error.message);
        }
    }
    /**
     * Handles the 'issues.edited' event from GitHub, syncs automation issues and labels.
     *
     * @param context - The GitHub webhook event context.
     */
    async issuesEdited(context) {
        try {
            // Extract necessary data from the context
            const installation = context.payload['installation'];
            const issue = context.payload['issue'];
            const repository = context.payload['repository'];
            console.log(chalk.magenta(`Syncing GitHub Automation ID: %s`), context.payload['action']);
            /** Synchronizes automation issues for a GitHub installation. */
            await this.syncAutomationIssue({ installation, issue, repository });
        }
        catch (error) {
            this.logger.error('Failed to sync in issues and labels', error.message);
        }
    }
    /**
     * Handles the 'issuesLabeled' event from GitHub.
     *
     * @param context - The GitHub webhook event context.
     */
    async issuesLabeled(context) {
        try {
            // Extract necessary data from the context
            const installation = context.payload['installation'];
            const issue = context.payload['issue'];
            const repository = context.payload['repository'];
            console.log(chalk.magenta(`Syncing GitHub Automation ID: %s`), context.payload['action']);
            /** Synchronizes automation issues for a GitHub installation. */
            await this.syncAutomationIssue({ installation, issue, repository });
        }
        catch (error) {
            this.logger.error('Failed to sync in issues and labels', error.message);
        }
    }
    /**
     * Handles the 'issuesUnlabeled' event from GitHub.
     *
     * @param context - The GitHub webhook event context.
     */
    async issuesUnlabeled(context) {
        try {
            // Extract necessary data from the context
            const installation = context.payload['installation'];
            const issue = context.payload['issue'];
            const repository = context.payload['repository'];
            console.log(chalk.magenta(`Syncing GitHub Automation ID: %s`), context.payload['action']);
            /** Synchronizes automation issues for a GitHub installation. */
            await this.syncAutomationIssue({ installation, issue, repository });
        }
        catch (error) {
            this.logger.error('Failed to sync in issues and labels', error.message);
        }
    }
    /**
     * Synchronizes automation issues for a GitHub installation.
     *
     * @param param0 - An object containing installation, issue, and repository information.
     */
    async syncAutomationIssue({ installation, issue, repository }) {
        try {
            const setting = await this.getInstallationSetting(installation);
            if (!!setting && !!setting.integration) {
                const integration = setting.integration;
                await this._githubSyncService.syncAutomationIssue({ integration, issue, repository });
            }
        }
        catch (error) {
            this.logger.error(`Failed to sync GitHub automation issue: ${installation?.id}`, error.message);
        }
    }
    /**
     * Retrieves integration settings associated with a specific GitHub installation.
     *
     * @param installation - The GitHub installation for which to retrieve settings.
     * @returns A promise that resolves to the integration setting or rejects with an error.
     */
    async getInstallationSetting(installation) {
        try {
            const installation_id = installation.id;
            // Retrieve the integration setting associated with the GitHub installation.
            return await this._commandBus.execute(new core_1.IntegrationSettingGetCommand({
                where: {
                    settingsName: contracts_1.GithubPropertyMapEnum.INSTALLATION_ID,
                    settingsValue: installation_id,
                    isActive: true,
                    isArchived: false,
                    integration: { isActive: true, isArchived: false }
                },
                relations: {
                    integration: {
                        settings: true,
                        entitySettings: { tiedEntities: true }
                    }
                }
            }));
        }
        catch (error) {
            this.logger.error(`Failed to fetch GitHub installation setting: ${installation?.id}`, error.message);
        }
    }
};
exports.GithubHooksService = GithubHooksService;
exports.GithubHooksService = GithubHooksService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus, github_sync_service_1.GithubSyncService])
], GithubHooksService);
//# sourceMappingURL=github.hooks.service.js.map