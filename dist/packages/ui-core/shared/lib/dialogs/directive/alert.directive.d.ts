import { EventEmitter, OnDestroy } from '@angular/core';
import { AlertDialogOptions } from '../alert/alert.component';
import * as i0 from "@angular/core";
export declare class AlertDirective implements OnDestroy {
    data: AlertDialogOptions;
    set message(value: string);
    set title(value: string);
    set closeText(value: string);
    close: EventEmitter<any>;
    private readonly dialogService;
    /**
     * Handles the click event and opens an alert dialog.
     *
     * @param {Event} $event - The click event object.
     * @return {void} This function does not return anything.
     */
    onClick($event: any): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AlertDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<AlertDirective, "[ngxAlertDialog]", never, { "message": { "alias": "message"; "required": false; }; "title": { "alias": "title"; "required": false; }; "closeText": { "alias": "closeText"; "required": false; }; }, { "close": "close"; }, never, never, true, never>;
}
