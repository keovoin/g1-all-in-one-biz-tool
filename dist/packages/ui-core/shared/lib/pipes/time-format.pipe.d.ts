import { PipeTransform, OnDestroy } from '@angular/core';
import * as i0 from "@angular/core";
export declare class TimeFormatPipe implements PipeTransform, OnDestroy {
    private readonly store;
    private format;
    constructor();
    /**
     * Transforms a given value into a formatted time string.
     * @param value The value to transform into a time string. This can be a string, number, Date object, or any value parsable by moment.js.
     * @param timeFormat The time format to use. If not provided, it defaults to `this.format`.
     * @param seconds Optional. If true, include seconds in the formatted time string. Defaults to false.
     * @returns A formatted time string based on the input value and format options.
     */
    transform(value: any, timeFormat?: number, seconds?: boolean): any;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimeFormatPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<TimeFormatPipe, "timeFormat", true>;
}
