"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallPluginCommandHandler = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const install_plugin_command_1 = require("../../commands/install-plugin.command");
/**
 * Command handler responsible for handling the installation of plugins.
 */
let InstallPluginCommandHandler = class InstallPluginCommandHandler {
    constructor(
    /**
     * Service responsible for handling plugin installation logic.
     */
    installationService, 
    /**
     * Service responsible for validating plugin subscription access.
     */
    subscriptionAccessService) {
        this.installationService = installationService;
        this.subscriptionAccessService = subscriptionAccessService;
        this.accessDeniedMessages = {
            [contracts_1.PluginScope.USER]: 'You do not have an active subscription for this plugin. Please subscribe to install and use it.',
            [contracts_1.PluginScope.ORGANIZATION]: 'Your organization does not have an active subscription for this plugin. Please contact your administrator.',
            [contracts_1.PluginScope.TENANT]: 'Your tenant does not have an active subscription for this plugin. Please contact your administrator.'
        };
    }
    /**
     * Executes the command to install a plugin.
     *
     * @param command - The install plugin command containing the plugin ID and version information.
     * @returns A promise that resolves when the plugin installation is completed.
     * @throws {NotFoundException} If the plugin installation entry is not found.
     * @throws {ForbiddenException} If user doesn't have proper subscription for plugin installation.
     */
    async execute(command) {
        const { pluginId, input: { versionId } } = command;
        const userId = core_1.RequestContext.currentUserId();
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        // Get employeeId - may be null for users without employee records or with CHANGE_SELECTED_EMPLOYEE permission
        const currentUser = core_1.RequestContext.currentUser();
        const installedById = currentUser?.employeeId || null;
        // Ensure user has an associated employee record
        if (!installedById) {
            throw new common_1.ForbiddenException('Plugin installation requires an associated employee record. Please contact your administrator.');
        }
        // Check if user has valid subscription for this plugin (any scope: user, organization, or tenant)
        const state = await this.subscriptionAccessService.getSubscriptionDetails(pluginId, tenantId, organizationId, userId);
        // Ensure user has access to install the plugin
        this.ensurePluginAccess(state);
        // Build where clause for finding existing installation (status excluded to avoid UNIQUE constraint violations
        // when re-installing after a previous uninstall)
        const whereClause = {
            pluginId,
            versionId,
            installedById
        };
        // Find existing plugin installation
        const { success, record: found } = await this.installationService.findOneOrFailByOptions({ where: whereClause });
        if (success && found.isInstalled()) {
            // Plugin is already installed, return the existing record
            return found;
        }
        // Create the PluginInstallation entity
        const installationData = success
            ? found
            : {
                tenantId,
                pluginId,
                versionId,
                installedById,
                ...(organizationId && { organizationId })
            };
        const installation = Object.assign(new domain_1.PluginInstallation(), installationData);
        // Mark the plugin installation as installed
        installation.markAsInstalled();
        // Persist the plugin installation record
        return this.installationService.save(installation);
    }
    ensurePluginAccess(state) {
        if (state.hasAccess)
            return;
        const message = this.accessDeniedMessages[state.accessLevel] ?? 'Access denied. Missing valid subscription.';
        throw new common_1.ForbiddenException(message);
    }
};
exports.InstallPluginCommandHandler = InstallPluginCommandHandler;
exports.InstallPluginCommandHandler = InstallPluginCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(install_plugin_command_1.InstallPluginCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginInstallationService,
        domain_1.PluginSubscriptionAccessService])
], InstallPluginCommandHandler);
//# sourceMappingURL=install-plugin-command.handler.js.map