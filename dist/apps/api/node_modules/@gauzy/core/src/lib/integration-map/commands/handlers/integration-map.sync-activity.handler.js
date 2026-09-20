"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationMapSyncActivityHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const commands_1 = require("./../../../time-tracking/activity/commands");
const integration_map_sync_activity_command_1 = require("./../integration-map.sync-activity.command");
const integration_map_sync_entity_command_1 = require("./../integration-map.sync-entity.command");
const integration_map_service_1 = require("../../integration-map.service");
const context_1 = require("../../../core/context");
let IntegrationMapSyncActivityHandler = class IntegrationMapSyncActivityHandler {
    constructor(_commandBus, _integrationMapService) {
        this._commandBus = _commandBus;
        this._integrationMapService = _integrationMapService;
    }
    /**
     * Third party activity integrated and mapped
     *
     * @param command
     * @returns
     */
    async execute(command) {
        const { input } = command;
        const { sourceId, organizationId, integrationId, entity } = input;
        const tenantId = context_1.RequestContext.currentTenantId();
        try {
            const activityMap = await this._integrationMapService.findOneByWhereOptions({
                entity: contracts_1.IntegrationEntity.ACTIVITY,
                sourceId,
                integrationId,
                organizationId,
                tenantId
            });
            await this._commandBus.execute(new commands_1.ActivityUpdateCommand(Object.assign(entity, {
                id: activityMap.gauzyId,
            })));
            return activityMap;
        }
        catch (error) {
            const gauzyActivity = await this._commandBus.execute(new commands_1.ActivityCreateCommand(entity));
            return await this._commandBus.execute(new integration_map_sync_entity_command_1.IntegrationMapSyncEntityCommand({
                gauzyId: gauzyActivity.id,
                integrationId,
                sourceId,
                entity: contracts_1.IntegrationEntity.ACTIVITY,
                organizationId,
                tenantId
            }));
        }
    }
};
exports.IntegrationMapSyncActivityHandler = IntegrationMapSyncActivityHandler;
exports.IntegrationMapSyncActivityHandler = IntegrationMapSyncActivityHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(integration_map_sync_activity_command_1.IntegrationMapSyncActivityCommand),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        integration_map_service_1.IntegrationMapService])
], IntegrationMapSyncActivityHandler);
//# sourceMappingURL=integration-map.sync-activity.handler.js.map