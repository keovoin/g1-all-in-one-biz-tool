"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeComController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const core_1 = require("@gauzy/core");
const contracts_1 = require("@gauzy/contracts");
const make_com_service_1 = require("./make-com.service");
const dto_1 = require("./dto");
const make_com_oauth_service_1 = require("./make-com-oauth.service");
const webhook_url_validator_1 = require("./webhook-url.validator");
let MakeComController = class MakeComController {
    constructor(makeComService, makeComOAuthService) {
        this.makeComService = makeComService;
        this.makeComOAuthService = makeComOAuthService;
    }
    /**
     * Retrieves the Make.com integration settings for the current tenant.
     *
     * @returns {Promise<IMakeComIntegrationSettings>} A promise that resolves with the tenant's Make.com integration settings.
     */
    async getSettings() {
        return this.makeComService.getIntegrationSettings();
    }
    /**
     * Updates the Make.com integration settings for the current tenant.
     *
     * @param {UpdateMakeComSettingsDTO} input - The DTO containing the updated Make.com settings.
     * @returns {Promise<IMakeComIntegrationSettings>} A promise that resolves to the updated integration settings.
     */
    async updateIntegrationSettings(settings) {
        // Verify tenant context exists
        if (!core_1.RequestContext.currentTenantId()) {
            throw new common_1.NotFoundException('Tenant ID not found in request context');
        }
        // SSRF egress guard: reject webhook URLs that target loopback/private/link-local hosts,
        // non-HTTPS schemes or the cloud-metadata endpoint (GHSA-534m-c6mh-mp98).
        if (settings.webhookUrl) {
            (0, webhook_url_validator_1.assertSafeMakeWebhookUrl)(settings.webhookUrl);
        }
        // Update webhook settings
        return this.makeComService.updateIntegrationSettings({
            isEnabled: settings.isEnabled,
            webhookUrl: settings.webhookUrl
        });
    }
    /**
     * Initialize Make.com OAuth integration for the current tenant.
     * Client credentials are read from server-side environment variables
     * and are never exposed to tenants.
     */
    async initializeIntegration(body) {
        const tenantId = core_1.RequestContext.currentTenantId();
        if (!tenantId) {
            throw new common_1.NotFoundException('Tenant ID not found in request context');
        }
        // Generate authorization URL first — if this fails (e.g. missing config),
        // we avoid leaving a partial integration record behind.
        const authorizationUrl = await this.makeComOAuthService.getAuthorizationUrl({
            organizationId: body?.organizationId
        });
        // Save the integration with server-side credentials
        const integration = await this.makeComService.addIntegrationSettings(body?.organizationId);
        return {
            authorizationUrl,
            integrationId: integration.id
        };
    }
    /**
     * Handle Token requests from Make.com custom apps.
     * This endpoint is called by your Make.com custom app during the OAuth flow.
     * It's configured in your custom app's "token" section.
     */
    async tokenEndpoint(body) {
        try {
            // Verify grant_type
            if (body.grant_type !== 'authorization_code') {
                throw new common_1.BadRequestException('Unsupported grant type');
            }
            // Validate required fields
            if (!body.code || !body.state || !body.client_id || !body.client_secret) {
                throw new common_1.BadRequestException('Missing required parameters');
            }
            // Verify state and retrieve the PKCE code verifier
            const stateVerification = await this.makeComOAuthService.verifyState(body.state);
            if (!stateVerification.isValid) {
                throw new common_1.BadRequestException('Invalid or expired state parameter');
            }
            // Exchange code for tokens with the PKCE code verifier
            const tokenResponse = await this.makeComOAuthService.exchangeCodeForToken(body.code, body.state, stateVerification.codeVerifier);
            // Return the token response in the format expected by Make.com
            return {
                access_token: tokenResponse.access_token,
                token_type: tokenResponse.token_type,
                expires_in: tokenResponse.expires_in,
                refresh_token: tokenResponse.refresh_token
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'Invalid request');
        }
    }
};
exports.MakeComController = MakeComController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Make.com integration settings for tenant' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Retrieved tenant Make.com settings'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Tenant not found in request context'
    }),
    (0, common_1.Get)('/'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComController.prototype, "getSettings", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update Make.com integration settings for tenant' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Make.com settings updated successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Tenant ID not found in request context'
    }),
    (0, common_1.Post)('/'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.UpdateMakeComSettingsDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComController.prototype, "updateIntegrationSettings", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Initialize Make.com OAuth integration' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Make.com OAuth authorization URL generated successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Server-side OAuth credentials not configured'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Tenant ID not found in request context'
    }),
    (0, common_1.Post)('/oauth-settings'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComController.prototype, "initializeIntegration", null);
tslib_1.__decorate([
    (0, common_1.Post)('/token'),
    (0, swagger_1.ApiOperation)({ summary: 'Handle Make.com token requests (For Custom Apps)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns OAuth tokens'
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid request or grant type'
    }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MakeComController.prototype, "tokenEndpoint", null);
exports.MakeComController = MakeComController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Make.com Integrations'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_ADD, contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    (0, common_1.Controller)('/integration/make-com'),
    tslib_1.__metadata("design:paramtypes", [make_com_service_1.MakeComService,
        make_com_oauth_service_1.MakeComOAuthService])
], MakeComController);
//# sourceMappingURL=make-com.controller.js.map