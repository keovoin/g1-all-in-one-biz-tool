import { NbDialogRef } from '@nebular/theme';
import * as i0 from "@angular/core";
export declare class CandidateActionConfirmationComponent {
    protected dialogRef: NbDialogRef<CandidateActionConfirmationComponent>;
    recordType: string;
    isReject: boolean;
    constructor(dialogRef: NbDialogRef<CandidateActionConfirmationComponent>);
    close(): void;
    action(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidateActionConfirmationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CandidateActionConfirmationComponent, "ga-candidate-action-confirmation", never, {}, {}, never, never, false, never>;
}
