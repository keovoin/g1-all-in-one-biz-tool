import { EventEmitter, OnDestroy, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class DebounceClickDirective implements OnInit, OnDestroy {
    private clicks;
    private subscription;
    debounceTime: number;
    throttledClick: EventEmitter<any>;
    /**
     * Handles the click event and emits it after a debounce time.
     *
     * @param {Event} event - The click event object.
     * @return {void} This function does not return a value.
     */
    clickEvent(event: Event): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DebounceClickDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DebounceClickDirective, "[debounceClick]", never, { "debounceTime": { "alias": "debounceTime"; "required": false; }; }, { "throttledClick": "throttledClick"; }, never, never, true, never>;
}
