"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlotBulkCreateCommand = void 0;
class TimeSlotBulkCreateCommand {
    constructor(slots, employeeId, organizationId, tenantId) {
        this.slots = slots;
        this.employeeId = employeeId;
        this.organizationId = organizationId;
        this.tenantId = tenantId;
    }
}
exports.TimeSlotBulkCreateCommand = TimeSlotBulkCreateCommand;
TimeSlotBulkCreateCommand.type = '[TimeSlot] bulk create';
//# sourceMappingURL=time-slot-bulk-create.command.js.map