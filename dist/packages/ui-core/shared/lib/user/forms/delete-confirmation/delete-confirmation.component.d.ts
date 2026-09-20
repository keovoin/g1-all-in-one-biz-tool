import { NbDialogRef } from '@nebular/theme';
import * as i0 from "@angular/core";
export declare class DeleteConfirmationComponent {
    protected readonly dialogRef: NbDialogRef<DeleteConfirmationComponent>;
    recordType: string;
    isRecord: boolean;
    constructor(dialogRef: NbDialogRef<DeleteConfirmationComponent>);
    close(): void;
    delete(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DeleteConfirmationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DeleteConfirmationComponent, "ga-delete-confirmation", never, {}, {}, never, never, false, never>;
}
