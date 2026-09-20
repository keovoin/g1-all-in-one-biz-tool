import { PipeTransform } from '@angular/core';
import * as i0 from "@angular/core";
export declare class UtcToLocalPipe implements PipeTransform {
    /**
     * Transforms the given date/time value to the local timezone and returns it as a JavaScript Date object.
     * @param value The date/time value to be transformed. Can be a string, Date, or moment object.
     * @param format The format to be used when parsing the date if initial parsing fails. Default is 'HH:mm'.
     * @returns A JavaScript Date object representing the date/time in the local timezone.
     */
    transform(value: any, format?: string): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<UtcToLocalPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<UtcToLocalPipe, "utcToLocal", true>;
}
