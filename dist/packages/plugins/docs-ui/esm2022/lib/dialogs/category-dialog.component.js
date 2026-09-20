import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbDialogRef, NbInputModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@angular/forms";
import * as i3 from "@ngx-translate/core";
/**
 * Create / rename a document category (`03-backend-plugin.md` §4.11). Standalone
 * so the settings page — which is lazily loaded outside `DocsUiModule` — can use
 * it without pulling the whole browse chunk.
 *
 * `slug` is deliberately never edited here: the backend derives it on create and
 * treats it as immutable for `isSystem` rows.
 */
export class CategoryDialogComponent {
    constructor(dialogRef) {
        this.dialogRef = dialogRef;
        /** Existing row to edit; omit to create. */
        this.category = null;
        this.name = '';
        this.color = '#3366ff';
        this.description = '';
    }
    ngOnInit() {
        if (this.category) {
            this.name = this.category.name ?? '';
            this.color = this.category.color || '#3366ff';
            this.description = this.category.description ?? '';
        }
    }
    confirm() {
        const name = this.name?.trim();
        if (!name)
            return;
        const result = {
            name,
            color: this.color || undefined,
            description: this.description?.trim() || undefined
        };
        this.dialogRef.close(result);
    }
    cancel() {
        this.dialogRef.close(null);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CategoryDialogComponent, deps: [{ token: i1.NbDialogRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: CategoryDialogComponent, isStandalone: true, selector: "gz-docs-category-dialog", inputs: { category: "category" }, ngImport: i0, template: `
		<nb-card class="docs-dialog docs-category-dialog">
			<nb-card-header>
				{{ (category ? 'DOCS.SETTINGS.CATEGORY_EDIT' : 'DOCS.SETTINGS.CATEGORY_NEW') | translate }}
			</nb-card-header>
			<nb-card-body>
				<label class="label" for="docs-category-name">{{ 'DOCS.SETTINGS.CATEGORY_NAME' | translate }}</label>
				<input
					id="docs-category-name"
					nbInput
					fullWidth
					type="text"
					maxlength="100"
					[(ngModel)]="name"
					(keydown.enter)="confirm()"
				/>

				<label class="label" for="docs-category-color">{{ 'DOCS.SETTINGS.CATEGORY_COLOR' | translate }}</label>
				<input id="docs-category-color" nbInput fullWidth type="color" [(ngModel)]="color" />

				<label class="label" for="docs-category-description">
					{{ 'DOCS.SETTINGS.CATEGORY_DESCRIPTION' | translate }}
				</label>
				<textarea
					id="docs-category-description"
					nbInput
					fullWidth
					rows="2"
					maxlength="255"
					[(ngModel)]="description"
				></textarea>
			</nb-card-body>
			<nb-card-footer class="docs-dialog-footer">
				<button nbButton ghost (click)="cancel()">{{ 'DOCS.UPLOAD.CANCEL' | translate }}</button>
				<button nbButton status="primary" [disabled]="!name?.trim()" (click)="confirm()">
					{{ 'DOCS.DIALOGS.CREATE_CONFIRM' | translate }}
				</button>
			</nb-card-footer>
		</nb-card>
	`, isInline: true, styles: [".docs-category-dialog{width:26rem;max-width:90vw}.label{display:block;margin:.75rem 0 .25rem}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.MaxLengthValidator, selector: "[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]", inputs: ["maxlength"] }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: NbButtonModule }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "ngmodule", type: NbCardModule }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "ngmodule", type: NbInputModule }, { kind: "directive", type: i1.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CategoryDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-category-dialog', imports: [CommonModule, FormsModule, TranslateModule, NbButtonModule, NbCardModule, NbInputModule], template: `
		<nb-card class="docs-dialog docs-category-dialog">
			<nb-card-header>
				{{ (category ? 'DOCS.SETTINGS.CATEGORY_EDIT' : 'DOCS.SETTINGS.CATEGORY_NEW') | translate }}
			</nb-card-header>
			<nb-card-body>
				<label class="label" for="docs-category-name">{{ 'DOCS.SETTINGS.CATEGORY_NAME' | translate }}</label>
				<input
					id="docs-category-name"
					nbInput
					fullWidth
					type="text"
					maxlength="100"
					[(ngModel)]="name"
					(keydown.enter)="confirm()"
				/>

				<label class="label" for="docs-category-color">{{ 'DOCS.SETTINGS.CATEGORY_COLOR' | translate }}</label>
				<input id="docs-category-color" nbInput fullWidth type="color" [(ngModel)]="color" />

				<label class="label" for="docs-category-description">
					{{ 'DOCS.SETTINGS.CATEGORY_DESCRIPTION' | translate }}
				</label>
				<textarea
					id="docs-category-description"
					nbInput
					fullWidth
					rows="2"
					maxlength="255"
					[(ngModel)]="description"
				></textarea>
			</nb-card-body>
			<nb-card-footer class="docs-dialog-footer">
				<button nbButton ghost (click)="cancel()">{{ 'DOCS.UPLOAD.CANCEL' | translate }}</button>
				<button nbButton status="primary" [disabled]="!name?.trim()" (click)="confirm()">
					{{ 'DOCS.DIALOGS.CREATE_CONFIRM' | translate }}
				</button>
			</nb-card-footer>
		</nb-card>
	`, styles: [".docs-category-dialog{width:26rem;max-width:90vw}.label{display:block;margin:.75rem 0 .25rem}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }], propDecorators: { category: [{
                type: Input
            }] } });
//# sourceMappingURL=category-dialog.component.js.map