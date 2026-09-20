import { Pipe, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as i0 from "@angular/core";
export class SafeUrlPipe {
    constructor() {
        this.sanitizer = inject(DomSanitizer);
    }
    /**
     *
     * @param url should be a string
     * @returns is safe string
     */
    transform(url) {
        if (url) {
            return this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SafeUrlPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: SafeUrlPipe, isStandalone: true, name: "safeUrl" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SafeUrlPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'safeUrl',
                    standalone: true
                }]
        }] });
//# sourceMappingURL=safe-url.pipe.js.map