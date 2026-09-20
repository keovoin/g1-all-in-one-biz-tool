"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNotEmpty = isNotEmpty;
const is_empty_1 = require("./is-empty");
/**
 * Check if the provided value is not empty.
 * This function utilizes the isEmpty function to determine if the value has content.
 *
 * @param item - The value to check for non-emptiness.
 * @returns {boolean} - Returns true if the value is not empty, otherwise false.
 */
function isNotEmpty(item) {
    return !(0, is_empty_1.isEmpty)(item);
}
//# sourceMappingURL=is-not-empty.js.map