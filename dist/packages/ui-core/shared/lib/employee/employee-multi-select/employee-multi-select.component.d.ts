import { EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { IDateRangePicker, IEmployee, IOrganization } from '@gauzy/contracts';
import { DateRangePickerBuilderService, EmployeesService } from '@gauzy/ui-core/core';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class EmployeeSelectComponent implements OnInit, OnDestroy {
    private readonly employeesService;
    private readonly store;
    private readonly dateRangePickerBuilderService;
    loaded: boolean;
    preSelected: string[] | string;
    set reset(value: boolean | null);
    get allEmployees(): IEmployee[];
    set allEmployees(value: IEmployee[]);
    get selectedEmployeeIds(): string[] | string;
    set selectedEmployeeIds(value: string[] | string);
    /**
     * Getter & Setter for employees
     */
    private _employees;
    set employees(employees: IEmployee[]);
    get employees(): IEmployee[];
    constructor(employeesService: EmployeesService, store: Store, dateRangePickerBuilderService: DateRangePickerBuilderService);
    set employeeId(value: string[] | string);
    get employeeId(): string[] | string;
    selectedChange: EventEmitter<any>;
    onLoadEmployees: EventEmitter<any>;
    multiple: boolean;
    label: string;
    disabled: boolean;
    placeholder: string;
    select: FormControl;
    private _allEmployees;
    val: string[] | string;
    changeValue$: Subject<string | string[]>;
    onChange: any;
    onTouched: any;
    organization: IOrganization;
    selectedDateRange: IDateRangePicker;
    ngOnInit(): Promise<void>;
    checkForMultiSelectValue(val: any): void;
    onMembersSelected(selectEvent: any): void;
    writeValue(value: any): void;
    registerOnChange(fn: (rating: number) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    /**
     * Get working employees of the selected month
     */
    private getWorkingEmployees;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeSelectComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EmployeeSelectComponent, "ga-employee-multi-select", never, { "reset": { "alias": "reset"; "required": false; }; "allEmployees": { "alias": "allEmployees"; "required": false; }; "selectedEmployeeIds": { "alias": "selectedEmployeeIds"; "required": false; }; "multiple": { "alias": "multiple"; "required": false; }; "label": { "alias": "label"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; }, { "selectedChange": "selectedChange"; "onLoadEmployees": "onLoadEmployees"; }, never, never, false, never>;
}
