"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationMapSyncOrganizationHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const context_1 = require("./../../../core/context");
const integration_map_sync_organization_command_1 = require("./../integration-map.sync-organization.command");
const integration_map_sync_entity_command_1 = require("./../integration-map.sync-entity.command");
const integration_map_service_1 = require("../../integration-map.service");
const commands_1 = require("./../../../organization/commands");
let IntegrationMapSyncOrganizationHandler = class IntegrationMapSyncOrganizationHandler {
    constructor(_commandBus, _integrationMapService) {
        this._commandBus = _commandBus;
        this._integrationMapService = _integrationMapService;
    }
    /**
     * Third party organization integrated and mapped
     *
     * @param command
     * @returns
     */
    async execute(command) {
        const { input } = command;
        const { integrationId, sourceId, organizationId, entity } = input;
        const tenantId = context_1.RequestContext.currentTenantId();
        try {
            const organizationMap = await this._integrationMapService.findOneByWhereOptions({
                entity: contracts_1.IntegrationEntity.ORGANIZATION,
                sourceId,
                integrationId,
                organizationId,
                tenantId
            });
            await this._commandBus.execute(new commands_1.OrganizationUpdateCommand(organizationMap.gauzyId, entity));
            return organizationMap;
        }
        catch (error) {
            const organization = await this._commandBus.execute(new commands_1.OrganizationCreateCommand(entity));
            return await this._commandBus.execute(new integration_map_sync_entity_command_1.IntegrationMapSyncEntityCommand({
                gauzyId: organization.id,
                integrationId,
                sourceId,
                entity: contracts_1.IntegrationEntity.ORGANIZATION,
                organizationId
            }));
        }
    }
};
exports.IntegrationMapSyncOrganizationHandler = IntegrationMapSyncOrganizationHandler;
exports.IntegrationMapSyncOrganizationHandler = IntegrationMapSyncOrganizationHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(integration_map_sync_organization_command_1.IntegrationMapSyncOrganizationCommand),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        integration_map_service_1.IntegrationMapService])
], IntegrationMapSyncOrganizationHandler);
//# sourceMappingURL=integration-map.sync-organization.handler.js.map