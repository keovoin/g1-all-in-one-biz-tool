import { __decorate, __metadata } from "tslib";
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DOCS_SAVED_VIEW_NAME_MAX, DOCS_SAVED_VIEWS_LIMIT } from '../../docs.constants';
import { DocsSavedViewsService } from '../../services/docs-saved-views.service';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "../../services/docs-saved-views.service";
import * as i3 from "@angular/common";
import * as i4 from "@angular/forms";
import * as i5 from "@nebular/theme";
/** Ideal panel width; it narrows on a viewport that cannot hold it. */
const PANEL_WIDTH_PX = 288;
/** Breathing room kept between the panel and every viewport edge. */
const VIEWPORT_MARGIN_PX = 8;
/** Gap between the trigger and the panel it opens. */
const TRIGGER_GAP_PX = 6;
/** Below this much room underneath the trigger, the panel opens upwards. */
const MIN_PANEL_HEIGHT_PX = 200;
/**
 * Saved filter views control in the filter bar (`01-ux-spec.md` §5, M5).
 *
 * Device-local only: the service writes `localStorage` and nothing here talks to
 * the API. The component owns just the popover UI — save current view, apply,
 * rename, delete — and emits the query-param patch the browse page merges into
 * the URL, keeping §5.1's "URL is the single source of truth" contract intact.
 *
 * The panel is `position: fixed` and measured off the trigger on open (and on
 * any scroll or resize while open), so it takes part in no ancestor's overflow,
 * stays clamped into the viewport and flips above the trigger when the room
 * below runs out.
 */
