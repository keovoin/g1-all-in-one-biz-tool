import { OnChanges, SimpleChanges } from '@angular/core';
import { DefaultFilter } from 'angular2-smart-table';
import { IOrganizationContact } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class OrganizationContactFilterComponent extends DefaultFilter implements OnChanges {
    constructor();
    /**
     *
     *
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     *
     * @param value
     */
    onChange(value: IOrganizationContact): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationContactFilterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<OrganizationContactFilterComponent, "ga-contact-select-filter", never, {}, {}, never, never, false, never>;
}
