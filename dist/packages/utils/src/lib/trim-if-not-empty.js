"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimIfNotEmpty = void 0;
const is_not_empty_1 = require("./is-not-empty");
/**
 * Trims a string value and returns it if not empty; otherwise, returns undefined.
 *
 * @param value - The string value to trim.
 * @returns Trimmed string value or undefined if the input is empty or undefined.
 *
 * @example
 * ```typescript
 * trimIfNotEmpty("  example  "); // Output: "example"
 * trimIfNotEmpty("   ");         // Output: undefined (empty after trimming)
 * trimIfNotEmpty("");            // Output: undefined
 * trimIfNotEmpty(undefined);     // Output: undefined
 * ```
 */
const trimIfNotEmpty = (value) => {
    return (0, is_not_empty_1.isNotEmpty)(value) ? value.trim() : undefined;
};
exports.trimIfNotEmpty = trimIfNotEmpty;
//# sourceMappingURL=trim-if-not-empty.js.map