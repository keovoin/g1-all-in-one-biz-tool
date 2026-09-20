import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class HashNumberPipe {
    /**
     * Transforms a number or string into a hashed string.
     *
     * @param {number | string} value - The value to be transformed.
     * @return {string} The transformed hashed string, or an empty string if the value is falsy or non-numeric.
     */
    transform(value) {
        if (value) {
            const numericValue = isNaN(Number(value)) ? value : Number(value);
            return '#' + numericValue;
        }
        return ''; // Return an empty string for non-numeric or falsy values
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HashNumberPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: HashNumberPipe, isStandalone: true, name: "hash" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HashNumberPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'hash',
                    standalone: true
                }]
        }] });
//# sourceMappingURL=hash-number.pipe.js.map