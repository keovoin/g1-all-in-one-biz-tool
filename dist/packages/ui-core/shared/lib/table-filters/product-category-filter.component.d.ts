import { OnChanges, SimpleChanges } from '@angular/core';
import { DefaultFilter } from 'angular2-smart-table';
import { IProductCategoryTranslated } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class ProductCategoryFilterComponent extends DefaultFilter implements OnChanges {
    constructor();
    /**
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     *
     * @param value
     */
    selectedProductCategoryEvent(value: IProductCategoryTranslated): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProductCategoryFilterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProductCategoryFilterComponent, "ga-product-category-select-filter", never, {}, {}, never, never, false, never>;
}
