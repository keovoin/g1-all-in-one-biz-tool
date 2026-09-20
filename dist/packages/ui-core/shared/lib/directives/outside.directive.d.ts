import { EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class OutsideDirective {
    private readonly elementRef;
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
    clickOutside: EventEmitter<boolean>;
    /**
     * Reports whether a document click landed inside this element.
     *
     * @param _event - The click event. Unused: only the target matters here, but the
     *                 host binding passes it and dropping it would change the binding.
     * @param targetElement - The element that was clicked.
     */
    onClick(_event: MouseEvent, targetElement: HTMLElement): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<OutsideDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<OutsideDirective, "[gauzyOutside]", never, {}, { "clickOutside": "clickOutside"; }, never, never, true, never>;
}
