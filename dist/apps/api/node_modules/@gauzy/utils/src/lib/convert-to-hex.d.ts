/**
 * Converts an object with numeric id values into a hexadecimal string representation.
 *
 * @param value - An object that contains an 'id' property, which should be an object with numeric values.
 * @returns A hexadecimal string representation of the numeric values in the 'id' object.
 * @throws Will throw an error if the input is invalid or if any id value is out of range (0-255).
 */
export default function toHexString(value: {
    id: Record<string, number>;
}): string;
