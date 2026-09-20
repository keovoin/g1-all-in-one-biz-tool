"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationMapSyncTimeLogHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const commands_1 = require("./../../../time-tracking/time-log/commands");
const integration_map_sync_entity_command_1 = require("./../integration-map.sync-entity.command");
const integration_map_sync_time_log_command_1 = require("../integration-map.sync-time-log.command");
const integration_map_service_1 = require("../../integration-map.service");
const context_1 = require("../../../core/context");
let IntegrationMapSyncTimeLogHandler = class IntegrationMapSyncTimeLogHandler {
    constructor(_commandBus, _integrationMapService) {
        this._commandBus = _commandBus;
        this._integrationMapService = _integrationMapService;
    }
    /**
     * Third party timeslot integrated and mapped
     *
     * @param command
     * @returns
     */
    async execute(command) {
        const { input } = command;
        const tenantId = context_1.RequestContext.currentTenantId();
        const { sourceId, organizationId, integrationId, entity } = input;
        try {
            return await this._integrationMapService.findOneByWhereOptions({
                entity: contracts_1.IntegrationEntity.TIME_LOG,
                sourceId,
                integrationId,
                organizationId,
                tenantId
            });
        }
        catch (error) {
            const gauzyTimeLog = await this._commandBus.execute(new commands_1.TimeLogCreateCommand(entity));
            return await this._commandBus.execute(new integration_map_sync_entity_command_1.IntegrationMapSyncEntityCommand({
                entity: contracts_1.IntegrationEntity.TIME_LOG,
                gauzyId: gauzyTimeLog.id,
                sourceId,
                integrationId,
                organizationId,
                tenantId
            }));
        }
    }
};
exports.IntegrationMapSyncTimeLogHandler = IntegrationMapSyncTimeLogHandler;
exports.IntegrationMapSyncTimeLogHandler = IntegrationMapSyncTimeLogHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(integration_map_sync_time_log_command_1.IntegrationMapSyncTimeLogCommand),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        integration_map_service_1.IntegrationMapService])
], IntegrationMapSyncTimeLogHandler);
//# sourceMappingURL=integration-map.sync-time-log.handler.js.map