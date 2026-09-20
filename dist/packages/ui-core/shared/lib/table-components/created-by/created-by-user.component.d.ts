import { Router } from '@angular/router';
import { ID, IUser } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class CreatedByUserComponent<Entity = any> {
    private readonly router;
    value: any;
    rowData: Entity;
    constructor(router: Router);
    /**
     * Resolves the *employee* id of the given user, if the user has an employee profile.
     *
     * `createdByUser.id` is a user id, while `/pages/employees/edit/:id` is keyed by employee id —
     * navigating with the former resolves to nothing and silently bounces back to Manage Employees.
     *
     * @param user - The user who created the record.
     * @returns The employee id, or `undefined` when the user has no employee profile.
     */
    employeeId(user: IUser): ID | undefined;
    /**
     * Navigates to the employee edit page of the given user, when that user is an employee.
     *
     * @param user - The user who created the record.
     */
    edit(user: IUser): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CreatedByUserComponent<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CreatedByUserComponent<any>, "ngx-created-by-user", never, { "value": { "alias": "value"; "required": false; }; "rowData": { "alias": "rowData"; "required": false; }; }, {}, never, never, false, never>;
}
