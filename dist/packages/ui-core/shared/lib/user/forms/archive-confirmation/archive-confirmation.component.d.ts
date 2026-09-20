import { NbDialogRef } from '@nebular/theme';
import * as i0 from "@angular/core";
export declare class ArchiveConfirmationComponent {
    protected readonly dialogRef: NbDialogRef<ArchiveConfirmationComponent>;
    recordType: string;
    constructor(dialogRef: NbDialogRef<ArchiveConfirmationComponent>);
    close(): void;
    archive(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ArchiveConfirmationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ArchiveConfirmationComponent, "ga-archive-confirmation", never, {}, {}, never, never, false, never>;
}
