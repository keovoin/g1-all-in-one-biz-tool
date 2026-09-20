import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@nebular/theme";
import * as i3 from "@ngx-translate/core";
/**
 * Preset chips with live facet counts: All / Needs review / Not in AI
 * knowledge / Archived. Toggling the active preset returns to All.
 */
export class PresetChipsComponent {
    constructor() {
        this.counts = null;
        this.presetToggled = new EventEmitter();
        this.chips = [
            { id: null, labelKey: 'DOCS.FILTERS.PRESET_ALL', countKey: 'all' },
            { id: 'needs-review', labelKey: 'DOCS.FILTERS.PRESET_NEEDS_REVIEW', countKey: 'needsReview' },
            { id: 'not-in-knowledge', labelKey: 'DOCS.FILTERS.PRESET_NOT_IN_KNOWLEDGE', countKey: 'notInKnowledge' },
            { id: 'archived', labelKey: 'DOCS.FILTERS.PRESET_ARCHIVED', countKey: 'archived' }
        ];
    }
    isActive(chip) {
        return chip.id === null ? !this.active : this.active === chip.id;
    }
    toggle(chip) {
        if (chip.id === null || this.isActive(chip)) {
            this.presetToggled.emit(undefined);
        }
        else {
            this.presetToggled.emit(chip.id);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PresetChipsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: PresetChipsComponent, isStandalone: false, selector: "gz-docs-preset-chips", inputs: { counts: "counts", active: "active" }, outputs: { presetToggled: "presetToggled" }, ngImport: i0, template: `
		<div class="docs-presets" role="group">
			<button
				*ngFor="let chip of chips"
				nbButton
				size="tiny"
				[status]="isActive(chip) ? 'primary' : 'basic'"
				[appearance]="isActive(chip) ? 'filled' : 'outline'"
				(click)="toggle(chip)"
				[attr.aria-pressed]="isActive(chip)"
			>
				<span class="docs-preset-label">{{ chip.labelKey | translate }}</span>
				<span class="docs-preset-count" *ngIf="counts">({{ counts[chip.countKey] }})</span>
			</button>
		</div>
	`, isInline: true, styles: [":host{display:block;min-width:0}.docs-presets{display:flex;gap:.375rem;flex-wrap:wrap}.docs-presets button[nbButton]{display:inline-flex;align-items:center;justify-content:center;gap:.25rem;height:1.5rem!important;min-height:1.5rem!important;padding-inline:.375rem!important;border-radius:var(--docs-radius, .375rem);font-size:.6875rem!important;font-weight:500;line-height:1;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}.docs-preset-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-preset-count{font-variant-numeric:tabular-nums;opacity:.7}\n"], dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PresetChipsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-preset-chips', template: `
		<div class="docs-presets" role="group">
			<button
				*ngFor="let chip of chips"
				nbButton
				size="tiny"
				[status]="isActive(chip) ? 'primary' : 'basic'"
				[appearance]="isActive(chip) ? 'filled' : 'outline'"
				(click)="toggle(chip)"
				[attr.aria-pressed]="isActive(chip)"
			>
				<span class="docs-preset-label">{{ chip.labelKey | translate }}</span>
				<span class="docs-preset-count" *ngIf="counts">({{ counts[chip.countKey] }})</span>
			</button>
		</div>
	`, standalone: false, styles: [":host{display:block;min-width:0}.docs-presets{display:flex;gap:.375rem;flex-wrap:wrap}.docs-presets button[nbButton]{display:inline-flex;align-items:center;justify-content:center;gap:.25rem;height:1.5rem!important;min-height:1.5rem!important;padding-inline:.375rem!important;border-radius:var(--docs-radius, .375rem);font-size:.6875rem!important;font-weight:500;line-height:1;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}.docs-preset-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-preset-count{font-variant-numeric:tabular-nums;opacity:.7}\n"] }]
        }], propDecorators: { counts: [{
                type: Input
            }], active: [{
                type: Input
            }], presetToggled: [{
                type: Output
            }] } });
//# sourceMappingURL=preset-chips.component.js.map