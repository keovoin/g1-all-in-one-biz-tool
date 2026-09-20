"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTimeSlotCommand = void 0;
class CreateTimeSlotCommand {
    constructor(input, forceDelete = false) {
        this.input = input;
        this.forceDelete = forceDelete;
    }
}
exports.CreateTimeSlotCommand = CreateTimeSlotCommand;
CreateTimeSlotCommand.type = '[TimeSlot] create';
//# sourceMappingURL=create-time-slot.command.js.map