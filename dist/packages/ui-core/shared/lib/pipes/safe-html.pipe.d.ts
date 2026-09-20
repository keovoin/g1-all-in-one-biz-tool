import { PipeTransform } from '@angular/core';
import * as i0 from "@angular/core";
export declare class SafeHtmlPipe implements PipeTransform {
    private readonly sanitizer;
    /**
     * Transforms a string into SafeHtml, bypassing Angular's security trust for HTML.
     *
     * @warning This pipe disables Angular's built-in sanitization. Ensure that the `value` is trusted HTML.
     * Using this with untrusted user input can lead to XSS vulnerabilities.
     *
     * @param value should be a string
     * @returns is safe string
     */
    transform(value: string): import("@angular/platform-browser").SafeHtml;
    static ɵfac: i0.ɵɵFactoryDeclaration<SafeHtmlPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<SafeHtmlPipe, "safeHtml", true>;
}
