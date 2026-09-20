import { OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import * as i0 from "@angular/core";
export interface AlertModalOptions {
    title?: string;
    message?: string;
    status?: string;
}
export declare class AlertModalComponent implements OnInit {
    private readonly dialogRef;
    data: AlertModalOptions;
    constructor(dialogRef: NbDialogRef<AlertModalComponent>);
    ngOnInit(): void;
    /**
     * Closes the dialog and returns the provided value.
     *
     * @param {any} val - The value to be returned when the dialog is closed.
     * @return {void} This function does not return a value.
     */
    closeDialog(val: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AlertModalComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AlertModalComponent, "ga-alert-modal", never, { "data": { "alias": "data"; "required": false; }; }, {}, never, never, false, never>;
}
