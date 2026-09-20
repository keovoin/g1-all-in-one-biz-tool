"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubIntegrationController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const octokit_service_1 = require("../probot/octokit.service");
const dto_1 = require("./dto");
let GitHubIntegrationController = class GitHubIntegrationController {
    constructor(_octokitService) {
        this._octokitService = _octokitService;
        this.logger = new common_1.Logger('GitHubIntegrationController');
    }
    /**
     * Get GitHub installation metadata for a specific integration.
     *
     * This endpoint allows you to retrieve metadata associated with a GitHub installation for a given integration.
     *
     * @param {Request} request - The HTTP request object.
     * @param {TenantOrganizationBaseDTO} query - Query parameters, including organizationId.
     * @returns {Promise<OctokitResponse<any> | void>} A promise that resolves with the GitHub installation metadata.
     * @throws {HttpException} If the query parameters are invalid or if there's an error retrieving the metadata.
     */
    async getGithubInstallationMetadata(request, query) {
        try {
            // Validate the input data (You can use class-validator for validation)
            if (!query || !query.organizationId) {
                throw new common_1.HttpException('Invalid query parameter', common_1.HttpStatus.BAD_REQUEST);
            }
            // Check if the request contains integration settings
            const settings = request['integration']?.settings;
            if (!settings || !settings.installation_id) {
                throw new common_1.HttpException('Invalid request parameter: Missing or unauthorized integration', common_1.HttpStatus.UNAUTHORIZED);
            }
            // Get installation metadata
            const installation_id = settings['installation_id'];
            const metadata = await this._octokitService.getInstallationMetadata(installation_id);
            return metadata.data;
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            this.logger.error('Error while retrieve github installation metadata', error.message);
            throw new common_1.HttpException(`Error while retrieve github installation metadata: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Get GitHub repositories associated with a specific GitHub App installation within a given organization.
     *
     * This endpoint allows you to retrieve a list of GitHub repositories associated with a GitHub App installation within a specific organization.
     *
     * @param {Request} request - The HTTP request object.
     * @param {TenantOrganizationBaseDTO} query - Query parameters containing organization information.
     * @returns {Promise<OctokitResponse<IGithubRepositoryResponse>>} A promise that resolves with the GitHub repositories.
     * @throws {HttpException} If the query parameters are invalid or if there's an error retrieving the repositories.
     */
    async getGithubRepositories(request, query) {
        try {
            // Validate the input data (You can use class-validator for validation)
            if (!query || !query.organizationId) {
                throw new common_1.HttpException('Invalid query parameter', common_1.HttpStatus.BAD_REQUEST);
            }
            // Check if the request contains integration settings
            const settings = request['integration']?.settings;
            if (!settings || !settings.installation_id) {
                throw new common_1.HttpException('Invalid request parameter: Missing or unauthorized integration', common_1.HttpStatus.UNAUTHORIZED);
            }
            const installation_id = settings['installation_id'];
            // Get installation repositories
            const repositories = await this._octokitService.getRepositories(installation_id);
            return repositories.data;
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            this.logger.error('Error while retrieving GitHub installation repositories', error.message);
            throw new common_1.HttpException(`Error while retrieving GitHub installation repositories: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Get GitHub repository issues for a specific GitHub App installation within a given organization, owner, and repository.
     *
     * This endpoint allows you to retrieve issues associated with a GitHub repository for a GitHub App installation within a specific organization.
     *
     * @param {Request} request - The HTTP request object.
     * @param {TenantOrganizationBaseDTO} query - Query parameters containing organization information.
     * @param {string} owner - The owner (username or organization) of the repository.
     * @param {string} repo - The name of the repository.
     * @returns {Promise<OctokitResponse<IGithubIssue>>} A promise that resolves with the GitHub repository issues.
     * @throws {HttpException} If the query parameters are invalid or if there's an error retrieving the issues.
     */
    async getGithubRepositoryIssues(request, query, owner, repo) {
        try {
            // Validate the input data (You can use class-validator for validation)
            if (!query || !query.organizationId) {
                throw new common_1.HttpException('Invalid query parameter', common_1.HttpStatus.BAD_REQUEST);
            }
            // Check if the request contains integration settings
            const settings = request['integration']?.settings;
            if (!settings || !settings.installation_id) {
                throw new common_1.HttpException('Invalid request parameter: Missing or unauthorized integration', common_1.HttpStatus.UNAUTHORIZED);
            }
            const installation_id = settings['installation_id'];
            const page = query.page;
            const per_page = query.per_page;
            // Get installation repositories
            const issues = await this._octokitService.getRepositoryIssues(installation_id, {
                owner,
                repo,
                page,
                per_page
            });
            return issues.data;
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            this.logger.error('Error while retrieving GitHub installation repository issues', error.message);
            throw new common_1.HttpException(`Error while retrieving GitHub installation repository issues: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.GitHubIntegrationController = GitHubIntegrationController;
tslib_1.__decorate([
    (0, common_1.Get)('/metadata'),
    (0, core_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, core_1.TenantOrganizationBaseDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], GitHubIntegrationController.prototype, "getGithubInstallationMetadata", null);
tslib_1.__decorate([
    (0, common_1.Get)('/repositories'),
    (0, core_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, core_1.TenantOrganizationBaseDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], GitHubIntegrationController.prototype, "getGithubRepositories", null);
tslib_1.__decorate([
    (0, common_1.Get)('/:owner/:repo/issues'),
    (0, core_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__param(2, (0, common_1.Param)('owner')),
    tslib_1.__param(3, (0, common_1.Param)('repo')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, dto_1.GithubIssuesQueryDTO, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], GitHubIntegrationController.prototype, "getGithubRepositoryIssues", null);
exports.GitHubIntegrationController = GitHubIntegrationController = tslib_1.__decorate([
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_ADD, contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    (0, common_1.Controller)('/integration/github/:integrationId'),
    tslib_1.__metadata("design:paramtypes", [octokit_service_1.OctokitService])
], GitHubIntegrationController);
//# sourceMappingURL=github-integration.controller.js.map