import { Pipe, SecurityContext, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as i0 from "@angular/core";
export class Nl2BrPipe {
    constructor() {
        this.sanitizer = inject(DomSanitizer);
    }
    /**
     * Transforms a string by replacing line breaks with HTML line breaks and sanitizes it if necessary.
     *
     * @param {string} value - The string to be transformed.
     * @param {boolean} [sanitizeBeforehand=false] - Whether to sanitize the string beforehand. Defaults to false.
     * @return {string} The transformed string.
     */
    transform(value, sanitizeBeforehand) {
        if (typeof value !== 'string') {
            return value;
        }
        let result;
        const textParsed = value.replace(/(?:\r\n|\r|\n)/g, '<br />');
        if (sanitizeBeforehand) {
            result = this.sanitizer.sanitize(SecurityContext.HTML, textParsed);
        }
        else {
            result = textParsed;
        }
        return result;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: Nl2BrPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: Nl2BrPipe, isStandalone: true, name: "nl2br" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: Nl2BrPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'nl2br',
                    standalone: true
                }]
        }] });
//# sourceMappingURL=nl2br.pipe.js.map