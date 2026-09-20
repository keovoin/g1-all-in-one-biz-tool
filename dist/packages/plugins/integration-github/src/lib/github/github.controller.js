"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const github_service_1 = require("./github.service");
const github_oauth_state_service_1 = require("./github-oauth-state.service");
const dto_1 = require("./dto");
let GitHubController = class GitHubController {
    constructor(_githubService, _githubOAuthStateService) {
        this._githubService = _githubService;
        this._githubOAuthStateService = _githubOAuthStateService;
    }
    /**
     * Mint a single-use, tenant-bound state nonce used to start a GitHub App installation.
     *
     * The nonce is handed to GitHub as the `state` query param and echoed back on the post-install
     * callback, so the resulting installation is bound to the tenant/organization that actually
     * initiated the flow — closing the cross-tenant installation hijack (GHSA-4rwq-65wh-45h4).
     *
     * @param input The tenant/organization initiating the installation.
     * @returns The opaque `state` nonce to pass to GitHub.
     */
    async createInstallationState(input) {
        // Require an authenticated tenant from the request context — do NOT trust a client-supplied
        // tenantId for this security boundary (the minted nonce is later trusted to bind an install).
        const tenantId = core_1.RequestContext.currentTenantId();
        if (!tenantId) {
            throw new common_1.HttpException('Missing authenticated tenant context', common_1.HttpStatus.FORBIDDEN);
        }
        const organizationId = input.organizationId;
        if (!organizationId) {
            throw new common_1.HttpException('Invalid organization', common_1.HttpStatus.BAD_REQUEST);
        }
        const state = await this._githubOAuthStateService.create({
            tenantId,
            organizationId,
            userId: core_1.RequestContext.currentUserId()
        });
        return { state };
    }
    /**
     *
     * @param body
     * @returns
     */
    async addGithubAppInstallation(input) {
        try {
            // Validate the input data (You can use class-validator for validation)
            if (!input || !input.installation_id || !input.setup_action || !input.state) {
                throw new common_1.HttpException('Invalid github input data', common_1.HttpStatus.BAD_REQUEST);
            }
            // Resolve and invalidate the single-use state nonce minted when this flow was initiated.
            // The installation is bound to the tenant/organization recorded against the nonce — NOT to
            // client-supplied identifiers — which closes the cross-tenant IDOR (GHSA-4rwq-65wh-45h4).
            const stateData = await this._githubOAuthStateService.consume(input.state);
            if (!stateData) {
                throw new common_1.HttpException('Invalid or expired GitHub installation state. Please restart the GitHub App connection.', common_1.HttpStatus.BAD_REQUEST);
            }
            // The authenticated caller MUST be the tenant that initiated the flow. Require a tenant
            // context — do not silently skip this check when it is absent (security boundary).
            const currentTenantId = core_1.RequestContext.currentTenantId();
            if (!currentTenantId || String(stateData.tenantId) !== String(currentTenantId)) {
                throw new common_1.HttpException('GitHub installation state does not belong to the current tenant.', common_1.HttpStatus.FORBIDDEN);
            }
            // Add the GitHub installation using the service, bound to the nonce's tenant/organization.
            return await this._githubService.addGithubAppInstallation({
                installation_id: input.installation_id,
                setup_action: input.setup_action,
                tenantId: stateData.tenantId,
                organizationId: stateData.organizationId
            });
        }
        catch (error) {
            // Preserve intentional HTTP exceptions (e.g. the cross-tenant uniqueness 400) instead of
            // masking them as a generic 500.
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            // Handle errors and return an appropriate error response
            throw new common_1.HttpException(`Failed to add GitHub integration: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     *
     * @param body
     * @returns
     */
    async oAuthEndpointAuthorization(input) {
        try {
            // Validate the input data (You can use class-validator for validation)
            if (!input || !input.code) {
                throw new common_1.HttpException('Invalid input data', common_1.HttpStatus.BAD_REQUEST);
            }
            // Add the GitHub installation using the service
            return await this._githubService.oAuthEndpointAuthorization(input);
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            throw new common_1.HttpException(`Failed to add GitHub integration: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.GitHubController = GitHubController;
tslib_1.__decorate([
    (0, common_1.Post)('/install/state'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, core_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.GithubInstallStateDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], GitHubController.prototype, "createInstallationState", null);
tslib_1.__decorate([
    (0, common_1.Post)('/install'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, core_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.GithubAppInstallDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], GitHubController.prototype, "addGithubAppInstallation", null);
tslib_1.__decorate([
    (0, common_1.Post)('/oauth'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, core_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.GithubOAuthDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], GitHubController.prototype, "oAuthEndpointAuthorization", null);
exports.GitHubController = GitHubController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('GitHub Integrations'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_ADD, contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    (0, common_1.Controller)('/integration/github'),
    tslib_1.__metadata("design:paramtypes", [github_service_1.GithubService,
        github_oauth_state_service_1.GithubOAuthStateService])
], GitHubController);
//# sourceMappingURL=github.controller.js.map