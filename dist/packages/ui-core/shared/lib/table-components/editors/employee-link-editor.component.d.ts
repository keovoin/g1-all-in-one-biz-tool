import { OnInit } from '@angular/core';
import { IUser } from '@gauzy/contracts';
import { Cell, DefaultEditor } from 'angular2-smart-table';
import * as i0 from "@angular/core";
export declare class EmployeeLinkEditorComponent extends DefaultEditor implements OnInit {
    cell: Cell;
    value: IUser;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeLinkEditorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EmployeeLinkEditorComponent, "ng-component", never, { "cell": { "alias": "cell"; "required": false; }; }, {}, never, never, false, never>;
}
