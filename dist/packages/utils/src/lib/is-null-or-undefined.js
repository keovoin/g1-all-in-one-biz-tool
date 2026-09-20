"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNullOrUndefined = isNullOrUndefined;
/**
 * Checks if a value is null or undefined.
 * From https://github.com/typeorm/typeorm/issues/873#issuecomment-502294597
 *
 * @param value - The value to check.
 * @returns True if the value is null or undefined; otherwise, false.
 *
 * @example
 * ```typescript
 * const result = isNullOrUndefined(someValue);
 * ```
 */
function isNullOrUndefined(value) {
    return value === undefined || value === null;
}
//# sourceMappingURL=is-null-or-undefined.js.map