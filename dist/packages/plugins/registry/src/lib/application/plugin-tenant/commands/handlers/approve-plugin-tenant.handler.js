"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovePluginTenantCommandHandler = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const approve_plugin_tenant_command_1 = require("../approve-plugin-tenant.command");
let ApprovePluginTenantCommandHandler = class ApprovePluginTenantCommandHandler {
    constructor(pluginTenantService) {
        this.pluginTenantService = pluginTenantService;
    }
    /**
     * Executes the approve plugin tenant command
     *
     * @param command - The command containing approval data
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
        // Check if plugin tenant exists
        const pluginTenant = await this.pluginTenantService.findOneByIdString(input.pluginTenantId);
        if (!pluginTenant) {
            throw new common_1.NotFoundException(`Plugin tenant with ID "${input.pluginTenantId}" not found`);
        }
        // Get current user for approval tracking
        const currentUser = core_1.RequestContext.currentUser();
        if (!currentUser) {
            throw new common_1.BadRequestException('User context is required for approval operations');
        }
        // Convert to entity to use business logic methods
        const entity = Object.assign(new domain_1.PluginTenant(), pluginTenant);
        if (input.approved) {
            // Approve the plugin
            entity.approve(currentUser);
            // Enable immediately if requested
            if (input.enableImmediately) {
                entity.enable();
            }
        }
        else {
            // Revoke approval
            entity.revokeApproval();
        }
        // Update in database
        await this.pluginTenantService.update(input.pluginTenantId, {
            approvedAt: entity.approvedAt,
            approvedById: entity.approvedById,
            enabled: entity.enabled
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
exports.ApprovePluginTenantCommandHandler = ApprovePluginTenantCommandHandler;
exports.ApprovePluginTenantCommandHandler = ApprovePluginTenantCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(approve_plugin_tenant_command_1.ApprovePluginTenantCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTenantService])
], ApprovePluginTenantCommandHandler);
//# sourceMappingURL=approve-plugin-tenant.handler.js.map