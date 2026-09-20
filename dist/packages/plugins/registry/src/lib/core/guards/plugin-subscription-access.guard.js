"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSubscriptionAccessGuard = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const core_2 = require("@nestjs/core");
const plugin_subscription_access_service_1 = require("../../domain/services/plugin-subscription-access.service");
/**
 * Guard to validate plugin subscription access before allowing operations.
 * This guard checks if the user has an active subscription to access the plugin.
 *
 * Usage:
 * @UseGuards(PluginSubscriptionAccessGuard)
 * @SetMetadata('pluginIdParam', 'pluginId') // Optional: specify which param contains the plugin ID
 *
 * By default, it looks for 'pluginId' in route params.
 */
let PluginSubscriptionAccessGuard = class PluginSubscriptionAccessGuard {
    constructor(reflector, subscriptionAccessService) {
        this.reflector = reflector;
        this.subscriptionAccessService = subscriptionAccessService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        // Get plugin ID from route parameters
        const pluginIdParam = this.reflector.get('pluginIdParam', context.getHandler()) || 'pluginId';
        const pluginId = request.params[pluginIdParam];
        if (!pluginId) {
            throw new common_1.ForbiddenException('Plugin ID parameter is missing in the request');
        }
        // Get context information
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        const userId = core_1.RequestContext.currentUserId();
        if (!tenantId) {
            throw new common_1.ForbiddenException('Tenant context is required');
        }
        // Check if user has access to the plugin
        try {
            const { canActivate } = await this.subscriptionAccessService.getSubscriptionDetails(pluginId, tenantId, organizationId, userId);
            return canActivate;
        }
        catch (error) {
            throw new common_1.ForbiddenException(error.message || 'You do not have an active subscription to access this plugin');
        }
    }
};
exports.PluginSubscriptionAccessGuard = PluginSubscriptionAccessGuard;
exports.PluginSubscriptionAccessGuard = PluginSubscriptionAccessGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_2.Reflector,
        plugin_subscription_access_service_1.PluginSubscriptionAccessService])
], PluginSubscriptionAccessGuard);
//# sourceMappingURL=plugin-subscription-access.guard.js.map