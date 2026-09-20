import { NbDialogRef } from '@nebular/theme';
import { RecurringExpenseDeletionEnum } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class RecurringExpenseDeleteConfirmationComponent {
    protected dialogRef: NbDialogRef<RecurringExpenseDeleteConfirmationComponent>;
    recordType: string;
    start: string;
    current: string;
    end: string;
    selectedOption: RecurringExpenseDeletionEnum;
    constructor(dialogRef: NbDialogRef<RecurringExpenseDeleteConfirmationComponent>);
    close(): void;
    delete(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RecurringExpenseDeleteConfirmationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RecurringExpenseDeleteConfirmationComponent, "ga-delete-confirmation", never, {}, {}, never, never, false, never>;
}
