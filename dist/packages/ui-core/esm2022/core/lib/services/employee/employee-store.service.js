import { __decorate, __metadata } from "tslib";
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Query, Store as AkitaStore, StoreConfig } from '@datorama/akita';
import * as i0 from "@angular/core";
let EmployeeAkitaStore = class EmployeeAkitaStore extends AkitaStore {
    constructor() {
        super({});
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeAkitaStore, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeAkitaStore, providedIn: 'root' }); }
};
EmployeeAkitaStore = __decorate([
    StoreConfig({ name: 'employee', resettable: true }),
    __metadata("design:paramtypes", [])
], EmployeeAkitaStore);
export { EmployeeAkitaStore };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeAkitaStore, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });
export class EmployeeAkitaQuery extends Query {
    constructor(store) {
        super(store);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeAkitaQuery, deps: [{ token: EmployeeAkitaStore }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeAkitaQuery, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeAkitaQuery, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: EmployeeAkitaStore }] });
/**
 * Service used to update employee
 */
export class EmployeeStore {
    constructor(employeeAkitaStore, employeeAkitaQuery) {
        this.employeeAkitaStore = employeeAkitaStore;
        this.employeeAkitaQuery = employeeAkitaQuery;
        this.selectedEmployee$ = new BehaviorSubject(this.selectedEmployee);
        this.userForm$ = new BehaviorSubject(this.userForm);
        this.employeeForm$ = new BehaviorSubject(this.employeeForm);
        this.employeeAction$ = this.employeeAkitaQuery.select(({ action, employees }) => {
            return { action, employees };
        });
    }
    set selectedEmployee(employee) {
        this._selectedEmployee = employee;
        this.selectedEmployee$.next(employee);
    }
    get selectedEmployee() {
        return this._selectedEmployee;
    }
    set employeeAction({ action, employees }) {
        this.employeeAkitaStore.update({
            action,
            employees
        });
    }
    set userForm(user) {
        this._userForm = user;
        this.userForm$.next(user);
    }
    get userForm() {
        return this._userForm;
    }
    set employeeForm(employee) {
        this._employeeForm = employee;
        this.employeeForm$.next(employee);
    }
    get employeeForm() {
        return this._employeeForm;
    }
    /**
     * Update the user form with new data
     *
     * @param formData - The form data to update.
     */
    async updateUserForm(formData) {
        // Simulate an async operation, such as an API call
        // await someApiService.update(formData);
        this.userForm = { ...this.userForm, ...formData };
    }
    /**
     * Update the employee form with new data
     *
     * @param formData - The form data to update.
     */
    async updateEmployeeForm(formData) {
        // Simulate an async operation, such as an API call
        // await someApiService.updateEmployee(formData);
        this.employeeForm = { ...this.employeeForm, ...formData };
    }
    destroy() {
        this.employeeAkitaStore.reset();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeStore, deps: [{ token: EmployeeAkitaStore }, { token: EmployeeAkitaQuery }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeStore }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeStore, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: EmployeeAkitaStore }, { type: EmployeeAkitaQuery }] });
//# sourceMappingURL=employee-store.service.js.map