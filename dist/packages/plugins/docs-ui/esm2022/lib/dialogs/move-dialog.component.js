import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocumentTreeStore } from '../services/document-tree.store';
import { DocumentsService } from '../services/documents.service';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@nebular/theme";
import * as i3 from "../services/document-tree.store";
import * as i4 from "../services/documents.service";
import * as i5 from "@gauzy/ui-core/core";
import * as i6 from "../components/folder-picker/docs-folder-picker.component";
/**
 * Move dialog: the shared `gz-docs-folder-picker` (flattened destination tree,
 * FILE nodes and each document's own subtree disabled) plus the move call.
 * Used by row action, tree context menu and bulk move. Closes truthy when at
 * least one move succeeded.
 */
export class MoveDialogComponent extends TranslationBaseComponent {
    constructor(translateService, dialogRef, treeStore, documentsService, toastrService) {
        super(translateService);
        this.translateService = translateService;
        this.dialogRef = dialogRef;
        this.treeStore = treeStore;
        this.documentsService = documentsService;
        this.toastrService = toastrService;
        /** Documents being moved (single row action or bulk selection). */
        this.documentIds = [];
        /** `undefined` until the user picks — `null` is the root and is a valid choice. */
        this.selectedId = undefined;
        this.saving = false;
    }
    onDestinationChange(destinationId) {
        this.selectedId = destinationId;
    }
    async confirm() {
        if (this.selectedId === undefined || this.saving)
            return;
        this.saving = true;
        let succeeded = 0;
        for (const id of this.documentIds) {
            try {
                await firstValueFrom(this.documentsService.move(id, { parentId: this.selectedId, index: 0 }));
                succeeded++;
            }
            catch (error) {
                this.toastrService.danger(this.getTranslation('DOCS.TOASTS.MOVE_FAILED'));
            }
        }
        if (succeeded > 0) {
            this.toastrService.success(this.getTranslation('DOCS.TOASTS.MOVED'));
            this.treeStore.invalidateAll();
            this.dialogRef.close(true);
        }
        else {
            this.saving = false;
        }
    }
    cancel() {
        this.dialogRef.close(false);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MoveDialogComponent, deps: [{ token: i1.TranslateService }, { token: i2.NbDialogRef }, { token: i3.DocumentTreeStore }, { token: i4.DocumentsService }, { token: i5.ToastrService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: MoveDialogComponent, isStandalone: false, selector: "gz-docs-move-dialog", inputs: { documentIds: "documentIds" }, usesInheritance: true, ngImport: i0, template: `
		<nb-card class="docs-dialog">
			<nb-card-header>{{ 'DOCS.DIALOGS.MOVE_TITLE' | translate }}</nb-card-header>
			<nb-card-body>
				<gz-docs-folder-picker
					[excludeIds]="documentIds"
					[selectedId]="selectedId"
					(selectedIdChange)="onDestinationChange($event)"
				></gz-docs-folder-picker>
				<div class="hint">{{ 'DOCS.DIALOGS.MOVE_CYCLE_HINT' | translate }}</div>
			</nb-card-body>
			<nb-card-footer class="docs-dialog-footer">
				<button nbButton ghost (click)="cancel()">{{ 'DOCS.UPLOAD.CANCEL' | translate }}</button>
				<button nbButton status="primary" [disabled]="selectedId === undefined || saving" (click)="confirm()">
					{{ 'DOCS.DIALOGS.MOVE_CONFIRM' | translate }}
				</button>
			</nb-card-footer>
		</nb-card>
	`, isInline: true, styles: [".docs-dialog{min-width:24rem;max-width:30rem}.hint{font-size:.75rem;color:var(--text-hint-color)}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"], dependencies: [{ kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i6.DocsFolderPickerComponent, selector: "gz-docs-folder-picker", inputs: ["excludeIds", "selectedId"], outputs: ["selectedIdChange"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MoveDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-move-dialog', template: `
		<nb-card class="docs-dialog">
			<nb-card-header>{{ 'DOCS.DIALOGS.MOVE_TITLE' | translate }}</nb-card-header>
			<nb-card-body>
				<gz-docs-folder-picker
					[excludeIds]="documentIds"
					[selectedId]="selectedId"
					(selectedIdChange)="onDestinationChange($event)"
				></gz-docs-folder-picker>
				<div class="hint">{{ 'DOCS.DIALOGS.MOVE_CYCLE_HINT' | translate }}</div>
			</nb-card-body>
			<nb-card-footer class="docs-dialog-footer">
				<button nbButton ghost (click)="cancel()">{{ 'DOCS.UPLOAD.CANCEL' | translate }}</button>
				<button nbButton status="primary" [disabled]="selectedId === undefined || saving" (click)="confirm()">
					{{ 'DOCS.DIALOGS.MOVE_CONFIRM' | translate }}
				</button>
			</nb-card-footer>
		</nb-card>
	`, standalone: false, styles: [".docs-dialog{min-width:24rem;max-width:30rem}.hint{font-size:.75rem;color:var(--text-hint-color)}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.NbDialogRef }, { type: i3.DocumentTreeStore }, { type: i4.DocumentsService }, { type: i5.ToastrService }], propDecorators: { documentIds: [{
                type: Input
            }] } });
//# sourceMappingURL=move-dialog.component.js.map