"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivatePluginCommandHandler = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const activate_plugin_command_1 = require("../activate-plugin.command");
/**
 * Command handler for activating plugin installations
 */
let ActivatePluginCommandHandler = class ActivatePluginCommandHandler {
    constructor(pluginInstallationService) {
        this.pluginInstallationService = pluginInstallationService;
    }
    /**
     * Activates a plugin installation if the current user has permission
     * @param command - Command containing the installation ID to activate
     * @returns Promise resolving to void upon successful activation
     * @throws BadRequestException if installation ID is missing
     * @throws NotFoundException if installation doesn't exist
     */
    async execute(command) {
        // Get current user and context
        const currentUser = core_1.RequestContext.currentUser();
        // Get employeeId - may be null for users without employee records or with CHANGE_SELECTED_EMPLOYEE permission
        const installedById = currentUser?.employeeId || null;
        // Extract installation ID and plugin ID from command
        const { installationId, pluginId } = command;
        // Validate input
        if (!installationId) {
            throw new common_1.BadRequestException('Plugin installation ID is required');
        }
        // Find the plugin installation
        const found = await this.pluginInstallationService.findOneOrFailByWhereOptions({
            id: installationId,
            installedById,
            pluginId
        });
        if (!found.success) {
            throw new common_1.ForbiddenException('You do not have permission to activate this plugin installation');
        }
        // Get the installation record
        const installation = found.record;
        // Ensure installation is in INSTALLED status before activation
        if (installation.status !== contracts_1.PluginInstallationStatus.INSTALLED) {
            throw new common_1.BadRequestException('Plugin must be installed before it can be activated');
        }
        // Only update if plugin installation is not already activated
        if (!installation.isActivated) {
            await this.pluginInstallationService.update(installationId, {
                isActivated: true,
                activatedAt: new Date(),
                deactivatedAt: null // Clear any previous deactivation date
            });
        }
        return {
            success: true,
            message: 'Plugin activated successfully'
        };
    }
};
exports.ActivatePluginCommandHandler = ActivatePluginCommandHandler;
exports.ActivatePluginCommandHandler = ActivatePluginCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(activate_plugin_command_1.ActivatePluginCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginInstallationService])
], ActivatePluginCommandHandler);
//# sourceMappingURL=activate-plugin-command.handler.js.map