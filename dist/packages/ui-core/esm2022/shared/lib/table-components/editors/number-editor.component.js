import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Cell, DefaultEditor } from 'angular2-smart-table';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
export class NumberEditorComponent extends DefaultEditor {
    constructor() {
        super();
        this.onConfirm = new EventEmitter();
    }
    ngOnInit() {
        // Get the value from the cell
        if (this.cell.getValue()) {
            // Set the cell value to the new raw value
            this.cellValue = this.cell.getNewRawValue();
            // Set the value on the cell
            this.cell.setValue(this.cell.getNewRawValue());
        }
    }
    /**
     * Handles the input change event.
     *
     * @param event - The input change event.
     */
    onInputChange(event) {
        // Get the input element
        const inputElement = event.target;
        // Get the value from the input element
        const value = inputElement.value;
        // Set the value on the cell
        this.cell.setValue(value);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NumberEditorComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: NumberEditorComponent, isStandalone: false, selector: "ng-component", inputs: { cell: "cell" }, outputs: { onConfirm: "onConfirm" }, usesInheritance: true, ngImport: i0, template: `<input
		class="form-control"
		[min]="0"
		[type]="'number'"
		[(ngModel)]="cellValue"
		(input)="onInputChange($event)"
		[name]="cell.getId()"
	/>`, isInline: true, dependencies: [{ kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NumberEditorComponent, decorators: [{
            type: Component,
            args: [{
                    template: `<input
		class="form-control"
		[min]="0"
		[type]="'number'"
		[(ngModel)]="cellValue"
		(input)="onInputChange($event)"
		[name]="cell.getId()"
	/>`,
                    standalone: false
                }]
        }], ctorParameters: () => [], propDecorators: { cell: [{
                type: Input
            }], onConfirm: [{
                type: Output
            }] } });
//# sourceMappingURL=number-editor.component.js.map