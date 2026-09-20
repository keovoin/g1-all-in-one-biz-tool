import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NbButtonModule, NbCardModule, NbDialogRef, NbDialogService } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
/**
 * "Leave anyway?" prompt (spec 04 §3.3, spec 05 §9.2 "route `CanDeactivate` — with confirm
 * if a save fails"). Standalone on purpose: it is opened from a functional guard, which has
 * no NgModule of its own, and declaring it in `docs-ui.module.ts` would couple the guard to
 * a file it does not own.
 */
export class DocsUnsavedChangesDialogComponent {
    constructor() {
        this.dialogRef = inject(NbDialogRef);
    }
    close(leave) {
        this.dialogRef.close(leave);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsUnsavedChangesDialogComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DocsUnsavedChangesDialogComponent, isStandalone: true, selector: "gz-docs-unsaved-changes-dialog", ngImport: i0, template: `
		<nb-card class="docs-dialog docs-unsaved-dialog">
			<nb-card-header>{{ 'DOCS.EDITOR.UNSAVED_TITLE' | translate }}</nb-card-header>
			<nb-card-body>{{ 'DOCS.EDITOR.DISCARD_CONFIRM' | translate }}</nb-card-body>
			<nb-card-footer class="docs-dialog-footer">
				<button nbButton ghost type="button" (click)="close(false)">
					{{ 'DOCS.EDITOR.UNSAVED_STAY' | translate }}
				</button>
				<button nbButton status="danger" type="button" (click)="close(true)">
					{{ 'DOCS.EDITOR.UNSAVED_LEAVE' | translate }}
				</button>
			</nb-card-footer>
		</nb-card>
	`, isInline: true, dependencies: [{ kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: NbButtonModule }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "ngmodule", type: NbCardModule }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsUnsavedChangesDialogComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'gz-docs-unsaved-changes-dialog',
                    standalone: true,
                    imports: [TranslateModule, NbButtonModule, NbCardModule],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: `
		<nb-card class="docs-dialog docs-unsaved-dialog">
			<nb-card-header>{{ 'DOCS.EDITOR.UNSAVED_TITLE' | translate }}</nb-card-header>
			<nb-card-body>{{ 'DOCS.EDITOR.DISCARD_CONFIRM' | translate }}</nb-card-body>
			<nb-card-footer class="docs-dialog-footer">
				<button nbButton ghost type="button" (click)="close(false)">
					{{ 'DOCS.EDITOR.UNSAVED_STAY' | translate }}
				</button>
				<button nbButton status="danger" type="button" (click)="close(true)">
					{{ 'DOCS.EDITOR.UNSAVED_LEAVE' | translate }}
				</button>
			</nb-card-footer>
		</nb-card>
	`
                }]
        }] });
/**
 * `canDeactivate` for `page/:id`.
 *
 * 🛑 Without this, leaving a dirty page silently lost edits: `DocumentPageComponent.ngOnDestroy`
 * fires a **fire-and-forget** `void flush()` while `DocumentAutosaveService.ngOnDestroy` clears
 * the retry timer in the same teardown — a save that failed on the way out was never retried and
 * nobody was told. The guard makes leaving wait for the flush, and asks before discarding when
 * the flush could not land (offline, a 409 conflict freeze, a 423 lock).
 *
 * A save already in flight also reports `false` (the autosave service is single-flight), so the
 * prompt can appear in that narrow window. That is the deliberate trade: a redundant question
 * beats a silently dropped paragraph.
 */
export const docsUnsavedChangesGuard = (component) => {
    // 🛑 `inject()` is only legal in the guard's *synchronous* injection context — resolving
    // the dialog service after the first `await` throws NG0203. Resolve it up front, even on
    // the clean-exit path where it goes unused.
    const dialogService = inject(NbDialogService);
    return (async () => {
        if (!component?.hasUnsavedChanges)
            return true;
        const saved = await component.flushPendingChanges();
        if (saved)
            return true;
        const leave = await firstValueFrom(dialogService.open(DocsUnsavedChangesDialogComponent, {
            closeOnEsc: true,
            closeOnBackdropClick: false
        }).onClose);
        return leave === true;
    })();
};
//# sourceMappingURL=docs-unsaved-changes.guard.js.map