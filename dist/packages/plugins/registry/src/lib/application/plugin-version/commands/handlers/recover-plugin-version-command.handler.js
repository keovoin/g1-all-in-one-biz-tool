"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoverPluginVersionCommandHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const recover_plugin_version_command_1 = require("../recover-plugin-version.command");
/**
 * Command handler responsible for recovering a soft-deleted plugin version.
 */
let RecoverPluginVersionCommandHandler = class RecoverPluginVersionCommandHandler {
    constructor(pluginVersionService) {
        this.pluginVersionService = pluginVersionService;
    }
    /**
     * Executes the recover plugin version command.
     * This method attempts to restore a previously soft-deleted plugin version.
     *
     * @param command - The command containing the plugin version ID and associated plugin ID.
     * @throws NotFoundException if the specified plugin version is not found.
     * @throws BadRequestException if the recovery operation fails.
     */
    async execute(command) {
        const { versionId, pluginId } = command;
        const result = await this.pluginVersionService.softRecover(versionId, {
            where: { pluginId },
            withDeleted: true
        });
        if (!result) {
            throw new common_1.NotFoundException(`Soft-deleted plugin version with ID ${versionId} and plugin ID ${pluginId} not found.`);
        }
    }
};
exports.RecoverPluginVersionCommandHandler = RecoverPluginVersionCommandHandler;
exports.RecoverPluginVersionCommandHandler = RecoverPluginVersionCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(recover_plugin_version_command_1.RecoverPluginVersionCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginVersionService])
], RecoverPluginVersionCommandHandler);
//# sourceMappingURL=recover-plugin-version-command.handler.js.map