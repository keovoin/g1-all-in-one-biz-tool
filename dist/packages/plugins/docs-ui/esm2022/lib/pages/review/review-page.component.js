import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Actions } from '@ngneat/effects-ng';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { DocumentKindEnum, DocumentReviewReasonEnum, DocumentReviewStatusEnum, PermissionsEnum } from '@gauzy/contracts';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { Store, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocumentsActions } from '../../+state/documents.actions';
import { DOCS_PREVIEW_DIALOG_CONFIG } from '../../docs.constants';
import { DocsPreviewModalComponent } from '../../components/preview/docs-preview-modal.component';
import { RejectDialogComponent } from '../../dialogs/reject-dialog.component';
import { DocumentsService } from '../../services/documents.service';
import { DOCS_PERMISSIONS } from '../../docs-permission-groups';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "../../services/documents.service";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "@nebular/theme";
import * as i5 from "@ngneat/effects-ng";
import * as i6 from "@angular/common";
import * as i7 from "ngx-permissions";
import * as i8 from "../../components/table/cells/name-cell.component";
import * as i9 from "../../components/table/cells/source-badge.component";
import * as i10 from "../../components/table/cells/category-chips.component";
import * as i11 from "../../components/bulk/bulk-bar.component";
import * as i12 from "../../components/empty/empty-state.component";
/**
 * Review queue (`01-ux-spec.md` §11): PENDING documents with reason badges,
 * single approve/reject (reject with an optional reason), row selection and
 * bulk approve/reject through the bulk bar (`DOCS_REVIEW` only — the route is
 * additionally permission-guarded), plus per-row Details and Preview.
 */
