import { NbDialogRef } from '@nebular/theme';
import * as i0 from "@angular/core";
export declare class ActionConfirmationComponent {
    protected dialogRef: NbDialogRef<ActionConfirmationComponent>;
    recordType: string;
    constructor(dialogRef: NbDialogRef<ActionConfirmationComponent>);
    close(): void;
    confirm(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ActionConfirmationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ActionConfirmationComponent, "ga-action-confirmation", never, {}, {}, never, never, false, never>;
}
