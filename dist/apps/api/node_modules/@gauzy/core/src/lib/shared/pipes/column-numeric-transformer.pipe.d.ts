import { ValueTransformer } from 'typeorm';
/**
 * Convert Non-integer numbers string to integer
 *
 * From https://github.com/typeorm/typeorm/issues/873#issuecomment-502294597
 */
export declare class ColumnNumericTransformerPipe implements ValueTransformer {
    /**
     * Converts a number for storage in the database.
     * If the value is not defined, it returns null.
     *
     * @param value - The number to convert.
     * @returns The number itself, or null if undefined.
     */
    to(value: number): number | null;
    /**
     * Transforms a string to the entity property value.
     *
     * @param value - The input string.
     * @returns The transformed number or null if the input is invalid.
     */
    from(value?: string | null): number | null;
}