let ReviewPageComponent = class ReviewPageComponent extends TranslationBaseComponent {
    constructor(translateService, documentsService, toastrService, dialogService, actions, store) {
        super(translateService);
        this.translateService = translateService;
        this.documentsService = documentsService;
        this.toastrService = toastrService;
        this.dialogService = dialogService;
        this.actions = actions;
        this.store = store;
        /**
         * Stable permission arrays for the template's `*ngxPermissionsOnly` gates.
         * 🛑 Never inline `[permissions.X]` in a binding — a fresh array each change-detection cycle
         * makes ngx-permissions re-validate forever and wedges the main thread.
         */
        this.docsPermissions = DOCS_PERMISSIONS;
        this.rows$ = new BehaviorSubject([]);
        this.loading = false;
        this.error = false;
        this.selectedIds = [];
        this.permissions = PermissionsEnum;
        this.kindEnum = DocumentKindEnum;
    }
    ngOnInit() {
        this.store.selectedOrganization$
            .pipe(filter((organization) => !!organization), distinctUntilChange(), tap(() => void this.load()), untilDestroyed(this))
            .subscribe();
    }
    async load() {
        this.loading = true;
        this.error = false;
        try {
            const organization = this.store.selectedOrganization;
            const { items } = await firstValueFrom(this.documentsService.getAll({
                reviewStatus: [DocumentReviewStatusEnum.PENDING],
                archived: false,
                organizationId: organization?.id,
                tenantId: organization?.tenantId,
                relations: ['categories', 'tags'],
                sort: 'updatedAt:desc',
                take: 100
            }));
            const rows = items ?? [];
            this.rows$.next(rows);
            // Drop selections that left the queue.
            const present = new Set(rows.map((row) => String(row.id)));
            this.selectedIds = this.selectedIds.filter((id) => present.has(String(id)));
        }
        catch {
            this.error = true;
            this.rows$.next([]);
        }
        finally {
            this.loading = false;
        }
    }
    // ─── Selection ───────────────────────────────────────────────
    isSelected(row) {
        return this.selectedIds.some((id) => String(id) === String(row.id));
    }
    toggleSelected(row, checked) {
        const id = row.id;
        this.selectedIds = checked
            ? [...this.selectedIds.filter((selected) => String(selected) !== String(id)), id]
            : this.selectedIds.filter((selected) => String(selected) !== String(id));
    }
    get allSelected() {
        const rows = this.rows$.value;
        return rows.length > 0 && rows.every((row) => this.isSelected(row));
    }
    toggleSelectAll(checked) {
        this.selectedIds = checked ? this.rows$.value.map((row) => row.id) : [];
    }
    onClearSelection() {
        this.selectedIds = [];
    }
    // ─── Row actions ─────────────────────────────────────────────
    async approve(document) {
        try {
            await firstValueFrom(this.documentsService.approveReview(document.id));
            this.toastrService.success(this.getTranslation('DOCS.TOASTS.REVIEW_APPROVED'));
            await this.load();
            this.actions.dispatch(DocumentsActions.refreshFacets());
        }
        catch (error) {
            this.toastrService.danger(error);
        }
    }
    /** Reject with an OPTIONAL reason (same `reason` field as bulk rejection). */
    async reject(document) {
        const result = await firstValueFrom(this.dialogService.open(RejectDialogComponent).onClose);
        if (!result)
            return;
        try {
            await firstValueFrom(this.documentsService.rejectReview(document.id, { reason: result.reason }));
            this.toastrService.success(this.getTranslation('DOCS.TOASTS.REVIEW_REJECTED'));
            await this.load();
            this.actions.dispatch(DocumentsActions.refreshFacets());
        }
        catch (error) {
            this.toastrService.danger(error);
        }
    }
    /** Opens the detail side panel (`?id=` on the review URL — the shell hosts it). */
    openDetails(document) {
        this.actions.dispatch(DocumentsActions.detailOpened(document.id));
    }
    openPreview(document) {
        this.dialogService.open(DocsPreviewModalComponent, { ...DOCS_PREVIEW_DIALOG_CONFIG, context: { document } });
    }
    onBulkCompleted() {
        this.selectedIds = [];
        void this.load();
        this.actions.dispatch(DocumentsActions.refreshFacets());
    }
    reasonKey(document) {
        const reason = (document.reviewReason ?? 'manual').toUpperCase().split('-').join('_');
        return `DOCS.REVIEW.REASONS.${reason}`;
    }
    reasonStatus(document) {
        switch (document.reviewReason) {
            case DocumentReviewReasonEnum.EXTRACTION_FAILED:
                return 'danger';
            case DocumentReviewReasonEnum.LOW_CONFIDENCE:
                return 'warning';
            case DocumentReviewReasonEnum.AI_GENERATED:
                return 'info';
            default:
                return 'basic';
        }
    }
    confidencePercent(document) {
        return document.aiConfidence !== undefined && document.aiConfidence !== null
            ? `${Math.round(document.aiConfidence * 100)}%`
            : '';
    }
    trackById(_, row) {
        return String(row.id);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ReviewPageComponent, deps: [{ token: i1.TranslateService }, { token: i2.DocumentsService }, { token: i3.ToastrService }, { token: i4.NbDialogService }, { token: i5.Actions }, { token: i3.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ReviewPageComponent, isStandalone: false, selector: "gz-docs-review-page", usesInheritance: true, ngImport: i0, template: "<div class=\"docs-review\">\n\t<div class=\"docs-review-header\">\n\t\t<h4>{{ 'DOCS.REVIEW.QUEUE_TITLE' | translate }}</h4>\n\t\t<button nbButton ghost size=\"small\" (click)=\"load()\">\n\t\t\t<nb-icon icon=\"refresh-outline\"></nb-icon>\n\t\t</button>\n\t</div>\n\n\t<ng-container *ngIf=\"rows$ | async as rows\">\n\t\t<ng-container *ngIf=\"rows.length; else emptyState\">\n\t\t\t<!-- Bulk bar: DOCS_REVIEW holders see approve/reject only (reviewMode) -->\n\t\t\t<gz-docs-bulk-bar\n\t\t\t\t[selectedIds]=\"selectedIds\"\n\t\t\t\t[reviewMode]=\"true\"\n\t\t\t\t(completed)=\"onBulkCompleted()\"\n\t\t\t\t(cleared)=\"onClearSelection()\"\n\t\t\t></gz-docs-bulk-bar>\n\n\t\t\t<div class=\"docs-review-list\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t\t\t\t<div class=\"docs-review-row docs-review-row-head\">\n\t\t\t\t\t<nb-checkbox\n\t\t\t\t\t\t[checked]=\"allSelected\"\n\t\t\t\t\t\t(checkedChange)=\"toggleSelectAll($event)\"\n\t\t\t\t\t\t[attr.aria-label]=\"'DOCS.A11Y.SELECTION_STATUS' | translate\"\n\t\t\t\t\t></nb-checkbox>\n\t\t\t\t\t<span class=\"docs-review-head-name\">{{ 'DOCS.TABLE.COLUMNS.NAME' | translate }}</span>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"docs-review-row\" *ngFor=\"let row of rows; trackBy: trackById\">\n\t\t\t\t\t<nb-checkbox\n\t\t\t\t\t\t[checked]=\"isSelected(row)\"\n\t\t\t\t\t\t(checkedChange)=\"toggleSelected(row, $event)\"\n\t\t\t\t\t\t[attr.aria-label]=\"row.name\"\n\t\t\t\t\t></nb-checkbox>\n\t\t\t\t\t<gz-docs-name-cell class=\"docs-review-name\" [rowData]=\"row\"></gz-docs-name-cell>\n\t\t\t\t\t<nb-badge\n\t\t\t\t\t\t[status]=\"reasonStatus(row)\"\n\t\t\t\t\t\t[text]=\"\n\t\t\t\t\t\t\t(reasonKey(row) | translate) +\n\t\t\t\t\t\t\t(confidencePercent(row) ? ' \u00B7 ' + confidencePercent(row) : '')\n\t\t\t\t\t\t\"\n\t\t\t\t\t></nb-badge>\n\t\t\t\t\t<gz-docs-source-badge [rowData]=\"row\"></gz-docs-source-badge>\n\t\t\t\t\t<gz-docs-category-chips [rowData]=\"row\"></gz-docs-category-chips>\n\t\t\t\t\t<span class=\"docs-review-date\">{{ row.updatedAt | date : 'medium' }}</span>\n\t\t\t\t\t<span class=\"docs-review-actions\">\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t(click)=\"openDetails(row)\"\n\t\t\t\t\t\t\t[nbTooltip]=\"'DOCS.PREVIEW.OPEN_DETAILS' | translate\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<nb-icon icon=\"info-outline\"></nb-icon>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t*ngIf=\"row.kind === kindEnum.FILE\"\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t(click)=\"openPreview(row)\"\n\t\t\t\t\t\t\t[nbTooltip]=\"'DOCS.PREVIEW.TITLE' | translate\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<nb-icon icon=\"eye-outline\"></nb-icon>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<ng-template [ngxPermissionsOnly]=\"docsPermissions.review\">\n\t\t\t\t\t\t\t<button nbButton size=\"tiny\" status=\"success\" (click)=\"approve(row)\">\n\t\t\t\t\t\t\t\t{{ 'DOCS.REVIEW.APPROVE' | translate }}\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t<button nbButton size=\"tiny\" status=\"danger\" appearance=\"outline\" (click)=\"reject(row)\">\n\t\t\t\t\t\t\t\t{{ 'DOCS.REVIEW.REJECT' | translate }}\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</ng-template>\n\t\t\t\t\t</span>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</ng-container>\n\n\t\t<ng-template #emptyState>\n\t\t\t<div [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" class=\"docs-review-empty-host\">\n\t\t\t\t<gz-docs-empty-state *ngIf=\"!loading\" [variant]=\"error ? 'error' : 'review-empty'\" (primaryAction)=\"load()\"></gz-docs-empty-state>\n\t\t\t</div>\n\t\t</ng-template>\n\t</ng-container>\n</div>\n", styles: [".docs-review{display:flex;flex-direction:column;gap:var(--docs-section-gap, 1rem);padding:var(--docs-page-padding, 1.25rem);color:var(--docs-text, var(--text-basic-color))}.docs-review-header{display:flex;align-items:center;justify-content:space-between;gap:.75rem;min-height:var(--gauzy-page-title-row-height, 2.125rem)}.docs-review-header h4{flex:1 1 auto;min-width:0;margin:0;font-size:var(--docs-title-size, 1rem);font-weight:var(--docs-title-weight, 600);line-height:var(--gauzy-page-title-line-height, 1.5rem);letter-spacing:var(--gauzy-page-title-letter-spacing, -.01em);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-review-header button[nbButton]{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:var(--docs-control-height, 2rem);height:var(--docs-control-height, 2rem);padding:0;border-radius:var(--docs-radius, .375rem)}.docs-review-header button[nbButton] nb-icon{margin:0;font-size:1rem}.docs-review-list{border-radius:var(--docs-radius-lg, .5rem);background:var(--docs-surface, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--docs-hairline, rgba(126, 126, 143, .18));overflow-x:auto}.docs-review-row{display:grid;grid-template-columns:2.5rem minmax(0,2fr) auto auto minmax(0,1fr) auto auto;align-items:center;gap:.5rem .75rem;padding:.5rem .75rem;border-bottom:1px solid var(--docs-hairline, rgba(126, 126, 143, .18));font-size:var(--docs-body-size, .8125rem)}.docs-review-row:last-child{border-bottom:0}.docs-review-row>nb-checkbox{justify-self:center}.docs-review-row .docs-review-name{min-width:0}.docs-review-row .docs-review-date{font-size:var(--docs-meta-size, .75rem);color:var(--docs-text-muted, var(--text-hint-color));white-space:nowrap}.docs-review-row .docs-review-actions{display:inline-flex;align-items:center;gap:.25rem}.docs-review-row button[nbButton]{display:inline-flex;align-items:center;gap:.25rem;height:var(--docs-control-height-sm, 1.75rem);min-height:var(--docs-control-height-sm, 1.75rem);padding-inline:.5rem;border-radius:var(--docs-radius, .375rem);font-size:var(--docs-meta-size, .75rem);white-space:nowrap}.docs-review-row button[nbButton] nb-icon{margin:0;font-size:.875rem}.docs-review-row .docs-review-actions button[nbButton]:has(nb-icon:only-child){width:var(--docs-control-height-sm, 1.75rem);padding-inline:0}.docs-review-row:not(.docs-review-row-head):hover{background:var(--docs-hover, rgba(126, 126, 143, .12))}.docs-review-row ::ng-deep nb-badge{position:static;display:inline-flex;align-items:center;max-width:100%;height:var(--gauzy-table-badge-height, 1.25rem);padding:0 var(--gauzy-table-chip-padding-x, .375rem);border-radius:var(--docs-radius, .375rem);font-size:var(--gauzy-table-chip-font-size, .6875rem);line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transform:none}.docs-review-row.docs-review-row-head{grid-template-columns:2.5rem minmax(0,1fr);font-size:var(--docs-label-size, .6875rem);font-weight:600;letter-spacing:.02em;color:var(--docs-text-muted, var(--text-hint-color));text-transform:uppercase;border-bottom-color:var(--docs-hairline, rgba(126, 126, 143, .18))}.docs-review-empty-host{display:block;min-height:12rem;border-radius:var(--docs-radius-lg, .5rem);background:var(--docs-surface, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--docs-hairline, rgba(126, 126, 143, .18))}@media(max-width:991px){.docs-review-row{grid-template-columns:2.5rem minmax(0,1fr)}.docs-review-row .docs-review-actions{grid-column:1/-1;justify-content:flex-end;flex-wrap:wrap}.docs-review-row>gz-docs-source-badge,.docs-review-row>gz-docs-category-chips,.docs-review-row>.docs-review-date,.docs-review-row>nb-badge{grid-column:2/-1}}\n"], dependencies: [{ kind: "directive", type: i6.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i7.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "component", type: i4.NbBadgeComponent, selector: "nb-badge", inputs: ["text", "position", "dotMode", "status"] }, { kind: "component", type: i4.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i4.NbCheckboxComponent, selector: "nb-checkbox", inputs: ["checked", "disabled", "status", "indeterminate"], outputs: ["checkedChange"] }, { kind: "component", type: i4.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i4.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "directive", type: i4.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "component", type: i8.NameCellComponent, selector: "gz-docs-name-cell", inputs: ["rowData", "value"] }, { kind: "component", type: i9.SourceBadgeComponent, selector: "gz-docs-source-badge", inputs: ["rowData", "value"] }, { kind: "component", type: i10.CategoryChipsComponent, selector: "gz-docs-category-chips", inputs: ["rowData", "value", "max"] }, { kind: "component", type: i11.BulkBarComponent, selector: "gz-docs-bulk-bar", inputs: ["selectedIds", "reviewMode"], outputs: ["completed", "cleared"] }, { kind: "component", type: i12.EmptyStateComponent, selector: "gz-docs-empty-state", inputs: ["variant"], outputs: ["primaryAction"] }, { kind: "pipe", type: i6.AsyncPipe, name: "async" }, { kind: "pipe", type: i6.DatePipe, name: "date" }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
ReviewPageComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        DocumentsService,
        ToastrService,
        NbDialogService,
        Actions,
        Store])
], ReviewPageComponent);
export { ReviewPageComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ReviewPageComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-review-page', standalone: false, template: "<div class=\"docs-review\">\n\t<div class=\"docs-review-header\">\n\t\t<h4>{{ 'DOCS.REVIEW.QUEUE_TITLE' | translate }}</h4>\n\t\t<button nbButton ghost size=\"small\" (click)=\"load()\">\n\t\t\t<nb-icon icon=\"refresh-outline\"></nb-icon>\n\t\t</button>\n\t</div>\n\n\t<ng-container *ngIf=\"rows$ | async as rows\">\n\t\t<ng-container *ngIf=\"rows.length; else emptyState\">\n\t\t\t<!-- Bulk bar: DOCS_REVIEW holders see approve/reject only (reviewMode) -->\n\t\t\t<gz-docs-bulk-bar\n\t\t\t\t[selectedIds]=\"selectedIds\"\n\t\t\t\t[reviewMode]=\"true\"\n\t\t\t\t(completed)=\"onBulkCompleted()\"\n\t\t\t\t(cleared)=\"onClearSelection()\"\n\t\t\t></gz-docs-bulk-bar>\n\n\t\t\t<div class=\"docs-review-list\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t\t\t\t<div class=\"docs-review-row docs-review-row-head\">\n\t\t\t\t\t<nb-checkbox\n\t\t\t\t\t\t[checked]=\"allSelected\"\n\t\t\t\t\t\t(checkedChange)=\"toggleSelectAll($event)\"\n\t\t\t\t\t\t[attr.aria-label]=\"'DOCS.A11Y.SELECTION_STATUS' | translate\"\n\t\t\t\t\t></nb-checkbox>\n\t\t\t\t\t<span class=\"docs-review-head-name\">{{ 'DOCS.TABLE.COLUMNS.NAME' | translate }}</span>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"docs-review-row\" *ngFor=\"let row of rows; trackBy: trackById\">\n\t\t\t\t\t<nb-checkbox\n\t\t\t\t\t\t[checked]=\"isSelected(row)\"\n\t\t\t\t\t\t(checkedChange)=\"toggleSelected(row, $event)\"\n\t\t\t\t\t\t[attr.aria-label]=\"row.name\"\n\t\t\t\t\t></nb-checkbox>\n\t\t\t\t\t<gz-docs-name-cell class=\"docs-review-name\" [rowData]=\"row\"></gz-docs-name-cell>\n\t\t\t\t\t<nb-badge\n\t\t\t\t\t\t[status]=\"reasonStatus(row)\"\n\t\t\t\t\t\t[text]=\"\n\t\t\t\t\t\t\t(reasonKey(row) | translate) +\n\t\t\t\t\t\t\t(confidencePercent(row) ? ' \u00B7 ' + confidencePercent(row) : '')\n\t\t\t\t\t\t\"\n\t\t\t\t\t></nb-badge>\n\t\t\t\t\t<gz-docs-source-badge [rowData]=\"row\"></gz-docs-source-badge>\n\t\t\t\t\t<gz-docs-category-chips [rowData]=\"row\"></gz-docs-category-chips>\n\t\t\t\t\t<span class=\"docs-review-date\">{{ row.updatedAt | date : 'medium' }}</span>\n\t\t\t\t\t<span class=\"docs-review-actions\">\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t(click)=\"openDetails(row)\"\n\t\t\t\t\t\t\t[nbTooltip]=\"'DOCS.PREVIEW.OPEN_DETAILS' | translate\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<nb-icon icon=\"info-outline\"></nb-icon>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t*ngIf=\"row.kind === kindEnum.FILE\"\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t(click)=\"openPreview(row)\"\n\t\t\t\t\t\t\t[nbTooltip]=\"'DOCS.PREVIEW.TITLE' | translate\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<nb-icon icon=\"eye-outline\"></nb-icon>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<ng-template [ngxPermissionsOnly]=\"docsPermissions.review\">\n\t\t\t\t\t\t\t<button nbButton size=\"tiny\" status=\"success\" (click)=\"approve(row)\">\n\t\t\t\t\t\t\t\t{{ 'DOCS.REVIEW.APPROVE' | translate }}\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t<button nbButton size=\"tiny\" status=\"danger\" appearance=\"outline\" (click)=\"reject(row)\">\n\t\t\t\t\t\t\t\t{{ 'DOCS.REVIEW.REJECT' | translate }}\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</ng-template>\n\t\t\t\t\t</span>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</ng-container>\n\n\t\t<ng-template #emptyState>\n\t\t\t<div [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" class=\"docs-review-empty-host\">\n\t\t\t\t<gz-docs-empty-state *ngIf=\"!loading\" [variant]=\"error ? 'error' : 'review-empty'\" (primaryAction)=\"load()\"></gz-docs-empty-state>\n\t\t\t</div>\n\t\t</ng-template>\n\t</ng-container>\n</div>\n", styles: [".docs-review{display:flex;flex-direction:column;gap:var(--docs-section-gap, 1rem);padding:var(--docs-page-padding, 1.25rem);color:var(--docs-text, var(--text-basic-color))}.docs-review-header{display:flex;align-items:center;justify-content:space-between;gap:.75rem;min-height:var(--gauzy-page-title-row-height, 2.125rem)}.docs-review-header h4{flex:1 1 auto;min-width:0;margin:0;font-size:var(--docs-title-size, 1rem);font-weight:var(--docs-title-weight, 600);line-height:var(--gauzy-page-title-line-height, 1.5rem);letter-spacing:var(--gauzy-page-title-letter-spacing, -.01em);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-review-header button[nbButton]{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:var(--docs-control-height, 2rem);height:var(--docs-control-height, 2rem);padding:0;border-radius:var(--docs-radius, .375rem)}.docs-review-header button[nbButton] nb-icon{margin:0;font-size:1rem}.docs-review-list{border-radius:var(--docs-radius-lg, .5rem);background:var(--docs-surface, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--docs-hairline, rgba(126, 126, 143, .18));overflow-x:auto}.docs-review-row{display:grid;grid-template-columns:2.5rem minmax(0,2fr) auto auto minmax(0,1fr) auto auto;align-items:center;gap:.5rem .75rem;padding:.5rem .75rem;border-bottom:1px solid var(--docs-hairline, rgba(126, 126, 143, .18));font-size:var(--docs-body-size, .8125rem)}.docs-review-row:last-child{border-bottom:0}.docs-review-row>nb-checkbox{justify-self:center}.docs-review-row .docs-review-name{min-width:0}.docs-review-row .docs-review-date{font-size:var(--docs-meta-size, .75rem);color:var(--docs-text-muted, var(--text-hint-color));white-space:nowrap}.docs-review-row .docs-review-actions{display:inline-flex;align-items:center;gap:.25rem}.docs-review-row button[nbButton]{display:inline-flex;align-items:center;gap:.25rem;height:var(--docs-control-height-sm, 1.75rem);min-height:var(--docs-control-height-sm, 1.75rem);padding-inline:.5rem;border-radius:var(--docs-radius, .375rem);font-size:var(--docs-meta-size, .75rem);white-space:nowrap}.docs-review-row button[nbButton] nb-icon{margin:0;font-size:.875rem}.docs-review-row .docs-review-actions button[nbButton]:has(nb-icon:only-child){width:var(--docs-control-height-sm, 1.75rem);padding-inline:0}.docs-review-row:not(.docs-review-row-head):hover{background:var(--docs-hover, rgba(126, 126, 143, .12))}.docs-review-row ::ng-deep nb-badge{position:static;display:inline-flex;align-items:center;max-width:100%;height:var(--gauzy-table-badge-height, 1.25rem);padding:0 var(--gauzy-table-chip-padding-x, .375rem);border-radius:var(--docs-radius, .375rem);font-size:var(--gauzy-table-chip-font-size, .6875rem);line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transform:none}.docs-review-row.docs-review-row-head{grid-template-columns:2.5rem minmax(0,1fr);font-size:var(--docs-label-size, .6875rem);font-weight:600;letter-spacing:.02em;color:var(--docs-text-muted, var(--text-hint-color));text-transform:uppercase;border-bottom-color:var(--docs-hairline, rgba(126, 126, 143, .18))}.docs-review-empty-host{display:block;min-height:12rem;border-radius:var(--docs-radius-lg, .5rem);background:var(--docs-surface, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--docs-hairline, rgba(126, 126, 143, .18))}@media(max-width:991px){.docs-review-row{grid-template-columns:2.5rem minmax(0,1fr)}.docs-review-row .docs-review-actions{grid-column:1/-1;justify-content:flex-end;flex-wrap:wrap}.docs-review-row>gz-docs-source-badge,.docs-review-row>gz-docs-category-chips,.docs-review-row>.docs-review-date,.docs-review-row>nb-badge{grid-column:2/-1}}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.DocumentsService }, { type: i3.ToastrService }, { type: i4.NbDialogService }, { type: i5.Actions }, { type: i3.Store }] });
//# sourceMappingURL=review-page.component.js.map