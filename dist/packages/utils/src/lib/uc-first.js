"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ucFirst = ucFirst;
/**
 * Capitalize the first letter of a string.
 *
 * @param str - The input string to capitalize.
 * @param force - If true, convert the rest of the string to lowercase (default is true).
 * @returns The modified string with the first letter capitalized.
 */
function ucFirst(str, force = true) {
    str = force ? str.toLowerCase() : str;
    return str.replace(/^([a-zA-Z])/, function (firstLetter) {
        return firstLetter.toUpperCase();
    });
}
//# sourceMappingURL=uc-first.js.map