let SavedViewsComponent = class SavedViewsComponent extends TranslationBaseComponent {
    constructor(translateService, savedViews, host) {
        super(translateService);
        this.translateService = translateService;
        this.savedViews = savedViews;
        this.host = host;
        /** Current URL query params — what "Save current view" captures. */
        this.params = {};
        /** Emits the merge patch that applies a view (see `toApplyPatch`). */
        this.applyView = new EventEmitter();
        this.views = [];
        this.open = false;
        this.draftName = '';
        /** Id of the row currently being renamed inline (null = none). */
        this.renamingId = null;
        this.renameDraft = '';
        /** Resolved `position: fixed` box for the panel. */
        this.panelStyle = {};
        this.nameMaxLength = DOCS_SAVED_VIEW_NAME_MAX;
        this.limit = DOCS_SAVED_VIEWS_LIMIT;
        /** Registered in the capture phase: scroll does not bubble to `window`. */
        this.onAnyScroll = () => this.reposition();
    }
    ngOnInit() {
        this.savedViews.views$.pipe(untilDestroyed(this)).subscribe((views) => (this.views = views));
        this.savedViews.refresh();
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', this.onAnyScroll, true);
        }
    }
    ngOnDestroy() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('scroll', this.onAnyScroll, true);
        }
    }
    toggle() {
        this.open = !this.open;
        if (this.open) {
            this.savedViews.refresh();
            this.draftName = '';
            this.cancelRename();
            this.reposition();
        }
    }
    /** An outside click closes the panel. */
    onDocumentClick(event) {
        if (!this.open)
            return;
        const target = event.target;
        if (target && this.host.nativeElement.contains(target))
            return;
        this.open = false;
    }
    onEscape() {
        if (!this.open)
            return;
        this.open = false;
        this.triggerRef?.nativeElement?.focus();
    }
    reposition() {
        const trigger = this.triggerRef?.nativeElement;
        if (!this.open || !trigger || typeof window === 'undefined')
            return;
        const rect = trigger.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const width = Math.min(PANEL_WIDTH_PX, viewportWidth - VIEWPORT_MARGIN_PX * 2);
        const left = Math.min(Math.max(VIEWPORT_MARGIN_PX, rect.right - width), viewportWidth - width - VIEWPORT_MARGIN_PX);
        const roomBelow = viewportHeight - rect.bottom - TRIGGER_GAP_PX - VIEWPORT_MARGIN_PX;
        const roomAbove = rect.top - TRIGGER_GAP_PX - VIEWPORT_MARGIN_PX;
        const flipUp = roomBelow < MIN_PANEL_HEIGHT_PX && roomAbove > roomBelow;
        // The room on the side we actually chose. `MIN_PANEL_HEIGHT_PX` is the FLIP
        // threshold, not a layout minimum: using it as a floor for `max-height` made the
        // panel taller than the viewport when neither side had 200px (short window, or a
        // trigger near the middle) — the panel scrolls internally instead.
        const room = Math.max(0, flipUp ? roomAbove : roomBelow);
        this.panelStyle = {
            width: `${width}px`,
            left: `${left}px`,
            ...(flipUp
                ? { bottom: `${viewportHeight - rect.top + TRIGGER_GAP_PX}px` }
                : { top: `${rect.bottom + TRIGGER_GAP_PX}px` }),
            maxHeight: `${room}px`
        };
    }
    get atLimit() {
        return this.views.length >= this.limit;
    }
    /** True when the given view describes exactly the filters currently in the URL. */
    isActive(view) {
        return this.savedViews.matches(view, this.params ?? {});
    }
    /** Label for the trigger button: the matching view's name, or the generic label. */
    get activeLabel() {
        const active = this.views.find((view) => this.isActive(view));
        return active?.name ?? this.getTranslation('DOCS.SAVED_VIEWS.LABEL');
    }
    // ─── Mutations ───────────────────────────────────────────────
    save() {
        const name = this.draftName.trim();
        if (!name)
            return;
        // Saving under an existing name overwrites it — see the service doc.
        const saved = this.savedViews.save(name, this.params ?? {});
        if (saved)
            this.draftName = '';
    }
    apply(view) {
        this.applyView.emit(this.savedViews.toApplyPatch(view));
        this.open = false;
    }
    startRename(view, event) {
        event.stopPropagation();
        this.renamingId = view.id;
        this.renameDraft = view.name;
    }
    commitRename(view) {
        const name = this.renameDraft.trim();
        if (name && name !== view.name)
            this.savedViews.rename(view.id, name);
        this.cancelRename();
    }
    cancelRename() {
        this.renamingId = null;
        this.renameDraft = '';
    }
    remove(view, event) {
        event.stopPropagation();
        this.savedViews.remove(view.id);
        if (this.renamingId === view.id)
            this.cancelRename();
    }
    trackView(_, view) {
        return view.id;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SavedViewsComponent, deps: [{ token: i1.TranslateService }, { token: i2.DocsSavedViewsService }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: SavedViewsComponent, isStandalone: false, selector: "gz-docs-saved-views", inputs: { params: "params" }, outputs: { applyView: "applyView" }, host: { listeners: { "document:click": "onDocumentClick($event)", "document:keydown.escape": "onEscape()", "window:resize": "reposition()" } }, viewQueries: [{ propertyName: "triggerRef", first: true, predicate: ["trigger"], descendants: true, read: ElementRef }], usesInheritance: true, ngImport: i0, template: "<div class=\"docs-saved-views\">\n\t<button\n\t\t#trigger\n\t\tnbButton\n\t\tghost\n\t\tsize=\"small\"\n\t\ttype=\"button\"\n\t\t[class.active]=\"open\"\n\t\t[attr.aria-expanded]=\"open\"\n\t\t[nbTooltip]=\"'DOCS.SAVED_VIEWS.TOOLTIP' | translate\"\n\t\t(click)=\"toggle()\"\n\t>\n\t\t<nb-icon icon=\"bookmark-outline\"></nb-icon>\n\t\t<span class=\"docs-saved-views-trigger-label\">{{ activeLabel }}</span>\n\t\t<nb-icon [icon]=\"open ? 'chevron-up-outline' : 'chevron-down-outline'\" size=\"tiny\"></nb-icon>\n\t</button>\n\n\t<div class=\"docs-saved-views-panel\" *ngIf=\"open\" role=\"menu\" [ngStyle]=\"panelStyle\">\n\t\t<!-- Save current view -->\n\t\t<div class=\"docs-saved-views-save\">\n\t\t\t<input\n\t\t\t\tnbInput\n\t\t\t\tfieldSize=\"small\"\n\t\t\t\ttype=\"text\"\n\t\t\t\tid=\"docs-saved-view-name\"\n\t\t\t\t[maxlength]=\"nameMaxLength\"\n\t\t\t\t[placeholder]=\"'DOCS.SAVED_VIEWS.NAME_PLACEHOLDER' | translate\"\n\t\t\t\t[attr.aria-label]=\"'DOCS.SAVED_VIEWS.NAME_PLACEHOLDER' | translate\"\n\t\t\t\t[(ngModel)]=\"draftName\"\n\t\t\t\t(keydown.enter)=\"save()\"\n\t\t\t/>\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tsize=\"tiny\"\n\t\t\t\tstatus=\"primary\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[disabled]=\"!draftName.trim() || atLimit\"\n\t\t\t\t(click)=\"save()\"\n\t\t\t>\n\t\t\t\t{{ 'DOCS.SAVED_VIEWS.SAVE' | translate }}\n\t\t\t</button>\n\t\t</div>\n\t\t<p class=\"docs-saved-views-hint\">{{ 'DOCS.SAVED_VIEWS.SAVE_HINT' | translate }}</p>\n\t\t<p class=\"docs-saved-views-hint warn\" *ngIf=\"atLimit\">\n\t\t\t{{ 'DOCS.SAVED_VIEWS.LIMIT_REACHED' | translate : { max: limit } }}\n\t\t</p>\n\n\t\t<hr />\n\n\t\t<!-- Stored views -->\n\t\t<p class=\"docs-saved-views-hint\" *ngIf=\"!views.length\">{{ 'DOCS.SAVED_VIEWS.EMPTY' | translate }}</p>\n\n\t\t<ul class=\"docs-saved-views-list\" *ngIf=\"views.length\">\n\t\t\t<li class=\"docs-saved-views-item\" *ngFor=\"let view of views; trackBy: trackView\">\n\t\t\t\t<!-- Inline rename -->\n\t\t\t\t<ng-container *ngIf=\"renamingId === view.id; else viewRow\">\n\t\t\t\t\t<!-- Only one row can be in rename mode at a time, so the id stays unique. -->\n\t\t\t\t\t<!-- Esc stops here: the component also closes the whole panel on a\n\t\t\t\t\t     document-level Esc, so the rename would take the panel with it. -->\n\t\t\t\t\t<input\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\tfieldSize=\"tiny\"\n\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\tid=\"docs-saved-view-rename\"\n\t\t\t\t\t\t[maxlength]=\"nameMaxLength\"\n\t\t\t\t\t\t[attr.aria-label]=\"'DOCS.SAVED_VIEWS.RENAME' | translate\"\n\t\t\t\t\t\t[(ngModel)]=\"renameDraft\"\n\t\t\t\t\t\t(keydown.enter)=\"commitRename(view)\"\n\t\t\t\t\t\t(keydown.escape)=\"cancelRename(); $event.stopPropagation()\"\n\t\t\t\t\t/>\n\t\t\t\t\t<button nbButton ghost size=\"tiny\" type=\"button\" (click)=\"commitRename(view)\">\n\t\t\t\t\t\t<nb-icon icon=\"checkmark-outline\"></nb-icon>\n\t\t\t\t\t</button>\n\t\t\t\t\t<button nbButton ghost size=\"tiny\" type=\"button\" (click)=\"cancelRename()\">\n\t\t\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t\t\t</button>\n\t\t\t\t</ng-container>\n\n\t\t\t\t<ng-template #viewRow>\n\t\t\t\t\t<button\n\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\tclass=\"docs-saved-views-apply\"\n\t\t\t\t\t\trole=\"menuitem\"\n\t\t\t\t\t\t[class.active]=\"isActive(view)\"\n\t\t\t\t\t\t(click)=\"apply(view)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-icon *ngIf=\"isActive(view)\" icon=\"checkmark-outline\" size=\"tiny\"></nb-icon>\n\t\t\t\t\t\t<span>{{ view.name }}</span>\n\t\t\t\t\t</button>\n\t\t\t\t\t<button\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tghost\n\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t[nbTooltip]=\"'DOCS.SAVED_VIEWS.RENAME' | translate\"\n\t\t\t\t\t\t(click)=\"startRename(view, $event)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-icon icon=\"edit-outline\"></nb-icon>\n\t\t\t\t\t</button>\n\t\t\t\t\t<button\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tghost\n\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\tstatus=\"danger\"\n\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t[nbTooltip]=\"'DOCS.SAVED_VIEWS.DELETE' | translate\"\n\t\t\t\t\t\t(click)=\"remove(view, $event)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-icon icon=\"trash-2-outline\"></nb-icon>\n\t\t\t\t\t</button>\n\t\t\t\t</ng-template>\n\t\t\t</li>\n\t\t</ul>\n\t</div>\n</div>\n", styles: [".docs-saved-views{position:relative;display:inline-block;min-width:0}.docs-saved-views>button[nbButton]{display:inline-flex;align-items:center;gap:.375rem;max-width:12rem;height:var(--docs-filter-control-height, var(--docs-control-height-sm, 1.75rem));min-height:var(--docs-filter-control-height, var(--docs-control-height-sm, 1.75rem));padding-inline:.5rem;border-radius:var(--docs-radius, .375rem);font-size:var(--docs-meta-size, .75rem);white-space:nowrap;overflow:hidden}.docs-saved-views>button[nbButton] .docs-saved-views-trigger-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-saved-views>button[nbButton] nb-icon{flex:0 0 auto;margin:0;font-size:.875rem}.docs-saved-views-panel{position:fixed;z-index:1010;display:flex;flex-direction:column;overflow-y:auto;min-width:16rem;max-width:calc(100vw - 1rem);padding:.625rem;border:0;border-radius:var(--docs-radius-lg, .5rem);background:var(--docs-surface, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--docs-hairline, rgba(126, 126, 143, .18)),var(--shadow);font-size:var(--docs-body-size, .8125rem)}.docs-saved-views-panel hr{margin:.625rem 0;border:0;border-top:1px solid var(--docs-hairline, rgba(126, 126, 143, .18))}.docs-saved-views-panel button[nbButton]{display:inline-flex;align-items:center;justify-content:center;gap:.25rem;height:var(--docs-control-height-sm, 1.75rem);min-height:var(--docs-control-height-sm, 1.75rem);padding-inline:.5rem;border-radius:var(--docs-radius, .375rem);font-size:var(--docs-meta-size, .75rem);white-space:nowrap}.docs-saved-views-panel button[nbButton] nb-icon{margin:0;font-size:.875rem}.docs-saved-views-panel .docs-saved-views-item button[nbButton]{flex:0 0 auto;width:var(--docs-control-height-sm, 1.75rem);padding-inline:0}.docs-saved-views-panel input[nbInput]{height:var(--docs-control-height-sm, 1.75rem);min-height:var(--docs-control-height-sm, 1.75rem);border-radius:var(--docs-radius, .375rem);font-size:var(--docs-meta-size, .75rem)}.docs-saved-views-save{display:flex;align-items:center;gap:.375rem}.docs-saved-views-save input{flex:1 1 auto;min-width:0}.docs-saved-views-hint{margin:.375rem 0 0;font-size:var(--docs-label-size, .6875rem);color:var(--docs-text-muted, var(--text-hint-color))}.docs-saved-views-hint.warn{color:var(--text-warning-color)}.docs-saved-views-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.125rem}.docs-saved-views-item{display:flex;align-items:center;gap:.125rem}.docs-saved-views-item input{flex:1 1 auto;min-width:0}.docs-saved-views-apply{flex:1 1 auto;min-width:0;display:flex;align-items:center;gap:.375rem;min-height:var(--docs-control-height-sm, 1.75rem);padding:.25rem .5rem;border:0;border-radius:var(--docs-radius, .375rem);background:transparent;color:inherit;font-size:var(--docs-body-size, .8125rem);text-align:left;cursor:pointer}.docs-saved-views-apply nb-icon{flex:0 0 auto}.docs-saved-views-apply span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-saved-views-apply:hover{background:var(--docs-hover, rgba(126, 126, 143, .12))}.docs-saved-views-apply.active{font-weight:600;color:var(--text-primary-color)}\n"], dependencies: [{ kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i4.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i4.MaxLengthValidator, selector: "[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]", inputs: ["maxlength"] }, { kind: "directive", type: i4.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i5.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i5.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i5.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "directive", type: i5.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
SavedViewsComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        DocsSavedViewsService,
        ElementRef])
], SavedViewsComponent);
export { SavedViewsComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SavedViewsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-saved-views', standalone: false, template: "<div class=\"docs-saved-views\">\n\t<button\n\t\t#trigger\n\t\tnbButton\n\t\tghost\n\t\tsize=\"small\"\n\t\ttype=\"button\"\n\t\t[class.active]=\"open\"\n\t\t[attr.aria-expanded]=\"open\"\n\t\t[nbTooltip]=\"'DOCS.SAVED_VIEWS.TOOLTIP' | translate\"\n\t\t(click)=\"toggle()\"\n\t>\n\t\t<nb-icon icon=\"bookmark-outline\"></nb-icon>\n\t\t<span class=\"docs-saved-views-trigger-label\">{{ activeLabel }}</span>\n\t\t<nb-icon [icon]=\"open ? 'chevron-up-outline' : 'chevron-down-outline'\" size=\"tiny\"></nb-icon>\n\t</button>\n\n\t<div class=\"docs-saved-views-panel\" *ngIf=\"open\" role=\"menu\" [ngStyle]=\"panelStyle\">\n\t\t<!-- Save current view -->\n\t\t<div class=\"docs-saved-views-save\">\n\t\t\t<input\n\t\t\t\tnbInput\n\t\t\t\tfieldSize=\"small\"\n\t\t\t\ttype=\"text\"\n\t\t\t\tid=\"docs-saved-view-name\"\n\t\t\t\t[maxlength]=\"nameMaxLength\"\n\t\t\t\t[placeholder]=\"'DOCS.SAVED_VIEWS.NAME_PLACEHOLDER' | translate\"\n\t\t\t\t[attr.aria-label]=\"'DOCS.SAVED_VIEWS.NAME_PLACEHOLDER' | translate\"\n\t\t\t\t[(ngModel)]=\"draftName\"\n\t\t\t\t(keydown.enter)=\"save()\"\n\t\t\t/>\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tsize=\"tiny\"\n\t\t\t\tstatus=\"primary\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[disabled]=\"!draftName.trim() || atLimit\"\n\t\t\t\t(click)=\"save()\"\n\t\t\t>\n\t\t\t\t{{ 'DOCS.SAVED_VIEWS.SAVE' | translate }}\n\t\t\t</button>\n\t\t</div>\n\t\t<p class=\"docs-saved-views-hint\">{{ 'DOCS.SAVED_VIEWS.SAVE_HINT' | translate }}</p>\n\t\t<p class=\"docs-saved-views-hint warn\" *ngIf=\"atLimit\">\n\t\t\t{{ 'DOCS.SAVED_VIEWS.LIMIT_REACHED' | translate : { max: limit } }}\n\t\t</p>\n\n\t\t<hr />\n\n\t\t<!-- Stored views -->\n\t\t<p class=\"docs-saved-views-hint\" *ngIf=\"!views.length\">{{ 'DOCS.SAVED_VIEWS.EMPTY' | translate }}</p>\n\n\t\t<ul class=\"docs-saved-views-list\" *ngIf=\"views.length\">\n\t\t\t<li class=\"docs-saved-views-item\" *ngFor=\"let view of views; trackBy: trackView\">\n\t\t\t\t<!-- Inline rename -->\n\t\t\t\t<ng-container *ngIf=\"renamingId === view.id; else viewRow\">\n\t\t\t\t\t<!-- Only one row can be in rename mode at a time, so the id stays unique. -->\n\t\t\t\t\t<!-- Esc stops here: the component also closes the whole panel on a\n\t\t\t\t\t     document-level Esc, so the rename would take the panel with it. -->\n\t\t\t\t\t<input\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\tfieldSize=\"tiny\"\n\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\tid=\"docs-saved-view-rename\"\n\t\t\t\t\t\t[maxlength]=\"nameMaxLength\"\n\t\t\t\t\t\t[attr.aria-label]=\"'DOCS.SAVED_VIEWS.RENAME' | translate\"\n\t\t\t\t\t\t[(ngModel)]=\"renameDraft\"\n\t\t\t\t\t\t(keydown.enter)=\"commitRename(view)\"\n\t\t\t\t\t\t(keydown.escape)=\"cancelRename(); $event.stopPropagation()\"\n\t\t\t\t\t/>\n\t\t\t\t\t<button nbButton ghost size=\"tiny\" type=\"button\" (click)=\"commitRename(view)\">\n\t\t\t\t\t\t<nb-icon icon=\"checkmark-outline\"></nb-icon>\n\t\t\t\t\t</button>\n\t\t\t\t\t<button nbButton ghost size=\"tiny\" type=\"button\" (click)=\"cancelRename()\">\n\t\t\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t\t\t</button>\n\t\t\t\t</ng-container>\n\n\t\t\t\t<ng-template #viewRow>\n\t\t\t\t\t<button\n\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\tclass=\"docs-saved-views-apply\"\n\t\t\t\t\t\trole=\"menuitem\"\n\t\t\t\t\t\t[class.active]=\"isActive(view)\"\n\t\t\t\t\t\t(click)=\"apply(view)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-icon *ngIf=\"isActive(view)\" icon=\"checkmark-outline\" size=\"tiny\"></nb-icon>\n\t\t\t\t\t\t<span>{{ view.name }}</span>\n\t\t\t\t\t</button>\n\t\t\t\t\t<button\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tghost\n\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t[nbTooltip]=\"'DOCS.SAVED_VIEWS.RENAME' | translate\"\n\t\t\t\t\t\t(click)=\"startRename(view, $event)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-icon icon=\"edit-outline\"></nb-icon>\n\t\t\t\t\t</button>\n\t\t\t\t\t<button\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tghost\n\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\tstatus=\"danger\"\n\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t[nbTooltip]=\"'DOCS.SAVED_VIEWS.DELETE' | translate\"\n\t\t\t\t\t\t(click)=\"remove(view, $event)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-icon icon=\"trash-2-outline\"></nb-icon>\n\t\t\t\t\t</button>\n\t\t\t\t</ng-template>\n\t\t\t</li>\n\t\t</ul>\n\t</div>\n</div>\n", styles: [".docs-saved-views{position:relative;display:inline-block;min-width:0}.docs-saved-views>button[nbButton]{display:inline-flex;align-items:center;gap:.375rem;max-width:12rem;height:var(--docs-filter-control-height, var(--docs-control-height-sm, 1.75rem));min-height:var(--docs-filter-control-height, var(--docs-control-height-sm, 1.75rem));padding-inline:.5rem;border-radius:var(--docs-radius, .375rem);font-size:var(--docs-meta-size, .75rem);white-space:nowrap;overflow:hidden}.docs-saved-views>button[nbButton] .docs-saved-views-trigger-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-saved-views>button[nbButton] nb-icon{flex:0 0 auto;margin:0;font-size:.875rem}.docs-saved-views-panel{position:fixed;z-index:1010;display:flex;flex-direction:column;overflow-y:auto;min-width:16rem;max-width:calc(100vw - 1rem);padding:.625rem;border:0;border-radius:var(--docs-radius-lg, .5rem);background:var(--docs-surface, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--docs-hairline, rgba(126, 126, 143, .18)),var(--shadow);font-size:var(--docs-body-size, .8125rem)}.docs-saved-views-panel hr{margin:.625rem 0;border:0;border-top:1px solid var(--docs-hairline, rgba(126, 126, 143, .18))}.docs-saved-views-panel button[nbButton]{display:inline-flex;align-items:center;justify-content:center;gap:.25rem;height:var(--docs-control-height-sm, 1.75rem);min-height:var(--docs-control-height-sm, 1.75rem);padding-inline:.5rem;border-radius:var(--docs-radius, .375rem);font-size:var(--docs-meta-size, .75rem);white-space:nowrap}.docs-saved-views-panel button[nbButton] nb-icon{margin:0;font-size:.875rem}.docs-saved-views-panel .docs-saved-views-item button[nbButton]{flex:0 0 auto;width:var(--docs-control-height-sm, 1.75rem);padding-inline:0}.docs-saved-views-panel input[nbInput]{height:var(--docs-control-height-sm, 1.75rem);min-height:var(--docs-control-height-sm, 1.75rem);border-radius:var(--docs-radius, .375rem);font-size:var(--docs-meta-size, .75rem)}.docs-saved-views-save{display:flex;align-items:center;gap:.375rem}.docs-saved-views-save input{flex:1 1 auto;min-width:0}.docs-saved-views-hint{margin:.375rem 0 0;font-size:var(--docs-label-size, .6875rem);color:var(--docs-text-muted, var(--text-hint-color))}.docs-saved-views-hint.warn{color:var(--text-warning-color)}.docs-saved-views-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.125rem}.docs-saved-views-item{display:flex;align-items:center;gap:.125rem}.docs-saved-views-item input{flex:1 1 auto;min-width:0}.docs-saved-views-apply{flex:1 1 auto;min-width:0;display:flex;align-items:center;gap:.375rem;min-height:var(--docs-control-height-sm, 1.75rem);padding:.25rem .5rem;border:0;border-radius:var(--docs-radius, .375rem);background:transparent;color:inherit;font-size:var(--docs-body-size, .8125rem);text-align:left;cursor:pointer}.docs-saved-views-apply nb-icon{flex:0 0 auto}.docs-saved-views-apply span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-saved-views-apply:hover{background:var(--docs-hover, rgba(126, 126, 143, .12))}.docs-saved-views-apply.active{font-weight:600;color:var(--text-primary-color)}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.DocsSavedViewsService }, { type: i0.ElementRef }], propDecorators: { params: [{
                type: Input
            }], applyView: [{
                type: Output
            }], triggerRef: [{
                type: ViewChild,
                args: ['trigger', { read: ElementRef }]
            }], onDocumentClick: [{
                type: HostListener,
                args: ['document:click', ['$event']]
            }], onEscape: [{
                type: HostListener,
                args: ['document:keydown.escape']
            }], reposition: [{
                type: HostListener,
                args: ['window:resize']
            }] } });
//# sourceMappingURL=saved-views.component.js.map