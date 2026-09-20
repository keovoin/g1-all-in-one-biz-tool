"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePluginVersionCommandHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const create_plugin_version_command_1 = require("../create-plugin-version.command");
let CreatePluginVersionCommandHandler = class CreatePluginVersionCommandHandler {
    constructor(pluginVersionService, pluginSourceService, pluginService) {
        this.pluginVersionService = pluginVersionService;
        this.pluginSourceService = pluginSourceService;
        this.pluginService = pluginService;
    }
    /**
     * Handles the execution of the CreatePluginVersionCommand.
     *
     * @param {CreatePluginVersionCommand} command - The command instance containing plugin ID and DTO.
     * @returns {Promise<IPluginVersion>} - The created plugin version.
     * @throws {NotFoundException} - If the plugin with the given ID does not exist.
     */
    async execute(command) {
        const { pluginId, dto } = command;
        // Fetch plugin by ID
        const pluginResult = await this.pluginService.findOneOrFailByIdString(pluginId);
        if (!pluginResult.success) {
            throw new common_1.NotFoundException(`Plugin with ID ${pluginId} not found.`);
        }
        // Create a plugin source
        const source = await this.pluginSourceService.createSources(dto.sources);
        // Create and return the new plugin version
        return this.pluginVersionService.createVersion(dto, pluginResult.record, source);
    }
};
exports.CreatePluginVersionCommandHandler = CreatePluginVersionCommandHandler;
exports.CreatePluginVersionCommandHandler = CreatePluginVersionCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(create_plugin_version_command_1.CreatePluginVersionCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginVersionService,
        domain_1.PluginSourceService,
        domain_1.PluginService])
], CreatePluginVersionCommandHandler);
//# sourceMappingURL=create-plugin-version-command.handler.js.map