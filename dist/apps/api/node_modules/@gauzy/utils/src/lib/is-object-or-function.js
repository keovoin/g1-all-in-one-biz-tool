"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObjectOrFunction = isObjectOrFunction;
const is_function_1 = require("./is-function"); // Ensure the import path is correct.
const is_plain_object_1 = require("./is-plain-object");
/**
 * Check if the item is either an object or a function.
 *
 * @param item - The item to check.
 * @returns {boolean} - Returns true if the item is an object or function, otherwise false.
 */
function isObjectOrFunction(item) {
    return (0, is_function_1.isFunction)(item) || (0, is_plain_object_1.isPlainObject)(item);
}
//# sourceMappingURL=is-object-or-function.js.map