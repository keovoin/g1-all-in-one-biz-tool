"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UninstallPluginCommandHandler = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const uninstall_plugin_command_1 = require("../uninstall-plugin.command");
/**
 * Command handler for uninstalling a plugin.
 */
let UninstallPluginCommandHandler = class UninstallPluginCommandHandler {
    /**
     * Constructor for UninstallPluginCommandHandler.
     *
     * @param installationService - The plugin installation service.
     */
    constructor(installationService) {
        this.installationService = installationService;
    }
    /**
     * Executes the command to uninstall a plugin.
     *
     * @param command - The uninstall plugin command containing the input data.
     * @returns A promise that resolves when the plugin uninstallation is complete.
     * @throws {NotFoundException} If the plugin installation is not found.
     */
    async execute(command) {
        // Get current user and context
        const currentUser = core_1.RequestContext.currentUser();
        // Get employeeId - may be null for users without employee records or with CHANGE_SELECTED_EMPLOYEE permission
        const installedById = currentUser?.employeeId || null;
        const { pluginId, installationId } = command;
        // Find the plugin installation by plugin ID and the current employee ID
        const found = await this.installationService.findOneOrFailByIdString(installationId, {
            where: {
                pluginId,
                installedById,
                status: contracts_1.PluginInstallationStatus.INSTALLED
            }
        });
        // If the installation is not found, throw a NotFoundException
        if (!found.success) {
            // No further action needed
            return;
        }
        // Assign found installation
        const { id } = found.record;
        // Update the installation status and uninstalled date
        await this.installationService.update(id, {
            status: contracts_1.PluginInstallationStatus.UNINSTALLED,
            uninstalledAt: new Date()
        });
    }
};
exports.UninstallPluginCommandHandler = UninstallPluginCommandHandler;
exports.UninstallPluginCommandHandler = UninstallPluginCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(uninstall_plugin_command_1.UninstallPluginCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginInstallationService])
], UninstallPluginCommandHandler);
//# sourceMappingURL=uninstall-plugin-command.handler.js.map