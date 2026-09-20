import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class RemoveLodashPipe {
    transform(value, args) {
        if (value) {
            return value.split('_').join(' ');
        }
        else {
            return value;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RemoveLodashPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: RemoveLodashPipe, isStandalone: false, name: "removeLodash" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RemoveLodashPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'removeLodash',
                    standalone: false
                }]
        }] });
//# sourceMappingURL=remove-lodash.pipe.js.map