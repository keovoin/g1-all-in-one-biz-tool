"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoverPluginSourceCommandHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const recover_plugin_source_command_1 = require("../recover-plugin-source.command");
/**
 * Command handler responsible for recovering a soft-deleted plugin source.
 */
let RecoverPluginSourceCommandHandler = class RecoverPluginSourceCommandHandler {
    constructor(pluginSourceService) {
        this.pluginSourceService = pluginSourceService;
    }
    /**
     * Executes the recover plugin source command.
     * This method attempts to restore a previously soft-deleted plugin source.
     *
     * @param command - The command containing the plugin source ID, version ID and associated plugin ID.
     * @throws NotFoundException if the specified plugin source is not found.
     * @throws BadRequestException if the recovery operation fails.
     */
    async execute(command) {
        const { versionId, pluginId, sourceId } = command;
        const result = await this.pluginSourceService.softRecover(versionId, {
            where: { id: sourceId, version: { id: versionId, pluginId } },
            relations: ['version'],
            withDeleted: true
        });
        if (!result) {
            throw new common_1.NotFoundException(`Soft-deleted plugin source with ID ${sourceId}, version ID ${versionId} and plugin ID $:console.warn();
				{pluginId} not found.`);
        }
    }
};
exports.RecoverPluginSourceCommandHandler = RecoverPluginSourceCommandHandler;
exports.RecoverPluginSourceCommandHandler = RecoverPluginSourceCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(recover_plugin_source_command_1.RecoverPluginSourceCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSourceService])
], RecoverPluginSourceCommandHandler);
//# sourceMappingURL=recover-plugin-source-command.handler.js.map