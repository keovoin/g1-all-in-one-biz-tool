import { CanDeactivateFn } from '@angular/router';
import type { DocumentPageComponent } from '../pages/page-editor/document-page.component';
import * as i0 from "@angular/core";
/**
 * "Leave anyway?" prompt (spec 04 §3.3, spec 05 §9.2 "route `CanDeactivate` — with confirm
 * if a save fails"). Standalone on purpose: it is opened from a functional guard, which has
 * no NgModule of its own, and declaring it in `docs-ui.module.ts` would couple the guard to
 * a file it does not own.
 */
export declare class DocsUnsavedChangesDialogComponent {
    private readonly dialogRef;
    close(leave: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocsUnsavedChangesDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DocsUnsavedChangesDialogComponent, "gz-docs-unsaved-changes-dialog", never, {}, {}, never, never, true, never>;
}
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
export declare const docsUnsavedChangesGuard: CanDeactivateFn<DocumentPageComponent>;
