import { NbDialogRef } from '@nebular/theme';
import * as i0 from "@angular/core";
export declare class ResendConfirmationComponent {
    protected dialogRef: NbDialogRef<ResendConfirmationComponent>;
    email: string;
    constructor(dialogRef: NbDialogRef<ResendConfirmationComponent>);
    close(): void;
    confirm(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ResendConfirmationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ResendConfirmationComponent, "ga-resend-confirmation", never, {}, {}, never, never, false, never>;
}
