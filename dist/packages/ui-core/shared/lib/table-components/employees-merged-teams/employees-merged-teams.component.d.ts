import { OnInit } from '@angular/core';
import { IEmployee } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class EmployeesMergedTeamsComponent implements OnInit {
    value: any;
    rowData: any;
    employees: IEmployee[];
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeesMergedTeamsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EmployeesMergedTeamsComponent, "ngx-employees-merged-teams", never, { "value": { "alias": "value"; "required": false; }; "rowData": { "alias": "rowData"; "required": false; }; }, {}, never, never, false, never>;
}
