import { PipeTransform } from '@angular/core';
import * as i0 from "@angular/core";
type unit = 'bytes' | 'KB' | 'MB' | 'GB' | 'TB';
type unitPrecisionMap = {
    [u in unit]: number;
};
export declare class FileSizePipe implements PipeTransform {
    private readonly units;
    /**
     * Converts a number of bytes to the largest possible unit.
     *
     * @param {number} bytes - The number of bytes to be converted. Defaults to 0.
     * @param {number | unitPrecisionMap} precision - The precision of the conversion. Can be a number or a map for each unit. Defaults to defaultPrecisionMap.
     * @return {string} The converted value with the unit.
     */
    transform(bytes?: number, precision?: number | unitPrecisionMap): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<FileSizePipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<FileSizePipe, "fileSize", true>;
}
export {};
