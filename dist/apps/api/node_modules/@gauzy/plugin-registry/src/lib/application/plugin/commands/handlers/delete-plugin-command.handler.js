"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePluginCommandHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const delete_plugin_command_1 = require("../delete-plugin.command");
let DeletePluginCommandHandler = class DeletePluginCommandHandler {
    constructor(pluginService) {
        this.pluginService = pluginService;
    }
    /**
     * Executes the delete plugin command
     *
     * @param command - The command containing the plugin ID to delete
     * @throws NotFoundException if the plugin doesn't exist
     * @throws BadRequestException if the deletion fails
     */
    async execute(command) {
        const { pluginId } = command;
        // Validate plugin ID
        if (!pluginId) {
            throw new common_1.BadRequestException('Plugin ID is required');
        }
        try {
            // Verify that the plugin exists before attempting deletion
            const plugin = await this.pluginService.findOneOrFailByIdString(pluginId);
            if (!plugin.success) {
                throw new common_1.NotFoundException(`Plugin with ID ${pluginId} not found`);
            }
            // Delete the plugin
            await this.pluginService.softDelete(pluginId);
            return {
                message: `Plugin with ID ${pluginId} has been deleted successfully`,
                status: common_1.HttpStatus.OK
            };
        }
        catch (error) {
            // Rethrow specific errors
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            // Wrap unexpected errors
            throw new common_1.BadRequestException(`Failed to delete plugin: ${error.message}`);
        }
    }
};
exports.DeletePluginCommandHandler = DeletePluginCommandHandler;
exports.DeletePluginCommandHandler = DeletePluginCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(delete_plugin_command_1.DeletePluginCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginService])
], DeletePluginCommandHandler);
//# sourceMappingURL=delete-plugin-command.handler.js.map