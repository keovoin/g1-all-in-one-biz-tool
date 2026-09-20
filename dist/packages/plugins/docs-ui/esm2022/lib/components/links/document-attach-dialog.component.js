import { __decorate, __metadata } from "tslib";
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbDialogRef, NbIconModule, NbInputModule, NbSpinnerModule } from '@nebular/theme';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subject, catchError, debounceTime, distinctUntilChanged, firstValueFrom, of, switchMap, tap } from 'rxjs';
import { BaseEntityEnum, DocumentKindEnum } from '@gauzy/contracts';
import { Store, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DOCS_SEARCH_DEBOUNCE_MS } from '../../docs.constants';
import { DocumentsService } from '../../services/documents.service';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@nebular/theme";
import * as i3 from "../../services/documents.service";
import * as i4 from "@gauzy/ui-core/core";
import * as i5 from "@angular/common";
import * as i6 from "@angular/forms";
/** One page of picker results — enough to scan, small enough not to need paging. */
const DOCUMENT_PICKER_PAGE_SIZE = 20;
/**
 * "Attach existing…" flow of the record-side Documents panel: search the hub by
 * name, pick one document, create the `DocumentLink` against the host record.
 *
 * The inverse of `dialogs/link-dialog.component.ts` (which starts from a document
 * and picks a record). Kept separate rather than parameterizing that one: it is a
 * different search surface — one endpoint instead of six entity services — and it
 * has to be **standalone**, because it is opened from the standalone panel mounted
 * on app pages where `DocsUiModule`'s declarations are not in scope.
 */
