import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@nebular/theme";
import * as i3 from "@angular/forms";
/**
 * Review rejection dialog with an explicitly OPTIONAL reason (`01-ux-spec.md`
 * §11 — rejection never requires a reason; the same `reason` field is sent for
 * single and bulk rejection). Closes with `{ reason?: string }` on confirm,
 * `null` on cancel.
 */
export class RejectDialogComponent extends TranslationBaseComponent {
    constructor(translateService, dialogRef) {
        super(translateService);
        this.translateService = translateService;
        this.dialogRef = dialogRef;
        this.reason = '';
    }
    confirm() {
        const reason = this.reason.trim();
        this.dialogRef.close({ reason: reason || undefined });
    }
    cancel() {
        this.dialogRef.close(null);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RejectDialogComponent, deps: [{ token: i1.TranslateService }, { token: i2.NbDialogRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: RejectDialogComponent, isStandalone: false, selector: "gz-docs-reject-dialog", usesInheritance: true, ngImport: i0, template: `
		<nb-card class="docs-dialog docs-reject-dialog">
			<nb-card-header>{{ 'DOCS.REVIEW.REJECT' | translate }}</nb-card-header>
			<nb-card-body>
				<label class="label" for="docs-reject-reason">{{ 'DOCS.REVIEW.REJECT_NOTE_LABEL' | translate }}</label>
				<textarea
					id="docs-reject-reason"
					nbInput
					fullWidth
					rows="3"
					maxlength="1000"
					[(ngModel)]="reason"
				></textarea>
			</nb-card-body>
			<nb-card-footer class="docs-dialog-footer">
				<button nbButton ghost (click)="cancel()">{{ 'DOCS.UPLOAD.CANCEL' | translate }}</button>
				<button nbButton status="danger" (click)="confirm()">{{ 'DOCS.REVIEW.REJECT' | translate }}</button>
			</nb-card-footer>
		</nb-card>
	`, isInline: true, styles: [".docs-reject-dialog{min-width:22rem;max-width:30rem}.label{display:block;margin-bottom:.25rem}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"], dependencies: [{ kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.MaxLengthValidator, selector: "[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]", inputs: ["maxlength"] }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "directive", type: i2.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RejectDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-reject-dialog', template: `
		<nb-card class="docs-dialog docs-reject-dialog">
			<nb-card-header>{{ 'DOCS.REVIEW.REJECT' | translate }}</nb-card-header>
			<nb-card-body>
				<label class="label" for="docs-reject-reason">{{ 'DOCS.REVIEW.REJECT_NOTE_LABEL' | translate }}</label>
				<textarea
					id="docs-reject-reason"
					nbInput
					fullWidth
					rows="3"
					maxlength="1000"
					[(ngModel)]="reason"
				></textarea>
			</nb-card-body>
			<nb-card-footer class="docs-dialog-footer">
				<button nbButton ghost (click)="cancel()">{{ 'DOCS.UPLOAD.CANCEL' | translate }}</button>
				<button nbButton status="danger" (click)="confirm()">{{ 'DOCS.REVIEW.REJECT' | translate }}</button>
			</nb-card-footer>
		</nb-card>
	`, standalone: false, styles: [".docs-reject-dialog{min-width:22rem;max-width:30rem}.label{display:block;margin-bottom:.25rem}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.NbDialogRef }] });
//# sourceMappingURL=reject-dialog.component.js.map