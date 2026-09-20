"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilitySlotsCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const underscore_1 = require("underscore");
const contracts_1 = require("@gauzy/contracts");
const availability_slots_create_command_1 = require("../availability-slots.create.command");
const availability_slots_entity_1 = require("../../availability-slots.entity");
const availability_slots_service_1 = require("../../availability-slots.service");
const get_conflict_availability_slots_command_1 = require("../get-conflict-availability-slots.command");
const context_1 = require("./../../../core/context");
let AvailabilitySlotsCreateHandler = class AvailabilitySlotsCreateHandler {
    constructor(availabilitySlotsService, commandBus) {
        this.availabilitySlotsService = availabilitySlotsService;
        this.commandBus = commandBus;
    }
    async execute(command) {
        const { input, insertType } = command;
        const { organizationId, employeeId, startTime, endTime, type } = input;
        if (!startTime || !endTime)
            return;
        const tenantId = context_1.RequestContext.currentTenantId();
        const conflicts = await this.commandBus.execute(new get_conflict_availability_slots_command_1.GetConflictAvailabilitySlotsCommand({
            employeeId,
            startTime,
            endTime,
            type,
            tenantId,
            organizationId
        }));
        if (insertType === contracts_1.AvailabilityMergeType.SKIP) {
            return;
        }
        if (conflicts.length > 0) {
            if (insertType === contracts_1.AvailabilityMergeType.MERGE) {
                const startTimes = conflicts.map((item) => new Date(item.startTime).getTime());
                const endTimes = conflicts.map((item) => new Date(item.endTime).getTime());
                input.startTime = new Date(Math.min(new Date(input.startTime).getTime(), ...startTimes));
                input.endTime = new Date(Math.max(new Date(input.endTime).getTime(), ...endTimes));
            }
            await this.availabilitySlotsService.delete({
                id: (0, typeorm_1.In)((0, underscore_1.pluck)(conflicts, 'id'))
            });
        }
        const availabilitySlots = new availability_slots_entity_1.AvailabilitySlot({
            ...input,
            tenantId
        });
        return await this.availabilitySlotsService.create(availabilitySlots);
    }
};
exports.AvailabilitySlotsCreateHandler = AvailabilitySlotsCreateHandler;
exports.AvailabilitySlotsCreateHandler = AvailabilitySlotsCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(availability_slots_create_command_1.AvailabilitySlotsCreateCommand),
    tslib_1.__metadata("design:paramtypes", [availability_slots_service_1.AvailabilitySlotsService,
        cqrs_1.CommandBus])
], AvailabilitySlotsCreateHandler);
//# sourceMappingURL=availability-slots.create.handler.js.map