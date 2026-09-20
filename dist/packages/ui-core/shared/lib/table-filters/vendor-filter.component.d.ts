import { OnChanges, SimpleChanges } from '@angular/core';
import { DefaultFilter } from 'angular2-smart-table';
import { IOrganizationVendor } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class VendorFilterComponent extends DefaultFilter implements OnChanges {
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
    selectedVendorEvent(value: IOrganizationVendor): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<VendorFilterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<VendorFilterComponent, "ga-vendor-select-filter", never, {}, {}, never, never, false, never>;
}
