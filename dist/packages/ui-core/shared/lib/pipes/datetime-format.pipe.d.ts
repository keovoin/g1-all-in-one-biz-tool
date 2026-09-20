import { PipeTransform } from '@angular/core';
import * as i0 from "@angular/core";
export declare class DateTimeFormatPipe implements PipeTransform {
    private readonly store;
    timeFormat: number;
    dateFormat: string;
    regionCode: string;
    constructor();
    /**
     * Transforms a given date value into a formatted string based on provided format and locale.
     *
     * @param value The date value to transform.
     * @param format The format to apply to the date.
     * @param locale The locale to use for formatting.
     * @param seconds Whether to include seconds in the time format.
     * @returns The formatted date string.
     */
    transform(value: Date | string | number | null | undefined, format?: string, locale?: string, seconds?: boolean): string | undefined;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateTimeFormatPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<DateTimeFormatPipe, "dateTimeFormat", true>;
}
