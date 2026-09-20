import { Component } from '@angular/core';
import { DefaultFilter } from 'angular2-smart-table';
import * as i0 from "@angular/core";
import * as i1 from "../vendor-select/vendor-select.component";
import * as i2 from "@ngx-translate/core";
export class VendorFilterComponent extends DefaultFilter {
    constructor() {
        super();
    }
    /**
     *
     * @param changes
     */
    ngOnChanges(changes) { }
    /**
     *
     * @param value
     */
    selectedVendorEvent(value) {
        this.column.filterFunction(value, this.column.id);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: VendorFilterComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: VendorFilterComponent, isStandalone: false, selector: "ga-vendor-select-filter", usesInheritance: true, usesOnChanges: true, ngImport: i0, template: `
		<ga-vendor-select
			[clearable]="true"
			[searchable]="false"
			[addTag]="false"
			[placeholder]="'SM_TABLE.VENDOR' | translate"
			(onChanged)="selectedVendorEvent($event)"
		></ga-vendor-select>
	`, isInline: true, dependencies: [{ kind: "component", type: i1.VendorSelectComponent, selector: "ga-vendor-select", inputs: ["disabled", "placeholder", "clearable", "addTag", "searchable"], outputs: ["onChanged"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: VendorFilterComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ga-vendor-select-filter',
                    template: `
		<ga-vendor-select
			[clearable]="true"
			[searchable]="false"
			[addTag]="false"
			[placeholder]="'SM_TABLE.VENDOR' | translate"
			(onChanged)="selectedVendorEvent($event)"
		></ga-vendor-select>
	`,
                    standalone: false
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=vendor-filter.component.js.map