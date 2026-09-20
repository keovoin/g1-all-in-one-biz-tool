import { Pipe, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as i0 from "@angular/core";
export class SafeHtmlPipe {
    constructor() {
        this.sanitizer = inject(DomSanitizer);
    }
    /**
     * Transforms a string into SafeHtml, bypassing Angular's security trust for HTML.
     *
     * @warning This pipe disables Angular's built-in sanitization. Ensure that the `value` is trusted HTML.
     * Using this with untrusted user input can lead to XSS vulnerabilities.
     *
     * @param value should be a string
     * @returns is safe string
     */
    transform(value) {
        if (value) {
            return this.sanitizer.bypassSecurityTrustHtml(value);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SafeHtmlPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: SafeHtmlPipe, isStandalone: true, name: "safeHtml" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SafeHtmlPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'safeHtml',
                    standalone: true
                }]
        }] });
//# sourceMappingURL=safe-html.pipe.js.map