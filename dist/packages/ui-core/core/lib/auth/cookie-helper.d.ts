/**
 * Retrieves the value of a cookie by its name for the current domain and its subdomains.
 *
 * @param {string} name - The name of the cookie to retrieve.
 * @return {string | null} - The value of the cookie if found, or null if not found.
 */
export declare function getCookie(name: string): string | null;
/**
 * Sets a cookie with the specified name, value, and options.
 *
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {Object} options - Additional options for the cookie.
 */
export declare function setCookie(name: string, value: string, options?: {
    [key: string]: any;
}): void;
/**
 * Deletes a cookie by setting its expiration date to a time in the past.
 *
 * @param {string} name - The name of the cookie to delete.
 * @param {Object} options - Additional options for the cookie.
 */
export declare function deleteCookie(name: string, options?: {
    [key: string]: any;
}): void;
