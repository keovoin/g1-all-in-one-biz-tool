"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilitySlotsBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const availability_slots_bulk_create_command_1 = require("../availability-slots.bulk.create.command");
const availability_slots_entity_1 = require("../../availability-slots.entity");
const context_1 = require("../../../core/context");
const availability_slots_create_command_1 = require("../availability-slots.create.command");
let AvailabilitySlotsBulkCreateHandler = class AvailabilitySlotsBulkCreateHandler {
    constructor(commandBus) {
        this.commandBus = commandBus;
    }
    async execute(command) {
        const { input } = command;
        const allAvailabilitySlots = [];
        const tenantId = context_1.RequestContext.currentTenantId();
        for (const item of input) {
            let availabilitySlots = new availability_slots_entity_1.AvailabilitySlot({
                ...item,
                tenantId
            });
            availabilitySlots = await this.commandBus.execute(new availability_slots_create_command_1.AvailabilitySlotsCreateCommand(availabilitySlots));
            allAvailabilitySlots.push(availabilitySlots);
        }
        return allAvailabilitySlots;
    }
};
exports.AvailabilitySlotsBulkCreateHandler = AvailabilitySlotsBulkCreateHandler;
exports.AvailabilitySlotsBulkCreateHandler = AvailabilitySlotsBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(availability_slots_bulk_create_command_1.AvailabilitySlotsBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus])
], AvailabilitySlotsBulkCreateHandler);
//# sourceMappingURL=availability-slots.bulk.create.handler.js.map