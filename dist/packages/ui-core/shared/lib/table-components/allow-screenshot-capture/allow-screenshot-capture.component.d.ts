import { EventEmitter, OnInit } from '@angular/core';
import { IEmployee } from '@gauzy/contracts';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class AllowScreenshotCaptureComponent implements OnInit {
    value: string | number;
    allowScreenshotCaptureChange: EventEmitter<boolean>;
    private _rowData;
    private _allowed$;
    constructor();
    ngOnInit(): void;
    onCheckedChange(event: boolean): void;
    get allowed(): boolean;
    get allowed$(): Observable<boolean>;
    set rowData(value: IEmployee);
    get rowData(): IEmployee;
    static ɵfac: i0.ɵɵFactoryDeclaration<AllowScreenshotCaptureComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AllowScreenshotCaptureComponent, "gauzy-allow-screenshot-capture", never, { "value": { "alias": "value"; "required": false; }; "rowData": { "alias": "rowData"; "required": false; }; }, { "allowScreenshotCaptureChange": "allowScreenshotCaptureChange"; }, never, never, false, never>;
}
