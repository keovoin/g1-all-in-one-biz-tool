import { OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { IImageAsset } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class AttachReceiptComponent implements OnInit {
    private dialogRef;
    constructor(dialogRef: NbDialogRef<AttachReceiptComponent>);
    imageUrl: string;
    currentReceipt: string;
    hoverState: boolean;
    disable: boolean;
    ngOnInit(): void;
    /**
     * Upload attach receipt
     *
     * @param image
     */
    updateImageAsset(image: IImageAsset): void;
    saveReceipt(): void;
    cancelReceipt(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AttachReceiptComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AttachReceiptComponent, "ga-attach-receipt", never, {}, {}, never, never, false, never>;
}
