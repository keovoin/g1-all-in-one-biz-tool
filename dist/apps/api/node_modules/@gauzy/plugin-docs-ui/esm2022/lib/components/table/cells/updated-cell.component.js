import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@nebular/theme";
/**
 * `Updated` cell — one truncating line plus the full timestamp in a tooltip.
 */
export class UpdatedCellComponent {
    constructor() {
        /** Formatting is memoized on the raw value: both getters are template bindings. */
        this.cache = { raw: {}, display: '', tooltip: '' };
    }
    /** Short form, for the row itself. */
    get display() {
        return this.format().display;
    }
    /** Long form, for the tooltip. */
    get tooltip() {
        return this.format().tooltip;
    }
    format() {
        const raw = this.value ?? this.rowData?.updatedAt;
        if (raw === this.cache.raw)
            return this.cache;
        const date = raw ? new Date(raw) : null;
        const valid = !!date && !Number.isNaN(date.getTime());
        this.cache = {
            raw,
            display: valid ? date.toLocaleString() : '',
            tooltip: valid ? date.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'medium' }) : ''
        };
        return this.cache;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UpdatedCellComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: UpdatedCellComponent, isStandalone: false, selector: "gz-docs-updated-cell", inputs: { rowData: "rowData", value: "value" }, ngImport: i0, template: `
		<span class="docs-updated" *ngIf="display" [nbTooltip]="tooltip" nbTooltipPlacement="top">{{ display }}</span>
	`, isInline: true, styles: [":host{display:block;min-width:0}.docs-updated{display:block;width:var(--docs-updated-cell-width, 9.5rem);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-variant-numeric:tabular-nums;color:var(--docs-text-muted, var(--text-hint-color));cursor:default}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UpdatedCellComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-updated-cell', template: `
		<span class="docs-updated" *ngIf="display" [nbTooltip]="tooltip" nbTooltipPlacement="top">{{ display }}</span>
	`, standalone: false, styles: [":host{display:block;min-width:0}.docs-updated{display:block;width:var(--docs-updated-cell-width, 9.5rem);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-variant-numeric:tabular-nums;color:var(--docs-text-muted, var(--text-hint-color));cursor:default}\n"] }]
        }], propDecorators: { rowData: [{
                type: Input
            }], value: [{
                type: Input
            }] } });
//# sourceMappingURL=updated-cell.component.js.map