import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DOCS_ACTIVITY_MAX_ITEMS, DocumentActivityService } from '../../services/document-activity.service';
import { mergeActivityEntries, toDocumentActivityEntry } from './docs-activity.model';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "../../services/document-activity.service";
import * as i3 from "@angular/common";
import * as i4 from "@nebular/theme";
/**
 * Activity timeline of the detail panel (`00-product-spec.md` §6.12 R-COL-03,
 * `01-ux-spec.md` §8.11, `04-frontend-plugin.md` §4.6).
 *
 * Reads back the rows `DocumentActivityLogSubscriber` writes on the backend event-bus seam:
 * newest first, "Show more" paging, capped at {@link DOCS_ACTIVITY_MAX_ITEMS}. System-driven
 * transitions (the whole extraction/classification/embedding pipeline marks itself
 * `actor: 'system'`) are attributed to "System" rather than to whoever happened to upload the
 * file.
 *
 * **Fault-isolated on purpose.** The panel loads links, comments and activity independently;
 * a failing activity read renders an inline retry here and leaves the rest of the panel intact.
 *
 * **Unknown values are never invented.** An action outside `ActionTypeEnum`, a column outside
 * the field-label map and an enum member with no translation all fall back to the raw stored
 * text — `custom-handler.ts` returns a missing key verbatim, so translating blindly would print
 * `DOCS.STATUS.<unmapped value>` at the user.
 */
