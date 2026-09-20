import { PipeTransform } from '@angular/core';
import * as i0 from "@angular/core";
export declare class DateFormatPipe implements PipeTransform {
    private readonly store;
    dateFormat: string;
    regionCode: string;
    locale: string;
    constructor();
    /**
     * Transforms a given value into a formatted date string based on provided format and locale.
     *
     * @param {Date | string | number | null | undefined} value - The value to transform. Can be a Date object, string, number, or null/undefined.
     * @param {string} [locale] - The locale to use for formatting. If not provided, the default region code will be used.
     * @param {string} [defaultFormat] - The format to apply to the date. If not provided, the default date format will be used.
     * @return {string | undefined} The formatted date string, or undefined if the value is falsy or invalid.
     */
    transform(value: Date | string | number | null | undefined, locale?: string, defaultFormat?: string): string | undefined;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateFormatPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<DateFormatPipe, "dateFormat", true>;
}
