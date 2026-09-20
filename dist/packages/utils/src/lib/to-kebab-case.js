"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kebabCase = void 0;
/**
 * Convert a string to kebab-case.
 *
 * @param str - The string to convert.
 * @returns The kebab-case version of the string.
 */
const kebabCase = (str) => str
    .replace(/([a-z])([A-Z])/g, '$1-$2') // Inserts a hyphen between lowercase and uppercase letters
    .replace(/[\s_]+/g, '-') // Replaces spaces and underscores with a hyphen
    .toLowerCase(); // Converts the entire string to lowercase
exports.kebabCase = kebabCase;
//# sourceMappingURL=to-kebab-case.js.map