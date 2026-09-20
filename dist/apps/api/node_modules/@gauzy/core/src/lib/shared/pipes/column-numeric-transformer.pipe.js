"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnNumericTransformerPipe = void 0;
const utils_1 = require("@gauzy/utils");
/**
 * Convert Non-integer numbers string to integer
 *
 * From https://github.com/typeorm/typeorm/issues/873#issuecomment-502294597
 */
class ColumnNumericTransformerPipe {
    /**
     * Converts a number for storage in the database.
     * If the value is not defined, it returns null.
     *
     * @param value - The number to convert.
     * @returns The number itself, or null if undefined.
     */
    to(value) {
        return (0, utils_1.isNotNullOrUndefined)(value) ? value : null; // Return the number for storage
    }
    /**
     * Transforms a string to the entity property value.
     *
     * @param value - The input string.
     * @returns The transformed number or null if the input is invalid.
     */
    from(value) {
        return (0, utils_1.isNotNullOrUndefined)(value) ? parseFloat(value) : null; // Convert string to number
    }
}
exports.ColumnNumericTransformerPipe = ColumnNumericTransformerPipe;
//# sourceMappingURL=column-numeric-transformer.pipe.js.map