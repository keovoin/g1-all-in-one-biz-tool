"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePluginVersionCommandHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const delete_plugin_version_command_1 = require("../delete-plugin-version.command");
let DeletePluginVersionCommandHandler = class DeletePluginVersionCommandHandler {
    constructor(pluginVersionService) {
        this.pluginVersionService = pluginVersionService;
    }
    /**
     * Executes the delete plugin command.
     * It attempts to soft delete the plugin version by versionId and pluginId.
     *
     * @param command - The command containing the plugin version details
     * @throws NotFoundException if the plugin version is not found
     * @throws BadRequestException if the deletion fails
     */
    async execute(command) {
        const { versionId, pluginId } = command;
        const count = await this.pluginVersionService.count({ where: { pluginId } });
        if (count <= 1) {
            throw new common_1.ForbiddenException('Cannot delete last version of plugin');
        }
        const result = await this.pluginVersionService.softDelete(versionId, {
            where: {
                pluginId
            }
        });
        if (!result) {
            throw new common_1.NotFoundException(`Plugin version with ID ${versionId} and plugin ID ${pluginId} not found.`);
        }
    }
};
exports.DeletePluginVersionCommandHandler = DeletePluginVersionCommandHandler;
exports.DeletePluginVersionCommandHandler = DeletePluginVersionCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(delete_plugin_version_command_1.DeletePluginVersionCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginVersionService])
], DeletePluginVersionCommandHandler);
//# sourceMappingURL=delete-plugin-version-command.handler.js.map