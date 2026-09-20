/**
 * A utility class for color operations.
 */
export declare class ColorAdapter {
    /**
     * Converts a hexadecimal color value to RGB string format.
     * @param hex The hexadecimal color value to convert.
     * @returns The RGB string representation of the color.
     */
    static hex2Rgb(hex: string): string;
    /**
     * Normalizes a hexadecimal color value by ensuring it starts with '#'.
     * @param hex The hexadecimal color value to normalize.
     * @returns The normalized hexadecimal color value.
     */
    static normalize(hex: string): string;
    /**
     * Determines the contrast color for a given background color.
     * @param bgColor The background color to determine the contrast color for.
     * @returns The contrast color (either '#ffffff' or '#000000').
     */
    static contrast(bgColor: string): string;
    /**
     * Gets the background color, ensuring it's in a valid format.
     * @param bgColor The background color to validate and return.
     * @returns The valid background color.
     */
    static background(bgColor: string): string;
    /**
     * Converts a hexadecimal color value to HSL string format.
     * @param hexColor The hexadecimal color value to convert.
     * @returns The HSL string representation of the color.
     */
    static hexToHsl(hexColor: string): string;
}
