import { OnInit } from '@angular/core';
import { IOrganization } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class IncomeTableComponent implements OnInit {
    private readonly store;
    organization: IOrganization;
    rowData: any;
    value: string | number;
    constructor(store: Store);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<IncomeTableComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IncomeTableComponent, "ga-income-table-selector", never, { "rowData": { "alias": "rowData"; "required": false; }; "value": { "alias": "value"; "required": false; }; }, {}, never, never, false, never>;
}
