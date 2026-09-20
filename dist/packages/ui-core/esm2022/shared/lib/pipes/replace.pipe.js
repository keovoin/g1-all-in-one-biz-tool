import { Pipe } from '@angular/core';
import { isRegExp, isString, isUndefined } from 'underscore';
import { replaceAll } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
export class ReplacePipe {
    /**
     * Transforms the input string by replacing occurrences of the pattern with the replacement.
     *
     * @param {any} input - The input string to be transformed.
     * @param {any} pattern - The pattern to search for in the input string. It can be a string or a regular expression.
     * @param {any} replacement - The string to replace the pattern with.
     * @return {any} The transformed input string with the pattern replaced by the replacement string.
     */
    transform(input, pattern, replacement) {
        if (!isString(input) || isUndefined(pattern) || isUndefined(replacement)) {
            return input;
        }
        if (isRegExp(pattern)) {
            return input.replace(pattern, replacement);
        }
        else {
            return replaceAll(input, pattern, replacement);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ReplacePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ReplacePipe, isStandalone: true, name: "replace" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ReplacePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'replace',
                    standalone: true
                }]
        }] });
//# sourceMappingURL=replace.pipe.js.map