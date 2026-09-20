"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationTenantDeleteHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const context_1 = require("../../../core/context");
const event_bus_1 = require("../../../event-bus/event-bus");
const base_entity_event_1 = require("../../../event-bus/base-entity-event");
const events_1 = require("../../../event-bus/events");
const integration_tenant_service_1 = require("../../integration-tenant.service");
const integration_tenant_delete_command_1 = require("../integration-tenant.delete.command");
let IntegrationTenantDeleteHandler = class IntegrationTenantDeleteHandler {
    constructor(_integrationTenantService, _eventBus) {
        this._integrationTenantService = _integrationTenantService;
        this._eventBus = _eventBus;
    }
    /**
     * Execute the command to delete the integration tenant.
     * @param command - The IntegrationTenantDeleteCommand instance.
     */
    async execute(command) {
        try {
            // Extract information from the command
            const { id, options } = command;
            const { tenantId, organizationId } = options;
            // Find the integration tenant by ID along with related data
            const integration = await this._integrationTenantService.findOneByIdString(id, {
                where: { tenantId, organizationId },
                relations: { integration: true, settings: true }
            });
            // Check the provider type of the integration and perform actions accordingly
            switch (integration.integration.provider) {
                case contracts_1.IntegrationEnum.GITHUB:
                    // Publish the integration delete event
                    const ctx = context_1.RequestContext.currentRequestContext();
                    const event = new events_1.IntegrationEvent(ctx, integration, base_entity_event_1.BaseEntityEventTypeEnum.DELETED);
                    await this._eventBus.publish(event);
                    break;
                // Add cases for other integration providers if needed
                default:
                    // Handle other integration providers if needed
                    break;
            }
            // Delete the integration tenant
            return await this._integrationTenantService.delete(id, {
                where: { tenantId, organizationId }
            });
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            console.log(`Failed to delete integration tenant: %s`, error.message);
            throw new common_1.HttpException(`Failed to delete integration tenant: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.IntegrationTenantDeleteHandler = IntegrationTenantDeleteHandler;
exports.IntegrationTenantDeleteHandler = IntegrationTenantDeleteHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(integration_tenant_delete_command_1.IntegrationTenantDeleteCommand),
    tslib_1.__metadata("design:paramtypes", [integration_tenant_service_1.IntegrationTenantService,
        event_bus_1.EventBus])
], IntegrationTenantDeleteHandler);
//# sourceMappingURL=integration-tenant.delete.handler.js.map