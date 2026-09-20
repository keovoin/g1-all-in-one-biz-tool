/**
 * Deeply clones an input value.
 *
 * @param input - The value to be deeply cloned. Can be a primitive, array, or object.
 * @returns A deep copy of the input value.
 */
export declare function deepClone<T extends string | number | any[] | Object>(input: T): T;
