"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchPattern = matchPattern;
/**
 * Checks if a string matches a specified regular expression pattern.
 *
 * @param value - The string to test.
 * @param pattern - The regular expression pattern to match.
 * @returns True if the string matches the pattern; otherwise, false.
 *
 * @example
 * ```typescript
 * const isEmail = matchPattern("test@example.com", /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
 * ```
 */
function matchPattern(value, pattern) {
    return pattern.test(value);
}
//# sourceMappingURL=match.js.map