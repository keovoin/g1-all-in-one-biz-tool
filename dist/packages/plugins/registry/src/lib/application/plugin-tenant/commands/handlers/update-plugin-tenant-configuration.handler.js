"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePluginTenantConfigurationCommandHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const update_plugin_tenant_configuration_command_1 = require("../update-plugin-tenant-configuration.command");
let UpdatePluginTenantConfigurationCommandHandler = class UpdatePluginTenantConfigurationCommandHandler {
    constructor(pluginTenantService) {
        this.pluginTenantService = pluginTenantService;
    }
    /**
     * Executes the update plugin tenant configuration command
     *
     * @param command - The command containing configuration update data
     * @returns The updated plugin tenant
     * @throws BadRequestException if validation fails
     * @throws NotFoundException if plugin tenant not found
     */
    async execute(command) {
        const { input } = command;
        // Validate input
        if (!input || !input.pluginTenantId) {
            throw new common_1.BadRequestException('Plugin tenant ID is required');
        }
        if (!input.configuration && !input.preferences) {
            throw new common_1.BadRequestException('Either configuration or preferences must be provided');
        }
        // Check if plugin tenant exists
        const pluginTenant = await this.pluginTenantService.findOneByIdString(input.pluginTenantId);
        if (!pluginTenant) {
            throw new common_1.NotFoundException(`Plugin tenant with ID "${input.pluginTenantId}" not found`);
        }
        // Convert to entity to use business logic methods
        const entity = Object.assign(new domain_1.PluginTenant(), pluginTenant);
        // Update configuration if provided
        if (input.configuration) {
            entity.updateConfiguration(input.configuration);
        }
        // Update preferences if provided
        if (input.preferences) {
            entity.updatePreferences(input.preferences);
        }
        // Update in database
        await this.pluginTenantService.update(input.pluginTenantId, {
            tenantConfiguration: entity.tenantConfiguration,
            preferences: entity.preferences
        });
        // Return updated plugin tenant with relations
        return await this.pluginTenantService.findOneByIdString(input.pluginTenantId, {
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
exports.UpdatePluginTenantConfigurationCommandHandler = UpdatePluginTenantConfigurationCommandHandler;
exports.UpdatePluginTenantConfigurationCommandHandler = UpdatePluginTenantConfigurationCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(update_plugin_tenant_configuration_command_1.UpdatePluginTenantConfigurationCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTenantService])
], UpdatePluginTenantConfigurationCommandHandler);
//# sourceMappingURL=update-plugin-tenant-configuration.handler.js.map