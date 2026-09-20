"use strict";
var MakeComAuthorizationController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeComAuthorizationController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@gauzy/config");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@gauzy/common");
const contracts_1 = require("@gauzy/contracts");
const make_com_oauth_service_1 = require("./make-com-oauth.service");
const make_com_config_1 = require("./make-com.config");
let MakeComAuthorizationController = MakeComAuthorizationController_1 = class MakeComAuthorizationController {
    constructor(config, makeComOAuthService) {
        this.config = config;
        this.makeComOAuthService = makeComOAuthService;
        this.logger = new common_1.Logger(MakeComAuthorizationController_1.name);
    }
    /**
     * Initiates the OAuth 2.0 authorization flow with Make.com.
     * Redirects the user to the Make.com authorization page.
     *
     * @param {object} params - The query parameters.
     * @param {string} [params.state] - Optional state parameter for OAuth flow.
     */
    async authorize({ state }) {
        const authorizationUrl = await this.makeComOAuthService.getAuthorizationUrl({ state });
        return {
            authorizationUrl
        };
    }
    /**
     * Resolve the post-install redirect URL from config, with fallback to
     * the statically resolved constant (which doesn't rely on dotenv-expand).
     */
    getPostInstallUrl() {
        const fromConfig = this.config.get('makeCom')?.postInstallUrl;
        // Detect unresolved env variable interpolation (e.g. "${CLIENT_BASE_URL}/...")
        if (fromConfig && !fromConfig.includes('${')) {
            return fromConfig;
        }
        return make_com_config_1.MAKE_POST_INSTALL_URL;
    }
    /**
     * Build a redirect URL by appending query params.
     * Handles hash-based Angular routing (e.g. http://host/#/path) by placing
     * query params within the hash fragment, after the route path.
     */
    buildRedirectUrl(baseUrl, params) {
        const queryString = new URLSearchParams(params).toString();
        const hashIndex = baseUrl.indexOf('#');
        if (hashIndex !== -1) {
            // Hash-based Angular routing: place query params after the hash route
            // e.g. http://host/#/path?query instead of http://host?query#/path
            const beforeHash = baseUrl.substring(0, hashIndex);
            const hashPart = baseUrl.substring(hashIndex);
            const separator = hashPart.includes('?') ? '&' : '?';
            return `${beforeHash}${hashPart}${separator}${queryString}`;
        }
        const separator = baseUrl.includes('?') ? '&' : '?';
        return `${baseUrl}${separator}${queryString}`;
    }
    /**
     * Handles the callback from Make.com after user authorization.
     * Exchanges the authorization code for access and refresh tokens.
     *
     * @param {object} query - The query parameters from the callback.
     * @param {Response} response - Express Response object.
     */
    async callback({ code, state, error, error_description }, response) {
        const postInstallUrl = this.getPostInstallUrl();
        this.logger.log(`OAuth callback received. postInstallUrl: ${postInstallUrl}`);
        try {
            // Handle error from Make.com
            if (error) {
                throw new common_1.BadRequestException(`OAuth error ${error} - ${error_description || 'No description provided'}`);
            }
            // Validate required data
            if (!code || !state) {
                throw new common_1.BadRequestException('Missing required parameters: code and state');
            }
            // Process the OAuth callback - verify state and exchange code for tokens
            await this.makeComOAuthService.handleAuthorizationCallback(code, state);
            // Redirect to the application with success params
            const url = this.buildRedirectUrl(postInstallUrl, {
                success: 'true',
                integration: contracts_1.IntegrationEnum.MakeCom,
                message: 'Integration connected successfully'
            });
            this.logger.log(`OAuth callback successful, redirecting to: ${url}`);
            return response.redirect(url);
        }
        catch (error) {
            const errorMessage = error.response?.message || error.message || 'Failed to complete OAuth flow';
            this.logger.error(`OAuth callback failed: ${errorMessage}`);
            const url = this.buildRedirectUrl(postInstallUrl, {
                success: 'false',
                integration: contracts_1.IntegrationEnum.MakeCom,
                message: errorMessage
            });
            return response.redirect(url);
        }
    }
};
exports.MakeComAuthorizationController = MakeComAuthorizationController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Initiate OAuth 2.0 flow with Make.com' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the Make.com authorization URL'
    }),
    (0, common_1.Get)('/authorize'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComAuthorizationController.prototype, "authorize", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Handle Make.com OAuth callback' }),
    (0, swagger_1.ApiResponse)({
        status: 302,
        description: 'Redirects to the application with token information'
    }),
    (0, common_1.Get)('/callback'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComAuthorizationController.prototype, "callback", null);
exports.MakeComAuthorizationController = MakeComAuthorizationController = MakeComAuthorizationController_1 = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Make.com OAuth'),
    (0, common_2.Public)(),
    (0, common_1.Controller)('/integration/make-com/oauth'),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService, make_com_oauth_service_1.MakeComOAuthService])
], MakeComAuthorizationController);
//# sourceMappingURL=make-com-authorization.controller.js.map