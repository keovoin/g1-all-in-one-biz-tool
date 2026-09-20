"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationMapSyncTimeSlotHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const integration_map_sync_entity_command_1 = require("../integration-map.sync-entity.command");
const integration_map_sync_time_slot_command_1 = require("../integration-map.sync-time-slot.command");
const integration_map_service_1 = require("../../integration-map.service");
const context_1 = require("../../../core/context");
const commands_1 = require("./../../../time-tracking/time-slot/commands");
let IntegrationMapSyncTimeSlotHandler = class IntegrationMapSyncTimeSlotHandler {
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
        const { employeeId } = entity;
        try {
            return await this._integrationMapService.findOneByWhereOptions({
                entity: contracts_1.IntegrationEntity.TIME_SLOT,
                sourceId,
                integrationId,
                organizationId,
                tenantId
            });
        }
        catch (error) {
            const { time_slot, starts_at } = entity;
            const gauzyTimeSlot = await this._commandBus.execute(new commands_1.TimeSlotCreateCommand({
                employeeId,
                startedAt: starts_at,
                overall: 0,
                keyboard: 0,
                mouse: 0,
                duration: 0,
                time_slot,
                organizationId
            }));
            return await this._commandBus.execute(new integration_map_sync_entity_command_1.IntegrationMapSyncEntityCommand({
                gauzyId: gauzyTimeSlot.id,
                integrationId,
                sourceId,
                entity: contracts_1.IntegrationEntity.TIME_SLOT,
                organizationId
            }));
        }
    }
};
exports.IntegrationMapSyncTimeSlotHandler = IntegrationMapSyncTimeSlotHandler;
exports.IntegrationMapSyncTimeSlotHandler = IntegrationMapSyncTimeSlotHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(integration_map_sync_time_slot_command_1.IntegrationMapSyncTimeSlotCommand),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        integration_map_service_1.IntegrationMapService])
], IntegrationMapSyncTimeSlotHandler);
//# sourceMappingURL=integration-map.sync-time-slot.handler.js.map