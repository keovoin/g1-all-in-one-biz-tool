import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocumentsService } from '../services/documents.service';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@nebular/theme";
import * as i3 from "../services/documents.service";
import * as i4 from "@gauzy/ui-core/core";
import * as i5 from "@angular/forms";
/**
 * FILE extraction correction: plain textarea over `extractedText`. Saving sets
 * `extractedTextEdited` server-side and re-chunks/re-indexes. Offered only for
 * settled (READY/FAILED) FILE documents.
 */
export class ExtractedTextDialogComponent extends TranslationBaseComponent {
    constructor(translateService, dialogRef, documentsService, toastrService) {
        super(translateService);
        this.translateService = translateService;
        this.dialogRef = dialogRef;
        this.documentsService = documentsService;
        this.toastrService = toastrService;
        this.text = '';
        this.loading = true;
        this.saving = false;
    }
    async ngOnInit() {
        try {
            const result = await firstValueFrom(this.documentsService.getExtractedText(this.documentId));
            this.text = result?.extractedText ?? '';
        }
        catch (error) {
            this.toastrService.danger(error);
        }
        finally {
            this.loading = false;
        }
    }
    async save() {
        if (this.saving)
            return;
        this.saving = true;
        try {
            const document = await firstValueFrom(this.documentsService.updateExtractedText(this.documentId, this.text));
            this.toastrService.success(this.getTranslation('DOCS.TOASTS.UPDATED'));
            this.dialogRef.close(document);
        }
        catch (error) {
            this.toastrService.danger(error);
            this.saving = false;
        }
    }
    cancel() {
        this.dialogRef.close(null);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ExtractedTextDialogComponent, deps: [{ token: i1.TranslateService }, { token: i2.NbDialogRef }, { token: i3.DocumentsService }, { token: i4.ToastrService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ExtractedTextDialogComponent, isStandalone: false, selector: "gz-docs-extracted-text-dialog", inputs: { documentId: "documentId" }, usesInheritance: true, ngImport: i0, template: `
		<nb-card class="docs-dialog docs-extracted-dialog">
			<nb-card-header>{{ 'DOCS.DETAIL.EXTRACTED_DIALOG_TITLE' | translate }}</nb-card-header>
			<nb-card-body [nbSpinner]="loading" nbSpinnerStatus="primary">
				<div class="hint">{{ 'DOCS.DETAIL.EXTRACTED_DIALOG_HINT' | translate }}</div>
				<textarea nbInput fullWidth rows="18" [(ngModel)]="text" [disabled]="loading"></textarea>
			</nb-card-body>
			<nb-card-footer class="docs-dialog-footer">
				<button nbButton ghost (click)="cancel()">{{ 'DOCS.UPLOAD.CANCEL' | translate }}</button>
				<button nbButton status="primary" [disabled]="loading || saving" (click)="save()">
					{{ 'DOCS.DETAIL.EXTRACTED_SAVE' | translate }}
				</button>
			</nb-card-footer>
		</nb-card>
	`, isInline: true, styles: [".docs-extracted-dialog{min-width:40rem;max-width:60rem}.hint{font-size:.75rem;color:var(--text-hint-color);margin-bottom:.5rem}textarea{font-family:var(--font-family-monospace, monospace);font-size:.8125rem}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"], dependencies: [{ kind: "directive", type: i5.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i5.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i5.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "directive", type: i2.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "directive", type: i2.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ExtractedTextDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-extracted-text-dialog', template: `
		<nb-card class="docs-dialog docs-extracted-dialog">
			<nb-card-header>{{ 'DOCS.DETAIL.EXTRACTED_DIALOG_TITLE' | translate }}</nb-card-header>
			<nb-card-body [nbSpinner]="loading" nbSpinnerStatus="primary">
				<div class="hint">{{ 'DOCS.DETAIL.EXTRACTED_DIALOG_HINT' | translate }}</div>
				<textarea nbInput fullWidth rows="18" [(ngModel)]="text" [disabled]="loading"></textarea>
			</nb-card-body>
			<nb-card-footer class="docs-dialog-footer">
				<button nbButton ghost (click)="cancel()">{{ 'DOCS.UPLOAD.CANCEL' | translate }}</button>
				<button nbButton status="primary" [disabled]="loading || saving" (click)="save()">
					{{ 'DOCS.DETAIL.EXTRACTED_SAVE' | translate }}
				</button>
			</nb-card-footer>
		</nb-card>
	`, standalone: false, styles: [".docs-extracted-dialog{min-width:40rem;max-width:60rem}.hint{font-size:.75rem;color:var(--text-hint-color);margin-bottom:.5rem}textarea{font-family:var(--font-family-monospace, monospace);font-size:.8125rem}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.NbDialogRef }, { type: i3.DocumentsService }, { type: i4.ToastrService }], propDecorators: { documentId: [{
                type: Input
            }] } });
//# sourceMappingURL=extracted-text-dialog.component.js.map