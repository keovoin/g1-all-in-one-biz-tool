import { PipeTransform } from '@angular/core';
import * as i0 from "@angular/core";
export declare class DurationFormatPipe implements PipeTransform {
    /**
     * Transforms the given number of seconds into a formatted duration string in the format HH:mm:ss.
     *
     * @param {number} seconds - The number of seconds to transform.
     * @return {string} The formatted duration string in the format HH:mm:ss.
     */
    transform(seconds: number): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<DurationFormatPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<DurationFormatPipe, "durationFormat", true>;
}
