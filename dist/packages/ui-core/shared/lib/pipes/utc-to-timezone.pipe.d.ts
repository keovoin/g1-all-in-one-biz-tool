import { PipeTransform } from '@angular/core';
import * as i0 from "@angular/core";
export declare class UtcToTimezone implements PipeTransform {
    /**
     * Transforms the given date/time value to the specified timezone and returns it as a JavaScript Date object.
     *
     * @param value The date/time value to be transformed. Can be a string, Date, or moment object.
     * @param timezone The IANA timezone identifier (e.g., 'America/New_York', 'Europe/London') to which the date should be converted.
     * @param format The format to be used when parsing the date if initial parsing fails. Default is 'HH:mm'.
     * @returns A JavaScript Date object representing the date/time in the specified timezone.
     */
    transform(value: any, timezone: string, format?: string): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<UtcToTimezone, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<UtcToTimezone, "utcToTimezone", true>;
}
