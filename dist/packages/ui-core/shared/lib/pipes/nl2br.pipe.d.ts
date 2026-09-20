import { PipeTransform } from '@angular/core';
import * as i0 from "@angular/core";
export declare class Nl2BrPipe implements PipeTransform {
    private readonly sanitizer;
    /**
     * Transforms a string by replacing line breaks with HTML line breaks and sanitizes it if necessary.
     *
     * @param {string} value - The string to be transformed.
     * @param {boolean} [sanitizeBeforehand=false] - Whether to sanitize the string beforehand. Defaults to false.
     * @return {string} The transformed string.
     */
    transform(value: string, sanitizeBeforehand?: boolean): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<Nl2BrPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<Nl2BrPipe, "nl2br", true>;
}
