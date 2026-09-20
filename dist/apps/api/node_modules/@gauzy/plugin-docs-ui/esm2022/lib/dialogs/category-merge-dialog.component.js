import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbDialogRef, NbSelectModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@angular/common";
import * as i3 from "@ngx-translate/core";
/**
 * Merge a category into another (`POST /categories/:id/merge`): every document
 * assignment is re-pointed to the target and the source is soft-deleted. The
 * source itself is excluded from the target list — the backend rejects a
 * self-merge with a 400 and there is no reason to offer it.
 */
export class CategoryMergeDialogComponent {
    constructor(dialogRef) {
        this.dialogRef = dialogRef;
        /** Category being merged away. */
        this.source = null;
        /** Candidate targets (the caller filters the source out). */
        this.targets = [];
        this.targetId = null;
    }
    confirm() {
        if (!this.targetId)
            return;
        this.dialogRef.close(this.targetId);
    }
    cancel() {
        this.dialogRef.close(null);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CategoryMergeDialogComponent, deps: [{ token: i1.NbDialogRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: CategoryMergeDialogComponent, isStandalone: true, selector: "gz-docs-category-merge-dialog", inputs: { source: "source", targets: "targets" }, ngImport: i0, template: `
		<nb-card class="docs-dialog docs-category-merge-dialog">
			<nb-card-header>{{ 'DOCS.SETTINGS.MERGE_TITLE' | translate }}</nb-card-header>
			<nb-card-body>
				<p class="hint">{{ 'DOCS.SETTINGS.MERGE_HINT' | translate : { name: source?.name } }}</p>
				<label class="label">{{ 'DOCS.SETTINGS.MERGE_TARGET' | translate }}</label>
				<nb-select fullWidth [(selected)]="targetId">
					<nb-option *ngFor="let category of targets" [value]="category.id">
						{{ category.name }}
					</nb-option>
				</nb-select>
			</nb-card-body>
			<nb-card-footer class="docs-dialog-footer">
				<button nbButton ghost (click)="cancel()">{{ 'DOCS.UPLOAD.CANCEL' | translate }}</button>
				<button nbButton status="primary" [disabled]="!targetId" (click)="confirm()">
					{{ 'DOCS.SETTINGS.MERGE_CONFIRM' | translate }}
				</button>
			</nb-card-footer>
		</nb-card>
	`, isInline: true, styles: [".docs-category-merge-dialog{width:26rem;max-width:90vw}.label{display:block;margin:.75rem 0 .25rem}.hint{color:var(--text-hint-color)}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "ngmodule", type: FormsModule }, { kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: NbButtonModule }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "ngmodule", type: NbCardModule }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "ngmodule", type: NbSelectModule }, { kind: "component", type: i1.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i1.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CategoryMergeDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-category-merge-dialog', imports: [CommonModule, FormsModule, TranslateModule, NbButtonModule, NbCardModule, NbSelectModule], template: `
		<nb-card class="docs-dialog docs-category-merge-dialog">
			<nb-card-header>{{ 'DOCS.SETTINGS.MERGE_TITLE' | translate }}</nb-card-header>
			<nb-card-body>
				<p class="hint">{{ 'DOCS.SETTINGS.MERGE_HINT' | translate : { name: source?.name } }}</p>
				<label class="label">{{ 'DOCS.SETTINGS.MERGE_TARGET' | translate }}</label>
				<nb-select fullWidth [(selected)]="targetId">
					<nb-option *ngFor="let category of targets" [value]="category.id">
						{{ category.name }}
					</nb-option>
				</nb-select>
			</nb-card-body>
			<nb-card-footer class="docs-dialog-footer">
				<button nbButton ghost (click)="cancel()">{{ 'DOCS.UPLOAD.CANCEL' | translate }}</button>
				<button nbButton status="primary" [disabled]="!targetId" (click)="confirm()">
					{{ 'DOCS.SETTINGS.MERGE_CONFIRM' | translate }}
				</button>
			</nb-card-footer>
		</nb-card>
	`, styles: [".docs-category-merge-dialog{width:26rem;max-width:90vw}.label{display:block;margin:.75rem 0 .25rem}.hint{color:var(--text-hint-color)}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }], propDecorators: { source: [{
                type: Input
            }], targets: [{
                type: Input
            }] } });
//# sourceMappingURL=category-merge-dialog.component.js.map