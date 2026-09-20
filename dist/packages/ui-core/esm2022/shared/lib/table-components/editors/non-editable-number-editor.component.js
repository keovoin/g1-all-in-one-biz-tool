import { Component, Input } from '@angular/core';
import { Cell, DefaultEditor } from 'angular2-smart-table';
import * as i0 from "@angular/core";
export class NonEditableNumberEditorComponent extends DefaultEditor {
    ngOnInit() {
        const value = this.cell.getValue();
        if (value === null || value === undefined) {
            console.warn('Cell value is null or undefined');
            this.cellValue = '';
        }
        else if (typeof value === 'number' || typeof value === 'string') {
            this.cellValue = value;
        }
        else {
            console.error('Unexpected cell value type:', typeof value);
            this.cellValue = '';
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NonEditableNumberEditorComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: NonEditableNumberEditorComponent, isStandalone: false, selector: "ng-component", inputs: { cell: "cell" }, usesInheritance: true, ngImport: i0, template: `
		<div>
			{{ cellValue }}
		</div>
	`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NonEditableNumberEditorComponent, decorators: [{
            type: Component,
            args: [{
                    template: `
		<div>
			{{ cellValue }}
		</div>
	`,
                    standalone: false
                }]
        }], propDecorators: { cell: [{
                type: Input
            }] } });
//# sourceMappingURL=non-editable-number-editor.component.js.map