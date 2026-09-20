import { PipeTransform } from '@angular/core';
import * as i0 from "@angular/core";
export declare class CapitalizePipe implements PipeTransform {
    /**
     * Capitalize first letter of every word
     *
     * @param input String to capitalize
     * @return Capitalized string
     */
    transform(input: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<CapitalizePipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<CapitalizePipe, "capitalize", true>;
}
