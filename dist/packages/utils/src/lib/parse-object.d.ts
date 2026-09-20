/**
 * Recursively parses an object, applying a callback to all non-object leaf values.
 *
 * @param source - The object to parse.
 * @param callback - The function to apply to each primitive value.
 * @returns The modified object.
 */
export declare function parseObject<T extends object>(source: T, callback: (value: any) => any): T;
