"use strict";
var ZapierWebhookController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZapierWebhookController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const utils_1 = require("@gauzy/utils");
const zapier_webhook_service_1 = require("./zapier-webhook.service");
const zapier_service_1 = require("./zapier.service");
const zapier_webhook_subscription_entity_1 = require("./zapier-webhook-subscription.entity");
let ZapierWebhookController = ZapierWebhookController_1 = class ZapierWebhookController {
    constructor(zapierWebhookService, zapierService) {
        this.zapierWebhookService = zapierWebhookService;
        this.zapierService = zapierService;
        this.logger = new common_1.Logger(ZapierWebhookController_1.name);
    }
    /**
     * Handles the incoming request with the provided request body and authorization token.
     *
     * @param body - The request payload containing the data required for processing.
     * @param authorization - The authorization token used for authenticating the request.
     * @returns A promise or response object indicating the outcome of the request (e.g., success status, data, or error).
     */
    async createWebhook(body, authorization) {
        if (!authorization) {
            throw new common_1.UnauthorizedException('Authorization header is required');
        }
        if (!authorization.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Authorization header must start with Bearer');
        }
        const token = authorization.split(' ')[1];
        try {
            // Resolve integration from opaque token or JWT (multi-app OAuth)
            const integration = await this.zapierService.resolveIntegrationFromBearerToken(token);
            if (!integration) {
                throw new common_1.ForbiddenException('Invalid token');
            }
            const { target_url, event } = body;
            if (!target_url || !event) {
                throw new common_1.BadRequestException('target_url and event are required');
            }
            // Validate webhook URL
            this.validateWebhookUrl(target_url);
            // Validate event name
            this.validateEventName(event);
            const { tenantId, organizationId, id: integrationId } = integration;
            if (!tenantId) {
                throw new common_1.BadRequestException('Integration tenant ID is required');
            }
            if (!organizationId) {
                throw new common_1.BadRequestException('Integration organization ID is required');
            }
            const subscription = await this.zapierWebhookService.createSubscription({
                targetUrl: target_url,
                event,
                integrationId,
                tenantId,
                organizationId
            });
            return subscription;
        }
        catch (error) {
            this.logger.error('Failed to create webhook subscription', error);
            if (error instanceof common_1.BadRequestException || error instanceof common_1.UnauthorizedException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to create webhook subscription');
        }
    }
    /**
     * Validate webhook URL for security
     */
    validateWebhookUrl(url) {
        // SSRF egress guard — applied UNCONDITIONALLY (previously the private-IP/loopback checks ran
        // only when NODE_ENV === 'production', leaving dev/staging unprotected). Rejects non-HTTPS
        // schemes, embedded credentials, and loopback/private/link-local hosts including the cloud
        // metadata IP 169.254.169.254 (GHSA-534m-c6mh-mp98 sibling).
        const reason = (0, utils_1.getUnsafeOutboundUrlReason)(url);
        if (reason) {
            throw new common_1.BadRequestException(`Invalid webhook URL: ${reason}`);
        }
    }
    /**
     * Validate event name
     */
    validateEventName(event) {
        if (typeof event !== 'string') {
            throw new common_1.BadRequestException('Event must be a string');
        }
        if (event.length < 1 || event.length > 100) {
            throw new common_1.BadRequestException('Event name must be between 1 and 100 characters');
        }
        // Allow only alphanumeric characters, dots, underscores, and hyphens
        const EVENT_NAME_REGEX = /^[a-zA-Z0-9._-]+$/;
        if (!EVENT_NAME_REGEX.test(event)) {
            throw new common_1.BadRequestException('Event name can only contain alphanumeric characters, dots, underscores, and hyphens');
        }
    }
    /**
     * Deletes an existing Zapier webhook subscription.
     *
     * @param id - The unique identifier of the webhook subscription to delete.
     * @param authorization - The Bearer token for authenticating the request.
     */
    async deleteWebhook(id, authorization) {
        if (!authorization) {
            throw new common_1.UnauthorizedException('Authorization header is required');
        }
        if (!authorization.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Authorization header must start with Bearer');
        }
        const token = authorization.split(' ')[1];
        try {
            // Resolve integration from opaque token or JWT (multi-app OAuth)
            const integration = await this.zapierService.resolveIntegrationFromBearerToken(token);
            if (!integration) {
                throw new common_1.ForbiddenException('Invalid token');
            }
            if (!integration.tenantId) {
                throw new common_1.BadRequestException('Integration tenant ID is required.');
            }
            await this.zapierWebhookService.deleteSubscription(id, integration.tenantId);
        }
        catch (error) {
            this.logger.error(`Failed to delete webhook subscription with id ${id}`, error);
            throw new common_1.InternalServerErrorException('Failed to delete webhook subscription.');
        }
    }
};
exports.ZapierWebhookController = ZapierWebhookController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new Zapier webhook subscription' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Webhook subscription created successfully',
        type: zapier_webhook_subscription_entity_1.ZapierWebhookSubscription
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Missing required fields'
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing authorization token'
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Invalid token'
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal Server Error'
    }),
    (0, common_1.Post)('/webhooks'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Headers)('Authorization')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ZapierWebhookController.prototype, "createWebhook", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete an existing Zapier webhook subscription' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Webhook subscription deleted successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Missing or invalid parameters'
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing authorization token'
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Invalid token'
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal Server Error'
    }),
    (0, common_1.Delete)('/webhooks/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Headers)('Authorization')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ZapierWebhookController.prototype, "deleteWebhook", null);
exports.ZapierWebhookController = ZapierWebhookController = ZapierWebhookController_1 = tslib_1.__decorate([
    (0, common_1.Controller)('/integration/zapier'),
    tslib_1.__metadata("design:paramtypes", [zapier_webhook_service_1.ZapierWebhookService,
        zapier_service_1.ZapierService])
], ZapierWebhookController);
//# sourceMappingURL=zapier-webhook.controller.js.map