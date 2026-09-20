import { PipeTransform } from '@angular/core';
import * as i0 from "@angular/core";
export declare class ReplacePipe implements PipeTransform {
    /**
     * Transforms the input string by replacing occurrences of the pattern with the replacement.
     *
     * @param {any} input - The input string to be transformed.
     * @param {any} pattern - The pattern to search for in the input string. It can be a string or a regular expression.
     * @param {any} replacement - The string to replace the pattern with.
     * @return {any} The transformed input string with the pattern replaced by the replacement string.
     */
    transform(input: any, pattern: any, replacement: any): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<ReplacePipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<ReplacePipe, "replace", true>;
}
