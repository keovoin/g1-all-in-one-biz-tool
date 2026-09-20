/**
 * Check if the provided value is empty.
 * This function checks for various types of values:
 * - Arrays: Returns true if the array is empty after filtering out any empty values.
 * - Objects: Returns true if the object has no own properties after removing null, undefined, or empty string properties.
 * - Other types: Returns true for null, undefined, or string representations of 'null' or 'undefined'.
 *
 * @param item - The value to check for emptiness.
 * @returns {boolean} - Returns true if the value is empty, otherwise false.
 */
export declare function isEmpty(item: any): boolean;
