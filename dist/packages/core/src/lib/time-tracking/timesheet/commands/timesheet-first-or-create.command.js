"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimesheetFirstOrCreateCommand = void 0;
class TimesheetFirstOrCreateCommand {
    constructor(date, employeeId, organizationId) {
        this.date = date;
        this.employeeId = employeeId;
        this.organizationId = organizationId;
    }
}
exports.TimesheetFirstOrCreateCommand = TimesheetFirstOrCreateCommand;
TimesheetFirstOrCreateCommand.type = '[Timesheet] First Or Create';
//# sourceMappingURL=timesheet-first-or-create.command.js.map