export class DocsDetailActivityComponent extends TranslationBaseComponent {
    constructor(translateService, activityService) {
        super(translateService);
        this.translateService = translateService;
        this.activityService = activityService;
        this.entries = [];
        this.loading = false;
        this.loadError = false;
        /** Full match count reported by the API — decides whether "Show more" is offered. */
        this.total = 0;
        /** 1-based page number; the DTO `skip` is a page, not an offset. */
        this.page = 1;
    }
    ngOnChanges(changes) {
        if (changes['documentId'] && this.documentId) {
            void this.reload();
        }
    }
    // ─── Loading ─────────────────────────────────────────────────
    /** Re-reads the first page, dropping anything already loaded. */
    async reload() {
        this.page = 1;
        this.entries = [];
        this.total = 0;
        await this.load();
    }
    /** Appends the next page; no-op once the cap or the end of the log is reached. */
    async showMore() {
        if (!this.canShowMore || this.loading)
            return;
        this.page += 1;
        await this.load();
    }
    /**
     * True while there are more rows to fetch AND the cap leaves room for them.
     *
     * Both halves matter: `total` is the whole log for this document, which can be far larger
     * than the 100-row window the panel is specified to show.
     */
    get canShowMore() {
        return !this.loadError && this.entries.length < Math.min(this.total, DOCS_ACTIVITY_MAX_ITEMS);
    }
    async load() {
        if (!this.documentId)
            return;
        this.loading = true;
        this.loadError = false;
        try {
            const page = await firstValueFrom(this.activityService.getPage(this.documentId, this.page));
            const rows = (page?.items ?? []).map(toDocumentActivityEntry);
            // The page window can shift under us when a row lands mid-session — merge by id.
            this.entries = mergeActivityEntries(this.entries, rows).slice(0, DOCS_ACTIVITY_MAX_ITEMS);
            this.total = page?.total ?? this.entries.length;
        }
        catch {
            this.loadError = true;
            // A failed "Show more" must not lose the rows already on screen, and the retry
            // button has to re-ask for the page that failed — so `page` is left where it is.
        }
        finally {
            this.loading = false;
        }
    }
    /** Retry target for the inline error: re-asks for the page that failed, keeping what loaded. */
    retry() {
        void this.load();
    }
    // ─── Presentation ────────────────────────────────────────────
    /** "System" for pipeline-owned transitions, the author's name otherwise. */
    actorLabel(entry) {
        if (entry.isSystem)
            return this.getTranslation('DOCS.ACTIVITY.SYSTEM');
        return entry.actorName || this.getTranslation('DOCS.ACTIVITY.UNKNOWN_ACTOR');
    }
    /** Translated action, or the raw stored action for anything outside `ActionTypeEnum`. */
    actionLabel(entry) {
        return entry.actionLabelKey ? this.translateOrRaw(entry.actionLabelKey, entry.action) : entry.action;
    }
    /** Translated column name, or the raw column for anything outside the label map. */
    fieldLabel(change) {
        return change.labelKey ? this.translateOrRaw(change.labelKey, change.field) : change.field;
    }
    /** True when the change carries a before/after pair worth printing. */
    hasValues(change) {
        return change.showValues && (this.isPrintable(change.previous) || this.isPrintable(change.next));
    }
    /** Enum member → its label; booleans → Yes/No; anything else → its own text. */
    valueLabel(change, value) {
        if (!this.isPrintable(value))
            return '—';
        if (typeof value === 'boolean') {
            return this.getTranslation(value ? 'DOCS.ACTIVITY.VALUE.TRUE' : 'DOCS.ACTIVITY.VALUE.FALSE');
        }
        const raw = String(value);
        return change.valueKeyPrefix ? this.translateOrRaw(`${change.valueKeyPrefix}${raw}`, raw) : raw;
    }
    trackEntry(_, entry) {
        return entry.id;
    }
    trackChange(_, change) {
        return change.field;
    }
    isPrintable(value) {
        return value !== undefined && value !== null && value !== '';
    }
    /**
     * Translates a key, falling back to the raw stored text when the key does not exist.
     *
     * 🛑 `custom-handler.ts` returns a missing key **verbatim**, so `instant()` cannot be trusted
     * to have found anything: comparing the result against the key is the only way to tell a
     * translation from a miss, and the miss must render the raw enum (spec 04 §4.6).
     */
    translateOrRaw(key, raw) {
        const translated = this.getTranslation(key);
        return !translated || translated === key ? raw : translated;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsDetailActivityComponent, deps: [{ token: i1.TranslateService }, { token: i2.DocumentActivityService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DocsDetailActivityComponent, isStandalone: false, selector: "gz-docs-detail-activity", inputs: { documentId: "documentId" }, providers: [DocumentActivityService], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<div class=\"docs-activity\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t<!-- Error state \u2014 mirrors the panel's own retry affordance; the rows already\n\t     loaded stay on screen so a failed \"Show more\" costs nothing. -->\n\t<div class=\"docs-activity-error\" *ngIf=\"loadError\">\n\t\t<span>{{ 'DOCS.ACTIVITY.LOAD_ERROR' | translate }}</span>\n\t\t<button nbButton size=\"tiny\" status=\"primary\" type=\"button\" (click)=\"retry()\">\n\t\t\t{{ 'DOCS.ERRORS.GENERIC_RETRY' | translate }}\n\t\t</button>\n\t</div>\n\n\t<!-- Empty state -->\n\t<p class=\"muted\" *ngIf=\"!loading && !loadError && !entries.length\">{{ 'DOCS.ACTIVITY.EMPTY' | translate }}</p>\n\n\t<!-- Timeline, newest first -->\n\t<ol class=\"docs-activity-list\" *ngIf=\"entries.length\">\n\t\t<li class=\"docs-activity-entry\" *ngFor=\"let entry of entries; trackBy: trackEntry\">\n\t\t\t<div class=\"docs-activity-head\">\n\t\t\t\t<span class=\"docs-activity-actor\" [nbTooltip]=\"actorLabel(entry)\" nbTooltipStatus=\"basic\">{{\n\t\t\t\t\tactorLabel(entry)\n\t\t\t\t}}</span>\n\t\t\t\t<span class=\"docs-activity-action\">{{ actionLabel(entry) }}</span>\n\t\t\t\t<span class=\"docs-activity-date\">{{ entry.createdAt | date : 'medium' }}</span>\n\t\t\t</div>\n\t\t\t<ul class=\"docs-activity-changes\" *ngIf=\"entry.changes.length\">\n\t\t\t\t<li *ngFor=\"let change of entry.changes; trackBy: trackChange\">\n\t\t\t\t\t<span class=\"docs-activity-field\">{{ fieldLabel(change) }}</span>\n\t\t\t\t\t<ng-container *ngIf=\"hasValues(change)\">\n\t\t\t\t\t\t<span\n\t\t\t\t\t\t\tclass=\"docs-activity-value\"\n\t\t\t\t\t\t\t[nbTooltip]=\"valueLabel(change, change.previous)\"\n\t\t\t\t\t\t\tnbTooltipStatus=\"basic\"\n\t\t\t\t\t\t\t>{{ valueLabel(change, change.previous) }}</span\n\t\t\t\t\t\t>\n\t\t\t\t\t\t<nb-icon icon=\"arrow-forward-outline\"></nb-icon>\n\t\t\t\t\t\t<span\n\t\t\t\t\t\t\tclass=\"docs-activity-value\"\n\t\t\t\t\t\t\t[nbTooltip]=\"valueLabel(change, change.next)\"\n\t\t\t\t\t\t\tnbTooltipStatus=\"basic\"\n\t\t\t\t\t\t\t>{{ valueLabel(change, change.next) }}</span\n\t\t\t\t\t\t>\n\t\t\t\t\t</ng-container>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t</li>\n\t</ol>\n\n\t<button\n\t\t*ngIf=\"canShowMore\"\n\t\tnbButton\n\t\tghost\n\t\tsize=\"tiny\"\n\t\ttype=\"button\"\n\t\tclass=\"docs-activity-more\"\n\t\t[disabled]=\"loading\"\n\t\t(click)=\"showMore()\"\n\t>\n\t\t{{ 'DOCS.DETAIL.SHOW_MORE' | translate }}\n\t</button>\n</div>\n", styles: [":host{display:block;min-width:0}.docs-activity{min-height:2rem}.docs-activity .muted{color:var(--docs-text-muted, var(--text-hint-color));margin:0}.docs-activity-error{display:flex;align-items:center;flex-wrap:wrap;gap:.5rem;font-size:var(--docs-meta-size, .75rem);margin-bottom:.5rem}.docs-activity-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.5rem}.docs-activity-entry{min-width:0;font-size:var(--docs-meta-size, .75rem);border-inline-start:2px solid var(--docs-hairline, rgba(126, 126, 143, .18));padding-inline-start:.5rem}.docs-activity-head{display:flex;align-items:baseline;flex-wrap:wrap;gap:.25rem .375rem;min-width:0}.docs-activity-head .docs-activity-actor{font-weight:600;max-width:10rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-activity-head .docs-activity-action{min-width:0;color:var(--docs-text-muted, var(--text-hint-color))}.docs-activity-head .docs-activity-date{margin-inline-start:auto;color:var(--docs-text-muted, var(--text-hint-color));font-size:var(--docs-label-size, .6875rem);white-space:nowrap}.docs-activity-changes{list-style:none;margin:.125rem 0 0;padding:0;color:var(--docs-text-muted, var(--text-hint-color));font-size:var(--docs-label-size, .6875rem)}.docs-activity-changes li{display:flex;align-items:center;gap:.25rem;flex-wrap:wrap;min-width:0}.docs-activity-changes nb-icon{flex:0 0 auto;font-size:.75rem}.docs-activity-changes .docs-activity-field{font-weight:600;color:var(--docs-text, var(--text-basic-color))}.docs-activity-changes .docs-activity-value{max-width:9rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-activity-more{margin-top:.375rem;height:1.5rem;min-height:1.5rem;padding-inline:0;font-size:var(--docs-meta-size, .75rem)}\n"], dependencies: [{ kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i4.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i4.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i4.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "directive", type: i4.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "pipe", type: i3.DatePipe, name: "date" }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsDetailActivityComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-detail-activity', providers: [DocumentActivityService], standalone: false, template: "<div class=\"docs-activity\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t<!-- Error state \u2014 mirrors the panel's own retry affordance; the rows already\n\t     loaded stay on screen so a failed \"Show more\" costs nothing. -->\n\t<div class=\"docs-activity-error\" *ngIf=\"loadError\">\n\t\t<span>{{ 'DOCS.ACTIVITY.LOAD_ERROR' | translate }}</span>\n\t\t<button nbButton size=\"tiny\" status=\"primary\" type=\"button\" (click)=\"retry()\">\n\t\t\t{{ 'DOCS.ERRORS.GENERIC_RETRY' | translate }}\n\t\t</button>\n\t</div>\n\n\t<!-- Empty state -->\n\t<p class=\"muted\" *ngIf=\"!loading && !loadError && !entries.length\">{{ 'DOCS.ACTIVITY.EMPTY' | translate }}</p>\n\n\t<!-- Timeline, newest first -->\n\t<ol class=\"docs-activity-list\" *ngIf=\"entries.length\">\n\t\t<li class=\"docs-activity-entry\" *ngFor=\"let entry of entries; trackBy: trackEntry\">\n\t\t\t<div class=\"docs-activity-head\">\n\t\t\t\t<span class=\"docs-activity-actor\" [nbTooltip]=\"actorLabel(entry)\" nbTooltipStatus=\"basic\">{{\n\t\t\t\t\tactorLabel(entry)\n\t\t\t\t}}</span>\n\t\t\t\t<span class=\"docs-activity-action\">{{ actionLabel(entry) }}</span>\n\t\t\t\t<span class=\"docs-activity-date\">{{ entry.createdAt | date : 'medium' }}</span>\n\t\t\t</div>\n\t\t\t<ul class=\"docs-activity-changes\" *ngIf=\"entry.changes.length\">\n\t\t\t\t<li *ngFor=\"let change of entry.changes; trackBy: trackChange\">\n\t\t\t\t\t<span class=\"docs-activity-field\">{{ fieldLabel(change) }}</span>\n\t\t\t\t\t<ng-container *ngIf=\"hasValues(change)\">\n\t\t\t\t\t\t<span\n\t\t\t\t\t\t\tclass=\"docs-activity-value\"\n\t\t\t\t\t\t\t[nbTooltip]=\"valueLabel(change, change.previous)\"\n\t\t\t\t\t\t\tnbTooltipStatus=\"basic\"\n\t\t\t\t\t\t\t>{{ valueLabel(change, change.previous) }}</span\n\t\t\t\t\t\t>\n\t\t\t\t\t\t<nb-icon icon=\"arrow-forward-outline\"></nb-icon>\n\t\t\t\t\t\t<span\n\t\t\t\t\t\t\tclass=\"docs-activity-value\"\n\t\t\t\t\t\t\t[nbTooltip]=\"valueLabel(change, change.next)\"\n\t\t\t\t\t\t\tnbTooltipStatus=\"basic\"\n\t\t\t\t\t\t\t>{{ valueLabel(change, change.next) }}</span\n\t\t\t\t\t\t>\n\t\t\t\t\t</ng-container>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t</li>\n\t</ol>\n\n\t<button\n\t\t*ngIf=\"canShowMore\"\n\t\tnbButton\n\t\tghost\n\t\tsize=\"tiny\"\n\t\ttype=\"button\"\n\t\tclass=\"docs-activity-more\"\n\t\t[disabled]=\"loading\"\n\t\t(click)=\"showMore()\"\n\t>\n\t\t{{ 'DOCS.DETAIL.SHOW_MORE' | translate }}\n\t</button>\n</div>\n", styles: [":host{display:block;min-width:0}.docs-activity{min-height:2rem}.docs-activity .muted{color:var(--docs-text-muted, var(--text-hint-color));margin:0}.docs-activity-error{display:flex;align-items:center;flex-wrap:wrap;gap:.5rem;font-size:var(--docs-meta-size, .75rem);margin-bottom:.5rem}.docs-activity-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.5rem}.docs-activity-entry{min-width:0;font-size:var(--docs-meta-size, .75rem);border-inline-start:2px solid var(--docs-hairline, rgba(126, 126, 143, .18));padding-inline-start:.5rem}.docs-activity-head{display:flex;align-items:baseline;flex-wrap:wrap;gap:.25rem .375rem;min-width:0}.docs-activity-head .docs-activity-actor{font-weight:600;max-width:10rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-activity-head .docs-activity-action{min-width:0;color:var(--docs-text-muted, var(--text-hint-color))}.docs-activity-head .docs-activity-date{margin-inline-start:auto;color:var(--docs-text-muted, var(--text-hint-color));font-size:var(--docs-label-size, .6875rem);white-space:nowrap}.docs-activity-changes{list-style:none;margin:.125rem 0 0;padding:0;color:var(--docs-text-muted, var(--text-hint-color));font-size:var(--docs-label-size, .6875rem)}.docs-activity-changes li{display:flex;align-items:center;gap:.25rem;flex-wrap:wrap;min-width:0}.docs-activity-changes nb-icon{flex:0 0 auto;font-size:.75rem}.docs-activity-changes .docs-activity-field{font-weight:600;color:var(--docs-text, var(--text-basic-color))}.docs-activity-changes .docs-activity-value{max-width:9rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-activity-more{margin-top:.375rem;height:1.5rem;min-height:1.5rem;padding-inline:0;font-size:var(--docs-meta-size, .75rem)}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.DocumentActivityService }], propDecorators: { documentId: [{
                type: Input
            }] } });
//# sourceMappingURL=docs-detail-activity.component.js.map