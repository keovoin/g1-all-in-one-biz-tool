import { OnInit, OnDestroy, EventEmitter, AfterViewInit, ChangeDetectorRef, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ID, IDateRangePicker, IEmployee, IOrganization, ISelectedEmployee } from '@gauzy/contracts';
import { DateRangePickerBuilderService, EmployeeStore, EmployeesService, NavigationService, Store, ToastrService } from '@gauzy/ui-core/core';
import { TruncatePipe } from '../../pipes';
import * as i0 from "@angular/core";
export declare class EmployeeSelectorComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    private readonly _router;
    private readonly _navigationService;
    private readonly _employeesService;
    private readonly _store;
    private readonly _dateRangePickerBuilderService;
    private readonly _activatedRoute;
    private readonly _cdRef;
    private readonly _employeeStore;
    private readonly _toastrService;
    private readonly _truncatePipe;
    hasEditEmployee$: Observable<boolean>;
    organization: IOrganization;
    employees: ISelectedEmployee[];
    subject$: Subject<any>;
    /**
     * Input properties for component customization.
     *
     * @property clearable - Whether the component allows clearing the selection (default: true).
     * @property addTag - Whether adding new tags is allowed (default: true).
     * @property skipGlobalChange - Whether to skip global change handling (default: false).
     * @property disabled - Whether the component is disabled (default: false).
     * @property placeholder - The placeholder text for the component.
     * @property defaultSelected - Whether the default option is selected (default: true).
     * @property showAllEmployeesOption - Whether to show the "All Employees" option (default: true).
     */
    clearable: boolean;
    addTag: boolean;
    skipGlobalChange: boolean;
    disabled: boolean;
    placeholder: string;
    defaultSelected: boolean;
    showAllEmployeesOption: boolean;
    /**
     * Extra class(es) for the DROPDOWN PANEL, not for this component.
     *
     * The header passes `header-entity-select` so its panels can be set in the header band's
     * text; see `.ng-dropdown-panel.header-entity-select` in `_overrides.scss`.
     */
    dropdownClass: string;
    /**
     * The class list ng-select puts on its appended panel. See `entitySelectPanelClass()` for
     * why an appended panel needs the whole list rebuilt rather than added to.
     */
    get panelClass(): string | null;
    /**
     * Manages the selected date range.
     *
     * The `selectedDateRange` setter updates the date range and triggers an update via `subject$.next`
     * with the selected organization and date range.
     *
     * @property selectedDateRange - The currently selected date range.
     */
    private _selectedDateRange?;
    get selectedDateRange(): IDateRangePicker;
    set selectedDateRange(range: IDateRangePicker);
    /**
     * Manages the selected employee.
     *
     * The `selectedEmployee` setter updates the selected employee and logs the change for debugging.
     *
     * @property selectedEmployee - The currently selected employee.
     */
    private _selectedEmployee;
    get selectedEmployee(): ISelectedEmployee;
    set selectedEmployee(employee: ISelectedEmployee);
    selectionChanged: EventEmitter<ISelectedEmployee>;
    constructor(_router: Router, _navigationService: NavigationService, _employeesService: EmployeesService, _store: Store, _dateRangePickerBuilderService: DateRangePickerBuilderService, _activatedRoute: ActivatedRoute, _cdRef: ChangeDetectorRef, _employeeStore: EmployeeStore, _toastrService: ToastrService, _truncatePipe: TruncatePipe);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnChanges(): void;
    /**
     * Adds newly created employees to the header selector.
     * @param employees - The array of employees to add.
     */
    createEmployee(employees: IEmployee[]): void;
    /**
     * Removes a deleted employee from the header selector.
     * @param employee - The employee to remove.
     */
    deleteEmployee(employee: IEmployee): void;
    /**
     * Searches for an employee by matching the provided search term with the employee's first name and/or last name.
     * The search term can contain multiple words separated by spaces, and each word is matched individually against
     * both the first and last names of the employee.
     *
     * @param term - The search term used to find matching employees. It can contain multiple words separated by spaces.
     * @param item - The employee object containing `firstName` and `lastName` properties.
     * @returns A boolean indicating whether any of the words in the search term match the first name or last name of the employee.
     */
    searchEmployee(term: string, item: any): boolean;
    /**
     * Selects an employee and performs necessary actions based on selection
     * @param employee The employee to select
     */
    selectEmployee(employee: ISelectedEmployee): Promise<void>;
    /**
     * Sets attributes to the current navigation parameters.
     * @param params An object containing key-value pairs representing the parameters to set.
     */
    private setAttributesToParams;
    /**
     * Selects an employee by their ID and performs necessary actions based on the selection.
     *
     * @param employeeId - The ID of the employee to select.
     */
    selectEmployeeById(employeeId: ID): Promise<void>;
    /**
     * GET Shortened Name
     *
     * @param firstName
     * @param lastName
     * @param limit
     * @returns
     */
    getShortenedName(firstName: string, lastName: string, limit?: number): string;
    /**
     * GET Full Name — the untruncated counterpart of `getShortenedName`.
     *
     * @param employee
     * @returns the employee's complete display name
     */
    getFullName(employee: ISelectedEmployee): string;
    /**
     * Handles the selection of an employee based on certain conditions
     */
    private onSelectEmployee;
    /**
     *
     * @param organization
     * @param selectedDateRange
     * @returns
     */
    loadWorkingEmployeesIfRequired: (organization: IOrganization, selectedDateRange: IDateRangePicker) => Promise<void>;
    /**
     *
     * @param organization
     * @param selectedDateRange
     * @returns
     */
    private getEmployees;
    /**
     * Display clearable option in employee selector
     *
     * @returns
     */
    isClearable(): boolean;
    /**
     * Create new employee from ng-select tag
     *
     * @param name
     * @returns
     */
    createNew: (name: string) => Promise<void>;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeSelectorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EmployeeSelectorComponent, "ga-employee-selector", never, { "clearable": { "alias": "clearable"; "required": false; }; "addTag": { "alias": "addTag"; "required": false; }; "skipGlobalChange": { "alias": "skipGlobalChange"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; "defaultSelected": { "alias": "defaultSelected"; "required": false; }; "showAllEmployeesOption": { "alias": "showAllEmployeesOption"; "required": false; }; "dropdownClass": { "alias": "dropdownClass"; "required": false; }; "selectedDateRange": { "alias": "selectedDateRange"; "required": false; }; "selectedEmployee": { "alias": "selectedEmployee"; "required": false; }; }, { "selectionChanged": "selectionChanged"; }, never, never, false, never>;
}
