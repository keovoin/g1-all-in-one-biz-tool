"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginAccessGuard = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const plugin_installation_service_1 = require("../../domain/services/plugin-installation.service");
const plugin_subscription_access_service_1 = require("../../domain/services/plugin-subscription-access.service");
const plugin_service_1 = require("../../domain/services/plugin.service");
let PluginAccessGuard = class PluginAccessGuard {
    constructor(pluginService, pluginSubscriptionAccessService, pluginInstallationService) {
        this.pluginService = pluginService;
        this.pluginSubscriptionAccessService = pluginSubscriptionAccessService;
        this.pluginInstallationService = pluginInstallationService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const idFromRequest = this.getPluginIdFromRequest(request);
        const userId = core_1.RequestContext.currentUserId();
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        const currentUser = core_1.RequestContext.currentUser();
        const installedById = currentUser?.employeeId || null;
        if (!idFromRequest) {
            throw new common_1.ForbiddenException('Plugin ID or Installation ID is required.');
        }
        if (!userId) {
            throw new common_1.ForbiddenException('User ID is required.');
        }
        let pluginId;
        // Check if we have an installation ID - resolve to plugin ID
        if (request.params?.installationId || request.body?.installationId) {
            const installation = await this.pluginInstallationService.findOneByIdString(idFromRequest);
            if (!installation) {
                throw new common_1.ForbiddenException('Plugin installation not found.');
            }
            // Check if user is the one who installed the plugin
            if (installation.installedById === installedById) {
                return true;
            }
            pluginId = installation.pluginId;
        }
        else {
            pluginId = idFromRequest;
        }
        // Check if user is the plugin owner (uploaded the plugin)
        const isOwner = await this.pluginService.validatePluginOwnership(pluginId, userId);
        if (isOwner) {
            return true;
        }
        // Check if user has an active subscription for this plugin using centralized service
        const hasAccess = await this.pluginSubscriptionAccessService.validatePluginAccess(pluginId, tenantId, organizationId, userId);
        if (hasAccess) {
            return true;
        }
        throw new common_1.ForbiddenException('You do not have permission to access this plugin. You must be the owner or have an active subscription.');
    }
    getPluginIdFromRequest(request) {
        // Handle both plugin IDs and installation IDs
        const pluginId = request.params?.id || request.body?.id || request.params?.pluginId || request.body?.pluginId;
        if (pluginId) {
            return pluginId;
        }
        // If we have an installation ID, we'll need to look up the plugin ID
        const installationId = request.params?.installationId || request.body?.installationId;
        if (installationId) {
            // This will be handled asynchronously in canActivate
            return installationId;
        }
        return undefined;
    }
};
exports.PluginAccessGuard = PluginAccessGuard;
exports.PluginAccessGuard = PluginAccessGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [plugin_service_1.PluginService,
        plugin_subscription_access_service_1.PluginSubscriptionAccessService,
        plugin_installation_service_1.PluginInstallationService])
], PluginAccessGuard);
//# sourceMappingURL=plugin-access.guard.js.map