let DocumentAttachDialogComponent = class DocumentAttachDialogComponent extends TranslationBaseComponent {
    constructor(translateService, dialogRef, documentsService, toastrService, store) {
        super(translateService);
        this.translateService = translateService;
        this.dialogRef = dialogRef;
        this.documentsService = documentsService;
        this.toastrService = toastrService;
        this.store = store;
        /** Links that already exist on the record — their documents are filtered out. */
        this.existing = [];
        this.search = '';
        this.results = [];
        this.selectedId = null;
        this.loading = false;
        this.saving = false;
        this.search$ = new Subject();
    }
    ngOnInit() {
        this.search$
            .pipe(debounceTime(DOCS_SEARCH_DEBOUNCE_MS), distinctUntilChanged(), tap(() => (this.loading = true)), switchMap((term) => this.documentsService
            .getAll({
            q: term || undefined,
            searchIn: 'name',
            archived: false,
            sort: 'updatedAt',
            sortOrder: 'DESC',
            take: DOCUMENT_PICKER_PAGE_SIZE
        })
            // A failed search yields an empty picker, never a broken dialog.
            .pipe(catchError(() => of({ items: [], total: 0 })))), tap((page) => {
            // 🛑 `GetDocumentsQueryDTO.kind` is a scalar, so "pages and files but
            // not folders" cannot be expressed on the wire — folders are dropped
            // here instead. Attaching a folder is not what this panel means.
            this.results = (page?.items ?? []).filter((row) => row.kind !== DocumentKindEnum.FOLDER);
            this.loading = false;
        }), untilDestroyed(this))
            .subscribe();
        // Cold start: the most recently updated documents, before anything is typed.
        this.search$.next('');
    }
    onSearchChange(term) {
        this.search = term;
        this.search$.next(term.trim());
    }
    /** Already-attached documents are hidden — the link write is idempotent anyway. */
    get filtered() {
        const linked = new Set((this.existing ?? []).map((link) => String(link.documentId)));
        return this.results.filter((document) => !linked.has(String(document.id)));
    }
    get canConfirm() {
        return !!this.selectedId && !this.saving;
    }
    async confirm() {
        if (!this.canConfirm)
            return;
        const organization = this.store.selectedOrganization;
        this.saving = true;
        try {
            const link = await firstValueFrom(this.documentsService.createLink({
                documentId: this.selectedId,
                entity: this.entity,
                entityId: this.entityId,
                // Display label captured at link time (spec 02 `DocumentLink.metadata`).
                metadata: { label: this.entityLabel ?? '' },
                organizationId: organization?.id,
                tenantId: organization?.tenantId
            }));
            this.toastrService.success(this.getTranslation('DOCS.LINKS.TOAST_ADDED'));
            this.dialogRef.close(link);
        }
        catch (error) {
            this.toastrService.danger(error);
            this.saving = false;
        }
    }
    cancel() {
        this.dialogRef.close(null);
    }
    iconOf(document) {
        return document?.kind === DocumentKindEnum.PAGE ? 'file-text-outline' : 'attach-outline';
    }
    trackByDocument(_, document) {
        return String(document.id);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentAttachDialogComponent, deps: [{ token: i1.TranslateService }, { token: i2.NbDialogRef }, { token: i3.DocumentsService }, { token: i4.ToastrService }, { token: i4.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DocumentAttachDialogComponent, isStandalone: true, selector: "gz-document-attach-dialog", inputs: { entity: "entity", entityId: "entityId", entityLabel: "entityLabel", existing: "existing" }, providers: [DocumentsService], usesInheritance: true, ngImport: i0, template: "<nb-card class=\"docs-dialog docs-attach-dialog\">\n\t<nb-card-header>{{ 'DOCS.LINKS.ATTACH_DIALOG_TITLE' | translate }}</nb-card-header>\n\n\t<nb-card-body [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t\t<!--\n\t\t\tThe field has no visible label by design (the card header names the dialog), so it needs\n\t\t\tan explicit accessible name \u2014 a placeholder is not one: it is not exposed as the\n\t\t\taccessible name by every screen reader and it disappears as soon as the user types.\n\t\t-->\n\t\t<input\n\t\t\tid=\"docs-attach-search\"\n\t\t\tnbInput\n\t\t\tfullWidth\n\t\t\tsize=\"small\"\n\t\t\ttype=\"text\"\n\t\t\t[attr.aria-label]=\"'DOCS.LINKS.ATTACH_SEARCH_PLACEHOLDER' | translate\"\n\t\t\t[placeholder]=\"'DOCS.LINKS.ATTACH_SEARCH_PLACEHOLDER' | translate\"\n\t\t\t[disabled]=\"saving\"\n\t\t\t[ngModel]=\"search\"\n\t\t\t(ngModelChange)=\"onSearchChange($event)\"\n\t\t/>\n\n\t\t<p class=\"muted\" *ngIf=\"!loading && !filtered.length\">\n\t\t\t{{ 'DOCS.LINKS.ATTACH_NO_DOCUMENTS' | translate }}\n\t\t</p>\n\n\t\t<div class=\"docs-attach-list\" *ngIf=\"filtered.length\">\n\t\t\t<button\n\t\t\t\ttype=\"button\"\n\t\t\t\tclass=\"docs-attach-item\"\n\t\t\t\t*ngFor=\"let document of filtered; trackBy: trackByDocument\"\n\t\t\t\t[class.selected]=\"selectedId === document.id\"\n\t\t\t\t[disabled]=\"saving\"\n\t\t\t\t(click)=\"selectedId = document.id\"\n\t\t\t>\n\t\t\t\t<nb-icon [icon]=\"iconOf(document)\" size=\"tiny\"></nb-icon>\n\t\t\t\t<span class=\"docs-attach-item-name\" [title]=\"document.name\">{{ document.name }}</span>\n\t\t\t</button>\n\t\t</div>\n\t</nb-card-body>\n\n\t<nb-card-footer class=\"docs-dialog-footer\">\n\t\t<button nbButton ghost [disabled]=\"saving\" (click)=\"cancel()\">{{ 'DOCS.UPLOAD.CANCEL' | translate }}</button>\n\t\t<button nbButton status=\"primary\" [disabled]=\"!canConfirm\" (click)=\"confirm()\">\n\t\t\t{{ 'DOCS.LINKS.CONFIRM' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: [".docs-attach-dialog{width:28rem;max-width:92vw;margin:0}.muted{margin:.75rem 0 0;color:var(--text-hint-color);font-size:.8125rem}.docs-attach-list{margin-top:.5rem;max-height:16rem;overflow-y:auto;border:1px solid var(--divider-color);border-radius:var(--border-radius)}.docs-attach-item{display:flex;align-items:center;gap:.375rem;width:100%;padding:.375rem .625rem;border:0;background:transparent;color:inherit;font-size:.875rem;text-align:left;cursor:pointer}.docs-attach-item:hover:not(:disabled){background:var(--background-basic-color-2)}.docs-attach-item.selected{background:var(--color-primary-transparent-200);font-weight:600}.docs-attach-item:disabled{cursor:default;opacity:.6}.docs-attach-item-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i5.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i5.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i6.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i6.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: NbButtonModule }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "ngmodule", type: NbCardModule }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "ngmodule", type: NbIconModule }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "ngmodule", type: NbInputModule }, { kind: "directive", type: i2.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "ngmodule", type: NbSpinnerModule }, { kind: "directive", type: i2.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
DocumentAttachDialogComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        NbDialogRef,
        DocumentsService,
        ToastrService,
        Store])
], DocumentAttachDialogComponent);
export { DocumentAttachDialogComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentAttachDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-document-attach-dialog', standalone: true, imports: [
                        CommonModule,
                        FormsModule,
                        TranslateModule,
                        NbButtonModule,
                        NbCardModule,
                        NbIconModule,
                        NbInputModule,
                        NbSpinnerModule
                    ], providers: [DocumentsService], template: "<nb-card class=\"docs-dialog docs-attach-dialog\">\n\t<nb-card-header>{{ 'DOCS.LINKS.ATTACH_DIALOG_TITLE' | translate }}</nb-card-header>\n\n\t<nb-card-body [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t\t<!--\n\t\t\tThe field has no visible label by design (the card header names the dialog), so it needs\n\t\t\tan explicit accessible name \u2014 a placeholder is not one: it is not exposed as the\n\t\t\taccessible name by every screen reader and it disappears as soon as the user types.\n\t\t-->\n\t\t<input\n\t\t\tid=\"docs-attach-search\"\n\t\t\tnbInput\n\t\t\tfullWidth\n\t\t\tsize=\"small\"\n\t\t\ttype=\"text\"\n\t\t\t[attr.aria-label]=\"'DOCS.LINKS.ATTACH_SEARCH_PLACEHOLDER' | translate\"\n\t\t\t[placeholder]=\"'DOCS.LINKS.ATTACH_SEARCH_PLACEHOLDER' | translate\"\n\t\t\t[disabled]=\"saving\"\n\t\t\t[ngModel]=\"search\"\n\t\t\t(ngModelChange)=\"onSearchChange($event)\"\n\t\t/>\n\n\t\t<p class=\"muted\" *ngIf=\"!loading && !filtered.length\">\n\t\t\t{{ 'DOCS.LINKS.ATTACH_NO_DOCUMENTS' | translate }}\n\t\t</p>\n\n\t\t<div class=\"docs-attach-list\" *ngIf=\"filtered.length\">\n\t\t\t<button\n\t\t\t\ttype=\"button\"\n\t\t\t\tclass=\"docs-attach-item\"\n\t\t\t\t*ngFor=\"let document of filtered; trackBy: trackByDocument\"\n\t\t\t\t[class.selected]=\"selectedId === document.id\"\n\t\t\t\t[disabled]=\"saving\"\n\t\t\t\t(click)=\"selectedId = document.id\"\n\t\t\t>\n\t\t\t\t<nb-icon [icon]=\"iconOf(document)\" size=\"tiny\"></nb-icon>\n\t\t\t\t<span class=\"docs-attach-item-name\" [title]=\"document.name\">{{ document.name }}</span>\n\t\t\t</button>\n\t\t</div>\n\t</nb-card-body>\n\n\t<nb-card-footer class=\"docs-dialog-footer\">\n\t\t<button nbButton ghost [disabled]=\"saving\" (click)=\"cancel()\">{{ 'DOCS.UPLOAD.CANCEL' | translate }}</button>\n\t\t<button nbButton status=\"primary\" [disabled]=\"!canConfirm\" (click)=\"confirm()\">\n\t\t\t{{ 'DOCS.LINKS.CONFIRM' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: [".docs-attach-dialog{width:28rem;max-width:92vw;margin:0}.muted{margin:.75rem 0 0;color:var(--text-hint-color);font-size:.8125rem}.docs-attach-list{margin-top:.5rem;max-height:16rem;overflow-y:auto;border:1px solid var(--divider-color);border-radius:var(--border-radius)}.docs-attach-item{display:flex;align-items:center;gap:.375rem;width:100%;padding:.375rem .625rem;border:0;background:transparent;color:inherit;font-size:.875rem;text-align:left;cursor:pointer}.docs-attach-item:hover:not(:disabled){background:var(--background-basic-color-2)}.docs-attach-item.selected{background:var(--color-primary-transparent-200);font-weight:600}.docs-attach-item:disabled{cursor:default;opacity:.6}.docs-attach-item-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.NbDialogRef }, { type: i3.DocumentsService }, { type: i4.ToastrService }, { type: i4.Store }], propDecorators: { entity: [{
                type: Input
            }], entityId: [{
                type: Input
            }], entityLabel: [{
                type: Input
            }], existing: [{
                type: Input
            }] } });
//# sourceMappingURL=document-attach-dialog.component.js.map