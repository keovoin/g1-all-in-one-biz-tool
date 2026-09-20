"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlotBulkDeleteCommand = void 0;
class TimeSlotBulkDeleteCommand {
    constructor(input, forceDelete = false, // Force delete
    entireSlots = false // Delete entire slots
    ) {
        this.input = input;
        this.forceDelete = forceDelete;
        this.entireSlots = entireSlots;
    }
}
exports.TimeSlotBulkDeleteCommand = TimeSlotBulkDeleteCommand;
TimeSlotBulkDeleteCommand.type = '[TimeSlot] delete';
//# sourceMappingURL=time-slot-bulk-delete.command.js.map