import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import * as i0 from "@angular/core";
export class NoSpaceEdgesDirective {
    constructor() {
        this.el = inject(ElementRef);
    }
    /**
     * Trims the input value and updates the element's value.
     *
     * @param {string} value - The input value to be trimmed.
     * @return {void} This function does not return anything.
     */
    onInput(value) {
        this.el.nativeElement.value = value.trim();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NoSpaceEdgesDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: NoSpaceEdgesDirective, isStandalone: true, selector: "[noSpaceEdges]", host: { listeners: { "input": "onInput($event.target.value)" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NoSpaceEdgesDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[noSpaceEdges]',
                    standalone: true
                }]
        }], propDecorators: { onInput: [{
                type: HostListener,
                args: ['input', ['$event.target.value']]
            }] } });
//# sourceMappingURL=no-space-edges.directive.js.map