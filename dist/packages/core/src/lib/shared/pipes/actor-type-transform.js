"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorTypeTransformer = void 0;
const contracts_1 = require("@gauzy/contracts");
/**
 * ActorTypeTransformer handles the conversion between the enum string values
 * (used in the application) and the integer values (stored in the database).
 */
class ActorTypeTransformer {
    /**
     * Converts the enum string value to its integer representation when writing to the database.
     *
     * @param value - The `ActorTypeEnum` value ('System' or 'User').
     * @returns The corresponding integer value to be stored in the database (0 for System, 1 for User).
     */
    to(value) {
        return value === contracts_1.ActorTypeEnum.User ? 1 : 0; // 1 for 'User', 0 for 'System' (default)
    }
    /**
     * Converts the integer value to its corresponding `ActorTypeEnum` string when reading from the database.
     *
     * @param value - The integer value (0 or 1) from the database.
     * @returns The corresponding `ActorTypeEnum` ('System' for 0, 'User' for 1).
     */
    from(value) {
        return value === 1 ? contracts_1.ActorTypeEnum.User : contracts_1.ActorTypeEnum.System;
    }
}
exports.ActorTypeTransformer = ActorTypeTransformer;
//# sourceMappingURL=actor-type-transform.js.map