"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeLogUpdateCommand = void 0;
class TimeLogUpdateCommand {
    constructor(input, id, manualTimeSlot, forceDelete = false) {
        this.input = input;
        this.id = id;
        this.manualTimeSlot = manualTimeSlot;
        this.forceDelete = forceDelete;
    }
}
exports.TimeLogUpdateCommand = TimeLogUpdateCommand;
TimeLogUpdateCommand.type = '[Time Tracking] Time Log update';
//# sourceMappingURL=time-log-update.command.js.map