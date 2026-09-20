"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginInstallationAccessGuard = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const plugin_installation_service_1 = require("../../domain/services/plugin-installation.service");
const plugin_subscription_access_service_1 = require("../../domain/services/plugin-subscription-access.service");
const plugin_service_1 = require("../../domain/services/plugin.service");
let PluginInstallationAccessGuard = class PluginInstallationAccessGuard {
    constructor(pluginInstallationService, pluginService, pluginSubscriptionAccessService) {
        this.pluginInstallationService = pluginInstallationService;
        this.pluginService = pluginService;
        this.pluginSubscriptionAccessService = pluginSubscriptionAccessService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const installationId = this.getInstallationIdFromRequest(request);
        const userId = core_1.RequestContext.currentUserId();
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        const currentUser = core_1.RequestContext.currentUser();
        const installedById = currentUser?.employeeId || null;
        if (!installationId) {
            throw new common_1.ForbiddenException('Plugin installation ID is required.');
        }
        if (!userId) {
            throw new common_1.ForbiddenException('User ID is required.');
        }
        // Find the plugin installation
        const installation = await this.pluginInstallationService.findOneByIdString(installationId);
        if (!installation) {
            throw new common_1.ForbiddenException('Plugin installation not found.');
        }
        // Check if user is the one who installed the plugin
        if (installation.installedById === installedById) {
            return true;
        }
        // Check if user is the plugin owner (uploaded the plugin)
        const isOwner = await this.pluginService.validatePluginOwnership(installation.pluginId, userId);
        if (isOwner) {
            return true;
        }
        // Check if user has an active subscription for this plugin using centralized service
        const hasAccess = await this.pluginSubscriptionAccessService.validatePluginAccess(installation.pluginId, tenantId, organizationId, userId);
        if (hasAccess) {
            return true;
        }
        throw new common_1.ForbiddenException('You do not have permission to access this plugin installation. You must be the installer, plugin owner, or have an active subscription.');
    }
    getInstallationIdFromRequest(request) {
        return request.params?.installationId || request.body?.installationId || request.params?.id || request.body?.id;
    }
};
exports.PluginInstallationAccessGuard = PluginInstallationAccessGuard;
exports.PluginInstallationAccessGuard = PluginInstallationAccessGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [plugin_installation_service_1.PluginInstallationService,
        plugin_service_1.PluginService,
        plugin_subscription_access_service_1.PluginSubscriptionAccessService])
], PluginInstallationAccessGuard);
//# sourceMappingURL=plugin-installation-access.guard.js.map