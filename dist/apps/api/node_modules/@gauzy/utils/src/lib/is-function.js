"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFunction = isFunction;
/**
 * Check if the provided item is a function.
 * @param item - The item to check.
 * @returns {boolean} - Returns true if the item is a function, otherwise false.
 *
 * This function also ensures that the item is not an array,
 * as arrays are technically objects in JavaScript.
 */
function isFunction(item) {
    return typeof item === 'function' && !Array.isArray(item);
}
//# sourceMappingURL=is-function.js.map