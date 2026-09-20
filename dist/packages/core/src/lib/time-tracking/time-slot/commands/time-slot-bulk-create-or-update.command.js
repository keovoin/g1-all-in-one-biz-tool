"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlotBulkCreateOrUpdateCommand = void 0;
class TimeSlotBulkCreateOrUpdateCommand {
    constructor(slots, employeeId, organizationId, tenantId) {
        this.slots = slots;
        this.employeeId = employeeId;
        this.organizationId = organizationId;
        this.tenantId = tenantId;
    }
}
exports.TimeSlotBulkCreateOrUpdateCommand = TimeSlotBulkCreateOrUpdateCommand;
TimeSlotBulkCreateOrUpdateCommand.type = '[TimeSlot] bulk create / update';
//# sourceMappingURL=time-slot-bulk-create-or-update.command.js.map