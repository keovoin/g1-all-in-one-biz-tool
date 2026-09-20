"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayToObject = arrayToObject;
/**
 * Converts an array of objects into a key-value object based on specified properties.
 *
 * @template T - Type of objects within the array.
 * @template K - Key property type (extends keyof T).
 * @template V - Value property type (extends keyof T).
 *
 * @param {T[]} array - The input array of objects.
 * @param {K} key - The property name to be used as the object key.
 * @param {V} value - The property name to be used as the object value.
 * @returns {Record<string, any>} - The resulting object mapping keys to values.
 *
 * @example
 * const users = [
 *   { id: 1, name: 'John' },
 *   { id: 2, name: 'Jane' }
 * ];
 * const userMap = arrayToObject(users, 'id', 'name');
 * console.log(userMap); // { "1": "John", "2": "Jane" }
 */
function arrayToObject(array, key, value) {
    return array.reduce((acc, item) => {
        acc[String(item[key])] = item[value];
        return acc;
    }, {});
}
//# sourceMappingURL=array-to-object.js.map