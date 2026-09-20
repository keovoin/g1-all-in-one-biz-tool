"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTimeSlotMinutesHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const context_1 = require("../../../../../core/context");
const create_time_slot_minutes_command_1 = require("../create-time-slot-minutes.command");
const update_time_slot_minutes_command_1 = require("../update-time-slot-minutes.command");
const type_orm_time_slot_minute_repository_1 = require("../../repositories/type-orm-time-slot-minute.repository");
let CreateTimeSlotMinutesHandler = class CreateTimeSlotMinutesHandler {
    constructor(commandBus, typeOrmTimeSlotMinuteRepository) {
        this.commandBus = commandBus;
        this.typeOrmTimeSlotMinuteRepository = typeOrmTimeSlotMinuteRepository;
    }
    /**
     * Handles creation or update of a time slot minute record.
     *
     * If a `TimeSlotMinute` already exists for the given `timeSlotId` and `datetime`,
     * it performs an update via `UpdateTimeSlotMinutesCommand`. Otherwise, it creates a new one.
     *
     * @param command - The command containing input data for a time slot minute.
     * @returns A Promise that resolves to the created or updated `TimeSlotMinute` entity.
     */
    async execute(command) {
        const { input } = command;
        const { id: timeSlotId } = input.timeSlot;
        // Extract tenant ID from the request context or the provided input
        const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
        // Check if a time slot minute already exists for the given time slot ID and datetime
        const timeMinute = await this.typeOrmTimeSlotMinuteRepository.findOneBy({
            timeSlotId: timeSlotId,
            datetime: input.datetime
        });
        if (timeMinute) {
            return this.commandBus.execute(new update_time_slot_minutes_command_1.UpdateTimeSlotMinutesCommand(timeMinute.id, {
                ...input,
                timeSlotId: timeMinute.id
            }));
        }
        else {
            return this.typeOrmTimeSlotMinuteRepository.save({
                ...input,
                tenantId
            });
        }
    }
};
exports.CreateTimeSlotMinutesHandler = CreateTimeSlotMinutesHandler;
exports.CreateTimeSlotMinutesHandler = CreateTimeSlotMinutesHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(create_time_slot_minutes_command_1.CreateTimeSlotMinutesCommand),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        type_orm_time_slot_minute_repository_1.TypeOrmTimeSlotMinuteRepository])
], CreateTimeSlotMinutesHandler);
//# sourceMappingURL=create-time-slot-minutes.handler.js.map