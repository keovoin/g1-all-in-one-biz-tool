import { HttpParams } from '@angular/common/http';
import moment from 'moment';
import { Observable } from 'rxjs';
/**
 * Check string is null or undefined
 * From https://github.com/typeorm/typeorm/issues/873#issuecomment-502294597
 *
 * @param obj
 * @returns
 */
export declare function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined;
/**
 * Checks if a value is not null or undefined.
 * @param value The value to be checked.
 * @returns true if the value is not null or undefined, false otherwise.
 */
export declare function isNotNullOrUndefined<T>(value: T | undefined | null): value is T;
/**
 * Check if a value is null, undefined, or an empty string.
 * @param value The value to check.
 * @returns true if the value is null, undefined, or an empty string, false otherwise.
 */
export declare function isNotNullOrUndefinedOrEmpty<T>(value: T | undefined | null): boolean;
export declare function toParams(query: any): HttpParams;
/**
 * Checks if the given value is a JavaScript object.
 * @param object The value to check.
 * @returns `true` if the value is a JavaScript object, `false` otherwise.
 */
export declare function isObject(object: any): boolean;
/**
 * Check value not empty.
 * @param item
 * @returns {boolean}
 */
export declare function isNotEmpty(item: any): boolean;
/**
 * Check value empty.
 * @param item
 * @returns {boolean}
 */
export declare function isEmpty(item: any): boolean;
export declare function toFormData(obj: any, form?: any, namespace?: any): any;
/**
 * Maps a percentage value (0–100) to a NbComponentStatus string.
 *
 * @param value - The progress percentage.
 * @returns The status: 'danger' (≤25), 'warning' (≤50), 'info' (≤75), or 'success' (>75).
 */
export declare function progressStatus(value: number): 'danger' | 'warning' | 'info' | 'success';
/**
 * Determines the contrasting color (black or white) based on the given hexadecimal color.
 * @param hex The hexadecimal color code (with or without the '#' prefix).
 * @returns The contrasting color ('#000000' for dark backgrounds, '#ffffff' for light backgrounds).
 */
export declare function getContrastColor(hex: string): string;
/**
 * The precision for a decimal (exact numeric applies only for decimal column), which is the maximum
 * number of digits that are stored.
 */
export declare function convertPrecisionFloatDigit(val: number, digit?: number): number;
export declare function retrieveNameFromEmail(email: string): string;
export declare function convertLocalToTimezone(localDt: string | Date, localDtFormat: string, timeZone: string, format?: string): string;
export declare function ucFirst(str: string, force: boolean): string;
/**
 * Get the UTC offset for a given timezone.
 *
 * @param timezone The timezone identifier (e.g., 'Europe/Paris').
 * @returns The UTC offset in minutes.
 */
export declare function getUTCOffsetForTimezone(timezone?: string): number;
/**
 * Converts a date to UTC using the offset of the specified timezone.
 *
 * @param date The date to convert, can be a string, Date object, or moment object.
 * @param timezone (Optional) The timezone identifier (e.g., 'Europe/Paris'). If not provided, the local timezone is used.
 * @returns A moment object representing the date in UTC.
 */
export declare function toUtcOffset(date: string | Date | moment.Moment, timezone?: string): moment.Moment;
/**
 * Converts the given date to the specified timezone.
 *
 * @param date The date to convert to the specified timezone.
 * @param timezone The IANA timezone identifier (e.g., 'America/New_York', 'Europe/London').
 * @returns A moment object representing the date in the specified timezone.
 */
export declare function toTimezone(date: string | Date | moment.Moment, timezone: string): moment.Moment;
/**
 * Converts the given date to the local timezone.
 *
 * @param date The date to convert to local timezone.
 * @returns A moment object representing the date in the local timezone.
 */
export declare function toLocal(date: string | Date | moment.Moment): moment.Moment;
/**
 * Converts the given date to the UTC timezone.
 * @param date The date to convert to UTC timezone.
 * @returns A moment object representing the date in UTC timezone.
 */
export declare function toUTC(date: string | Date | moment.Moment): moment.Moment;
/**
 * Returns an operator function that filters out consecutive duplicate values in an observable sequence.
 * @returns An operator function that filters out consecutive duplicate values in an observable sequence.
 */
