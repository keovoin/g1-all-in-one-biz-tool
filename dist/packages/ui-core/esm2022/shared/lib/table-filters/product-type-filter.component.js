import { Component } from '@angular/core';
import { DefaultFilter } from 'angular2-smart-table';
import * as i0 from "@angular/core";
import * as i1 from "../product/product-type-selector/product-type-selector.component";
import * as i2 from "@ngx-translate/core";
export class ProductTypeFilterComponent extends DefaultFilter {
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
    selectedProductTypeEvent(value) {
        this.column.filterFunction(value, this.column.id);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductTypeFilterComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ProductTypeFilterComponent, isStandalone: false, selector: "ga-product-type-select-filter", usesInheritance: true, usesOnChanges: true, ngImport: i0, template: `
		<ngx-product-type-selector
			[placeholder]="'INVENTORY_PAGE.PRODUCT_TYPE' | translate"
			[addTag]="false"
			[label]="''"
			(onChanged)="selectedProductTypeEvent($event)"
		></ngx-product-type-selector>
	`, isInline: true, dependencies: [{ kind: "component", type: i1.ProductTypeSelectorComponent, selector: "ngx-product-type-selector", inputs: ["disabled", "placeholder", "label", "addTag"], outputs: ["onChanged", "onLoaded"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductTypeFilterComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ga-product-type-select-filter',
                    template: `
		<ngx-product-type-selector
			[placeholder]="'INVENTORY_PAGE.PRODUCT_TYPE' | translate"
			[addTag]="false"
			[label]="''"
			(onChanged)="selectedProductTypeEvent($event)"
		></ngx-product-type-selector>
	`,
                    standalone: false
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=product-type-filter.component.js.map