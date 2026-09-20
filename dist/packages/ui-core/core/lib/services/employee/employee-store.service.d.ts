import { IEmployee, IEmployeeUpdateInput, IUserFindInput, IEmployeeStoreState, IUserUpdateInput } from '@gauzy/contracts';
import { BehaviorSubject } from 'rxjs';
import { Query, Store as AkitaStore } from '@datorama/akita';
import * as i0 from "@angular/core";
export declare class EmployeeAkitaStore extends AkitaStore<IEmployeeStoreState> {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeAkitaStore, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EmployeeAkitaStore>;
}
export declare class EmployeeAkitaQuery extends Query<IEmployeeStoreState> {
    constructor(store: EmployeeAkitaStore);
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeAkitaQuery, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EmployeeAkitaQuery>;
}
/**
 * Service used to update employee
 */
export declare class EmployeeStore {
    protected employeeAkitaStore: EmployeeAkitaStore;
    protected employeeAkitaQuery: EmployeeAkitaQuery;
    private _selectedEmployee;
    private _userForm;
    private _employeeForm;
    constructor(employeeAkitaStore: EmployeeAkitaStore, employeeAkitaQuery: EmployeeAkitaQuery);
    selectedEmployee$: BehaviorSubject<IEmployee>;
    userForm$: BehaviorSubject<IUserFindInput>;
    employeeForm$: BehaviorSubject<IEmployeeUpdateInput>;
    set selectedEmployee(employee: IEmployee);
    get selectedEmployee(): IEmployee;
    employeeAction$: import("rxjs").Observable<{
        action: import("@gauzy/contracts").CrudActionEnum;
        employees: IEmployee[];
    }>;
    set employeeAction({ action, employees }: IEmployeeStoreState);
    set userForm(user: IUserUpdateInput);
    get userForm(): IUserUpdateInput;
    set employeeForm(employee: IEmployeeUpdateInput);
    get employeeForm(): IEmployeeUpdateInput;
    /**
     * Update the user form with new data
     *
     * @param formData - The form data to update.
     */
    updateUserForm(formData: IUserUpdateInput): Promise<void>;
    /**
     * Update the employee form with new data
     *
     * @param formData - The form data to update.
     */
    updateEmployeeForm(formData: IEmployeeUpdateInput): Promise<void>;
    destroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeStore, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EmployeeStore>;
}
