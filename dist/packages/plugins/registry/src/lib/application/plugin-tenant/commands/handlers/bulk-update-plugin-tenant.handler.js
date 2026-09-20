"use strict";
var BulkUpdatePluginTenantCommandHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkUpdatePluginTenantCommandHandler = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const shared_1 = require("../../../../shared");
const bulk_update_plugin_tenant_command_1 = require("../bulk-update-plugin-tenant.command");
let BulkUpdatePluginTenantCommandHandler = BulkUpdatePluginTenantCommandHandler_1 = class BulkUpdatePluginTenantCommandHandler {
    constructor(pluginTenantService) {
        this.pluginTenantService = pluginTenantService;
        this.logger = new common_1.Logger(BulkUpdatePluginTenantCommandHandler_1.name);
    }
    /**
     * Executes the bulk update plugin tenant command
     *
     * @param command - The command containing bulk operation data
     * @returns Array of operation results
     * @throws BadRequestException if validation fails
     */
    async execute(command) {
        const { input } = command;
        // Validate input
        if (!input || !input.pluginTenantIds || input.pluginTenantIds.length === 0) {
            throw new common_1.BadRequestException('Plugin tenant IDs are required');
        }
        const results = {
            success: [],
            failed: []
        };
        const currentUser = core_1.RequestContext.currentUser();
        for (const pluginTenantId of input.pluginTenantIds) {
            try {
                // Check if plugin tenant exists
                const pluginTenant = await this.pluginTenantService.findOneByIdString(pluginTenantId);
                if (!pluginTenant) {
                    results.failed.push({
                        id: pluginTenantId,
                        error: `Plugin tenant with ID "${pluginTenantId}" not found`
                    });
                    continue;
                }
                let updated;
                switch (input.operation) {
                    case shared_1.PluginTenantBulkOperation.ENABLE:
                        updated = await this.pluginTenantService.enablePlugin(pluginTenantId);
                        break;
                    case shared_1.PluginTenantBulkOperation.DISABLE:
                        updated = await this.pluginTenantService.disablePlugin(pluginTenantId);
                        break;
                    case shared_1.PluginTenantBulkOperation.APPROVE:
                        if (!currentUser) {
                            throw new Error('User context is required for approval operations');
                        }
                        const entity = Object.assign(new domain_1.PluginTenant(), pluginTenant);
                        entity.approve(currentUser);
                        await this.pluginTenantService.update(pluginTenantId, {
                            approvedAt: entity.approvedAt,
                            approvedById: entity.approvedById,
                            enabled: entity.enabled
                        });
                        updated = await this.pluginTenantService.findOneByIdString(pluginTenantId);
                        break;
                    case shared_1.PluginTenantBulkOperation.REVOKE:
                        const revokeEntity = Object.assign(new domain_1.PluginTenant(), pluginTenant);
                        revokeEntity.revokeApproval();
                        await this.pluginTenantService.update(pluginTenantId, {
                            approvedAt: undefined,
                            approvedById: undefined,
                            enabled: false
                        });
                        updated = await this.pluginTenantService.findOneByIdString(pluginTenantId);
                        break;
                    case shared_1.PluginTenantBulkOperation.DELETE:
                        await this.pluginTenantService.delete(pluginTenantId);
                        updated = null; // No return value for deleted items
                        break;
                    default:
                        throw new Error(`Unsupported operation: ${input.operation}`);
                }
                if (updated) {
                    results.success.push(updated);
                }
                this.logger.debug(`Successfully executed ${input.operation} operation on plugin tenant ${pluginTenantId}`);
            }
            catch (error) {
                this.logger.error(`Failed to execute ${input.operation} operation on plugin tenant ${pluginTenantId}`, error.stack);
                results.failed.push({
                    id: pluginTenantId,
                    error: error.message
                });
            }
        }
        return results;
    }
};
exports.BulkUpdatePluginTenantCommandHandler = BulkUpdatePluginTenantCommandHandler;
exports.BulkUpdatePluginTenantCommandHandler = BulkUpdatePluginTenantCommandHandler = BulkUpdatePluginTenantCommandHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(bulk_update_plugin_tenant_command_1.BulkUpdatePluginTenantCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTenantService])
], BulkUpdatePluginTenantCommandHandler);
//# sourceMappingURL=bulk-update-plugin-tenant.handler.js.map