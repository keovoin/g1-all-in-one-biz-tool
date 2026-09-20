import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { catchError, firstValueFrom, of } from 'rxjs';
import { DocumentKindEnum } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocumentsService } from '../services/documents.service';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@nebular/theme";
import * as i3 from "../services/documents.service";
import * as i4 from "@angular/common";
import * as i5 from "@angular/forms";
/**
 * Delete prompt for an archived document (`01-ux-spec.md` §10.11).
 *
 * When the node has children the user chooses between deleting the whole
 * subtree and promoting the children one level up; with no children there is
 * nothing to choose and the dialog is a plain confirmation.
 *
 * 🛑 The chosen value leaves as `strategy` — that is the name
 * `DeleteDocumentQueryDTO` declares, and the route validates with
 * `whitelist: true`, so any other param name is stripped and the backend
 * silently falls back to `subtree`. A prompt whose answer is dropped on the
 * wire is worse than no prompt at all.
 */
export class DocsDeleteDialogComponent extends TranslationBaseComponent {
    constructor(translateService, dialogRef, documentsService) {
        super(translateService);
        this.translateService = translateService;
        this.dialogRef = dialogRef;
        this.documentsService = documentsService;
        this.target = null;
        /** Defaults to the backend's own default, so confirming without touching the radios is a no-surprise. */
        this.strategy = 'subtree';
        this.hasChildren = false;
        /** True while the child count is still being resolved — Delete waits for it. */
        this.resolving = false;
    }
    ngOnInit() {
        void this.resolveChildren();
    }
    /**
     * Decides whether the strategy choice is offered.
     *
     * A caller holding the list projection already knows (`childrenCount`); the
     * detail panel reads the single-document endpoint, which carries no such
     * column, so the count is fetched. A FILE is a leaf by construction and never
     * costs a request. A failed count degrades to "no children" — the backend
     * default (`subtree`) is then what runs, which is exactly what happened
     * before this dialog existed.
     */
    async resolveChildren() {
        const target = this.target;
        if (!target || target.kind === DocumentKindEnum.FILE)
            return;
        if (target.childrenCount !== undefined) {
            this.hasChildren = target.childrenCount > 0;
            return;
        }
        this.resolving = true;
        try {
            const result = await firstValueFrom(this.documentsService
                .getAll({ parentId: target.id, archived: 'include', take: 1 })
                .pipe(catchError(() => of({ items: [], total: 0 }))));
            this.hasChildren = (result?.total ?? 0) > 0;
        }
        finally {
            this.resolving = false;
        }
    }
    confirm() {
        if (this.resolving)
            return;
        // With no children there is nothing to promote — never send a strategy the
        // user was not offered.
        this.dialogRef.close({ strategy: this.hasChildren ? this.strategy : 'subtree' });
    }
    cancel() {
        this.dialogRef.close(null);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsDeleteDialogComponent, deps: [{ token: i1.TranslateService }, { token: i2.NbDialogRef }, { token: i3.DocumentsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DocsDeleteDialogComponent, isStandalone: false, selector: "gz-docs-delete-dialog", inputs: { target: "target" }, usesInheritance: true, ngImport: i0, template: `
		<nb-card class="docs-dialog docs-delete-dialog">
			<nb-card-header>{{ 'DOCS.DIALOGS.DELETE_TITLE' | translate }}</nb-card-header>
			<nb-card-body>
				<p class="docs-delete-body">
					{{ 'DOCS.DIALOGS.DELETE_BODY' | translate : { name: target?.name || '' } }}
				</p>
				<!-- The radios exist only when there is actually a subtree to decide about. -->
				<nb-radio-group *ngIf="hasChildren" [(ngModel)]="strategy" name="docs-delete-strategy">
					<nb-radio value="subtree">{{ 'DOCS.DIALOGS.DELETE_SUBTREE_OPTION' | translate }}</nb-radio>
					<nb-radio value="promote-children">
						{{ 'DOCS.DIALOGS.DELETE_PROMOTE_OPTION' | translate }}
					</nb-radio>
				</nb-radio-group>
			</nb-card-body>
			<nb-card-footer class="docs-dialog-footer">
				<button nbButton ghost (click)="cancel()">{{ 'DOCS.UPLOAD.CANCEL' | translate }}</button>
				<button nbButton status="danger" [disabled]="resolving" (click)="confirm()">
					{{ 'DOCS.TREE.DELETE' | translate }}
				</button>
			</nb-card-footer>
		</nb-card>
	`, isInline: true, styles: [".docs-delete-dialog{min-width:22rem;max-width:30rem}.docs-delete-body{margin:0 0 .75rem}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"], dependencies: [{ kind: "directive", type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i5.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i5.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i2.NbRadioComponent, selector: "nb-radio", inputs: ["name", "checked", "value", "disabled", "status"], outputs: ["valueChange", "blur"] }, { kind: "component", type: i2.NbRadioGroupComponent, selector: "nb-radio-group", inputs: ["value", "name", "disabled", "status"], outputs: ["valueChange"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsDeleteDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-delete-dialog', template: `
		<nb-card class="docs-dialog docs-delete-dialog">
			<nb-card-header>{{ 'DOCS.DIALOGS.DELETE_TITLE' | translate }}</nb-card-header>
			<nb-card-body>
				<p class="docs-delete-body">
					{{ 'DOCS.DIALOGS.DELETE_BODY' | translate : { name: target?.name || '' } }}
				</p>
				<!-- The radios exist only when there is actually a subtree to decide about. -->
				<nb-radio-group *ngIf="hasChildren" [(ngModel)]="strategy" name="docs-delete-strategy">
					<nb-radio value="subtree">{{ 'DOCS.DIALOGS.DELETE_SUBTREE_OPTION' | translate }}</nb-radio>
					<nb-radio value="promote-children">
						{{ 'DOCS.DIALOGS.DELETE_PROMOTE_OPTION' | translate }}
					</nb-radio>
				</nb-radio-group>
			</nb-card-body>
			<nb-card-footer class="docs-dialog-footer">
				<button nbButton ghost (click)="cancel()">{{ 'DOCS.UPLOAD.CANCEL' | translate }}</button>
				<button nbButton status="danger" [disabled]="resolving" (click)="confirm()">
					{{ 'DOCS.TREE.DELETE' | translate }}
				</button>
			</nb-card-footer>
		</nb-card>
	`, standalone: false, styles: [".docs-delete-dialog{min-width:22rem;max-width:30rem}.docs-delete-body{margin:0 0 .75rem}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.NbDialogRef }, { type: i3.DocumentsService }], propDecorators: { target: [{
                type: Input
            }] } });
//# sourceMappingURL=delete-dialog.component.js.map