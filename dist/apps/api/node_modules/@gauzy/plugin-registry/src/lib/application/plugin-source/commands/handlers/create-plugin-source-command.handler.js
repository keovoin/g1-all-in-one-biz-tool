"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePluginSourceCommandHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const create_plugin_source_command_1 = require("../../commands/create-plugin-source.command");
let CreatePluginSourceCommandHandler = class CreatePluginSourceCommandHandler {
    constructor(pluginVersionService, pluginSourceService) {
        this.pluginVersionService = pluginVersionService;
        this.pluginSourceService = pluginSourceService;
    }
    /**
     * Handles the execution of the CreatePluginVersionCommand.
     *
     * @param {CreatePluginSourceCommand} command - The command instance containing plugin ID and DTO.
     * @returns {Promise<IPluginSource[]>} - The created plugin source.
     * @throws {NotFoundException} - If the plugin with the given ID does not exist.
     */
    async execute(command) {
        const { pluginId, versionId, input } = command;
        // Fetch plugin by ID
        const validation = await this.pluginVersionService.findOneOrFailByWhereOptions({
            id: versionId,
            pluginId
        });
        if (!validation.success) {
            throw new common_1.NotFoundException(`Plugin source with ID ${versionId} not found.`);
        }
        // Create a plugin source
        const sources = input.map((source) => Object.assign(new domain_1.PluginSource(), { versionId }, source));
        // Save the plugin source
        return this.pluginSourceService.saveSources(sources);
    }
};
exports.CreatePluginSourceCommandHandler = CreatePluginSourceCommandHandler;
exports.CreatePluginSourceCommandHandler = CreatePluginSourceCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(create_plugin_source_command_1.CreatePluginSourceCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginVersionService,
        domain_1.PluginSourceService])
], CreatePluginSourceCommandHandler);
//# sourceMappingURL=create-plugin-source-command.handler.js.map