import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class CapitalizePipe {
    /**
     * Capitalize first letter of every word
     *
     * @param input String to capitalize
     * @return Capitalized string
     */
    transform(input) {
        return input && input.length ? input.charAt(0).toUpperCase() + input.slice(1).toLowerCase() : input;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CapitalizePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: CapitalizePipe, isStandalone: true, name: "capitalize" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CapitalizePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'capitalize',
                    standalone: true
                }]
        }] });
//# sourceMappingURL=capitalize.pipe.js.map