import { ElementRef, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class SearchInputComponent {
    isInputShown: boolean;
    input: ElementRef;
    search: EventEmitter<string>;
    showInput(): void;
    hideInput(): void;
    onInput(val: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SearchInputComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SearchInputComponent, "ngx-search-input", never, {}, { "search": "search"; }, never, never, false, never>;
}
