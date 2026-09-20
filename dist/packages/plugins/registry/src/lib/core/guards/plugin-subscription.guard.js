"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSubscriptionGuard = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const plugin_subscription_access_service_1 = require("../../domain/services/plugin-subscription-access.service");
/**
 * Guard to validate that the user has a valid subscription before installing a plugin
 */
let PluginSubscriptionGuard = class PluginSubscriptionGuard {
    constructor(pluginSubscriptionAccessService) {
        this.pluginSubscriptionAccessService = pluginSubscriptionAccessService;
    }
    /**
     * Validates that the user has a valid subscription for the plugin
     * @param context The execution context
     * @returns Promise<boolean> indicating if the user has valid subscription
     */
    async canActivate(context) {
        console.log('PluginSubscriptionGuard canActivate called');
        const request = context.switchToHttp().getRequest();
        const pluginId = request.params.pluginId;
        if (!pluginId) {
            throw new common_1.ForbiddenException('Plugin ID is required');
        }
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        const userId = core_1.RequestContext.currentUserId();
        if (!tenantId) {
            throw new common_1.ForbiddenException('Tenant context is required');
        }
        try {
            // Use centralized subscription access service for validation
            const hasAccess = await this.pluginSubscriptionAccessService.validatePluginAccess(pluginId, tenantId, organizationId, userId);
            if (!hasAccess) {
                console.log(`Plugin subscription access denied: Plugin ID: ${pluginId}, Tenant ID: ${tenantId}, User ID: ${userId}`);
                throw new common_1.ForbiddenException('Valid subscription required. Please purchase a subscription for this plugin before installation.');
            }
            console.log(`Plugin subscription access granted: Plugin ID: ${pluginId}, Tenant ID: ${tenantId}, User ID: ${userId}`);
            return true;
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            console.error('Error checking plugin subscription:', error);
            throw new common_1.ForbiddenException('Unable to verify plugin subscription. Please try again.');
        }
    }
};
exports.PluginSubscriptionGuard = PluginSubscriptionGuard;
exports.PluginSubscriptionGuard = PluginSubscriptionGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [plugin_subscription_access_service_1.PluginSubscriptionAccessService])
], PluginSubscriptionGuard);
//# sourceMappingURL=plugin-subscription.guard.js.map