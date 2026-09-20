"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeactivatePluginCommandHandler = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const deactivate_plugin_command_1 = require("../deactivate-plugin.command");
/**
 * Command handler for deactivating plugin installations
 */
let DeactivatePluginCommandHandler = class DeactivatePluginCommandHandler {
    constructor(pluginInstallationService) {
        this.pluginInstallationService = pluginInstallationService;
    }
    /**
     * Deactivates a plugin installation if the current user has permission
     * @param command - Command containing the installation ID to deactivate
     * @returns Promise resolving to void upon successful deactivation
     * @throws BadRequestException if installation ID is missing
     * @throws NotFoundException if installation doesn't exist
     */
    async execute(command) {
        const { installationId } = command;
        // Validate input
        if (!installationId) {
            throw new common_1.BadRequestException('Plugin installation ID is required');
        }
        // Find the plugin installation
        const found = await this.pluginInstallationService.findOneOrFailByIdString(installationId);
        if (!found.success) {
            throw new common_1.NotFoundException('Plugin installation not found');
        }
        // Get the installation record
        const installation = found.record;
        // Ensure installation is in INSTALLED status
        if (installation.status !== contracts_1.PluginInstallationStatus.INSTALLED) {
            throw new common_1.BadRequestException('Only installed plugins can be deactivated');
        }
        // Only update if plugin installation is currently activated
        if (installation.isActivated) {
            await this.pluginInstallationService.update(installationId, {
                isActivated: false,
                deactivatedAt: new Date()
            });
        }
        return {
            success: true,
            message: 'Plugin deactivated successfully'
        };
    }
};
exports.DeactivatePluginCommandHandler = DeactivatePluginCommandHandler;
exports.DeactivatePluginCommandHandler = DeactivatePluginCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(deactivate_plugin_command_1.DeactivatePluginCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginInstallationService])
], DeactivatePluginCommandHandler);
//# sourceMappingURL=deactivate-plugin-command.handler.js.map