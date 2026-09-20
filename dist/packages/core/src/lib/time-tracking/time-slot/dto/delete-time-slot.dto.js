"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteTimeSlotDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("../../../core/dto");
/**
 * Data Transfer Object (DTO) for deleting time slots with the `forceDelete` flag.
 * This DTO extends the `ForceDeleteBaseDTO` to include the `forceDelete` flag.
 */
class DeleteTimeSlotDTO extends dto_1.ForceDeleteBaseDTO {
    constructor() {
        super(...arguments);
        /**
         * An array of IDs representing the time slots to be deleted.
         * This array must not be empty and ensures that at least one time slot is selected for deletion.
         */
        this.ids = [];
    }
}
exports.DeleteTimeSlotDTO = DeleteTimeSlotDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Array }),
    (0, class_validator_1.ArrayNotEmpty)(),
    tslib_1.__metadata("design:type", Array)
], DeleteTimeSlotDTO.prototype, "ids", void 0);
//# sourceMappingURL=delete-time-slot.dto.js.map