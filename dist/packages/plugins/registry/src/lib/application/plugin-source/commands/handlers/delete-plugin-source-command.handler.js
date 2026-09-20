"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePluginSourceCommandHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const delete_plugin_source_command_1 = require("../delete-plugin-source.command");
let DeletePluginSourceCommandHandler = class DeletePluginSourceCommandHandler {
    constructor(pluginSourceService) {
        this.pluginSourceService = pluginSourceService;
    }
    /**
     * Executes the delete plugin source command.
     * It attempts to soft delete the plugin source by sourceId, versionId and pluginId.
     *
     * @param command - The command containing the plugin source details
     * @throws NotFoundException if the plugin source is not found
     * @throws BadRequestException if the deletion fails
     */
    async execute(command) {
        const { versionId, pluginId, sourceId } = command;
        const count = await this.pluginSourceService.count({
            where: {
                version: {
                    id: versionId,
                    pluginId
                }
            },
            relations: ['version']
        });
        if (count <= 1) {
            throw new common_1.ForbiddenException('Cannot delete last source of plugin');
        }
        const result = await this.pluginSourceService.softDelete(sourceId, {
            where: {
                version: {
                    id: versionId,
                    pluginId
                }
            },
            relations: ['version']
        });
        if (!result) {
            throw new common_1.NotFoundException(`Plugin source with ID ${sourceId} not found or doesn't belong to the specified plugin version.`);
        }
    }
};
exports.DeletePluginSourceCommandHandler = DeletePluginSourceCommandHandler;
exports.DeletePluginSourceCommandHandler = DeletePluginSourceCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(delete_plugin_source_command_1.DeletePluginSourceCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSourceService])
], DeletePluginSourceCommandHandler);
//# sourceMappingURL=delete-plugin-source-command.handler.js.map