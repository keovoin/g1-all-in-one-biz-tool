import { OnInit, AfterViewInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { NbDialogRef, NbStepperComponent, NbTagComponent } from '@nebular/theme';
import { IEmployee, IEmployeeCreateInput, IOrganization } from '@gauzy/contracts';
import { EmployeeStore, EmployeesService, ErrorHandlingService, OrganizationsService, Store } from '@gauzy/ui-core/core';
import { BasicInfoFormComponent } from '../../user/forms';
import * as i0 from "@angular/core";
export declare class EmployeeMutationComponent implements OnInit, AfterViewInit {
    protected readonly dialogRef: NbDialogRef<EmployeeMutationComponent>;
    protected readonly organizationsService: OrganizationsService;
    protected readonly employeesService: EmployeesService;
    protected readonly store: Store;
    private readonly errorHandler;
    private readonly _employeeStore;
    userBasicInfo: BasicInfoFormComponent;
    stepper: NbStepperComponent;
    loading: boolean;
    linear: boolean;
    form: UntypedFormGroup;
    employees: IEmployeeCreateInput[];
    organization: IOrganization;
    constructor(dialogRef: NbDialogRef<EmployeeMutationComponent>, organizationsService: OrganizationsService, employeesService: EmployeesService, store: Store, errorHandler: ErrorHandlingService, _employeeStore: EmployeeStore);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Closes the dialog window.
     *
     * @param employee An optional array of employees to pass back to the caller.
     */
    closeDialog(employee?: IEmployee[] | null): void;
    /**
     * Adds an employee to the employees array based on form input.
     * Resets the form and stepper after adding the employee.
     */
    addEmployee(): void;
    /**
     * Adds multiple employees and handles the process of creation.
     * Closes the dialog upon successful creation or handles errors.
     */
    add(): Promise<void>;
    /**
     * Removed one employee in the array of employees.
     * @param tag
     */
    onEmployeeRemove(tag: NbTagComponent): void;
    /**
     * Go to the next step without saving the data even if the form is valid.
     */
    nextStep(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeMutationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EmployeeMutationComponent, "ga-employee-mutation", never, {}, {}, never, never, false, never>;
}
