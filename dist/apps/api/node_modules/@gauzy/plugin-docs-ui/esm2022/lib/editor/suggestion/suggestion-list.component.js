import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { NbIconModule } from '@nebular/theme';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@nebular/theme";
/**
 * Generic listbox rendered inside the shared suggestion overlay (spec 05 §6.4).
 * Keyboard state is driven imperatively by `SuggestionHostService` (the editor
 * keeps focus; `aria-activedescendant` points here).
 */
export class SuggestionListComponent {
    constructor() {
        this.cdr = inject(ChangeDetectorRef);
        this.items = [];
        this.activeIndex = 0;
        this.ariaLabel = '';
        this.emptyLabel = '';
        /** Set by the host; invoked with the chosen item. */
        this.onSelect = () => void 0;
    }
    setItems(items, emptyLabel, ariaLabel) {
        this.items = items;
        this.emptyLabel = emptyLabel;
        this.ariaLabel = ariaLabel;
        this.activeIndex = Math.min(this.activeIndex, Math.max(0, items.length - 1));
        this.cdr.markForCheck();
    }
    isGroupStart(index) {
        return index === 0 || this.items[index - 1]?.group !== this.items[index]?.group;
    }
    setActive(index) {
        this.activeIndex = index;
        this.cdr.markForCheck();
    }
    move(delta) {
        if (!this.items.length)
            return;
        this.activeIndex = (this.activeIndex + delta + this.items.length) % this.items.length;
        this.cdr.markForCheck();
        this.scrollActiveIntoView();
    }
    select(index = this.activeIndex) {
        const item = this.items[index];
        if (item && !item.disabled)
            this.onSelect(item);
    }
    get activeDescendantId() {
        return this.items.length ? `gz-suggestion-option-${this.activeIndex}` : null;
    }
    scrollActiveIntoView() {
        requestAnimationFrame(() => {
            document.getElementById(`gz-suggestion-option-${this.activeIndex}`)?.scrollIntoView({ block: 'nearest' });
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SuggestionListComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: SuggestionListComponent, isStandalone: true, selector: "gz-suggestion-list", ngImport: i0, template: `
		<div class="gz-suggestion-list" role="listbox" [attr.aria-label]="ariaLabel">
			<ng-container *ngFor="let item of items; let i = index">
				<div class="gz-suggestion-group" *ngIf="item.group && isGroupStart(i)" role="presentation">
					{{ item.group }}
				</div>
				<button
					type="button"
					class="gz-suggestion-item"
					role="option"
					[id]="'gz-suggestion-option-' + i"
					[class.active]="i === activeIndex"
					[attr.aria-selected]="i === activeIndex"
					[disabled]="item.disabled"
					(mousedown)="$event.preventDefault()"
					(mouseenter)="setActive(i)"
					(click)="select(i)"
				>
					<span class="gz-suggestion-glyph" *ngIf="item.glyph">{{ item.glyph }}</span>
					<nb-icon
						*ngIf="!item.glyph && item.icon && item.pack !== 'fa'"
						[icon]="item.icon"
						class="gz-suggestion-icon"
					></nb-icon>
					<i *ngIf="!item.glyph && item.icon && item.pack === 'fa'" class="{{ item.icon }} gz-suggestion-icon"></i>
					<span class="gz-suggestion-label">{{ item.label }}</span>
					<span class="gz-suggestion-hint" *ngIf="item.hint">{{ item.hint }}</span>
				</button>
			</ng-container>
			<div class="gz-suggestion-empty" *ngIf="!items.length">{{ emptyLabel }}</div>
		</div>
	`, isInline: true, styles: [".gz-suggestion-list{min-width:14rem;max-width:20rem;max-height:19rem;overflow-y:auto;padding:.25rem;border-radius:var(--border-radius);border:1px solid var(--border-basic-color-3);background:var(--background-basic-color-1);box-shadow:var(--shadow)}.gz-suggestion-group{padding:.375rem .5rem .125rem;font-size:.6875rem;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--text-hint-color)}.gz-suggestion-item{display:flex;align-items:center;gap:.5rem;width:100%;border:none;background:transparent;border-radius:.25rem;padding:.375rem .5rem;cursor:pointer;text-align:left;color:var(--text-basic-color);font-size:.875rem}.gz-suggestion-item.active{background:var(--color-primary-transparent-100)}.gz-suggestion-item:disabled{opacity:.4;cursor:default}.gz-suggestion-icon{font-size:1rem;width:1.25rem;text-align:center;color:var(--text-hint-color)}.gz-suggestion-glyph{width:1.25rem;text-align:center}.gz-suggestion-label{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.gz-suggestion-hint{font-size:.75rem;color:var(--text-hint-color)}.gz-suggestion-empty{padding:.5rem;font-size:.875rem;color:var(--text-hint-color)}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "ngmodule", type: NbIconModule }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SuggestionListComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-suggestion-list', standalone: true, imports: [CommonModule, NbIconModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `
		<div class="gz-suggestion-list" role="listbox" [attr.aria-label]="ariaLabel">
			<ng-container *ngFor="let item of items; let i = index">
				<div class="gz-suggestion-group" *ngIf="item.group && isGroupStart(i)" role="presentation">
					{{ item.group }}
				</div>
				<button
					type="button"
					class="gz-suggestion-item"
					role="option"
					[id]="'gz-suggestion-option-' + i"
					[class.active]="i === activeIndex"
					[attr.aria-selected]="i === activeIndex"
					[disabled]="item.disabled"
					(mousedown)="$event.preventDefault()"
					(mouseenter)="setActive(i)"
					(click)="select(i)"
				>
					<span class="gz-suggestion-glyph" *ngIf="item.glyph">{{ item.glyph }}</span>
					<nb-icon
						*ngIf="!item.glyph && item.icon && item.pack !== 'fa'"
						[icon]="item.icon"
						class="gz-suggestion-icon"
					></nb-icon>
					<i *ngIf="!item.glyph && item.icon && item.pack === 'fa'" class="{{ item.icon }} gz-suggestion-icon"></i>
					<span class="gz-suggestion-label">{{ item.label }}</span>
					<span class="gz-suggestion-hint" *ngIf="item.hint">{{ item.hint }}</span>
				</button>
			</ng-container>
			<div class="gz-suggestion-empty" *ngIf="!items.length">{{ emptyLabel }}</div>
		</div>
	`, styles: [".gz-suggestion-list{min-width:14rem;max-width:20rem;max-height:19rem;overflow-y:auto;padding:.25rem;border-radius:var(--border-radius);border:1px solid var(--border-basic-color-3);background:var(--background-basic-color-1);box-shadow:var(--shadow)}.gz-suggestion-group{padding:.375rem .5rem .125rem;font-size:.6875rem;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--text-hint-color)}.gz-suggestion-item{display:flex;align-items:center;gap:.5rem;width:100%;border:none;background:transparent;border-radius:.25rem;padding:.375rem .5rem;cursor:pointer;text-align:left;color:var(--text-basic-color);font-size:.875rem}.gz-suggestion-item.active{background:var(--color-primary-transparent-100)}.gz-suggestion-item:disabled{opacity:.4;cursor:default}.gz-suggestion-icon{font-size:1rem;width:1.25rem;text-align:center;color:var(--text-hint-color)}.gz-suggestion-glyph{width:1.25rem;text-align:center}.gz-suggestion-label{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.gz-suggestion-hint{font-size:.75rem;color:var(--text-hint-color)}.gz-suggestion-empty{padding:.5rem;font-size:.875rem;color:var(--text-hint-color)}\n"] }]
        }] });
//# sourceMappingURL=suggestion-list.component.js.map