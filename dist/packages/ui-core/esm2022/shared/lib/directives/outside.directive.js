import { Directive, ElementRef, EventEmitter, Output, HostListener, inject } from '@angular/core';
import * as i0 from "@angular/core";
export class OutsideDirective {
    constructor() {
        this.elementRef = inject(ElementRef);
        /**
         * Emits on every document click: `true` when the click landed INSIDE the host,
         * `false` when it landed outside.
         *
         * The name reads like "the click was outside", but the payload says the
         * opposite — so consumers are written as `(clickOutside)="handler($event)"` with
         * `handler(clickedInside: boolean)`, and typically act when the value is FALSE.
         * The name is kept because seven templates bind it; the type is not, because it
         * was declared `EventEmitter<MouseEvent>` while emitting a boolean. Every
         * consumer already typed its handler `boolean` and so worked only by ignoring
         * that declaration — which made "correct the type" a trap: fixing it in
         * isolation would have silently inverted any handler written against the lie.
         */
        this.clickOutside = new EventEmitter();
    }
    /**
     * Reports whether a document click landed inside this element.
     *
     * @param _event - The click event. Unused: only the target matters here, but the
     *                 host binding passes it and dropping it would change the binding.
     * @param targetElement - The element that was clicked.
     */
    onClick(_event, targetElement) {
        if (!targetElement) {
            return;
        }
        const clickedInside = this.elementRef.nativeElement.contains(targetElement);
        this.clickOutside.emit(clickedInside);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OutsideDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: OutsideDirective, isStandalone: true, selector: "[gauzyOutside]", outputs: { clickOutside: "clickOutside" }, host: { listeners: { "document:click": "onClick($event,$event.target)" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OutsideDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[gauzyOutside]',
                    standalone: true
                }]
        }], propDecorators: { clickOutside: [{
                type: Output
            }], onClick: [{
                type: HostListener,
                args: ['document:click', ['$event', '$event.target']]
            }] } });
//# sourceMappingURL=outside.directive.js.map