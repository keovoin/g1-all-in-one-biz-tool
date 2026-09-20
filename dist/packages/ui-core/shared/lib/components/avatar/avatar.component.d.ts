import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ID, IEmployee } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class AvatarComponent implements OnInit {
    private readonly router;
    online$: Observable<boolean>;
    size: 'lg' | 'sm' | 'md';
    src: string;
    appendCaption: string;
    caption: string;
    id: ID;
    isOption: boolean;
    /**
     * A class member and getter/setter for managing an employee object.
     */
    private _employee;
    set employee(value: IEmployee);
    get employee(): IEmployee;
    set value(object: any);
    /**
     * A class member and getter/setter for managing an employee name.
     */
    private _name;
    set name(value: string);
    get name(): string;
    constructor(router: Router);
    ngOnInit(): void;
    /**
     * Navigates to the employee edit page based on the provided employee ID.
     *
     * @param id - The ID of the employee to edit.
     */
    edit(id: ID): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AvatarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AvatarComponent, "ngx-avatar", never, { "size": { "alias": "size"; "required": false; }; "src": { "alias": "src"; "required": false; }; "appendCaption": { "alias": "appendCaption"; "required": false; }; "caption": { "alias": "caption"; "required": false; }; "id": { "alias": "id"; "required": false; }; "isOption": { "alias": "isOption"; "required": false; }; "employee": { "alias": "employee"; "required": false; }; "value": { "alias": "value"; "required": false; }; "name": { "alias": "name"; "required": false; }; }, {}, never, never, false, never>;
}
