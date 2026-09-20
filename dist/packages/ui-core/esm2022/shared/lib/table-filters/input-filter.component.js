import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { DefaultFilter } from 'angular2-smart-table';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
export class InputFilterComponent extends DefaultFilter {
    constructor() {
        super();
        this.inputControl = new FormControl();
    }
    ngOnInit() {
        // Subscribe to value changes of the inputControl
        this.subscription = this.inputControl.valueChanges
            .pipe(
        // Apply a debounce time to reduce the frequency of value changes
        debounceTime(this.debounceTime), 
        // Ensure distinct values to avoid redundant operations
        distinctUntilChanged(), 
        // Use tap to perform a side effect, invoking the filterFunction of the column
        tap((value) => this.column.filterFunction(value, this.column.id)))
            // Subscribe to the observable
            .subscribe();
    }
    /**
     *
     * @param changes
     */
    ngOnChanges(changes) { }
    /**
     * Lifecycle hook called just before the component is destroyed.
     */
    ngOnDestroy() {
        // Unsubscribe from the subscription to avoid memory leaks.
        this.subscription.unsubscribe();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InputFilterComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: InputFilterComponent, isStandalone: false, selector: "ga-input-filter-selector", usesInheritance: true, usesOnChanges: true, ngImport: i0, template: ` <input [formControl]="inputControl" class="form-control" [placeholder]="column.title" /> `, isInline: true, dependencies: [{ kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InputFilterComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ga-input-filter-selector',
                    template: ` <input [formControl]="inputControl" class="form-control" [placeholder]="column.title" /> `,
                    standalone: false
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=input-filter.component.js.map