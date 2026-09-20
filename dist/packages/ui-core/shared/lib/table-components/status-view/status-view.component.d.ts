import { OnInit } from '@angular/core';
import { NbComponentStatus } from '@nebular/theme';
import * as i0 from "@angular/core";
export declare class StatusViewComponent implements OnInit {
    value: string;
    rowData: any;
    status: NbComponentStatus;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<StatusViewComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<StatusViewComponent, "ngx-status-view", never, { "value": { "alias": "value"; "required": false; }; "rowData": { "alias": "rowData"; "required": false; }; }, {}, never, never, false, never>;
}
