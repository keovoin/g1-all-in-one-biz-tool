"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPascalCase = toPascalCase;
/**
 * Convert a string to PascalCase.
 *
 * @param str - The string to convert.
 * @returns The PascalCase version of the string.
 */
function toPascalCase(str) {
    return str.replace(/(^\w|_\w)/g, (match) => match.replace(/_/g, "").toUpperCase());
}
//# sourceMappingURL=to-pascal-case.js.map