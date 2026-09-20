import { PipeTransform } from '@angular/core';
import * as i0 from "@angular/core";
export declare class FilterArrayPipe implements PipeTransform {
    /**
     * Filters an array of values based on the provided input array.
     *
     * @param {any[]} values - The array of values to filter.
     * @param {string[]} input - The array of strings to use for filtering.
     * @return {any[]} The filtered array of values.
     */
    transform(values: any, input: string[]): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<FilterArrayPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<FilterArrayPipe, "filterArray", true>;
}
