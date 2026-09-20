import { PipeTransform } from '@angular/core';
import * as i0 from "@angular/core";
export declare class CurrencyPositionPipe implements PipeTransform {
    /**
     * Transforms the given data string based on the specified position.
     *
     * @param {string} data - The data string to be transformed.
     * @param {string} position - The position to determine the transformation.
     * @return {string} The transformed data string.
     */
    transform(data: string, position: string): string;
    /**
     * This method extract currency symbol and value
     * @param data should be a string value of a currency pipe
     * @returns string
     */
    extract(data: string): string[];
    static ɵfac: i0.ɵɵFactoryDeclaration<CurrencyPositionPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<CurrencyPositionPipe, "position", true>;
}
