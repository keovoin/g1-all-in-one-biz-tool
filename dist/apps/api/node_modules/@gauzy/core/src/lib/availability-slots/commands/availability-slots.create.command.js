"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilitySlotsCreateCommand = void 0;
const contracts_1 = require("@gauzy/contracts");
class AvailabilitySlotsCreateCommand {
    constructor(input, insertType = contracts_1.AvailabilityMergeType.MERGE) {
        this.input = input;
        this.insertType = insertType;
    }
}
exports.AvailabilitySlotsCreateCommand = AvailabilitySlotsCreateCommand;
AvailabilitySlotsCreateCommand.type = '[AvailabilitySlots] Create';
//# sourceMappingURL=availability-slots.create.command.js.map