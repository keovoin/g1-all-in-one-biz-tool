import { OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import * as i0 from "@angular/core";
export interface AlertDialogOptions {
    title?: string;
    message?: string;
    closeText?: string;
}
export declare class AlertComponent implements OnInit {
    private readonly dialogRef;
    data: AlertDialogOptions;
    constructor(dialogRef: NbDialogRef<AlertComponent>);
    ngOnInit(): void;
    /**
     * Closes the dialog.
     *
     * @return {void} No return value.
     */
    closeDialog(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AlertComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AlertComponent, "ngx-alert", never, { "data": { "alias": "data"; "required": false; }; }, {}, never, never, false, never>;
}
