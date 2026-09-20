import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class FilterArrayPipe {
    /**
     * Filters an array of values based on the provided input array.
     *
     * @param {any[]} values - The array of values to filter.
     * @param {string[]} input - The array of strings to use for filtering.
     * @return {any[]} The filtered array of values.
     */
    transform(values, input) {
        let output = [];
        if (input && input.length > 0) {
            values.forEach((value) => {
                if (input.indexOf(value.id) !== -1)
                    output.push(value);
            });
        }
        return output;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FilterArrayPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: FilterArrayPipe, isStandalone: true, name: "filterArray", pure: false }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FilterArrayPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'filterArray',
                    pure: false,
                    standalone: true
                }]
        }] });
//# sourceMappingURL=filter-array.pipe.js.map