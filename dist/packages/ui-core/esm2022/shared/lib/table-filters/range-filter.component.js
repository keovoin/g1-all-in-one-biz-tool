import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DefaultFilter } from 'angular2-smart-table';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
export class RangeFilterComponent extends DefaultFilter {
    constructor() {
        super();
        this.rangeControl = new FormGroup({
            min: new FormControl(),
            max: new FormControl()
        });
    }
    ngOnInit() {
        // Subscribe to both min and max value changes with optimized operators
        this.subscription = this.rangeControl.valueChanges
            .pipe(debounceTime(this.debounceTime), // Reduce unnecessary requests
        distinctUntilChanged((prev, curr) => prev.min === curr.min && prev.max === curr.max), // Compare min and max values
        filter(({ min, max }) => min !== null || max !== null), // Only process when at least one value is provided
        tap(({ min, max }) => this.column.filterFunction({ min, max }, this.column.id)))
            .subscribe();
    }
    ngOnDestroy() {
        // Cleanup subscription to avoid memory leaks
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RangeFilterComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: RangeFilterComponent, isStandalone: false, selector: "ga-range-filter-selector", usesInheritance: true, ngImport: i0, template: `
		<div class="d-flex">
			<input
				[formControl]="rangeControl.controls.min"
				class="form-control me-2"
				placeholder="Min"
				type="number"
				aria-label="Minimum value"
			/>

			<span aria-hidden="true">-</span>
			<input
				[formControl]="rangeControl.controls.max"
				class="form-control"
				placeholder="Max"
				type="number"
				aria-label="Maximum value"
			/>
		</div>
	`, isInline: true, dependencies: [{ kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RangeFilterComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ga-range-filter-selector',
                    template: `
		<div class="d-flex">
			<input
				[formControl]="rangeControl.controls.min"
				class="form-control me-2"
				placeholder="Min"
				type="number"
				aria-label="Minimum value"
			/>

			<span aria-hidden="true">-</span>
			<input
				[formControl]="rangeControl.controls.max"
				class="form-control"
				placeholder="Max"
				type="number"
				aria-label="Maximum value"
			/>
		</div>
	`,
                    standalone: false
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=range-filter.component.js.map