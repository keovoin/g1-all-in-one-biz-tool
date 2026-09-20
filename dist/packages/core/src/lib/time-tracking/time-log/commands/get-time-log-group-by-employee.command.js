"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTimeLogGroupByEmployeeCommand = void 0;
class GetTimeLogGroupByEmployeeCommand {
    constructor(timeLogs, timeZone) {
        this.timeLogs = timeLogs;
        this.timeZone = timeZone;
    }
}
exports.GetTimeLogGroupByEmployeeCommand = GetTimeLogGroupByEmployeeCommand;
GetTimeLogGroupByEmployeeCommand.type = '[TimeLog] group by employee';
//# sourceMappingURL=get-time-log-group-by-employee.command.js.map