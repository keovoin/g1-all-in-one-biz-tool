import { NbDialogRef } from '@nebular/theme';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown';
import * as i0 from "@angular/core";
export declare class CountdownConfirmationComponent {
    protected readonly dialogRef: NbDialogRef<any>;
    recordType: string;
    isEnabled: boolean;
    countDownConfig: CountdownConfig;
    /**
     * Handles an action event triggered by the countdown.
     *
     * @param event - The CountdownEvent object containing details about the action.
     *                 Example: { action: 'done', left: 0 }
     * - If the action is 'done', this method closes the dialog and emits a 'continue' signal.
     */
    handleActionEvent(event: CountdownEvent): void;
    /**
     * Closes the current dialog.
     *
     * This method is typically used to dismiss the dialog without performing
     * any additional actions or sending a signal.
     */
    close(): void;
    /**
     * Continues the current flow of execution.
     *
     * This method closes the dialog and sends a 'continue' signal to indicate
     * that the user has chosen to proceed with the next step.
     */
    continue(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CountdownConfirmationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CountdownConfirmationComponent, "ga-countdown-confirmation", never, {}, {}, never, never, false, never>;
}
