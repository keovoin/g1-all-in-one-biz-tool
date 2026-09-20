import { OnInit } from '@angular/core';
import { Cell, DefaultEditor } from 'angular2-smart-table';
import * as i0 from "@angular/core";
export declare class NonEditableNumberEditorComponent extends DefaultEditor implements OnInit {
    cellValue: string | number;
    cell: Cell;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NonEditableNumberEditorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NonEditableNumberEditorComponent, "ng-component", never, { "cell": { "alias": "cell"; "required": false; }; }, {}, never, never, false, never>;
}
