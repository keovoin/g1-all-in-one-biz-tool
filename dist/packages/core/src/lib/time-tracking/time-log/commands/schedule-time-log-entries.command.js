"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleTimeLogEntriesCommand = void 0;
class ScheduleTimeLogEntriesCommand {
    constructor(employeeId, organizationId, tenantId) {
        this.employeeId = employeeId;
        this.organizationId = organizationId;
        this.tenantId = tenantId;
    }
}
exports.ScheduleTimeLogEntriesCommand = ScheduleTimeLogEntriesCommand;
ScheduleTimeLogEntriesCommand.type = 'Adjust [TimeLog] Entries';
//# sourceMappingURL=schedule-time-log-entries.command.js.map