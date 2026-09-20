import { OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { AlertComponent } from '../alert/alert.component';
import * as i0 from "@angular/core";
export interface ConfirmDialogOptions {
    title?: string;
    message?: string;
    yesText?: string;
    noText?: string;
}
export declare class ConfirmComponent implements OnInit {
    private readonly dialogRef;
    data: ConfirmDialogOptions;
    constructor(dialogRef: NbDialogRef<AlertComponent>);
    ngOnInit(): void;
    close(confirm?: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ConfirmComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ConfirmComponent, "ngx-confirm", never, { "data": { "alias": "data"; "required": false; }; }, {}, never, never, false, never>;
}
