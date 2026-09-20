"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deduplicate = deduplicate;
/**
 * Remove duplicates from an array.
 *
 * @param collection - The array from which to remove duplicates.
 * @returns A new array with duplicate values removed.
 */
function deduplicate(collection) {
    return [...new Set(collection)];
}
//# sourceMappingURL=deduplicate.js.map