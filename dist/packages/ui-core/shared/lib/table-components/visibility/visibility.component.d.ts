import { EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class VisibilityComponent implements OnInit {
    value: string | number;
    visibilityChange: EventEmitter<boolean>;
    private _rowData;
    private _visibility$;
    constructor();
    ngOnInit(): void;
    onCheckedChange(event: boolean): void;
    get visibility$(): Observable<boolean>;
    set rowData(value: any);
    get rowData(): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<VisibilityComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<VisibilityComponent, "gauzy-visibility", never, { "value": { "alias": "value"; "required": false; }; "rowData": { "alias": "rowData"; "required": false; }; }, { "visibilityChange": "visibilityChange"; }, never, never, false, never>;
}
