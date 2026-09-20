import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@nebular/theme";
/** Tag chips: core tag colors, up to 3 + "+N" overflow. */
export class TagChipsComponent {
    constructor() {
        this.max = 3;
        /** Cache so `visible` keeps a stable array reference across change-detection cycles. */
        this.visibleCache = {
            source: undefined,
            max: -1,
            result: []
        };
    }
    get tags() {
        return this.value ?? this.rowData?.tags ?? [];
    }
    /**
     * Rendered per table row on every browse-list change detection. `slice()` mints a new array
     * identity each call; memoizing it (keyed on the source array reference + `max`) keeps the
     * `*ngFor` reference stable, and `trackById` keeps the chip DOM stable when the content is
     * unchanged — the same reference-stability discipline as `FacetMultiselectComponent`.
     */
    get visible() {
        const source = this.tags;
        if (this.visibleCache.source !== source || this.visibleCache.max !== this.max) {
            this.visibleCache = { source, max: this.max, result: source.slice(0, this.max) };
        }
        return this.visibleCache.result;
    }
    get overflow() {
        return Math.max(0, this.tags.length - this.max);
    }
    trackById(_index, tag) {
        return tag.id;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TagChipsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TagChipsComponent, isStandalone: false, selector: "gz-docs-tag-chips", inputs: { rowData: "rowData", value: "value", max: "max" }, ngImport: i0, template: `
		<span class="docs-chips">
			<span
				class="docs-chip"
				*ngFor="let tag of visible; trackBy: trackById"
				[style.background-color]="tag.color || null"
				[nbTooltip]="tag.name"
				nbTooltipStatus="basic"
			>
				{{ tag.name }}
			</span>
			<span class="docs-chip overflow" *ngIf="overflow > 0">+{{ overflow }}</span>
		</span>
	`, isInline: true, styles: [".docs-chips{display:inline-flex;align-items:center;gap:var(--gauzy-table-chip-gap, .1875rem);flex-wrap:wrap;max-width:100%;min-width:0}.docs-chip{display:inline-flex;align-items:center;max-width:9rem;height:var(--gauzy-table-badge-height, 1.25rem);padding:0 var(--gauzy-table-chip-padding-x, .375rem);border-radius:var(--docs-radius, .375rem);font-size:var(--gauzy-table-chip-font-size, .6875rem);line-height:var(--gauzy-table-chip-line-height, .875rem);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.docs-chip{color:var(--text-control-color);background:var(--background-basic-color-3)}.docs-chip.overflow{background:transparent;color:var(--docs-text-muted, var(--text-hint-color));box-shadow:inset 0 0 0 1px var(--docs-hairline, rgba(126, 126, 143, .18))}\n"], dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TagChipsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-tag-chips', template: `
		<span class="docs-chips">
			<span
				class="docs-chip"
				*ngFor="let tag of visible; trackBy: trackById"
				[style.background-color]="tag.color || null"
				[nbTooltip]="tag.name"
				nbTooltipStatus="basic"
			>
				{{ tag.name }}
			</span>
			<span class="docs-chip overflow" *ngIf="overflow > 0">+{{ overflow }}</span>
		</span>
	`, standalone: false, styles: [".docs-chips{display:inline-flex;align-items:center;gap:var(--gauzy-table-chip-gap, .1875rem);flex-wrap:wrap;max-width:100%;min-width:0}.docs-chip{display:inline-flex;align-items:center;max-width:9rem;height:var(--gauzy-table-badge-height, 1.25rem);padding:0 var(--gauzy-table-chip-padding-x, .375rem);border-radius:var(--docs-radius, .375rem);font-size:var(--gauzy-table-chip-font-size, .6875rem);line-height:var(--gauzy-table-chip-line-height, .875rem);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.docs-chip{color:var(--text-control-color);background:var(--background-basic-color-3)}.docs-chip.overflow{background:transparent;color:var(--docs-text-muted, var(--text-hint-color));box-shadow:inset 0 0 0 1px var(--docs-hairline, rgba(126, 126, 143, .18))}\n"] }]
        }], propDecorators: { rowData: [{
                type: Input
            }], value: [{
                type: Input
            }], max: [{
                type: Input
            }] } });
//# sourceMappingURL=tag-chips.component.js.map