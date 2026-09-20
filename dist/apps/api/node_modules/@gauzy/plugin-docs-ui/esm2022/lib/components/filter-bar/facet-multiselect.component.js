import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
import * as i3 from "@ng-select/ng-select";
import * as i4 from "@ngx-translate/core";
/**
 * Generic multi-select facet dropdown over `{ label, value, count }[]`, built on
 * ng-select.
 */
export class FacetMultiselectComponent {
    constructor() {
        this.buckets = [];
        this.selected = [];
        this.labelKey = '';
        this.selectionChange = new EventEmitter();
        this.options = [];
        /** Reference-stable mirror of `selected`. */
        this.selectedValues = [];
        /** Content fingerprint of the last-built options. */
        this.optionsSignature = '';
        /** Content fingerprint of selectedValues. */
        this.selectedSignature = '';
    }
    ngOnChanges() {
        const buckets = this.buckets ?? [];
        const selected = this.selected ?? [];
        const known = new Set(buckets.map((bucket) => bucket.value));
        const stale = selected.filter((value) => !known.has(value));
        // Resolved labels are part of the fingerprint so locale changes
        // correctly rebuild the options.
        const signature = JSON.stringify([
            buckets.map((bucket) => [bucket.value, this.resolveLabel(bucket.value, bucket.label), bucket.count]),
            stale.map((value) => [value, this.resolveLabel(value)])
        ]);
        if (signature !== this.optionsSignature) {
            this.optionsSignature = signature;
            this.options = [
                ...buckets.map((bucket) => ({
                    value: bucket.value,
                    label: this.resolveLabel(bucket.value, bucket.label),
                    count: bucket.count
                })),
                // Keep stale selected values visible.
                ...stale.map((value) => ({
                    value,
                    label: this.resolveLabel(value)
                }))
            ];
        }
        const selectedSignature = JSON.stringify(selected);
        if (selectedSignature !== this.selectedSignature) {
            this.selectedSignature = selectedSignature;
            this.selectedValues = [...selected];
        }
    }
    /**
     * Stable identity for ng-select items.
     */
    trackByValue(option) {
        return option.value;
    }
    onSelectedChange(values) {
        const next = values ?? [];
        // Keep the local mirror synchronized before the parent/store
        // sends the updated values back.
        this.selectedSignature = JSON.stringify(next);
        this.selectedValues = next;
        this.selectionChange.emit(next);
    }
    resolveLabel(value, label) {
        if (label) {
            return label;
        }
        return this.labelFor ? this.labelFor(value) : value;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FacetMultiselectComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: FacetMultiselectComponent, isStandalone: false, selector: "gz-docs-facet-multiselect", inputs: { buckets: "buckets", selected: "selected", labelKey: "labelKey", labelFor: "labelFor" }, outputs: { selectionChange: "selectionChange" }, usesOnChanges: true, ngImport: i0, template: `
		<ng-select
			[items]="options"
			bindLabel="label"
			bindValue="value"
			[trackByFn]="trackByValue"
			[multiple]="true"
			[closeOnSelect]="false"
			[searchable]="false"
			appendTo="body"
			[placeholder]="labelKey | translate"
			[ngModel]="selectedValues"
			(ngModelChange)="onSelectedChange($event)"
		>
			<ng-template ng-option-tmp let-option="item">
				<div class="docs-facet-option">
					<span>{{ option.label }}</span>
					<span class="docs-facet-count" *ngIf="option.count !== undefined"> ({{ option.count }}) </span>
				</div>
			</ng-template>
		</ng-select>
	`, isInline: true, styles: [":host{display:block;width:100%;min-width:0}::ng-deep .ng-select .ng-select-container{display:flex;align-items:center!important;min-height:1.75rem}::ng-deep .ng-select .ng-value-container{display:flex;align-items:center!important;min-height:1.75rem;max-height:3.5rem;overflow-y:auto;overflow-x:hidden;padding-top:0!important;padding-bottom:0!important;font-size:10px!important;line-height:1!important;scrollbar-width:thin}::ng-deep .ng-select .ng-value{display:inline-flex;align-items:center;font-size:10px!important;line-height:1!important}::ng-deep .ng-select .ng-value-label{display:inline-flex;align-items:center;font-size:10px!important;line-height:1!important}::ng-deep .ng-select .ng-placeholder{display:flex;align-items:center;height:1.75rem;margin:0!important;padding:0!important;font-size:10px!important;line-height:1!important}::ng-deep .ng-select .ng-input{display:flex;align-items:center;height:1.75rem;padding:0!important}::ng-deep .ng-select .ng-input>input{height:1.75rem!important;padding:0!important;font-size:10px!important;line-height:1!important}::ng-deep .ng-select .ng-arrow-wrapper,::ng-deep .ng-select .ng-clear-wrapper{display:inline-flex;align-items:center;justify-content:center;height:100%}::ng-deep .ng-dropdown-panel .ng-option{display:flex;align-items:center;min-height:1.75rem;padding-top:0!important;padding-bottom:0!important;font-size:10px!important;line-height:1.2!important}::ng-deep .ng-dropdown-panel .ng-option-label{display:flex;align-items:center;font-size:10px!important;line-height:1.2!important}.docs-facet-option{display:flex;align-items:center;gap:.25rem;width:100%;font-size:10px;line-height:1.2}.docs-facet-count{color:var(--docs-text-muted, var(--text-hint-color));font-size:10px;font-variant-numeric:tabular-nums}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i3.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "directive", type: i3.NgOptionTemplateDirective, selector: "[ng-option-tmp]" }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FacetMultiselectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-facet-multiselect', template: `
		<ng-select
			[items]="options"
			bindLabel="label"
			bindValue="value"
			[trackByFn]="trackByValue"
			[multiple]="true"
			[closeOnSelect]="false"
			[searchable]="false"
			appendTo="body"
			[placeholder]="labelKey | translate"
			[ngModel]="selectedValues"
			(ngModelChange)="onSelectedChange($event)"
		>
			<ng-template ng-option-tmp let-option="item">
				<div class="docs-facet-option">
					<span>{{ option.label }}</span>
					<span class="docs-facet-count" *ngIf="option.count !== undefined"> ({{ option.count }}) </span>
				</div>
			</ng-template>
		</ng-select>
	`, standalone: false, styles: [":host{display:block;width:100%;min-width:0}::ng-deep .ng-select .ng-select-container{display:flex;align-items:center!important;min-height:1.75rem}::ng-deep .ng-select .ng-value-container{display:flex;align-items:center!important;min-height:1.75rem;max-height:3.5rem;overflow-y:auto;overflow-x:hidden;padding-top:0!important;padding-bottom:0!important;font-size:10px!important;line-height:1!important;scrollbar-width:thin}::ng-deep .ng-select .ng-value{display:inline-flex;align-items:center;font-size:10px!important;line-height:1!important}::ng-deep .ng-select .ng-value-label{display:inline-flex;align-items:center;font-size:10px!important;line-height:1!important}::ng-deep .ng-select .ng-placeholder{display:flex;align-items:center;height:1.75rem;margin:0!important;padding:0!important;font-size:10px!important;line-height:1!important}::ng-deep .ng-select .ng-input{display:flex;align-items:center;height:1.75rem;padding:0!important}::ng-deep .ng-select .ng-input>input{height:1.75rem!important;padding:0!important;font-size:10px!important;line-height:1!important}::ng-deep .ng-select .ng-arrow-wrapper,::ng-deep .ng-select .ng-clear-wrapper{display:inline-flex;align-items:center;justify-content:center;height:100%}::ng-deep .ng-dropdown-panel .ng-option{display:flex;align-items:center;min-height:1.75rem;padding-top:0!important;padding-bottom:0!important;font-size:10px!important;line-height:1.2!important}::ng-deep .ng-dropdown-panel .ng-option-label{display:flex;align-items:center;font-size:10px!important;line-height:1.2!important}.docs-facet-option{display:flex;align-items:center;gap:.25rem;width:100%;font-size:10px;line-height:1.2}.docs-facet-count{color:var(--docs-text-muted, var(--text-hint-color));font-size:10px;font-variant-numeric:tabular-nums}\n"] }]
        }], propDecorators: { buckets: [{
                type: Input
            }], selected: [{
                type: Input
            }], labelKey: [{
                type: Input
            }], labelFor: [{
                type: Input
            }], selectionChange: [{
                type: Output
            }] } });
//# sourceMappingURL=facet-multiselect.component.js.map