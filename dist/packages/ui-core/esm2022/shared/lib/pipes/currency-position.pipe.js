import { Pipe } from '@angular/core';
import { CurrencyPosition } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export class CurrencyPositionPipe {
    /**
     * Transforms the given data string based on the specified position.
     *
     * @param {string} data - The data string to be transformed.
     * @param {string} position - The position to determine the transformation.
     * @return {string} The transformed data string.
     */
    transform(data, position) {
        let val = data;
        const extracted = this.extract(data);
        switch (position) {
            case CurrencyPosition.LEFT:
                val = extracted[0] + ' ' + extracted[1];
                break;
            case CurrencyPosition.RIGHT:
                val = extracted[1] + ' ' + extracted[0];
                break;
            default:
                break;
        }
        return val;
    }
    /**
     * This method extract currency symbol and value
     * @param data should be a string value of a currency pipe
     * @returns string
     */
    extract(data) {
        const regex = new RegExp('([^\\d\\.\\,\\s]+)', 'g');
        const currency = regex.exec(data)[0];
        const value = currency && data ? data.replace(currency, '') : '';
        return [currency, value];
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CurrencyPositionPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: CurrencyPositionPipe, isStandalone: true, name: "position" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CurrencyPositionPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'position',
                    standalone: true
                }]
        }] });
//# sourceMappingURL=currency-position.pipe.js.map