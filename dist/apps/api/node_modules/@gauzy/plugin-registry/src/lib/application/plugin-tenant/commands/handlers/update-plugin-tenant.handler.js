"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePluginTenantCommandHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const update_plugin_tenant_command_1 = require("../update-plugin-tenant.command");
let UpdatePluginTenantCommandHandler = class UpdatePluginTenantCommandHandler {
    constructor(pluginTenantService) {
        this.pluginTenantService = pluginTenantService;
    }
    /**
     * Executes the update plugin tenant command
     *
     * @param command - The command containing plugin tenant update data
     * @returns The updated plugin tenant
     * @throws BadRequestException if validation fails
     * @throws NotFoundException if plugin tenant not found
     */
    async execute(command) {
        const { id, input } = command;
        // Validate input
        if (!input) {
            throw new common_1.BadRequestException('Update data is required');
        }
        // Check if plugin tenant exists
        const existing = await this.pluginTenantService.findOneByIdString(id);
        if (!existing) {
            throw new common_1.NotFoundException(`Plugin tenant with ID "${id}" not found`);
        }
        // Update the plugin tenant
        await this.pluginTenantService.update(id, {
            enabled: input.enabled,
            scope: input.scope,
            autoInstall: input.autoInstall,
            requiresApproval: input.requiresApproval,
            isMandatory: input.isMandatory,
            maxInstallations: input.maxInstallations,
            maxActiveUsers: input.maxActiveUsers,
            tenantConfiguration: input.tenantConfiguration,
            preferences: input.preferences,
            isDataCompliant: input.isDataCompliant,
            complianceCertifications: input.complianceCertifications
        });
        // Return updated plugin tenant with relations
        return await this.pluginTenantService.findOneByIdString(id, {
            relations: [
                'plugin',
                'approvedBy',
                'allowedRoles',
                'allowedUsers',
                'deniedUsers',
                'settings',
                'subscriptions'
            ]
        });
    }
};
exports.UpdatePluginTenantCommandHandler = UpdatePluginTenantCommandHandler;
exports.UpdatePluginTenantCommandHandler = UpdatePluginTenantCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(update_plugin_tenant_command_1.UpdatePluginTenantCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTenantService])
], UpdatePluginTenantCommandHandler);
//# sourceMappingURL=update-plugin-tenant.handler.js.map