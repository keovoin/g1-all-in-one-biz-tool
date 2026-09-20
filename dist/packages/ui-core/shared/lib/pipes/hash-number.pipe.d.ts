import { PipeTransform } from '@angular/core';
import * as i0 from "@angular/core";
export declare class HashNumberPipe implements PipeTransform {
    /**
     * Transforms a number or string into a hashed string.
     *
     * @param {number | string} value - The value to be transformed.
     * @return {string} The transformed hashed string, or an empty string if the value is falsy or non-numeric.
     */
    transform(value: number | string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<HashNumberPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<HashNumberPipe, "hash", true>;
}
