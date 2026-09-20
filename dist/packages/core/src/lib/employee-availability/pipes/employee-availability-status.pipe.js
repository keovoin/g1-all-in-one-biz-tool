"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityStatusTransformer = void 0;
const contracts_1 = require("@gauzy/contracts");
/**
 * Transformer to handle the conversion between the enum values
 * (used in the application) and integer values (stored in the database).
 */
class AvailabilityStatusTransformer {
    /**
     * Converts the enum value to its corresponding integer representation
     * when saving to the database.
     *
     * @param value - The `AvailabilityStatusEnum` value.
     * @returns The corresponding integer value for storage in the database.
     */
    to(value) {
        switch (value) {
            case contracts_1.AvailabilityStatusEnum.Available:
                return contracts_1.AvailabilityStatusValue.Available;
            case contracts_1.AvailabilityStatusEnum.Partial:
                return contracts_1.AvailabilityStatusValue.Partial;
            case contracts_1.AvailabilityStatusEnum.Unavailable:
                return contracts_1.AvailabilityStatusValue.Unavailable;
            default:
                throw new Error(`Invalid availability status: ${value}`);
        }
    }
    /**
     * Converts the integer value from the database back to the corresponding
     * enum value when reading.
     *
     * @param value - The integer value stored in the database.
     * @returns The corresponding `AvailabilityStatusEnum` value.
     */
    from(value) {
        switch (value) {
            case contracts_1.AvailabilityStatusValue.Available:
                return contracts_1.AvailabilityStatusEnum.Available;
            case contracts_1.AvailabilityStatusValue.Partial:
                return contracts_1.AvailabilityStatusEnum.Partial;
            case contracts_1.AvailabilityStatusValue.Unavailable:
                return contracts_1.AvailabilityStatusEnum.Unavailable;
            default:
                throw new Error(`Invalid status value: ${value}`);
        }
    }
}
exports.AvailabilityStatusTransformer = AvailabilityStatusTransformer;
//# sourceMappingURL=employee-availability-status.pipe.js.map