"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlotMergeCommand = void 0;
class TimeSlotMergeCommand {
    constructor(organizationId, employeeId, start, end, forceDelete = false) {
        this.organizationId = organizationId;
        this.employeeId = employeeId;
        this.start = start;
        this.end = end;
        this.forceDelete = forceDelete;
    }
}
exports.TimeSlotMergeCommand = TimeSlotMergeCommand;
TimeSlotMergeCommand.type = '[TimeSlot] merge';
//# sourceMappingURL=time-slot-merge.command.js.map