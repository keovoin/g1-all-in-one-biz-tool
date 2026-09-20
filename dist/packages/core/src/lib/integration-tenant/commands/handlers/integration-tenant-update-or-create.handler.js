"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationTenantUpdateOrCreateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const integration_tenant_service_1 = require("../../integration-tenant.service");
const integration_tenant_create_command_1 = require("../integration-tenant.create.command");
const integration_tenant_update_or_create_command_1 = require("../integration-tenant-update-or-create.command");
const integration_tenant_update_command_1 = require("../integration-tenant.update.command");
let IntegrationTenantUpdateOrCreateHandler = class IntegrationTenantUpdateOrCreateHandler {
    constructor(_commandBus, _integrationTenantService) {
        this._commandBus = _commandBus;
        this._integrationTenantService = _integrationTenantService;
    }
    /**
     * Execute the IntegrationTenantUpdateOrCreateCommand to update or create an integration tenant.
     *
     * @param command - The IntegrationTenantUpdateOrCreateCommand containing the options and input data.
     * @returns {Promise<IIntegrationTenant>} - A promise that resolves with the updated or newly created integration tenant.
     */
    async execute(command) {
        const { options, input } = command;
        // Try to find the corresponding integration tenant
        try {
            const integration = await this._integrationTenantService.findOneByWhereOptions(options);
            // Update the corresponding integration tenant with the new input data
            return await this._commandBus.execute(new integration_tenant_update_command_1.IntegrationTenantUpdateCommand(integration.id, input));
        }
        catch (error) {
            // Create a corresponding integration tenant with the new input data
            return await this._commandBus.execute(new integration_tenant_create_command_1.IntegrationTenantCreateCommand(input));
        }
    }
};
exports.IntegrationTenantUpdateOrCreateHandler = IntegrationTenantUpdateOrCreateHandler;
exports.IntegrationTenantUpdateOrCreateHandler = IntegrationTenantUpdateOrCreateHandler = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    (0, cqrs_1.CommandHandler)(integration_tenant_update_or_create_command_1.IntegrationTenantUpdateOrCreateCommand),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        integration_tenant_service_1.IntegrationTenantService])
], IntegrationTenantUpdateOrCreateHandler);
//# sourceMappingURL=integration-tenant-update-or-create.handler.js.map