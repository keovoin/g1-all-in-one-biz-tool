import { ValueTransformer } from 'typeorm';
import { RequestMethod } from '@gauzy/contracts';
/**
 * HttpMethodTransformerPipe handles the conversion between enum integer (stored in DB)
 * and the corresponding HTTP method string (e.g., 'GET', 'POST', etc.).
 */
export declare class HttpMethodTransformerPipe implements ValueTransformer {
    /**
     * A map of HTTP method strings to their corresponding enum values.
     */
    private static methodMap;
    /**
     * A map of enum values to their corresponding HTTP method strings.
     */
    private static reverseMethodMap;
    /**
     * Converts the HTTP method string to the corresponding enum value when writing to the database.
     *
     * @param value - The HTTP method string (e.g., 'GET', 'POST').
     * @returns The corresponding RequestMethod enum value.
     */
    to(value: string): RequestMethod;
    /**
     * Converts the enum value to the corresponding HTTP method string when reading from the database.
     *
     * @param value - The enum value (e.g., RequestMethod.GET).
     * @returns The corresponding HTTP method string.
     */
    from(value: RequestMethod): string;
}
