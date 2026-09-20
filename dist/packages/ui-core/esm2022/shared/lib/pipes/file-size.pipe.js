import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
const defaultPrecisionMap = {
    bytes: 0,
    KB: 1,
    MB: 2,
    GB: 2,
    TB: 2
};
/*
 * Convert bytes into largest possible unit.
 * Takes an precision argument that can be a number or a map for each unit.
 * Usage:
 *   bytes | fileSize:precision
 * @example
 * // returns 1 KB
 * {{ 1500 | fileSize }}
 * @example
 * // returns 2.1 GB
 * {{ 2100000000 | fileSize }}
 * @example
 * // returns 1.46 KB
 * {{ 1500 | fileSize:2 }}
 */
export class FileSizePipe {
    constructor() {
        this.units = ['bytes', 'KB', 'MB', 'GB', 'TB'];
    }
    /**
     * Converts a number of bytes to the largest possible unit.
     *
     * @param {number} bytes - The number of bytes to be converted. Defaults to 0.
     * @param {number | unitPrecisionMap} precision - The precision of the conversion. Can be a number or a map for each unit. Defaults to defaultPrecisionMap.
     * @return {string} The converted value with the unit.
     */
    transform(bytes = 0, precision = defaultPrecisionMap) {
        if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes))
            return '?';
        let unitIndex = 0;
        while (bytes >= 1000) {
            bytes /= 1000;
            unitIndex++;
        }
        const unit = this.units[unitIndex];
        if (typeof precision === 'number') {
            return bytes.toFixed(precision) + ' ' + unit;
        }
        return bytes.toFixed(precision[unit]) + ' ' + unit;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FileSizePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: FileSizePipe, isStandalone: true, name: "fileSize" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FileSizePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'fileSize',
                    standalone: true
                }]
        }] });
//# sourceMappingURL=file-size.pipe.js.map