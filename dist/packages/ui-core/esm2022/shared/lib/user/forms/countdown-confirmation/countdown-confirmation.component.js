import { Component, inject } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "ngx-countdown";
import * as i3 from "@ngx-translate/core";
export class CountdownConfirmationComponent {
    constructor() {
        this.dialogRef = inject((NbDialogRef));
        this.countDownConfig = { leftTime: 5 };
    }
    /**
     * Handles an action event triggered by the countdown.
     *
     * @param event - The CountdownEvent object containing details about the action.
     *                 Example: { action: 'done', left: 0 }
     * - If the action is 'done', this method closes the dialog and emits a 'continue' signal.
     */
    handleActionEvent(event) {
        if (event.action === 'done') {
            this.dialogRef.close('continue');
        }
    }
    /**
     * Closes the current dialog.
     *
     * This method is typically used to dismiss the dialog without performing
     * any additional actions or sending a signal.
     */
    close() {
        this.dialogRef.close();
    }
    /**
     * Continues the current flow of execution.
     *
     * This method closes the dialog and sends a 'continue' signal to indicate
     * that the user has chosen to proceed with the next step.
     */
    continue() {
        this.dialogRef.close('continue');
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CountdownConfirmationComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: CountdownConfirmationComponent, isStandalone: false, selector: "ga-countdown-confirmation", ngImport: i0, template: `
		<nb-card class="center">
			<nb-card-header>
				<h6>{{ 'FORM.CONFIRM' | translate }}</h6>
			</nb-card-header>
			<nb-card-body>
				<span>
					<b>{{ recordType }}</b>
					{{ 'FORM.COUNTDOWN_CONFIRMATION.WAS' | translate }}
					{{
						((isEnabled ? 'FORM.COUNTDOWN_CONFIRMATION.ENABLED' : 'FORM.COUNTDOWN_CONFIRMATION.DISABLED')
							| translate) + '?'
					}}
				</span>
				<div class="mt-2">
					{{ 'FORM.COUNTDOWN_CONFIRMATION.WAIT_UNTIL_RELOAD' | translate }}
					<countdown #cd [config]="countDownConfig" (event)="handleActionEvent($event)"></countdown>
				</div>
			</nb-card-body>
			<nb-card-footer>
				<button (click)="continue()" class="mr-3" status="danger" nbButton>
					{{ 'BUTTONS.CONTINUE' | translate }}
				</button>
				<button (click)="close()" status="info" nbButton>
					{{ 'BUTTONS.CANCEL' | translate }}
				</button>
			</nb-card-footer>
		</nb-card>
	`, isInline: true, styles: ["nb-card-body{text-align:center}.center{align-items:center;width:350px}\n"], dependencies: [{ kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i2.CountdownComponent, selector: "countdown", inputs: ["config", "render"], outputs: ["event"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CountdownConfirmationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-countdown-confirmation', template: `
		<nb-card class="center">
			<nb-card-header>
				<h6>{{ 'FORM.CONFIRM' | translate }}</h6>
			</nb-card-header>
			<nb-card-body>
				<span>
					<b>{{ recordType }}</b>
					{{ 'FORM.COUNTDOWN_CONFIRMATION.WAS' | translate }}
					{{
						((isEnabled ? 'FORM.COUNTDOWN_CONFIRMATION.ENABLED' : 'FORM.COUNTDOWN_CONFIRMATION.DISABLED')
							| translate) + '?'
					}}
				</span>
				<div class="mt-2">
					{{ 'FORM.COUNTDOWN_CONFIRMATION.WAIT_UNTIL_RELOAD' | translate }}
					<countdown #cd [config]="countDownConfig" (event)="handleActionEvent($event)"></countdown>
				</div>
			</nb-card-body>
			<nb-card-footer>
				<button (click)="continue()" class="mr-3" status="danger" nbButton>
					{{ 'BUTTONS.CONTINUE' | translate }}
				</button>
				<button (click)="close()" status="info" nbButton>
					{{ 'BUTTONS.CANCEL' | translate }}
				</button>
			</nb-card-footer>
		</nb-card>
	`, standalone: false, styles: ["nb-card-body{text-align:center}.center{align-items:center;width:350px}\n"] }]
        }] });
//# sourceMappingURL=countdown-confirmation.component.js.map