export declare function distinctUntilChange<T>(): (source: Observable<T>) => Observable<T>;
/**
 * Compares two dates.
 * @param date1 The first date to compare.
 * @param date2 The second date to compare.
 * @returns `true` if `date1` is greater than `date2`, `false` if they are equal or `date1` is less than `date2`.
 */
export declare const compareDate: (date1: any, date2: any) => boolean;
/**
 * Splits a camelCase or snake_case string into separate words.
 * @param word The input string to split.
 * @returns The input string split into separate words, with each word capitalized.
 * @throws If the input parameter is not a string.
 */
export declare function splitCamelCase(word: string): string;
/**
 * Deep Merge
 *
 * @param target
 * @param sources
 * @returns
 */
export declare function mergeDeep(target: any, ...sources: any): any;
/**
 * Delete Keys from nested object
 *
 * @param data
 * @param deleteKeys
 * @returns
 */
export declare function cleanKeys(data: any, deleteKeys: any): void;
/**
 * Maps a row of employee data to a partial employee state object.
 * @param row The row of employee data to map.
 * @returns A partial employee state object containing 'name', 'fullName', 'id', and 'imageUrl' properties.
 */
export declare function employeeMapper(row: any): {
    name: string | null;
    fullName: string | null;
    id: string | null;
    imageUrl: string | null;
};
/**
 * Adding Trailing Slash In URL
 *
 * "/#/pages/home"
 * console.log(addTrailingSlashIfMissing('#/pages/home'));
 *
 * "/pages/home"
 * console.log(addTrailingSlashIfMissing('pages/home'));
 *
 */
export declare function addTrailingSlash(str: string): string;
/**
 * Removing Trailing Slash In URL
 *
 * "example.com"
 * console.log(stripTrailingSlash('example.com/'));
 *
 */
export declare function removeTrailingSlash(str: string): string;
/**
 * Prepare external URL
 *
 * @param url
 * @returns
 */
export declare function __prepareExternalUrlLocation(url: string): string;
/**
 * Generate slug from string value
 *
 * @param string
 * @param replacement
 * @returns {string}
 */
export declare function sluggable(string: string, replacement?: any): string;
/**
 * It takes a base64 image, compresses it to a given width and height, and returns a promise that
 * resolves to the compressed image
 * @param {string} base64Image - The base64 image string
 * @param {number} width - The width of the image you want to compress.
 * @param {number} height - The height of the image in pixels.
 * @returns A promise that resolves to a string.
 */
export declare function compressImage(base64Image: string, width: number, height: number): Promise<string>;
/**
 * How To Make A Sleep Function In TypeScript?
 *
 * @param ms
 * @returns
 */
export declare function sleep(ms: number): Promise<unknown>;
/**
 * Converts a given input into a boolean value.
 * If the input is `undefined` or `null`, it returns `false`.
 *
 * @param value - The input to convert to a boolean.
 * @returns {boolean} - A boolean representation of the given input.
 */
export declare const parseToBoolean: (value: any) => boolean;
/**
 * Replaces all occurrences of a substring in a given string with another substring.
 *
 * @param {string} value - The input value.
 * @param {string} search - The substring to search for.
 * @param {string} replace - The substring to replace the search substring with.
 * @return {string} The modified string with all occurrences of the search substring replaced.
 */
export declare function replaceAll(value: string, search: string, replace: string): string;
/**
 * Remove duplicates from an array of objects based on a specified property.
 *
 * @param items The array of objects to process.
 * @param property The property to check for duplicates (case-insensitive).
 * @returns A new array with duplicates removed, keeping the last occurrence.
 */
export declare function removeDuplicatesByProperty<T>(items: T[], property: keyof T): T[];
/**
 * Extracts the numeric value from a string.
 *
 * @param value The string containing both text and numbers (e.g., 'BGN 20', 'USD 45.67').
 * @returns The numeric part of the string as a number. Returns NaN if no numeric value is found.
 */
export declare function extractNumber(value: string): number;
/**
 * Checks if a given string exists in an array of strings, case-insensitively.
 * @param existingStrings Array of existing strings to check against.
 * @param value The string to validate.
 * @returns `true` if the string already exists in the array (case-insensitive), otherwise `false`.
 */
export declare function validateUniqueString(existingStrings: string[], value: string): boolean;
/**
 * Calculates the display name for an entity with user information.
 * Handles various user name formats consistently across the application.
 *
 * @param entity The entity object that may contain user information
 * @returns A formatted display name string
 */
export declare function getEntityDisplayName(entity: any): string;
