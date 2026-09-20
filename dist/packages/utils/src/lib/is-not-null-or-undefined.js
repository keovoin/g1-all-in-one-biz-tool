"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNotNullOrUndefined = isNotNullOrUndefined;
/**
 * Checks if a value is not null or undefined.
 *
 * @param value - The value to be checked.
 * @returns True if the value is not null or undefined; otherwise, false.
 *
 * @example
 * ```typescript
 * const result = isNotNullOrUndefined(someValue);
 * ```
 */
function isNotNullOrUndefined(value) {
    return value !== undefined && value !== null;
}
//# sourceMappingURL=is-not-null-or-undefined.js.map