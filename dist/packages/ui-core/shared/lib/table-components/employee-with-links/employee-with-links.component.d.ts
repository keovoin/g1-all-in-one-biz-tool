import { Router } from '@angular/router';
import { IEmployee } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import { IPersonListItem } from '../people-list/people-list.component';
import * as i0 from "@angular/core";
/**
 * Grid cell renderer for "the people on this record" — Members, Managers,
 * Employees, Interviewers, Assigned To.
 *
 * The rendering itself lives in `ngx-people-list`, which is shared with every
 * other people column so they all look the same; this component only owns the
 * navigation that is specific to an employee.
 */
export declare class EmployeeWithLinksComponent {
    private readonly store;
    private readonly router;
    rowData: any;
    value: any;
    constructor(store: Store, router: Router);
    /**
     * Selects an employee and opens their statistics page.
     *
     * @param person The person that was clicked in the list.
     */
    selectEmployee(person: IPersonListItem): void;
    /**
     * Navigates to the employee statistics page.
     *
     * @param {IEmployee['id']} id - The ID of the employee.
     * @return {void} This function does not return a value.
     */
    navigateToEmployeeStatistics(id: IEmployee['id']): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeWithLinksComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EmployeeWithLinksComponent, "ngx-employee-with-links", never, { "rowData": { "alias": "rowData"; "required": false; }; "value": { "alias": "value"; "required": false; }; }, {}, never, never, false, never>;
}
