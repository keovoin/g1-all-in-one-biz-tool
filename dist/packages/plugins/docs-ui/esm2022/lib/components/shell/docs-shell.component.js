import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Actions } from '@ngneat/effects-ng';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { TranslateService } from '@ngx-translate/core';
import { DocumentsActions } from '../../+state/documents.actions';
import { DocumentsQuery } from '../../+state/documents.query';
import { DocsPreviewModalComponent } from '../preview/docs-preview-modal.component';
import { DOCS_PREVIEW_DIALOG_CONFIG, DOCS_TREE_COLLAPSED_KEY } from '../../docs.constants';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/router";
import * as i3 from "@ngneat/effects-ng";
import * as i4 from "../../+state/documents.query";
import * as i5 from "@nebular/theme";
import * as i6 from "@angular/common";
import * as i7 from "../tree/docs-tree.component";
import * as i8 from "../detail/docs-detail-panel.component";
/**
 * Shell for /pages/documents: in-page left tree column (collapsible, state in
 * localStorage), content router-outlet, and the detail side panel host. The
 * detail panel is not a route — it is `?id=<documentId>` on the current URL.
 */
let DocsShellComponent = class DocsShellComponent extends TranslationBaseComponent {
    constructor(translateService, route, router, actions, documentsQuery, dialogService) {
        super(translateService);
        this.translateService = translateService;
        this.route = route;
        this.router = router;
        this.actions = actions;
        this.documentsQuery = documentsQuery;
        this.dialogService = dialogService;
        this.treeCollapsed = false;
        this.detailId$ = this.documentsQuery.detailId$;
    }
    ngOnInit() {
        this.treeCollapsed = localStorage.getItem(DOCS_TREE_COLLAPSED_KEY) === 'true';
        // URL ?id= is the source of truth for the open detail panel.
        this.route.queryParamMap
            .pipe(map((params) => params.get('id')), distinctUntilChanged(), untilDestroyed(this))
            .subscribe((id) => {
            const current = this.documentsQuery.detailId;
            if (id && String(current) !== id) {
                this.actions.dispatch(DocumentsActions.detailOpened(id));
            }
            else if (!id && current) {
                this.actions.dispatch(DocumentsActions.detailClosed());
            }
        });
    }
    toggleTree() {
        this.treeCollapsed = !this.treeCollapsed;
        localStorage.setItem(DOCS_TREE_COLLAPSED_KEY, String(this.treeCollapsed));
    }
    onDetailClosed() {
        this.actions.dispatch(DocumentsActions.detailClosed());
    }
    /**
     * Every panel edit — taxonomy chips, archive/unarchive, knowledge toggle,
     * reprocess, extracted-text save, share/visibility — lands here.
     *
     * The panel used to emit into nothing: the row behind it kept the values it was
     * listed with, and the facets and preset counts (which are what the filter bar
     * and the "Needs review" / "Not in knowledge" chips are derived from) went
     * stale until the next full reload. `rowChanged` patches the row in place and
     * `refreshFacets` re-counts, exactly as the panel's own review-request path
     * already did for itself.
     */
    onDetailChanged(document) {
        if (!document)
            return;
        this.actions.dispatch(DocumentsActions.rowChanged(document));
        this.actions.dispatch(DocumentsActions.refreshFacets());
    }
    /**
     * The document behind the open panel is gone. `rowRemoved` drops it from the
     * list and — because the effect closes a detail panel pointing at the removed
     * id — also closes this panel, so nothing is left pointing at a 404.
     */
    onDetailDeleted(id) {
        if (!id)
            return;
        this.actions.dispatch(DocumentsActions.rowRemoved(id));
        this.actions.dispatch(DocumentsActions.refreshFacets());
    }
    onOpenEditor(id) {
        this.router.navigate(['page', id], { relativeTo: this.route });
    }
    onOpenPreview(document) {
        this.dialogService.open(DocsPreviewModalComponent, { ...DOCS_PREVIEW_DIALOG_CONFIG, context: { document } });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsShellComponent, deps: [{ token: i1.TranslateService }, { token: i2.ActivatedRoute }, { token: i2.Router }, { token: i3.Actions }, { token: i4.DocumentsQuery }, { token: i5.NbDialogService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DocsShellComponent, isStandalone: false, selector: "gz-docs-shell", usesInheritance: true, ngImport: i0, template: "<div class=\"docs-shell\">\n\t<aside class=\"docs-tree-column\" [class.collapsed]=\"treeCollapsed\" [attr.aria-label]=\"'DOCS.A11Y.TREE_LABEL' | translate\">\n\t\t<div class=\"docs-tree-column-header\">\n\t\t\t<span class=\"docs-tree-column-title\" *ngIf=\"!treeCollapsed\" aria-hidden=\"true\">\n\t\t\t\t{{ 'DOCS.TREE.ALL_DOCUMENTS' | translate }}\n\t\t\t</span>\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"tiny\"\n\t\t\t\tclass=\"docs-tree-column-toggle\"\n\t\t\t\t(click)=\"toggleTree()\"\n\t\t\t\t[nbTooltip]=\"(treeCollapsed ? 'DOCS.TREE.EXPAND_SIDEBAR' : 'DOCS.TREE.COLLAPSE_SIDEBAR') | translate\"\n\t\t\t\t[attr.aria-label]=\"(treeCollapsed ? 'DOCS.TREE.EXPAND_SIDEBAR' : 'DOCS.TREE.COLLAPSE_SIDEBAR') | translate\"\n\t\t\t>\n\t\t\t\t<nb-icon [icon]=\"treeCollapsed ? 'chevron-right-outline' : 'chevron-left-outline'\"></nb-icon>\n\t\t\t</button>\n\t\t</div>\n\t\t<gz-docs-tree *ngIf=\"!treeCollapsed\"></gz-docs-tree>\n\t</aside>\n\n\t<main class=\"docs-content\">\n\t\t<router-outlet></router-outlet>\n\t</main>\n\n\t<!-- `<aside>` already exposes the implicit `complementary` role \u2014 no explicit role needed. -->\n\t<aside\n\t\tclass=\"docs-detail-column\"\n\t\t*ngIf=\"detailId$ | async as detailId\"\n\t\t[attr.aria-label]=\"'DOCS.A11Y.DETAIL_PANEL_LABEL' | translate\"\n\t>\n\t\t<gz-docs-detail-panel\n\t\t\t[documentId]=\"detailId\"\n\t\t\t(closed)=\"onDetailClosed()\"\n\t\t\t(changed)=\"onDetailChanged($event)\"\n\t\t\t(deleted)=\"onDetailDeleted($event)\"\n\t\t\t(openEditor)=\"onOpenEditor($event)\"\n\t\t\t(openPreview)=\"onOpenPreview($event)\"\n\t\t></gz-docs-detail-panel>\n\t</aside>\n</div>\n", styles: [":host{display:block;height:100%}.docs-shell{--docs-detail-width: 26rem;--docs-tree-width: 15.5rem;--docs-tree-collapsed-width: 2.25rem;--docs-page-padding: 1.25rem;--docs-section-gap: 1rem;--docs-row-gap: .5rem;--docs-radius: var(--gauzy-radius-sm, .375rem);--docs-radius-lg: var(--border-radius, .5rem);--docs-surface: var(--gauzy-card-1, var(--background-basic-color-1));--docs-surface-sunken: var(--background-basic-color-2);--docs-hairline: var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));--docs-hover: var(--gauzy-hover-tint, rgba(126, 126, 143, .12));--docs-active: var(--gauzy-active-tint, rgba(126, 126, 143, .2));--docs-control-height: var(--gauzy-header-control-height, 2rem);--docs-control-height-sm: 1.75rem;--docs-title-size: var(--gauzy-page-title-font-size, 1rem);--docs-title-weight: var(--gauzy-page-title-font-weight, 600);--docs-body-size: .8125rem;--docs-meta-size: .75rem;--docs-label-size: .6875rem;--docs-text: var(--text-basic-color);--docs-text-muted: var(--gauzy-text-color-2, var(--text-hint-color));display:flex;align-items:stretch;height:100%;min-height:0;position:relative}.docs-tree-column{flex:0 0 var(--docs-tree-width, 15.5rem);min-width:0;display:flex;flex-direction:column;gap:.25rem;padding:.75rem .75rem .75rem 0;border-right:1px solid var(--docs-hairline, rgba(126, 126, 143, .18));overflow-y:auto;overscroll-behavior:contain}.docs-tree-column.collapsed{flex-basis:var(--docs-tree-collapsed-width, 2.25rem);padding-inline:0;overflow:hidden}.docs-tree-column .docs-tree-column-header{display:flex;align-items:center;justify-content:space-between;gap:.25rem;min-height:var(--gauzy-page-title-row-height, 2.125rem);padding-inline-start:.375rem}.docs-tree-column .docs-tree-column-title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:var(--docs-label-size, .6875rem);font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--docs-text-muted, var(--text-hint-color))}.docs-tree-column .docs-tree-column-toggle{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:1.5rem;height:1.5rem;padding:0;border-radius:var(--docs-radius, .375rem)}.docs-tree-column .docs-tree-column-toggle nb-icon{margin:0;font-size:.875rem}.docs-tree-column.collapsed .docs-tree-column-header{justify-content:center;padding-inline-start:0}.docs-tree-column{scrollbar-width:thin;scrollbar-color:var(--gauzy-scrollbar, rgba(126, 126, 143, .35)) transparent}.docs-tree-column::-webkit-scrollbar{width:.375rem}.docs-tree-column::-webkit-scrollbar-thumb{border-radius:1rem;background:var(--gauzy-scrollbar, rgba(126, 126, 143, .35))}.docs-tree-column::-webkit-scrollbar-track{background:transparent}.docs-content{flex:1 1 auto;min-width:0;overflow-y:auto;overscroll-behavior:contain}.docs-detail-column{flex:0 0 var(--docs-detail-width, 26rem);min-width:0;border-left:1px solid var(--docs-hairline, rgba(126, 126, 143, .18));overflow-y:auto;overscroll-behavior:contain}@media(min-width:1800px){.docs-shell{--docs-detail-width: 30rem}}@media(max-width:1200px){.docs-tree-column{flex-basis:var(--docs-tree-collapsed-width, 2.25rem)}.docs-tree-column:not(.collapsed){flex-basis:13.5rem}.docs-detail-column{position:absolute;right:0;top:0;bottom:0;z-index:10;background:var(--docs-surface, var(--background-basic-color-1));box-shadow:0 0 0 1px var(--docs-hairline, rgba(126, 126, 143, .18)),var(--shadow)}}@media(max-width:900px){.docs-shell{--docs-page-padding: 1rem;--docs-section-gap: .875rem}.docs-detail-column{flex-basis:100%;left:0;width:auto}}@media(max-width:600px){.docs-shell{--docs-page-padding: .75rem}.docs-tree-column{flex-basis:var(--docs-tree-collapsed-width, 2.25rem)}.docs-tree-column:not(.collapsed){flex-basis:12rem}}\n"], dependencies: [{ kind: "directive", type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.RouterOutlet, selector: "router-outlet", inputs: ["name", "routerOutletData"], outputs: ["activate", "deactivate", "attach", "detach"], exportAs: ["outlet"] }, { kind: "component", type: i5.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i5.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i5.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "component", type: i7.DocsTreeComponent, selector: "gz-docs-tree" }, { kind: "component", type: i8.DocsDetailPanelComponent, selector: "gz-docs-detail-panel", inputs: ["documentId"], outputs: ["closed", "changed", "deleted", "openEditor", "openPreview"] }, { kind: "pipe", type: i6.AsyncPipe, name: "async" }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
DocsShellComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        ActivatedRoute,
        Router,
        Actions,
        DocumentsQuery,
        NbDialogService])
], DocsShellComponent);
export { DocsShellComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsShellComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-shell', standalone: false, template: "<div class=\"docs-shell\">\n\t<aside class=\"docs-tree-column\" [class.collapsed]=\"treeCollapsed\" [attr.aria-label]=\"'DOCS.A11Y.TREE_LABEL' | translate\">\n\t\t<div class=\"docs-tree-column-header\">\n\t\t\t<span class=\"docs-tree-column-title\" *ngIf=\"!treeCollapsed\" aria-hidden=\"true\">\n\t\t\t\t{{ 'DOCS.TREE.ALL_DOCUMENTS' | translate }}\n\t\t\t</span>\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"tiny\"\n\t\t\t\tclass=\"docs-tree-column-toggle\"\n\t\t\t\t(click)=\"toggleTree()\"\n\t\t\t\t[nbTooltip]=\"(treeCollapsed ? 'DOCS.TREE.EXPAND_SIDEBAR' : 'DOCS.TREE.COLLAPSE_SIDEBAR') | translate\"\n\t\t\t\t[attr.aria-label]=\"(treeCollapsed ? 'DOCS.TREE.EXPAND_SIDEBAR' : 'DOCS.TREE.COLLAPSE_SIDEBAR') | translate\"\n\t\t\t>\n\t\t\t\t<nb-icon [icon]=\"treeCollapsed ? 'chevron-right-outline' : 'chevron-left-outline'\"></nb-icon>\n\t\t\t</button>\n\t\t</div>\n\t\t<gz-docs-tree *ngIf=\"!treeCollapsed\"></gz-docs-tree>\n\t</aside>\n\n\t<main class=\"docs-content\">\n\t\t<router-outlet></router-outlet>\n\t</main>\n\n\t<!-- `<aside>` already exposes the implicit `complementary` role \u2014 no explicit role needed. -->\n\t<aside\n\t\tclass=\"docs-detail-column\"\n\t\t*ngIf=\"detailId$ | async as detailId\"\n\t\t[attr.aria-label]=\"'DOCS.A11Y.DETAIL_PANEL_LABEL' | translate\"\n\t>\n\t\t<gz-docs-detail-panel\n\t\t\t[documentId]=\"detailId\"\n\t\t\t(closed)=\"onDetailClosed()\"\n\t\t\t(changed)=\"onDetailChanged($event)\"\n\t\t\t(deleted)=\"onDetailDeleted($event)\"\n\t\t\t(openEditor)=\"onOpenEditor($event)\"\n\t\t\t(openPreview)=\"onOpenPreview($event)\"\n\t\t></gz-docs-detail-panel>\n\t</aside>\n</div>\n", styles: [":host{display:block;height:100%}.docs-shell{--docs-detail-width: 26rem;--docs-tree-width: 15.5rem;--docs-tree-collapsed-width: 2.25rem;--docs-page-padding: 1.25rem;--docs-section-gap: 1rem;--docs-row-gap: .5rem;--docs-radius: var(--gauzy-radius-sm, .375rem);--docs-radius-lg: var(--border-radius, .5rem);--docs-surface: var(--gauzy-card-1, var(--background-basic-color-1));--docs-surface-sunken: var(--background-basic-color-2);--docs-hairline: var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));--docs-hover: var(--gauzy-hover-tint, rgba(126, 126, 143, .12));--docs-active: var(--gauzy-active-tint, rgba(126, 126, 143, .2));--docs-control-height: var(--gauzy-header-control-height, 2rem);--docs-control-height-sm: 1.75rem;--docs-title-size: var(--gauzy-page-title-font-size, 1rem);--docs-title-weight: var(--gauzy-page-title-font-weight, 600);--docs-body-size: .8125rem;--docs-meta-size: .75rem;--docs-label-size: .6875rem;--docs-text: var(--text-basic-color);--docs-text-muted: var(--gauzy-text-color-2, var(--text-hint-color));display:flex;align-items:stretch;height:100%;min-height:0;position:relative}.docs-tree-column{flex:0 0 var(--docs-tree-width, 15.5rem);min-width:0;display:flex;flex-direction:column;gap:.25rem;padding:.75rem .75rem .75rem 0;border-right:1px solid var(--docs-hairline, rgba(126, 126, 143, .18));overflow-y:auto;overscroll-behavior:contain}.docs-tree-column.collapsed{flex-basis:var(--docs-tree-collapsed-width, 2.25rem);padding-inline:0;overflow:hidden}.docs-tree-column .docs-tree-column-header{display:flex;align-items:center;justify-content:space-between;gap:.25rem;min-height:var(--gauzy-page-title-row-height, 2.125rem);padding-inline-start:.375rem}.docs-tree-column .docs-tree-column-title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:var(--docs-label-size, .6875rem);font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--docs-text-muted, var(--text-hint-color))}.docs-tree-column .docs-tree-column-toggle{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:1.5rem;height:1.5rem;padding:0;border-radius:var(--docs-radius, .375rem)}.docs-tree-column .docs-tree-column-toggle nb-icon{margin:0;font-size:.875rem}.docs-tree-column.collapsed .docs-tree-column-header{justify-content:center;padding-inline-start:0}.docs-tree-column{scrollbar-width:thin;scrollbar-color:var(--gauzy-scrollbar, rgba(126, 126, 143, .35)) transparent}.docs-tree-column::-webkit-scrollbar{width:.375rem}.docs-tree-column::-webkit-scrollbar-thumb{border-radius:1rem;background:var(--gauzy-scrollbar, rgba(126, 126, 143, .35))}.docs-tree-column::-webkit-scrollbar-track{background:transparent}.docs-content{flex:1 1 auto;min-width:0;overflow-y:auto;overscroll-behavior:contain}.docs-detail-column{flex:0 0 var(--docs-detail-width, 26rem);min-width:0;border-left:1px solid var(--docs-hairline, rgba(126, 126, 143, .18));overflow-y:auto;overscroll-behavior:contain}@media(min-width:1800px){.docs-shell{--docs-detail-width: 30rem}}@media(max-width:1200px){.docs-tree-column{flex-basis:var(--docs-tree-collapsed-width, 2.25rem)}.docs-tree-column:not(.collapsed){flex-basis:13.5rem}.docs-detail-column{position:absolute;right:0;top:0;bottom:0;z-index:10;background:var(--docs-surface, var(--background-basic-color-1));box-shadow:0 0 0 1px var(--docs-hairline, rgba(126, 126, 143, .18)),var(--shadow)}}@media(max-width:900px){.docs-shell{--docs-page-padding: 1rem;--docs-section-gap: .875rem}.docs-detail-column{flex-basis:100%;left:0;width:auto}}@media(max-width:600px){.docs-shell{--docs-page-padding: .75rem}.docs-tree-column{flex-basis:var(--docs-tree-collapsed-width, 2.25rem)}.docs-tree-column:not(.collapsed){flex-basis:12rem}}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.ActivatedRoute }, { type: i2.Router }, { type: i3.Actions }, { type: i4.DocumentsQuery }, { type: i5.NbDialogService }] });
//# sourceMappingURL=docs-shell.component.js.map