import { Component, Input } from '@angular/core';
import { DocumentKnowledgeStatusEnum, DocumentReviewStatusEnum } from '@gauzy/contracts';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@nebular/theme";
import * as i3 from "@ngx-translate/core";
/**
 * AI knowledge badge; a PENDING review overlays the amber review pill next to it.
 */
export class KnowledgeBadgeComponent {
    constructor() {
        this.reviewEnum = DocumentReviewStatusEnum;
    }
    get status() {
        return this.value ?? this.rowData?.knowledgeStatus ?? DocumentKnowledgeStatusEnum.NONE;
    }
    get isBusy() {
        return this.status === DocumentKnowledgeStatusEnum.QUEUED || this.status === DocumentKnowledgeStatusEnum.INDEXING;
    }
    get cssClass() {
        switch (this.status) {
            case DocumentKnowledgeStatusEnum.INDEXED:
                return 'indexed';
            case DocumentKnowledgeStatusEnum.FAILED:
                return 'failed';
            case DocumentKnowledgeStatusEnum.EXCLUDED:
                return 'excluded';
            default:
                return '';
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: KnowledgeBadgeComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: KnowledgeBadgeComponent, isStandalone: false, selector: "gz-docs-knowledge-badge", inputs: { rowData: "rowData", value: "value" }, ngImport: i0, template: `
		<span class="docs-badge" [ngClass]="cssClass">
			<nb-icon *ngIf="isBusy" icon="loader-outline" size="tiny" class="docs-badge-spin"></nb-icon>
			{{ 'DOCS.KNOWLEDGE.' + status | translate }}
		</span>
		<span
			class="docs-badge review-pill"
			*ngIf="rowData?.reviewStatus === reviewEnum.PENDING"
			[nbTooltip]="'DOCS.REVIEW.PENDING_TOOLTIP' | translate"
		>
			{{ 'DOCS.REVIEW.PENDING' | translate }}
		</span>
	`, isInline: true, styles: [".docs-badge{display:inline-flex;align-items:center;gap:.25rem;max-width:100%;height:var(--gauzy-table-badge-height, 1.25rem);padding:0 var(--gauzy-table-chip-padding-x, .375rem);border-radius:var(--docs-radius, .375rem);font-size:var(--gauzy-table-chip-font-size, .6875rem);line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:var(--docs-surface-sunken, var(--background-basic-color-2))}.docs-badge{color:var(--docs-text-muted, var(--text-hint-color))}.docs-badge.indexed{color:var(--color-primary-default)}.docs-badge.failed{color:var(--color-danger-default)}.docs-badge.excluded{box-shadow:inset 0 0 0 1px var(--border-basic-color-4);background:transparent}.docs-badge.review-pill{color:var(--color-warning-default);margin-left:.25rem}.docs-badge nb-icon{font-size:.75rem}.docs-badge-spin{animation:docs-spin 1s linear infinite}@keyframes docs-spin{to{transform:rotate(360deg)}}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i2.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: KnowledgeBadgeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-knowledge-badge', template: `
		<span class="docs-badge" [ngClass]="cssClass">
			<nb-icon *ngIf="isBusy" icon="loader-outline" size="tiny" class="docs-badge-spin"></nb-icon>
			{{ 'DOCS.KNOWLEDGE.' + status | translate }}
		</span>
		<span
			class="docs-badge review-pill"
			*ngIf="rowData?.reviewStatus === reviewEnum.PENDING"
			[nbTooltip]="'DOCS.REVIEW.PENDING_TOOLTIP' | translate"
		>
			{{ 'DOCS.REVIEW.PENDING' | translate }}
		</span>
	`, standalone: false, styles: [".docs-badge{display:inline-flex;align-items:center;gap:.25rem;max-width:100%;height:var(--gauzy-table-badge-height, 1.25rem);padding:0 var(--gauzy-table-chip-padding-x, .375rem);border-radius:var(--docs-radius, .375rem);font-size:var(--gauzy-table-chip-font-size, .6875rem);line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:var(--docs-surface-sunken, var(--background-basic-color-2))}.docs-badge{color:var(--docs-text-muted, var(--text-hint-color))}.docs-badge.indexed{color:var(--color-primary-default)}.docs-badge.failed{color:var(--color-danger-default)}.docs-badge.excluded{box-shadow:inset 0 0 0 1px var(--border-basic-color-4);background:transparent}.docs-badge.review-pill{color:var(--color-warning-default);margin-left:.25rem}.docs-badge nb-icon{font-size:.75rem}.docs-badge-spin{animation:docs-spin 1s linear infinite}@keyframes docs-spin{to{transform:rotate(360deg)}}\n"] }]
        }], propDecorators: { rowData: [{
                type: Input
            }], value: [{
                type: Input
            }] } });
//# sourceMappingURL=knowledge-badge.component.js.map