"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepMerge = deepMerge;
const deep_clone_1 = require("./deep-clone");
const is_class_instance_1 = require("./is-class-instance");
const is_plain_object_1 = require("./is-plain-object");
/**
 * Deeply merges two objects.
 *
 * @param target - The target object to merge into.
 * @param source - The source object to merge from.
 * @param depth - The depth level for recursive merging (default is 0).
 * @returns The merged object.
 */
function deepMerge(target, source, depth = 0) {
    // Return the target if source is not an object
    if (!source || typeof source !== 'object') {
        return target;
    }
    // Clone target at depth 0 to avoid mutating original target
    if (depth === 0) {
        target = (0, deep_clone_1.deepClone)(target);
    }
    // Merge objects recursively
    if ((0, is_plain_object_1.isPlainObject)(target) && (0, is_plain_object_1.isPlainObject)(source)) {
        for (const key in source) {
            // Prevent prototype pollution (CWE-1321): never copy these keys, which would
            // otherwise let a crafted source object write onto Object.prototype.
            if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                continue;
            }
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                // If the source value is an object, recursively merge
                if ((0, is_plain_object_1.isPlainObject)(source[key])) {
                    if (!target[key]) {
                        target[key] = {};
                    }
                    if (!(0, is_class_instance_1.isClassInstance)(source[key])) {
                        deepMerge(target[key], source[key], depth + 1);
                    }
                    else {
                        // If the source is a class instance, do not merge, just assign
                        target[key] = source[key];
                    }
                }
                else {
                    // Directly assign the value from source to target
                    target[key] = source[key];
                }
            }
        }
    }
    return target;
}
//# sourceMappingURL=deep-merge.js.map