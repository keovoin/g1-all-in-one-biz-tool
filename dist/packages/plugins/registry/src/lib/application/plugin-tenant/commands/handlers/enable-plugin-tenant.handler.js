"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnablePluginTenantCommandHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const enable_plugin_tenant_command_1 = require("../enable-plugin-tenant.command");
let EnablePluginTenantCommandHandler = class EnablePluginTenantCommandHandler {
    constructor(pluginTenantService) {
        this.pluginTenantService = pluginTenantService;
    }
    /**
     * Executes the enable plugin tenant command
     *
     * @param command - The command containing plugin tenant ID to enable
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
        // Use service method for enabling
        return await this.pluginTenantService.enablePlugin(id);
    }
};
exports.EnablePluginTenantCommandHandler = EnablePluginTenantCommandHandler;
exports.EnablePluginTenantCommandHandler = EnablePluginTenantCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(enable_plugin_tenant_command_1.EnablePluginTenantCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTenantService])
], EnablePluginTenantCommandHandler);
//# sourceMappingURL=enable-plugin-tenant.handler.js.map