import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { catchError, of } from 'rxjs';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocumentsService } from '../services/documents.service';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@nebular/theme";
import * as i3 from "../services/documents.service";
import * as i4 from "@angular/common";
/**
 * Bulk "Set categories" dialog (`R-BLK-01` / `01-ux-spec.md` §12).
 *
 * 🛑 The bulk action is `SET_CATEGORIES` — a **replace**, not a merge: every
 * selected document ends up with exactly the categories chosen here and loses
 * the rest. Tags have separate add/remove actions precisely because they are
 * additive; categories do not, so the dialog leads with the warning rather than
 * burying it in a hint. Confirming with nothing selected clears the category set
 * of every selected document, which is a legitimate (and equally destructive)
 * use of the same action.
 *
 * Closes with `ID[]` on confirm, `null` on cancel.
 */
export class BulkCategoriesDialogComponent extends TranslationBaseComponent {
    constructor(translateService, dialogRef, documentsService) {
        super(translateService);
        this.translateService = translateService;
        this.dialogRef = dialogRef;
        this.documentsService = documentsService;
        this.categories = [];
        this.categoryIds = [];
    }
    ngOnInit() {
        // Cosmetic fetch: an empty catalog still lets the user clear categories.
        this.documentsService
            .getCategories()
            .pipe(catchError(() => of([])))
            .subscribe((categories) => (this.categories = categories ?? []));
    }
    confirm() {
        this.dialogRef.close(this.categoryIds ?? []);
    }
    cancel() {
        this.dialogRef.close(null);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BulkCategoriesDialogComponent, deps: [{ token: i1.TranslateService }, { token: i2.NbDialogRef }, { token: i3.DocumentsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: BulkCategoriesDialogComponent, isStandalone: false, selector: "gz-docs-bulk-categories-dialog", usesInheritance: true, ngImport: i0, template: `
		<nb-card class="docs-dialog">
			<nb-card-header>{{ 'DOCS.BULK.CATEGORIES' | translate }}</nb-card-header>
			<nb-card-body>
				<div class="docs-dialog-warning">
					<nb-icon icon="alert-triangle-outline"></nb-icon>
					<span>{{ 'DOCS.DIALOGS.SET_CATEGORIES_WARNING' | translate }}</span>
				</div>
				<div class="docs-dialog-field">
					<label class="label">{{ 'DOCS.DETAIL.CATEGORIES' | translate }}</label>
					<nb-select multiple fullWidth size="small" [(selected)]="categoryIds">
						<nb-option *ngFor="let category of categories" [value]="category.id">{{ category.name }}</nb-option>
					</nb-select>
					<div class="hint">{{ 'DOCS.BULK.SET_CATEGORIES_HINT' | translate }}</div>
				</div>
			</nb-card-body>
			<nb-card-footer class="docs-dialog-footer">
				<button nbButton ghost (click)="cancel()">{{ 'DOCS.UPLOAD.CANCEL' | translate }}</button>
				<button nbButton status="primary" (click)="confirm()">{{ 'DOCS.BULK.CATEGORIES' | translate }}</button>
			</nb-card-footer>
		</nb-card>
	`, isInline: true, styles: [".docs-dialog{min-width:22rem;max-width:30rem}.docs-dialog-warning{display:flex;align-items:flex-start;gap:.5rem;margin-bottom:1rem;color:var(--color-warning-default)}.docs-dialog-field .label{display:block;margin-bottom:.25rem}.docs-dialog-field .hint{font-size:.75rem;color:var(--text-hint-color);margin-top:.25rem}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"], dependencies: [{ kind: "directive", type: i4.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i2.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i2.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BulkCategoriesDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-bulk-categories-dialog', template: `
		<nb-card class="docs-dialog">
			<nb-card-header>{{ 'DOCS.BULK.CATEGORIES' | translate }}</nb-card-header>
			<nb-card-body>
				<div class="docs-dialog-warning">
					<nb-icon icon="alert-triangle-outline"></nb-icon>
					<span>{{ 'DOCS.DIALOGS.SET_CATEGORIES_WARNING' | translate }}</span>
				</div>
				<div class="docs-dialog-field">
					<label class="label">{{ 'DOCS.DETAIL.CATEGORIES' | translate }}</label>
					<nb-select multiple fullWidth size="small" [(selected)]="categoryIds">
						<nb-option *ngFor="let category of categories" [value]="category.id">{{ category.name }}</nb-option>
					</nb-select>
					<div class="hint">{{ 'DOCS.BULK.SET_CATEGORIES_HINT' | translate }}</div>
				</div>
			</nb-card-body>
			<nb-card-footer class="docs-dialog-footer">
				<button nbButton ghost (click)="cancel()">{{ 'DOCS.UPLOAD.CANCEL' | translate }}</button>
				<button nbButton status="primary" (click)="confirm()">{{ 'DOCS.BULK.CATEGORIES' | translate }}</button>
			</nb-card-footer>
		</nb-card>
	`, standalone: false, styles: [".docs-dialog{min-width:22rem;max-width:30rem}.docs-dialog-warning{display:flex;align-items:flex-start;gap:.5rem;margin-bottom:1rem;color:var(--color-warning-default)}.docs-dialog-field .label{display:block;margin-bottom:.25rem}.docs-dialog-field .hint{font-size:.75rem;color:var(--text-hint-color);margin-top:.25rem}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.NbDialogRef }, { type: i3.DocumentsService }] });
//# sourceMappingURL=bulk-categories-dialog.component.js.map