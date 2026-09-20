"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisablePluginTenantCommandHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const disable_plugin_tenant_command_1 = require("../disable-plugin-tenant.command");
let DisablePluginTenantCommandHandler = class DisablePluginTenantCommandHandler {
    constructor(pluginTenantService) {
        this.pluginTenantService = pluginTenantService;
    }
    /**
     * Executes the disable plugin tenant command
     *
     * @param command - The command containing plugin tenant ID to disable
     * @returns The updated plugin tenant
     * @throws NotFoundException if plugin tenant not found
     */
    async execute(command) {
        const { id } = command;
        // Check if plugin tenant exists
        const existing = await this.pluginTenantService.findOneByIdString(id);
        if (!existing) {
            throw new common_1.NotFoundException(`Plugin tenant with ID "${id}" not found`);
        }
        // Use service method for disabling
        return await this.pluginTenantService.disablePlugin(id);
    }
};
exports.DisablePluginTenantCommandHandler = DisablePluginTenantCommandHandler;
exports.DisablePluginTenantCommandHandler = DisablePluginTenantCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(disable_plugin_tenant_command_1.DisablePluginTenantCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTenantService])
], DisablePluginTenantCommandHandler);
//# sourceMappingURL=disable-plugin-tenant.handler.js.map