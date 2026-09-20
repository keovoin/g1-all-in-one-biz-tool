"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationMapSyncProjectHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const context_1 = require("./../../../core/context");
const integration_map_sync_project_command_1 = require("./../integration-map.sync-project.command");
const integration_map_sync_entity_command_1 = require("./../integration-map.sync-entity.command");
const integration_map_service_1 = require("../../integration-map.service");
const commands_1 = require("../../../organization-project/commands");
let IntegrationMapSyncProjectHandler = class IntegrationMapSyncProjectHandler {
    constructor(_commandBus, _integrationMapService) {
        this._commandBus = _commandBus;
        this._integrationMapService = _integrationMapService;
    }
    /**
     * Third party organization project integration and mapping.
     *
     * @param {IntegrationMapSyncProjectCommand} command - The command containing input data for integrating and mapping the project.
     * @returns {Promise<IIntegrationMap>} - Returns a promise that resolves with the mapped project integration data.
     */
    async execute(command) {
        const { input } = command;
        const { integrationId, sourceId, organizationId, entity } = input;
        const tenantId = context_1.RequestContext.currentTenantId();
        try {
            // Attempt to find an existing project map
            const projectMap = await this._integrationMapService.findOneByWhereOptions({
                entity: contracts_1.IntegrationEntity.PROJECT,
                sourceId,
                integrationId,
                organizationId,
                tenantId
            });
            // Update the project if it exists
            await this._commandBus.execute(new commands_1.OrganizationProjectUpdateCommand(projectMap.gauzyId, entity));
            return projectMap;
        }
        catch (error) {
            // If project map is not found, create a new project and map it
            const project = await this._commandBus.execute(new commands_1.OrganizationProjectCreateCommand(entity));
            return this._commandBus.execute(new integration_map_sync_entity_command_1.IntegrationMapSyncEntityCommand({
                gauzyId: project.id,
                integrationId,
                sourceId,
                entity: contracts_1.IntegrationEntity.PROJECT,
                organizationId
            }));
        }
    }
};
exports.IntegrationMapSyncProjectHandler = IntegrationMapSyncProjectHandler;
exports.IntegrationMapSyncProjectHandler = IntegrationMapSyncProjectHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(integration_map_sync_project_command_1.IntegrationMapSyncProjectCommand),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        integration_map_service_1.IntegrationMapService])
], IntegrationMapSyncProjectHandler);
//# sourceMappingURL=integration-map.sync-project.handler.js.map