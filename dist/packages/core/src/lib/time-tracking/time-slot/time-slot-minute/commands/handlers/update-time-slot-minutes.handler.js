"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTimeSlotMinutesHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const update_time_slot_minutes_command_1 = require("../update-time-slot-minutes.command");
const type_orm_time_slot_minute_repository_1 = require("../../repositories/type-orm-time-slot-minute.repository");
let UpdateTimeSlotMinutesHandler = class UpdateTimeSlotMinutesHandler {
    constructor(typeOrmTimeSlotMinuteRepository) {
        this.typeOrmTimeSlotMinuteRepository = typeOrmTimeSlotMinuteRepository;
    }
    /**
     * Updates an existing `TimeSlotMinute` entity by its ID.
     *
     * If the entity is found, it updates the record with the given input data
     * (excluding `timeSlotId` to prevent relational inconsistency), then fetches
     * and returns the updated record with its `timeSlot` relation.
     *
     * @param command - Contains the ID of the time slot minute and updated input data.
     * @returns A Promise resolving to the updated `TimeSlotMinute` entity, or `null` if not found.
     */
    async execute(command) {
        const { input, id } = command;
        const timeMinute = await this.typeOrmTimeSlotMinuteRepository.findOneBy({ id });
        if (timeMinute) {
            // Prevent changing the timeSlot relation – remove the key entirely
            if ('timeSlotId' in input) {
                delete input.timeSlotId;
            }
            await this.typeOrmTimeSlotMinuteRepository.update(id, input);
            // Fetch and return the updated entity including its timeSlot relation
            return await this.typeOrmTimeSlotMinuteRepository.findOne({
                where: { id },
                relations: { timeSlot: true }
            });
        }
        return null;
    }
};
exports.UpdateTimeSlotMinutesHandler = UpdateTimeSlotMinutesHandler;
exports.UpdateTimeSlotMinutesHandler = UpdateTimeSlotMinutesHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(update_time_slot_minutes_command_1.UpdateTimeSlotMinutesCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_time_slot_minute_repository_1.TypeOrmTimeSlotMinuteRepository])
], UpdateTimeSlotMinutesHandler);
//# sourceMappingURL=update-time-slot-minutes.handler.js.map