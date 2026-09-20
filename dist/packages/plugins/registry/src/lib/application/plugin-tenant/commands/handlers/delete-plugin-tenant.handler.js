"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePluginTenantCommandHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const delete_plugin_tenant_command_1 = require("../delete-plugin-tenant.command");
let DeletePluginTenantCommandHandler = class DeletePluginTenantCommandHandler {
    constructor(pluginTenantService) {
        this.pluginTenantService = pluginTenantService;
    }
    /**
     * Executes the delete plugin tenant command
     *
     * @param command - The command containing plugin tenant ID to delete
     * @returns Promise<void>
     * @throws NotFoundException if plugin tenant not found
     */
    async execute(command) {
        const { id } = command;
        // Check if plugin tenant exists
        const existing = await this.pluginTenantService.findOneByIdString(id);
        if (!existing) {
            throw new common_1.NotFoundException(`Plugin tenant with ID "${id}" not found`);
        }
        // Delete the plugin tenant
        await this.pluginTenantService.delete(id);
    }
};
exports.DeletePluginTenantCommandHandler = DeletePluginTenantCommandHandler;
exports.DeletePluginTenantCommandHandler = DeletePluginTenantCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(delete_plugin_tenant_command_1.DeletePluginTenantCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTenantService])
], DeletePluginTenantCommandHandler);
//# sourceMappingURL=delete-plugin-tenant.handler.js.map