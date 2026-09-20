import { OnChanges, SimpleChanges } from '@angular/core';
import { DefaultFilter } from 'angular2-smart-table';
import { IProductTypeTranslated } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class ProductTypeFilterComponent extends DefaultFilter implements OnChanges {
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
    selectedProductTypeEvent(value: IProductTypeTranslated): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProductTypeFilterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProductTypeFilterComponent, "ga-product-type-select-filter", never, {}, {}, never, never, false, never>;
}
