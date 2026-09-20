"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubTaskUpdateOrCreateCommandHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const utils_1 = require("@gauzy/utils");
const github_repository_issue_service_1 = require("./../../repository/issue/github-repository-issue.service");
const commands_1 = require("../../repository/issue/commands");
const github_sync_service_1 = require("../../github-sync.service");
const task_update_or_create_command_1 = require("../task.update-or-create.command");
let GithubTaskUpdateOrCreateCommandHandler = class GithubTaskUpdateOrCreateCommandHandler {
    constructor(_commandBus, _githubSyncService, _organizationProjectService, _integrationMapService, _githubRepositoryIssueService) {
        this._commandBus = _commandBus;
        this._githubSyncService = _githubSyncService;
        this._organizationProjectService = _organizationProjectService;
        this._integrationMapService = _integrationMapService;
        this._githubRepositoryIssueService = _githubRepositoryIssueService;
    }
    /**
     * Command handler for the `GithubTaskUpdateOrCreateCommand`, responsible for processing actions when a task is opened in Gauzy.
     *
     * @param command - The `GithubTaskUpdateOrCreateCommand` containing the task data to be processed.
     */
    async execute(command) {
        try {
            const { task, options } = command;
            const tenantId = core_1.RequestContext.currentTenantId() || options.tenantId;
            const { organizationId, projectId } = options;
            // Step 1: Get the GitHub integration for the organization
            const integration = await this._commandBus.execute(new core_1.IntegrationTenantGetCommand({
                where: {
                    name: contracts_1.IntegrationEnum.GITHUB,
                    organizationId,
                    tenantId,
                    isActive: true,
                    isArchived: false,
                    integration: {
                        provider: contracts_1.IntegrationEnum.GITHUB,
                        isActive: true,
                        isArchived: false
                    }
                },
                relations: {
                    settings: true
                }
            }));
            // Step 2: Check if the integration and its settings are available
            if (!!integration && !!integration.settings) {
                const integrationId = integration.id;
                // Convert settings array to an object for easier access
                const settings = (0, utils_1.arrayToObject)(integration.settings, 'settingsName', 'settingsValue');
                const installationId = settings['installation_id'];
                // Step 3: Ensure that installation ID is available
                if (!!installationId) {
                    try {
                        // Step 4: Get the project and repository information
                        const project = await this._organizationProjectService.findOneByIdString(projectId, {
                            where: {
                                organizationId,
                                tenantId,
                                isActive: true,
                                isArchived: false,
                                customFields: {
                                    repository: {
                                        organizationId,
                                        tenantId,
                                        hasSyncEnabled: true,
                                        isActive: true,
                                        isArchived: false
                                    }
                                }
                            },
                            relations: {
                                customFields: { repository: true }
                            }
                        });
                        // Step 5: Check if the project and its repository are available
                        if (!!project && !!project.customFields['repository']) {
                            const repository = project.customFields['repository'];
                            // Step 6: Prepare the payload for opening the GitHub issue
                            const payload = {
                                repo: repository.name,
                                owner: repository.owner,
                                title: task.title,
                                body: task.description,
                                labels: this._mapIssueLabelPayload(task.tags || [])
                            };
                            const syncTag = settings['sync_tag']; // Check if the issue should be synchronized for this project
                            // Step 7: Continue execution based on auto-sync label setting
                            if (!!this.shouldSyncIssue(project, payload.labels, syncTag)) {
                                try {
                                    // Check if an integration map already exists for the issue
                                    const integrationMap = await this._integrationMapService.findOneByWhereOptions({
                                        entity: contracts_1.IntegrationEntity.ISSUE,
                                        gauzyId: task.id,
                                        integrationId,
                                        organizationId,
                                        tenantId,
                                        isActive: true,
                                        isArchived: false
                                    });
                                    try {
                                        /** */
                                        const syncIssue = await this._githubRepositoryIssueService.findOneByWhereOptions({
                                            organizationId,
                                            tenantId,
                                            repositoryId: repository.id,
                                            issueId: parseInt(integrationMap.sourceId)
                                        });
                                        payload.issue_number = syncIssue.issueNumber;
                                        await this._githubSyncService.createOrUpdateIssue(installationId, payload);
                                    }
                                    catch (error) {
                                        console.log('Error while getting synced issue', error?.message);
                                    }
                                }
                                catch (error) {
                                    // Step 9: Open the GitHub issue
                                    const issue = await this._githubSyncService.createOrUpdateIssue(installationId, payload);
                                    // Step 10: Synchronized GitHub repository issue.
                                    const { repositoryId } = repository;
                                    await this._commandBus.execute(new commands_1.IntegrationSyncGithubRepositoryIssueCommand({
                                        tenantId,
                                        organizationId,
                                        integrationId
                                    }, repositoryId, issue));
                                    // Step 11: Create a mapping between the task and the GitHub issue
                                    return await this._commandBus.execute(new core_1.IntegrationMapSyncEntityCommand({
                                        gauzyId: task.id,
                                        integrationId,
                                        sourceId: issue.id.toString(),
                                        entity: contracts_1.IntegrationEntity.ISSUE,
                                        organizationId,
                                        tenantId
                                    }));
                                }
                            }
                        }
                    }
                    catch (error) {
                        console.log('Project Not Found: %s', error.message);
                    }
                }
            }
        }
        catch (error) {
            // Handle errors gracefully, for example, log them
            console.log('Error while getting synced issue', error?.message);
        }
    }
    /**
     * Determines whether an issue should be synchronized based on project settings.
     *
     * @param project - The project configuration.
     * @param issue - The GitHub issue to be synchronized.
     * @returns A boolean indicating whether the issue should be synchronized.
     */
    shouldSyncIssue(project, labels = [], syncTag) {
        if (!project || !project.isTasksAutoSync) {
            return false;
        }
        return !!labels.find((label) => label.name.trim() === syncTag.trim());
    }
    /**
     * Map an array of tags to a simplified structure.
     *
     * @param tags - An array of ITag objects to be mapped.
     * @returns An array of objects with 'name', 'color', and 'description' properties.
     */
    _mapIssueLabelPayload(tags = []) {
        return tags.map(({ name, color, description, isSystem }) => ({
            name,
            color,
            description,
            default: isSystem
        }));
    }
};
exports.GithubTaskUpdateOrCreateCommandHandler = GithubTaskUpdateOrCreateCommandHandler;
exports.GithubTaskUpdateOrCreateCommandHandler = GithubTaskUpdateOrCreateCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(task_update_or_create_command_1.GithubTaskUpdateOrCreateCommand),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        github_sync_service_1.GithubSyncService,
        core_1.OrganizationProjectService,
        core_1.IntegrationMapService,
        github_repository_issue_service_1.GithubRepositoryIssueService])
], GithubTaskUpdateOrCreateCommandHandler);
//# sourceMappingURL=task.update-or-create.handler.js.map