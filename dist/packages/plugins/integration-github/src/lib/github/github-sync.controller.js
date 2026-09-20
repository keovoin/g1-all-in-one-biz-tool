"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubSyncController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const github_sync_service_1 = require("./github-sync.service");
const dto_1 = require("./dto");
let GitHubSyncController = class GitHubSyncController {
    constructor(_githubSyncService) {
        this._githubSyncService = _githubSyncService;
        this.logger = new common_1.Logger('GitHubSyncController');
    }
    /**
     * Handle an HTTP POST request to manually synchronize GitHub issues and labels.
     *
     * @param body - The request body containing data for synchronization.
     * @returns An HTTP response with the result of the synchronization.
     */
    async syncGithubIssuesAndLabels(integrationId, request, input) {
        try {
            // Validate the input data (You can use class-validator for validation)
            if (!input || !input.organizationId) {
                throw new common_1.HttpException('Invalid sync issues & labels request parameters', common_1.HttpStatus.BAD_REQUEST);
            }
            // Call a service method to perform manual synchronization of GitHub issues and labels
            return await this._githubSyncService.manualSyncGithubIssues(integrationId, input, request);
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            this.logger.error('Error while github sync issues and labels', error.message);
            throw new common_1.HttpException(`Error while github sync issues and labels: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Handle an HTTP POST request to automatically synchronize GitHub issues.
     *
     * @param body - The request body containing data for synchronization.
     * @returns An HTTP response with the result of the synchronization.
     */
    async autoSyncGithubIssues(integrationId, request, input) {
        try {
            // Validate the input data (You can use class-validator for validation)
            if (!input || !input.organizationId) {
                throw new common_1.HttpException('Invalid sync issues & labels request parameters', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this._githubSyncService.autoSyncGithubIssues(integrationId, input, request);
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            this.logger.error(`Error while github sync issues and labels`, error.message);
            throw new common_1.HttpException(`Error while github sync issues and labels: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.GitHubSyncController = GitHubSyncController;
tslib_1.__decorate([
    (0, common_1.Post)('/manual-sync/issues'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, core_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Param)('integrationId')),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, dto_1.ProcessGithubIssueSyncDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], GitHubSyncController.prototype, "syncGithubIssuesAndLabels", null);
tslib_1.__decorate([
    (0, common_1.Post)('/auto-sync/issues'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, core_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Param)('integrationId')),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, dto_1.ProcessGithubIssueSyncDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], GitHubSyncController.prototype, "autoSyncGithubIssues", null);
exports.GitHubSyncController = GitHubSyncController = tslib_1.__decorate([
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_ADD, contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    (0, common_1.Controller)('/integration/github/:integrationId'),
    tslib_1.__metadata("design:paramtypes", [github_sync_service_1.GithubSyncService])
], GitHubSyncController);
//# sourceMappingURL=github-sync.controller.js.map