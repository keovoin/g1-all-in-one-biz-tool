"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationSyncGithubRepositoryCommandHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const github_repository_service_1 = require("./../../repository/github-repository.service");
const integration_sync_github_repository_command_1 = require("../integration-sync-github-repository.command");
let IntegrationSyncGithubRepositoryCommandHandler = class IntegrationSyncGithubRepositoryCommandHandler {
    constructor(_githubRepositoryService) {
        this._githubRepositoryService = _githubRepositoryService;
    }
    /**
     * Execute a synchronization of a GitHub repository for an integration.
     *
     * @param command - The command containing synchronization details.
     * @returns A promise that resolves to the integrated GitHub repository.
     */
    async execute(command) {
        // Extract input parameters from the command
        const { input } = command;
        const { repository, organizationId, integrationId } = input;
        const tenantId = core_1.RequestContext.currentTenantId() || input.tenantId;
        // Destructure the repository object for better readability
        const { id: repositoryId, full_name, name, owner, open_issues_count } = repository;
        const status = repository.status || contracts_1.GithubRepositoryStatusEnum.SYNCING;
        try {
            /**
             * Find an integration repository based on repository, integration, organization, and tenant.
             *
             * @returns A promise that resolves to the integration repository if found.
             */
            const integrationRepository = await this._githubRepositoryService.findOneByWhereOptions({
                repositoryId,
                integrationId,
                organizationId,
                tenantId
            });
            /**
             * Update an integration repository with the provided details.
             *
             * @returns A promise that resolves to the updated integration repository.
             */
            return await this._githubRepositoryService.create({
                id: integrationRepository.id,
                name: name,
                fullName: full_name,
                owner: owner.login,
                issuesCount: open_issues_count,
                private: repository.private,
                status,
                repositoryId,
                integrationId,
                organizationId,
                tenantId
            });
        }
        catch (error) {
            /**
             * Create or update an integration repository with the provided details.
             *
             * @returns A promise that resolves to the created or updated integration repository.
             */
            return await this._githubRepositoryService.create({
                name: name,
                fullName: full_name,
                owner: owner.login,
                issuesCount: open_issues_count,
                private: repository.private,
                status,
                repositoryId,
                integrationId,
                organizationId,
                tenantId
            });
        }
    }
};
exports.IntegrationSyncGithubRepositoryCommandHandler = IntegrationSyncGithubRepositoryCommandHandler;
exports.IntegrationSyncGithubRepositoryCommandHandler = IntegrationSyncGithubRepositoryCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(integration_sync_github_repository_command_1.IntegrationSyncGithubRepositoryCommand),
    tslib_1.__metadata("design:paramtypes", [github_repository_service_1.GithubRepositoryService])
], IntegrationSyncGithubRepositoryCommandHandler);
//# sourceMappingURL=integration-sync-github-repository.handler.js.map