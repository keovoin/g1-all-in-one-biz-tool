import { Component } from '@angular/core';
import { DefaultFilter } from 'angular2-smart-table';
import * as i0 from "@angular/core";
import * as i1 from "../product/product-category-selector/product-category-selector.component";
import * as i2 from "@ngx-translate/core";
export class ProductCategoryFilterComponent extends DefaultFilter {
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
    selectedProductCategoryEvent(value) {
        this.column.filterFunction(value, this.column.id);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductCategoryFilterComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ProductCategoryFilterComponent, isStandalone: false, selector: "ga-product-category-select-filter", usesInheritance: true, usesOnChanges: true, ngImport: i0, template: `
		<ngx-product-category-selector
			[placeholder]="'INVENTORY_PAGE.PRODUCT_CATEGORY' | translate"
			[addTag]="false"
			[label]="''"
			(onChanged)="selectedProductCategoryEvent($event)"
		></ngx-product-category-selector>
	`, isInline: true, dependencies: [{ kind: "component", type: i1.ProductCategorySelectorComponent, selector: "ngx-product-category-selector", inputs: ["disabled", "placeholder", "addTag", "label"], outputs: ["onChanged", "onLoaded"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductCategoryFilterComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ga-product-category-select-filter',
                    template: `
		<ngx-product-category-selector
			[placeholder]="'INVENTORY_PAGE.PRODUCT_CATEGORY' | translate"
			[addTag]="false"
			[label]="''"
			(onChanged)="selectedProductCategoryEvent($event)"
		></ngx-product-category-selector>
	`,
                    standalone: false
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=product-category-filter.component.js.map