import { EventEmitter, OnInit } from '@angular/core';
import { Cell, DefaultEditor } from 'angular2-smart-table';
import * as i0 from "@angular/core";
export declare class NumberEditorComponent extends DefaultEditor implements OnInit {
    cellValue: number;
    cell: Cell;
    onConfirm: EventEmitter<number>;
    constructor();
    ngOnInit(): void;
    /**
     * Handles the input change event.
     *
     * @param event - The input change event.
     */
    onInputChange(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NumberEditorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NumberEditorComponent, "ng-component", never, { "cell": { "alias": "cell"; "required": false; }; }, { "onConfirm": "onConfirm"; }, never, never, false, never>;
}
