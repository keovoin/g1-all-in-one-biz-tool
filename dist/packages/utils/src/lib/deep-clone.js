"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepClone = deepClone;
const is_class_instance_1 = require("./is-class-instance");
const is_empty_1 = require("./is-empty");
const is_plain_object_1 = require("./is-plain-object");
/**
 * Deeply clones an input value.
 *
 * @param input - The value to be deeply cloned. Can be a primitive, array, or object.
 * @returns A deep copy of the input value.
 */
function deepClone(input) {
    // Return the input itself if it's not an object or is empty
    if (!(0, is_plain_object_1.isPlainObject)(input) || (0, is_empty_1.isEmpty)(input)) {
        return input;
    }
    // Initialize output variable
    let output;
    // Clone array types recursively
    if (Array.isArray(input)) {
        output = input.map((item) => deepClone(item));
        return output;
    }
    // Return class instances directly
    if ((0, is_class_instance_1.isClassInstance)(input)) {
        return input;
    }
    // Clone objects recursively
    output = {};
    for (const key in input) {
        // Prevent prototype pollution (CWE-1321) via `__proto__`. Unlike deepMerge, `constructor` and
        // `prototype` are intentionally NOT skipped here: cloning must preserve ordinary own data keys
        // with those names, and the dangerous recursion only exists in deepMerge's source-driven merge.
        if (key === '__proto__') {
            continue;
        }
        if (Object.prototype.hasOwnProperty.call(input, key)) {
            output[key] = deepClone(input[key]);
        }
    }
    return output;
}
//# sourceMappingURL=deep-clone.js.map