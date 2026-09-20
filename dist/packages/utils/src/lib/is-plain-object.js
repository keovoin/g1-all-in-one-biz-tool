"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlainObject = isPlainObject;
/**
 * Determines whether the given value is a plain object (not an array, null, or other non-object types).
 *
 * @param {unknown} item - The value to check.
 * @returns {boolean} - Returns `true` if the value is a non-array object, otherwise `false`.
 *
 * @example
 * console.log(isPlainObject({})); // true
 * console.log(isPlainObject([])); // false
 * console.log(isPlainObject(null)); // false
 * console.log(isPlainObject('string')); // false
 */
function isPlainObject(item) {
    return !!item && typeof item === 'object' && !Array.isArray(item);
}
//# sourceMappingURL=is-plain-object.js.map