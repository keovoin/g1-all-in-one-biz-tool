"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubAuthorizationController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const common_2 = require("@gauzy/common");
const config_1 = require("@gauzy/config");
const github_oauth_state_service_1 = require("./github-oauth-state.service");
let GitHubAuthorizationController = class GitHubAuthorizationController {
    constructor(_config, _githubOAuthStateService) {
        this._config = _config;
        this._githubOAuthStateService = _githubOAuthStateService;
    }
    /**
     * Public post-install callback hit by GitHub after a user installs the GitHub App.
     *
     * @param query
     * @param response
     */
    async githubIntegrationPostInstallCallback(query, response) {
        try {
            // Validate the input data (You can use class-validator for validation)
            if (!query || !query.installation_id || !query.setup_action || !query.state) {
                throw new common_1.HttpException('Invalid github callback query data', common_1.HttpStatus.BAD_REQUEST);
            }
            // Validate the state nonce minted when the install flow was initiated. We only PEEK here
            // (the nonce is consumed when the installation is finalized), but rejecting an unknown
            // nonce blocks forged callbacks. It also lets us ALWAYS redirect to the server-side
            // post-install URL rather than to a client-supplied value (closes the open redirect).
            const stateData = await this._githubOAuthStateService.peek(query.state);
            if (!stateData) {
                throw new common_1.HttpException('Invalid or expired GitHub installation state.', common_1.HttpStatus.BAD_REQUEST);
            }
            /** Github Config Options */
            const { postInstallUrl } = this._config.get('github');
            /** Construct the redirect URL with query parameters. */
            const urlParams = new URLSearchParams();
            urlParams.append('installation_id', query.installation_id);
            urlParams.append('setup_action', query.setup_action);
            urlParams.append('state', query.state);
            /**
             * Always redirect to the server-side configured post-install URL — never to a
             * client-supplied `state` value (anti open-redirect, GHSA-4rwq-65wh-45h4).
             */
            return response.redirect(`${postInstallUrl}?${urlParams.toString()}`);
        }
        catch (error) {
            // Preserve intentional HTTP exceptions instead of masking them as a generic 500.
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            // Handle errors and return an appropriate error response
            throw new common_1.HttpException(`Failed to add GitHub installation: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.GitHubAuthorizationController = GitHubAuthorizationController;
tslib_1.__decorate([
    (0, common_2.Public)(),
    (0, common_1.Get)('/callback'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], GitHubAuthorizationController.prototype, "githubIntegrationPostInstallCallback", null);
exports.GitHubAuthorizationController = GitHubAuthorizationController = tslib_1.__decorate([
    (0, common_1.Controller)('/integration/github'),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService,
        github_oauth_state_service_1.GithubOAuthStateService])
], GitHubAuthorizationController);
//# sourceMappingURL=github-authorization.controller.js.map