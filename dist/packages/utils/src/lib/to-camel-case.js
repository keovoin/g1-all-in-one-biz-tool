"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCamelCase = toCamelCase;
/**
 * Convert a string to camelCase.
 *
 * @param str - The string to convert.
 * @returns The camelCase version of the string.
 */
function toCamelCase(str) {
    return /^([a-z]+)(([A-Z]([a-z]+))+)$/.test(str)
        ? str
        : str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}
//# sourceMappingURL=to-camel-case.js.map