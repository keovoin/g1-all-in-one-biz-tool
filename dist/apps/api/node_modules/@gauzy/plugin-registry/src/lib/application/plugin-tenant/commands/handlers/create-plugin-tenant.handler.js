"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePluginTenantCommandHandler = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const create_plugin_tenant_command_1 = require("../create-plugin-tenant.command");
let CreatePluginTenantCommandHandler = class CreatePluginTenantCommandHandler {
    constructor(pluginTenantService, pluginService) {
        this.pluginTenantService = pluginTenantService;
        this.pluginService = pluginService;
    }
    /**
     * Executes the create plugin tenant command
     *
     * @param command - The command containing plugin tenant creation data
     * @returns The created plugin tenant
     * @throws BadRequestException if validation fails
     * @throws ConflictException if plugin tenant already exists
     */
    async execute(command) {
        const { input } = command;
        // Validate input
        if (!input) {
            throw new common_1.BadRequestException('Plugin tenant data is required');
        }
        // Get context info
        const tenantId = input.tenantId || core_1.RequestContext.currentTenantId();
        const organizationId = input.organizationId || core_1.RequestContext.currentOrganizationId();
        if (!tenantId) {
            throw new common_1.BadRequestException('Tenant ID is required');
        }
        // Verify plugin exists
        const plugin = await this.pluginService.findOneByIdString(input.pluginId);
        if (!plugin) {
            throw new common_1.BadRequestException(`Plugin with ID "${input.pluginId}" not found`);
        }
        // Check if plugin tenant already exists
        const existing = await this.pluginTenantService.findByPluginAndTenant(input.pluginId, tenantId, organizationId);
        if (existing) {
            throw new common_1.ConflictException(`Plugin "${plugin.name}" is already configured for this ${organizationId ? 'organization' : 'tenant'}`);
        }
        // Create plugin tenant using factory method
        const pluginTenant = domain_1.PluginTenant.create({
            plugin,
            scope: input.scope,
            enabled: input.enabled,
            autoInstall: input.autoInstall,
            requiresApproval: input.requiresApproval,
            isMandatory: input.isMandatory,
            maxInstallations: input.maxInstallations,
            maxActiveUsers: input.maxActiveUsers,
            isDataCompliant: input.isDataCompliant
        });
        // Set additional properties
        pluginTenant.tenantId = tenantId;
        pluginTenant.organizationId = organizationId;
        pluginTenant.tenantConfiguration = input.tenantConfiguration;
        pluginTenant.preferences = input.preferences;
        pluginTenant.complianceCertifications = input.complianceCertifications;
        // Handle access controls
        if (input.allowedRoleIds && input.allowedRoleIds.length > 0) {
            // TODO: Load roles from IDs and assign to allowedRoles
            // This would require role service injection
        }
        if (input.allowedUserIds && input.allowedUserIds.length > 0) {
            // TODO: Load users from IDs and assign to allowedUsers
            // This would require user service injection
        }
        if (input.deniedUserIds && input.deniedUserIds.length > 0) {
            // TODO: Load users from IDs and assign to deniedUsers
            // This would require user service injection
        }
        // If objects are provided directly, use them
        if (input.allowedRoles) {
            pluginTenant.allowedRoles = input.allowedRoles;
        }
        if (input.allowedUsers) {
            pluginTenant.allowedUsers = input.allowedUsers;
        }
        if (input.deniedUsers) {
            pluginTenant.deniedUsers = input.deniedUsers;
        }
        // Save the plugin tenant
        const created = await this.pluginTenantService.save(pluginTenant);
        // Return with relations loaded
        return await this.pluginTenantService.findOneByIdString(created.id, {
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
exports.CreatePluginTenantCommandHandler = CreatePluginTenantCommandHandler;
exports.CreatePluginTenantCommandHandler = CreatePluginTenantCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(create_plugin_tenant_command_1.CreatePluginTenantCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTenantService,
        domain_1.PluginService])
], CreatePluginTenantCommandHandler);
//# sourceMappingURL=create-plugin-tenant.handler.js.map