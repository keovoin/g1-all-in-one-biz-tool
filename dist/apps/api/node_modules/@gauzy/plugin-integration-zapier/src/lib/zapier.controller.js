"use strict";
var ZapierController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZapierController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const zapier_service_1 = require("./zapier.service");
const node_crypto_1 = require("node:crypto");
let ZapierController = ZapierController_1 = class ZapierController {
    /**
     * Creates an instance of the ZapierController.
     * Initializes the controller with the required services for managing Zapier integrations.
     * Ensures that the necessary configuration values are properly set in the environment variables.
     * These are essential for enabling secure and functional Zapier integrations.
     */
    constructor(zapierService) {
        this.zapierService = zapierService;
        this.logger = new common_1.Logger(ZapierController_1.name);
    }
    /**
     * Initialize a new Zapier integration.
     * Stores client credentials and returns the authorization URL to redirect
     * the admin to Zapier's OAuth consent page.
     */
    async initializeIntegration(body) {
        const tenantId = core_1.RequestContext.currentTenantId();
        if (!tenantId) {
            throw new common_1.BadRequestException('Tenant ID is required');
        }
        if (!body?.organizationId) {
            throw new common_1.BadRequestException('Organization ID is required');
        }
        // Generate state parameter for CSRF protection
        const state = Buffer.from((0, node_crypto_1.randomBytes)(32)).toString('base64url');
        // Store the integration with server-side credentials and state
        const integration = await this.zapierService.storeIntegrationCredentials({
            organizationId: body.organizationId,
            state
        });
        // Generate authorization URL using server-side client ID
        const authorizationUrl = this.zapierService.getAuthorizationUrl({ state });
        return {
            authorizationUrl,
            integrationId: integration.id
        };
    }
    /**
     * Get available Zapier triggers.
     * This method retrieves the available triggers from Zapier based on the provided token.
     */
    async getTriggers(token) {
        try {
            this.validateToken(token, true);
            return await this.zapierService.fetchTriggers(token);
        }
        catch (error) {
            this.handleZapierError(error, 'triggers');
        }
    }
    async getActions(token) {
        try {
            this.validateToken(token, true);
            return await this.zapierService.fetchActions(token);
        }
        catch (error) {
            this.handleZapierError(error, 'actions');
        }
    }
    /**
     * Get Zaps for the authenticated Zapier account.
     */
    async getZaps(token) {
        try {
            this.validateToken(token, true);
            return await this.zapierService.fetchZaps(token);
        }
        catch (error) {
            this.handleZapierError(error, 'zaps');
        }
    }
    /**
     * Create a new Zap on the authenticated Zapier account.
     */
    async createZap(token, body) {
        try {
            this.validateToken(token, true);
            if (!body?.title || !Array.isArray(body?.steps) || body.steps.length === 0) {
                throw new common_1.BadRequestException('Zap title and at least one step are required');
            }
            return await this.zapierService.createZap(body, token);
        }
        catch (error) {
            this.handleZapierError(error, 'zaps');
        }
    }
    /**
     * Get publicly available Zap templates from Zapier.
     * This Zapier endpoint does not require an OAuth access token — it only
     * needs the server-configured `client_id`, which is attached in the service.
     */
    async getZapTemplates(limit) {
        try {
            const parsedLimit = limit ? Number(limit) : undefined;
            return await this.zapierService.fetchZapTemplates(parsedLimit);
        }
        catch (error) {
            this.handleZapierError(error, 'zap-templates');
        }
    }
    /**
     * Helper method to validate Zapier token
     */
    validateToken(token, isThrowUnauthorizedOnMissingToken = false) {
        const exception = isThrowUnauthorizedOnMissingToken ? common_1.UnauthorizedException : common_1.BadRequestException;
        if (!token) {
            throw new exception('Token parameter is required');
        }
        if (!token.trim()) {
            throw new exception('Token parameter cannot be empty');
        }
    }
    /**
     * Helper method to handle Zapier endpoint errors
     */
    handleZapierError(error, endpointType) {
        this.logger.error(`Failed to fetch Zapier ${endpointType}`, error);
        // Re-throw specific known errors
        if (error instanceof common_1.UnauthorizedException) {
            throw error;
        }
        if (error instanceof common_1.BadRequestException) {
            throw error;
        }
        if (error instanceof common_1.NotFoundException) {
            throw error;
        }
        // For unexpected errors, include original error message
        throw new common_1.InternalServerErrorException(`Failed to fetch Zapier ${endpointType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    /**
     * Get Zapier access token for a given integration
     */
    async getZapierToken(integrationId) {
        try {
            return await this.zapierService.getZapierToken(integrationId);
        }
        catch (error) {
            this.logger.error(`Failed to get Zapier token for integration ID ${integrationId}`, error);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to get Zapier token');
        }
    }
    /**
     * Retrieves the Zapier integration settings for the current tenant.
     *
     * @returns {Promise<IZapierIntegrationSettings>} A promise that resolves with the tenant's Zapier integration settings.
     */
    async getSettings() {
        return this.zapierService.getIntegrationSettings();
    }
};
exports.ZapierController = ZapierController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Initialize a new Zapier integration' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Authorization URL generated successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Missing required fields'
    }),
    (0, common_1.Post)('/settings'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ZapierController.prototype, "initializeIntegration", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get available Zapier triggers' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully retrieved Zapier triggers'
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing authorization token'
    }),
    (0, common_1.Get)('/triggers'),
    tslib_1.__param(0, (0, common_1.Query)('token')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ZapierController.prototype, "getTriggers", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get available Zapier actions' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully retrieved Zapier actions'
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing authorization token'
    }),
    (0, common_1.Get)('/actions'),
    tslib_1.__param(0, (0, common_1.Query)('token')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ZapierController.prototype, "getActions", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Zapier zaps' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully retrieved Zapier zaps'
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing authorization token'
    }),
    (0, common_1.Get)('/zaps'),
    tslib_1.__param(0, (0, common_1.Query)('token')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ZapierController.prototype, "getZaps", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new Zapier zap' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Successfully created Zapier zap'
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Missing required fields'
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing authorization token'
    }),
    (0, common_1.Post)('/zaps'),
    tslib_1.__param(0, (0, common_1.Query)('token')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ZapierController.prototype, "createZap", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Zapier zap templates (public)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully retrieved Zapier zap templates'
    }),
    (0, common_1.Get)('/zap-templates'),
    tslib_1.__param(0, (0, common_1.Query)('limit')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ZapierController.prototype, "getZapTemplates", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Zapier access token for integration' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully retrieved Zapier access token'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Access token not found for the given integration'
    }),
    (0, common_1.Get)('/token/:integrationId'),
    tslib_1.__param(0, (0, common_1.Param)('integrationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ZapierController.prototype, "getZapierToken", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Zapier integration settings for tenant' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Retrieved tenant Zapier settings'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Tenant not found in request context'
    }),
    (0, common_1.Get)('/settings'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ZapierController.prototype, "getSettings", null);
exports.ZapierController = ZapierController = ZapierController_1 = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Zapier Integrations'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_ADD, contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    (0, common_1.Controller)('/integration/zapier'),
    tslib_1.__metadata("design:paramtypes", [zapier_service_1.ZapierService])
], ZapierController);
//# sourceMappingURL=zapier.controller.js.map