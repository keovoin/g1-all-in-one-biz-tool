"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteTimeSpanCommand = void 0;
class DeleteTimeSpanCommand {
    constructor(newTime, timeLog, timeSlot, forceDelete = false) {
        this.newTime = newTime;
        this.timeLog = timeLog;
        this.timeSlot = timeSlot;
        this.forceDelete = forceDelete;
    }
}
exports.DeleteTimeSpanCommand = DeleteTimeSpanCommand;
DeleteTimeSpanCommand.type = '[TimeLog] delete time span';
//# sourceMappingURL=delete-time-span.command.js.map