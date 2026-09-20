import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
export class CandidateActionConfirmationComponent {
    constructor(dialogRef) {
        this.dialogRef = dialogRef;
    }
    close() {
        this.dialogRef.close();
    }
    action() {
        this.dialogRef.close('ok');
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateActionConfirmationComponent, deps: [{ token: i1.NbDialogRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: CandidateActionConfirmationComponent, isStandalone: false, selector: "ga-candidate-action-confirmation", ngImport: i0, template: `
		<nb-card class="center">
		  <nb-card-header>
		    <h6>{{ 'FORM.CONFIRM' | translate }}</h6>
		  </nb-card-header>
		  <nb-card-body>
		    <span>
		      {{ 'FORM.CANDIDATE_ACTION_CONFIRMATION.SURE' | translate }}
		      @if (isReject) {
		        <span>{{ 'FORM.CANDIDATE_ACTION_CONFIRMATION.REJECT' | translate }}</span>
		      }
		      @if (!isReject) {
		        <span>{{ 'FORM.CANDIDATE_ACTION_CONFIRMATION.HIRE' | translate }}</span>
		      }
		      {{ 'FORM.CANDIDATE_ACTION_CONFIRMATION.CANDIDATE' | translate }}
		      {{ recordType }}
		    </span>
		  </nb-card-body>
		  <nb-card-footer>
		    <button (click)="action()" class="mr-3" status="danger" nbButton>
		      {{ 'BUTTONS.OK' | translate }}
		    </button>
		    <button (click)="close()" status="info" nbButton>
		      {{ 'BUTTONS.CANCEL' | translate }}
		    </button>
		  </nb-card-footer>
		</nb-card>
		`, isInline: true, styles: ["nb-card-body{text-align:center}.center{align-items:center;width:300px}\n"], dependencies: [{ kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateActionConfirmationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-candidate-action-confirmation', template: `
		<nb-card class="center">
		  <nb-card-header>
		    <h6>{{ 'FORM.CONFIRM' | translate }}</h6>
		  </nb-card-header>
		  <nb-card-body>
		    <span>
		      {{ 'FORM.CANDIDATE_ACTION_CONFIRMATION.SURE' | translate }}
		      @if (isReject) {
		        <span>{{ 'FORM.CANDIDATE_ACTION_CONFIRMATION.REJECT' | translate }}</span>
		      }
		      @if (!isReject) {
		        <span>{{ 'FORM.CANDIDATE_ACTION_CONFIRMATION.HIRE' | translate }}</span>
		      }
		      {{ 'FORM.CANDIDATE_ACTION_CONFIRMATION.CANDIDATE' | translate }}
		      {{ recordType }}
		    </span>
		  </nb-card-body>
		  <nb-card-footer>
		    <button (click)="action()" class="mr-3" status="danger" nbButton>
		      {{ 'BUTTONS.OK' | translate }}
		    </button>
		    <button (click)="close()" status="info" nbButton>
		      {{ 'BUTTONS.CANCEL' | translate }}
		    </button>
		  </nb-card-footer>
		</nb-card>
		`, standalone: false, styles: ["nb-card-body{text-align:center}.center{align-items:center;width:300px}\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }] });
//# sourceMappingURL=candidate-action-confirmation.component.js.map