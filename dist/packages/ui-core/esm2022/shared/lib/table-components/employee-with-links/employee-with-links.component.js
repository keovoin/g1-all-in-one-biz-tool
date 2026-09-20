import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@angular/router";
import * as i3 from "../people-list/people-list.component";
/**
 * Grid cell renderer for "the people on this record" — Members, Managers,
 * Employees, Interviewers, Assigned To.
 *
 * The rendering itself lives in `ngx-people-list`, which is shared with every
 * other people column so they all look the same; this component only owns the
 * navigation that is specific to an employee.
 */
export class EmployeeWithLinksComponent {
    constructor(store, router) {
        this.store = store;
        this.router = router;
    }
    /**
     * Selects an employee and opens their statistics page.
     *
     * @param person The person that was clicked in the list.
     */
    selectEmployee(person) {
        const employee = person?.raw;
        if (!employee?.id) {
            return;
        }
        this.store.selectedEmployee = {
            ...employee,
            firstName: employee?.user?.firstName,
            lastName: employee?.user?.lastName,
            imageUrl: person.imageUrl
        };
        this.navigateToEmployeeStatistics(employee.id);
    }
    /**
     * Navigates to the employee statistics page.
     *
     * @param {IEmployee['id']} id - The ID of the employee.
     * @return {void} This function does not return a value.
     */
    navigateToEmployeeStatistics(id) {
        if (id)
            this.router.navigate([`/pages/employees/edit/${id}/account`]);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeWithLinksComponent, deps: [{ token: i1.Store }, { token: i2.Router }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: EmployeeWithLinksComponent, isStandalone: false, selector: "ngx-employee-with-links", inputs: { rowData: "rowData", value: "value" }, ngImport: i0, template: "<ngx-people-list [people]=\"value\" (selectPerson)=\"selectEmployee($event)\"></ngx-people-list>\n", dependencies: [{ kind: "component", type: i3.PeopleListComponent, selector: "ngx-people-list", inputs: ["people", "maxNames", "maxAvatars", "wrap"], outputs: ["selectPerson"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeWithLinksComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-employee-with-links', standalone: false, template: "<ngx-people-list [people]=\"value\" (selectPerson)=\"selectEmployee($event)\"></ngx-people-list>\n" }]
        }], ctorParameters: () => [{ type: i1.Store }, { type: i2.Router }], propDecorators: { rowData: [{
                type: Input
            }], value: [{
                type: Input
            }] } });
//# sourceMappingURL=employee-with-links.component.js.map