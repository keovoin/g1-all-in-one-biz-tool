import { OnInit } from '@angular/core';
import { IOrganization } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class InvoiceTotalValueComponent implements OnInit {
    private readonly store;
    value: string;
    rowData: any;
    organization: IOrganization;
    constructor(store: Store);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<InvoiceTotalValueComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<InvoiceTotalValueComponent, "ga-invoice-total-amount", never, { "value": { "alias": "value"; "required": false; }; "rowData": { "alias": "rowData"; "required": false; }; }, {}, never, never, false, never>;
}
