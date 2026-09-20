"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSubscriptionAnalyticsController = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const application_1 = require("../../application");
const domain_1 = require("../../domain");
/**
 * Plugin Subscription Analytics Controller
 * Provides analytics and access verification for plugin subscriptions
 */
let PluginSubscriptionAnalyticsController = class PluginSubscriptionAnalyticsController {
    constructor(queryBus) {
        this.queryBus = queryBus;
    }
    /**
     * Get expiring subscriptions analytics
     */
    async getExpiringSubscriptions(days) {
        return await this.queryBus.execute(new application_1.GetExpiringSubscriptionsQuery(days || 7));
    }
    /**
     * Verify plugin access for current user/tenant
     */
    async verifyPluginAccess(pluginId) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        const accessCheckDto = { pluginId };
        return await this.queryBus.execute(new application_1.CheckPluginAccessQuery(accessCheckDto, tenantId, organizationId));
    }
};
exports.PluginSubscriptionAnalyticsController = PluginSubscriptionAnalyticsController;
tslib_1.__decorate([
    (0, common_1.Get)('expiring'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get expiring subscriptions',
        description: 'Retrieve subscriptions that are expiring within specified days'
    }),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false, description: 'Days until expiry (default: 7)', type: Number }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Expiring subscriptions retrieved successfully',
        type: [domain_1.PluginSubscription]
    }),
    tslib_1.__param(0, (0, common_1.Query)('days')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionAnalyticsController.prototype, "getExpiringSubscriptions", null);
tslib_1.__decorate([
    (0, common_1.Get)('access-verification'),
    (0, swagger_1.ApiOperation)({
        summary: 'Verify plugin access',
        description: 'Check if current user/tenant has access to specified plugin'
    }),
    (0, swagger_1.ApiQuery)({ name: 'pluginId', required: true, description: 'Plugin ID to check access for', type: String }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin access verification completed',
        schema: {
            type: 'object',
            properties: {
                hasAccess: { type: 'boolean' },
                subscription: { $ref: '#/components/schemas/PluginSubscription' }
            }
        }
    }),
    tslib_1.__param(0, (0, common_1.Query)('pluginId', common_1.ParseUUIDPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionAnalyticsController.prototype, "verifyPluginAccess", null);
exports.PluginSubscriptionAnalyticsController = PluginSubscriptionAnalyticsController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Plugin Subscription Analytics'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, common_1.Controller)('plugins/subscriptions/analytics'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.QueryBus])
], PluginSubscriptionAnalyticsController);
//# sourceMappingURL=plugin-subscription-analytics.controller.js.map