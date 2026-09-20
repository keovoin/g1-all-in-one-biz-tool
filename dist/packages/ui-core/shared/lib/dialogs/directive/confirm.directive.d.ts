import { EventEmitter, OnDestroy } from '@angular/core';
import { ConfirmDialogOptions } from '../confirm/confirm.component';
import * as i0 from "@angular/core";
export declare class ConfirmDirective implements OnDestroy {
    data: ConfirmDialogOptions;
    set message(value: string);
    set title(value: string);
    set yesText(value: string);
    set noText(value: string);
    confirm: EventEmitter<any>;
    decline: EventEmitter<any>;
    private readonly dialogService;
    /**
     * Handles the click event and opens a confirmation dialog.
     *
     * @param {Event} $event - The click event object.
     * @return {void} This function does not return anything.
     */
    onClick($event: any): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ConfirmDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ConfirmDirective, "[ngxConfirmDialog]", never, { "message": { "alias": "message"; "required": false; }; "title": { "alias": "title"; "required": false; }; "yesText": { "alias": "yesText"; "required": false; }; "noText": { "alias": "noText"; "required": false; }; }, { "confirm": "confirm"; "decline": "decline"; }, never, never, true, never>;
}
