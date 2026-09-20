import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, filter, of, Subject, switchMap, tap } from 'rxjs';
import { DocumentStatusEnum } from '@gauzy/contracts';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { Store } from '@gauzy/ui-core/core';
import { humanizeBytes } from '../../models/docs-format.util';
import { DocumentsService } from '../../services/documents.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/documents.service";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@angular/common";
import * as i4 from "@nebular/theme";
import * as i5 from "@ngx-translate/core";
/**
 * Org-global stats tiles above the filter bar (`GET /documents/stats`).
 *
 * Deliberately NOT filter-relative — the preset chips already are: tiles answer
 * "what is in this organization", so they load once, reload on an org switch and
 * on the page's explicit `reload()` calls (upload settled, bulk finished).
 *
 * Cosmetic surface: any failure — including 404 on a deployment whose API
 * predates the endpoint — hides the whole strip rather than surfacing an error,
 * so a UI-first deploy degrades silently.
 */
let DocsStatsLineComponent = class DocsStatsLineComponent {
    constructor(documentsService, store) {
        this.documentsService = documentsService;
        this.store = store;
        this.tiles = [];
        this.loading = false;
        this.visible = false;
        this.reload$ = new Subject();
    }
    ngOnInit() {
        // switchMap: an org switch mid-flight must never let the old org's numbers land.
        this.reload$
            .pipe(tap(() => (this.loading = true)), switchMap(() => this.documentsService.getStats().pipe(catchError(() => of(null)))), untilDestroyed(this))
            .subscribe((stats) => {
            this.loading = false;
            this.visible = !!stats;
            this.tiles = stats ? this.buildTiles(stats) : [];
        });
        this.store.selectedOrganization$
            .pipe(filter((organization) => !!organization), distinctUntilChange(), tap(() => this.reload()), untilDestroyed(this))
            .subscribe();
    }
    /** Public on purpose — the browse page re-pulls after uploads and bulk actions settle. */
    reload() {
        this.reload$.next();
    }
    trackByLabel(_index, tile) {
        return tile.labelKey;
    }
    buildTiles(stats) {
        const byStatus = stats.byStatus ?? {};
        // UPLOADED is the internal first phase the user is never shown — it reads
        // "Processing" everywhere (badge, facet, URL), so the tile folds it too.
        const processing = (byStatus[DocumentStatusEnum.PROCESSING] ?? 0) + (byStatus[DocumentStatusEnum.UPLOADED] ?? 0);
        const tiles = [
            { labelKey: 'DOCS.STATS.TOTAL', value: String(stats.total ?? 0), color: '' },
            {
                labelKey: 'DOCS.STATS.READY',
                value: String(byStatus[DocumentStatusEnum.READY] ?? 0),
                color: 'var(--color-success-default)'
            },
            { labelKey: 'DOCS.STATS.PROCESSING', value: String(processing), color: 'var(--color-info-default)' },
            {
                labelKey: 'DOCS.STATS.FAILED',
                value: String(byStatus[DocumentStatusEnum.FAILED] ?? 0),
                color: 'var(--color-danger-default)'
            },
            {
                labelKey: 'DOCS.STATS.NEEDS_REVIEW',
                value: String(stats.needsReview ?? 0),
                color: 'var(--color-warning-default)'
            }
        ];
        // Storage renders only when the deployment reports real usage — never an
        // assumed "0 of 0" (which reads as a hard-full quota).
        const storage = stats.storage;
        if (storage && typeof storage.usedBytes === 'number' && Number.isFinite(storage.usedBytes)) {
            const used = storage.usedBytes ? humanizeBytes(storage.usedBytes) : '0 B';
            tiles.push({
                labelKey: 'DOCS.STATS.STORAGE',
                value: storage.quotaBytes > 0 ? `${used} / ${humanizeBytes(storage.quotaBytes)}` : used,
                color: ''
            });
        }
        return tiles;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsStatsLineComponent, deps: [{ token: i1.DocumentsService }, { token: i2.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DocsStatsLineComponent, isStandalone: false, selector: "gz-docs-stats-line", ngImport: i0, template: "<div class=\"docs-stats-line\" *ngIf=\"visible\" role=\"group\" [attr.aria-label]=\"'DOCS.STATS.ARIA' | translate\">\n\t<span class=\"docs-stat\" *ngFor=\"let tile of tiles; trackBy: trackByLabel\">\n\t\t<span class=\"docs-stat-label\">{{ tile.labelKey | translate }}</span>\n\t\t<span\n\t\t\tclass=\"docs-stat-value\"\n\t\t\t[style.color]=\"tile.color || null\"\n\t\t\t[nbTooltip]=\"(tile.labelKey | translate) + ': ' + tile.value\"\n\t\t\tnbTooltipStatus=\"basic\"\n\t\t\t>{{ tile.value }}</span\n\t\t>\n\t</span>\n\t<nb-icon *ngIf=\"loading\" icon=\"loader-outline\" class=\"docs-stats-spinner\"></nb-icon>\n</div>\n", styles: [".docs-stats-line{display:flex;align-items:center;flex-wrap:wrap;gap:.25rem 1rem;min-width:0;font-size:var(--docs-meta-size, .75rem);line-height:1.25rem}.docs-stat{display:inline-flex;align-items:baseline;gap:.375rem;min-width:0}.docs-stat-label{color:var(--docs-text-muted, var(--text-hint-color));white-space:nowrap}.docs-stat-label:after{content:\":\"}.docs-stat-value{font-weight:600;font-variant-numeric:tabular-nums;color:var(--docs-text, var(--text-basic-color));white-space:nowrap;max-width:10rem;overflow:hidden;text-overflow:ellipsis}.docs-stats-spinner{font-size:.875rem;color:var(--docs-text-muted, var(--text-hint-color));animation:docs-stats-spin 1.2s linear infinite}@keyframes docs-stats-spin{to{transform:rotate(360deg)}}@media(max-width:575px){.docs-stats-line{gap:.25rem .75rem}}\n"], dependencies: [{ kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i4.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i4.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
};
DocsStatsLineComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [DocumentsService, Store])
], DocsStatsLineComponent);
export { DocsStatsLineComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsStatsLineComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-stats-line', standalone: false, template: "<div class=\"docs-stats-line\" *ngIf=\"visible\" role=\"group\" [attr.aria-label]=\"'DOCS.STATS.ARIA' | translate\">\n\t<span class=\"docs-stat\" *ngFor=\"let tile of tiles; trackBy: trackByLabel\">\n\t\t<span class=\"docs-stat-label\">{{ tile.labelKey | translate }}</span>\n\t\t<span\n\t\t\tclass=\"docs-stat-value\"\n\t\t\t[style.color]=\"tile.color || null\"\n\t\t\t[nbTooltip]=\"(tile.labelKey | translate) + ': ' + tile.value\"\n\t\t\tnbTooltipStatus=\"basic\"\n\t\t\t>{{ tile.value }}</span\n\t\t>\n\t</span>\n\t<nb-icon *ngIf=\"loading\" icon=\"loader-outline\" class=\"docs-stats-spinner\"></nb-icon>\n</div>\n", styles: [".docs-stats-line{display:flex;align-items:center;flex-wrap:wrap;gap:.25rem 1rem;min-width:0;font-size:var(--docs-meta-size, .75rem);line-height:1.25rem}.docs-stat{display:inline-flex;align-items:baseline;gap:.375rem;min-width:0}.docs-stat-label{color:var(--docs-text-muted, var(--text-hint-color));white-space:nowrap}.docs-stat-label:after{content:\":\"}.docs-stat-value{font-weight:600;font-variant-numeric:tabular-nums;color:var(--docs-text, var(--text-basic-color));white-space:nowrap;max-width:10rem;overflow:hidden;text-overflow:ellipsis}.docs-stats-spinner{font-size:.875rem;color:var(--docs-text-muted, var(--text-hint-color));animation:docs-stats-spin 1.2s linear infinite}@keyframes docs-stats-spin{to{transform:rotate(360deg)}}@media(max-width:575px){.docs-stats-line{gap:.25rem .75rem}}\n"] }]
        }], ctorParameters: () => [{ type: i1.DocumentsService }, { type: i2.Store }] });
//# sourceMappingURL=docs-stats-line.component.js.map