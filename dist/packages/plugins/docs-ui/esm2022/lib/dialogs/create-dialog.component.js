import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { DocumentKindEnum } from '@gauzy/contracts';
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
 * Minimal create/rename dialog for FOLDER and PAGE nodes (tree context menu,
 * `?newPage=1` deep link). Closes with the created/updated document or null.
 */
export class CreateDialogComponent extends TranslationBaseComponent {
    constructor(translateService, dialogRef, documentsService, toastrService) {
        super(translateService);
        this.translateService = translateService;
        this.dialogRef = dialogRef;
        this.documentsService = documentsService;
        this.toastrService = toastrService;
        this.kind = DocumentKindEnum.FOLDER;
        this.parentId = null;
        /** When set, the dialog renames the existing document instead of creating. */
        this.renameId = null;
        this.initialName = '';
        this.name = '';
        this.saving = false;
        this.kindEnum = DocumentKindEnum;
    }
    ngOnInit() {
        this.name = this.initialName ?? '';
    }
    async confirm() {
        const name = this.name?.trim();
        if (!name || this.saving)
            return;
        this.saving = true;
        try {
            let document;
            if (this.renameId) {
                document = await firstValueFrom(this.documentsService.update(this.renameId, { name }));
                this.toastrService.success(this.getTranslation('DOCS.TOASTS.RENAMED'));
            }
            else {
                document = await firstValueFrom(this.documentsService.create({ kind: this.kind, name, parentId: this.parentId ?? undefined }));
                this.toastrService.success(this.getTranslation('DOCS.TOASTS.CREATED'));
            }
            this.dialogRef.close(document);
        }
        catch (error) {
            // The raw HttpErrorResponse renders as "Http failure response … 400 OK" —
            // log it for diagnosis, show the user a human sentence.
            console.error('Document create/rename failed', error);
            this.toastrService.danger(this.getTranslation(this.renameId ? 'DOCS.ERRORS.RENAME_FAILED' : 'DOCS.ERRORS.CREATE_FAILED'));
            this.saving = false;
        }
    }
    cancel() {
        this.dialogRef.close(null);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CreateDialogComponent, deps: [{ token: i1.TranslateService }, { token: i2.NbDialogRef }, { token: i3.DocumentsService }, { token: i4.ToastrService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: CreateDialogComponent, isStandalone: false, selector: "gz-docs-create-dialog", inputs: { kind: "kind", parentId: "parentId", renameId: "renameId", initialName: "initialName" }, usesInheritance: true, ngImport: i0, template: `
		<nb-card class="docs-dialog">
			<nb-card-header>
				{{ (renameId ? 'DOCS.TREE.RENAME' : kind === kindEnum.FOLDER ? 'DOCS.TREE.NEW_FOLDER' : 'DOCS.TREE.NEW_PAGE') | translate }}
			</nb-card-header>
			<nb-card-body>
				<label class="label" for="docs-create-name">{{ 'DOCS.DIALOGS.CREATE_NAME_LABEL' | translate }}</label>
				<input
					id="docs-create-name"
					nbInput
					fullWidth
					type="text"
					[(ngModel)]="name"
					(keyup.enter)="confirm()"
					autofocus
				/>
			</nb-card-body>
			<nb-card-footer class="docs-dialog-footer">
				<button nbButton ghost (click)="cancel()">{{ 'DOCS.UPLOAD.CANCEL' | translate }}</button>
				<button nbButton status="primary" [disabled]="!name?.trim() || saving" (click)="confirm()">
					{{ 'DOCS.DIALOGS.CREATE_CONFIRM' | translate }}
				</button>
			</nb-card-footer>
		</nb-card>
	`, isInline: true, styles: [".docs-dialog{min-width:22rem}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}.label{display:block;margin-bottom:.25rem}\n"], dependencies: [{ kind: "directive", type: i5.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i5.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i5.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "directive", type: i2.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CreateDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-create-dialog', template: `
		<nb-card class="docs-dialog">
			<nb-card-header>
				{{ (renameId ? 'DOCS.TREE.RENAME' : kind === kindEnum.FOLDER ? 'DOCS.TREE.NEW_FOLDER' : 'DOCS.TREE.NEW_PAGE') | translate }}
			</nb-card-header>
			<nb-card-body>
				<label class="label" for="docs-create-name">{{ 'DOCS.DIALOGS.CREATE_NAME_LABEL' | translate }}</label>
				<input
					id="docs-create-name"
					nbInput
					fullWidth
					type="text"
					[(ngModel)]="name"
					(keyup.enter)="confirm()"
					autofocus
				/>
			</nb-card-body>
			<nb-card-footer class="docs-dialog-footer">
				<button nbButton ghost (click)="cancel()">{{ 'DOCS.UPLOAD.CANCEL' | translate }}</button>
				<button nbButton status="primary" [disabled]="!name?.trim() || saving" (click)="confirm()">
					{{ 'DOCS.DIALOGS.CREATE_CONFIRM' | translate }}
				</button>
			</nb-card-footer>
		</nb-card>
	`, standalone: false, styles: [".docs-dialog{min-width:22rem}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}.label{display:block;margin-bottom:.25rem}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.NbDialogRef }, { type: i3.DocumentsService }, { type: i4.ToastrService }], propDecorators: { kind: [{
                type: Input
            }], parentId: [{
                type: Input
            }], renameId: [{
                type: Input
            }], initialName: [{
                type: Input
            }] } });
//# sourceMappingURL=create-dialog.component.js.map