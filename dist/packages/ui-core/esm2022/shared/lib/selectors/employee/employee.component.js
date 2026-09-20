import { __decorate, __metadata } from "tslib";
import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, map, Subject } from 'rxjs';
import { filter, debounceTime, tap, switchMap } from 'rxjs/operators';
import { CrudActionEnum, DEFAULT_TYPE, PermissionsEnum } from '@gauzy/contracts';
import { DateRangePickerBuilderService, EmployeeStore, EmployeesService, NavigationService, Store, ToastrService } from '@gauzy/ui-core/core';
import { distinctUntilChange, isNotEmpty } from '@gauzy/ui-core/common';
import { TruncatePipe } from '../../pipes';
import { ALL_EMPLOYEES_SELECTED } from './default-employee';
import { entitySelectPanelClass } from '../entity-select-panel-class';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "../../pipes";
import * as i4 from "@angular/common";
import * as i5 from "@angular/forms";
import * as i6 from "@nebular/theme";
import * as i7 from "@ng-select/ng-select";
import * as i8 from "../../directives/img.directive";
import * as i9 from "@ngx-translate/core";
let EmployeeSelectorComponent = class EmployeeSelectorComponent {
    /**
     * The class list ng-select puts on its appended panel. See `entitySelectPanelClass()` for
     * why an appended panel needs the whole list rebuilt rather than added to.
     */
    get panelClass() {
        return entitySelectPanelClass(this.dropdownClass);
    }
    get selectedDateRange() {
        return this._selectedDateRange;
    }
    set selectedDateRange(range) {
        //This will set _selectedDateRange too
        this.subject$.next([this._store.selectedOrganization, range]);
    }
    get selectedEmployee() {
        return this._selectedEmployee;
    }
    set selectedEmployee(employee) {
        this._selectedEmployee = employee;
        // If skipGlobalChange is false, update the query parameters
        if (!this.skipGlobalChange) {
            this.setAttributesToParams({ employeeId: employee?.id });
        }
    }
    constructor(_router, _navigationService, _employeesService, _store, _dateRangePickerBuilderService, _activatedRoute, _cdRef, _employeeStore, _toastrService, _truncatePipe) {
        this._router = _router;
        this._navigationService = _navigationService;
        this._employeesService = _employeesService;
        this._store = _store;
        this._dateRangePickerBuilderService = _dateRangePickerBuilderService;
        this._activatedRoute = _activatedRoute;
        this._cdRef = _cdRef;
        this._employeeStore = _employeeStore;
        this._toastrService = _toastrService;
        this._truncatePipe = _truncatePipe;
        this.employees = [];
        this.subject$ = new Subject();
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
        this.clearable = true;
        this.addTag = true;
        this.skipGlobalChange = false;
        this.disabled = false;
        this.defaultSelected = true;
        this.showAllEmployeesOption = true;
        this.selectionChanged = new EventEmitter();
        /**
         *
         * @param organization
         * @param selectedDateRange
         * @returns
         */
        this.loadWorkingEmployeesIfRequired = async (organization, selectedDateRange) => {
            //If no organization, then something is wrong
            if (!organization) {
                this.employees = [];
                return;
            }
            this._selectedDateRange = selectedDateRange;
            await this.getEmployees(organization, selectedDateRange);
        };
        /**
         *
         * @param organization
         * @param selectedDateRange
         * @returns
         */
        this.getEmployees = async (organization, selectedDateRange) => {
            if (!organization) {
                this.employees = [];
                return;
            }
            const { tenantId } = this._store.user;
            const { id: organizationId } = organization;
            const { items } = await this._employeesService.getWorking(organizationId, tenantId, selectedDateRange, true);
            this.employees = [
                ...items.map((employee) => {
                    return {
                        id: employee.id,
                        firstName: employee.user.firstName,
                        lastName: employee.user.lastName,
                        fullName: employee.user.name,
                        imageUrl: employee.user.image?.fullUrl || employee.user.imageUrl,
                        shortDescription: employee.short_description,
                        employeeLevel: employee.employeeLevel,
                        billRateCurrency: employee.billRateCurrency,
                        billRateValue: employee.billRateValue,
                        timeZone: employee.user.timeZone,
                        timeFormat: employee.user.timeFormat
                    };
                })
            ];
            //Insert All Employees Option
            if (this.showAllEmployeesOption && this._store.hasPermission(PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
                this.employees.unshift(ALL_EMPLOYEES_SELECTED);
            }
            //Set selected employee if no employee selected
            if (items.length > 0 && !this._store.selectedEmployee) {
                this._store.selectedEmployee = this.employees[0] || ALL_EMPLOYEES_SELECTED;
            }
        };
        /**
         * Create new employee from ng-select tag
         *
         * @param name
         * @returns
         */
        this.createNew = async (name) => {
            if (!this.organization || !name) {
                return;
            }
            try {
                const chunks = name.split(/\s+/);
                const [firstName, lastName] = [chunks.shift(), chunks.join(' ')];
                this._router.navigate(['/pages/employees/'], {
                    queryParams: { openAddDialog: true },
                    state: { firstName, lastName }
                });
            }
            catch (error) {
                this._toastrService.error(error);
            }
        };
    }
    ngOnInit() {
        this.onSelectEmployee();
        this.hasEditEmployee$ = this._store.userRolePermissions$.pipe(map(() => this._store.hasPermission(PermissionsEnum.ORG_EMPLOYEES_EDIT)));
        this.subject$
            .pipe(debounceTime(200), switchMap(async ([organization, dateRange]) => {
            await this.loadWorkingEmployeesIfRequired(organization, dateRange);
        }), untilDestroyed(this))
            .subscribe();
        this._store.selectedEmployee$
            .pipe(distinctUntilChange(), filter((employee) => !!employee), tap((employee) => {
            if (this.defaultSelected) {
                this.selectedEmployee = employee;
                this.selectionChanged.emit(employee);
            }
            this._cdRef.detectChanges();
        }), untilDestroyed(this))
            .subscribe();
        this._activatedRoute.queryParams
            .pipe(filter((query) => !!query.employeeId), tap(({ employeeId }) => this.selectEmployeeById(employeeId)), untilDestroyed(this))
            .subscribe();
        const storeOrganization$ = this._store.selectedOrganization$;
        const selectedDateRange$ = this._dateRangePickerBuilderService.selectedDateRange$;
        combineLatest([storeOrganization$, selectedDateRange$])
            .pipe(filter(([organization]) => !!organization), tap(([organization, dateRange]) => {
            this.organization = organization;
            this._selectedDateRange = dateRange;
            this.subject$.next([organization, dateRange]);
        }), untilDestroyed(this))
            .subscribe();
    }
    ngAfterViewInit() {
        this._cdRef.detectChanges();
        this._employeeStore.employeeAction$
            .pipe(filter(({ action, employees }) => !!action && !!employees), tap(() => this._employeeStore.destroy()), untilDestroyed(this))
            .subscribe(({ action, employees }) => {
            switch (action) {
                case CrudActionEnum.CREATED:
                    this.createEmployee(employees);
                    break;
                case CrudActionEnum.DELETED:
                    const [employee] = employees;
                    this.deleteEmployee(employee);
                    break;
                default:
                    break;
            }
        });
    }
    ngOnChanges() {
        this._cdRef.detectChanges();
    }
    /**
     * Adds newly created employees to the header selector.
     * @param employees - The array of employees to add.
     */
    createEmployee(employees) {
        this.employees = [
            ...(this.employees || []),
            ...employees.map((employee) => ({
                id: employee.id,
                firstName: employee.user.firstName,
                lastName: employee.user.lastName,
                fullName: employee.user.name,
                imageUrl: employee.user.imageUrl,
                timeFormat: employee.user.timeFormat,
                timeZone: employee.user.timeZone
            }))
        ].filter(isNotEmpty);
    }
    /**
     * Removes a deleted employee from the header selector.
     * @param employee - The employee to remove.
     */
    deleteEmployee(employee) {
        this.employees = (this.employees || [])
            .filter((item) => item.id !== employee.id)
            .filter(isNotEmpty);
    }
    /**
     * Searches for an employee by matching the provided search term with the employee's first name and/or last name.
     * The search term can contain multiple words separated by spaces, and each word is matched individually against
     * both the first and last names of the employee.
     *
     * @param term - The search term used to find matching employees. It can contain multiple words separated by spaces.
     * @param item - The employee object containing `firstName` and `lastName` properties.
     * @returns A boolean indicating whether any of the words in the search term match the first name or last name of the employee.
     */
    searchEmployee(term, item) {
        // Split the search term by commas to handle multiple names
        const searchTerms = term
            .toLowerCase()
            .split(',')
            .map((s) => s.trim());
        // Combine the employee's firstName and lastName for easier comparison
        const fullName = `${item.firstName || ''} ${item.lastName || ''}`.toLowerCase();
        // Check if any search term matches the employee's full name
        return searchTerms.some((searchTerm) => {
            // Split the search term into individual words for handling names with spaces
            const keywords = searchTerm.split(' ');
            return keywords.some((keyword) => fullName.includes(keyword));
        });
    }
    /**
     * Selects an employee and performs necessary actions based on selection
     * @param employee The employee to select
     */
    async selectEmployee(employee) {
        try {
            if (!this.skipGlobalChange) {
                this._store.selectedEmployee = employee || ALL_EMPLOYEES_SELECTED;
                await this.setAttributesToParams({ employeeId: employee?.id });
            }
            else {
                this.selectedEmployee = employee || ALL_EMPLOYEES_SELECTED;
            }
            if (isNotEmpty(employee)) {
                this.selectionChanged.emit(employee);
            }
        }
        catch (error) {
            console.error('Error while selecting employee:', error);
        }
    }
    /**
     * Sets attributes to the current navigation parameters.
     * @param params An object containing key-value pairs representing the parameters to set.
     */
    async setAttributesToParams(params) {
        await this._navigationService.updateQueryParams(params);
    }
    /**
     * Selects an employee by their ID and performs necessary actions based on the selection.
     *
     * @param employeeId - The ID of the employee to select.
     */
    async selectEmployeeById(employeeId) {
        try {
            const employee = this.employees.find((emp) => emp.id === employeeId);
            if (employee) {
                await this.selectEmployee(employee);
            }
        }
        catch (error) {
            console.error('Error selecting employee by ID:', error);
        }
    }
    /**
     * GET Shortened Name
     *
     * @param firstName
     * @param lastName
     * @param limit
     * @returns
     */
    getShortenedName(firstName, lastName, limit = 18) {
        if (firstName && lastName) {
            return (this._truncatePipe.transform(firstName, limit / 2, false, '') +
                ' ' +
                this._truncatePipe.transform(lastName, limit / 2, false, '.'));
        }
        else {
            return (this._truncatePipe.transform(firstName, limit) ||
                this._truncatePipe.transform(lastName, limit) ||
                '[error: bad name]');
        }
    }
    /**
     * GET Full Name — the untruncated counterpart of `getShortenedName`.
     *
     * @param employee
     * @returns the employee's complete display name
     */
    getFullName(employee) {
        return (employee?.fullName || [employee?.firstName, employee?.lastName].filter(Boolean).join(' ')).trim();
    }
    /**
     * Handles the selection of an employee based on certain conditions
     */
    onSelectEmployee() {
        try {
            if (!this.selectedEmployee && isNotEmpty(this.employees)) {
                // Ensure selected employee doesn't get reset when already set elsewhere
                this.selectEmployee(this.employees[0]);
            }
            if (!this.defaultSelected && this.selectedEmployee === ALL_EMPLOYEES_SELECTED) {
                this.selectedEmployee = null;
            }
        }
        catch (error) {
            console.error('Error while handling employee selection:', error);
        }
    }
    /**
     * Display clearable option in employee selector
     *
     * @returns
     */
    isClearable() {
        if (this.clearable) {
            if (this.selectedEmployee && this.selectedEmployee.hasOwnProperty('defaultType')) {
                if (this.selectedEmployee.defaultType === DEFAULT_TYPE.ALL_EMPLOYEE) {
                    return false;
                }
            }
            return !!this._store.hasPermission(PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
        }
    }
    ngOnDestroy() {
        if (this.employees.length > 0 && !this._store.selectedEmployee && !this.skipGlobalChange) {
            this._store.selectedEmployee = this.employees[0] || ALL_EMPLOYEES_SELECTED;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeSelectorComponent, deps: [{ token: i1.Router }, { token: i2.NavigationService }, { token: i2.EmployeesService }, { token: i2.Store }, { token: i2.DateRangePickerBuilderService }, { token: i1.ActivatedRoute }, { token: i0.ChangeDetectorRef }, { token: i2.EmployeeStore }, { token: i2.ToastrService }, { token: i3.TruncatePipe }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: EmployeeSelectorComponent, isStandalone: false, selector: "ga-employee-selector", inputs: { clearable: "clearable", addTag: "addTag", skipGlobalChange: "skipGlobalChange", disabled: "disabled", placeholder: "placeholder", defaultSelected: "defaultSelected", showAllEmployeesOption: "showAllEmployeesOption", dropdownClass: "dropdownClass", selectedDateRange: "selectedDateRange", selectedEmployee: "selectedEmployee" }, outputs: { selectionChanged: "selectionChanged" }, usesOnChanges: true, ngImport: i0, template: "<ng-select\n  #select\n  [addTag]=\"(hasEditEmployee$ | async) && addTag ? createNew : null\"\n  [clearable]=\"isClearable()\"\n  [disabled]=\"disabled\"\n  [(items)]=\"employees\"\n  (change)=\"selectEmployee($event); select.blur()\"\n  (clear)=\"select.blur()\"\n  [(ngModel)]=\"selectedEmployee\"\n  [placeholder]=\"placeholder || 'FORM.PLACEHOLDERS.ALL_EMPLOYEES' | translate\"\n  [addTagText]=\"'FORM.PLACEHOLDERS.ADD_EMPLOYEE' | translate\"\n  [searchFn]=\"searchEmployee\"\n  bindName=\"firstName\"\n  appendTo=\"body\"\n  class=\"employee gauzy-entity-select\"\n  [ngClass]=\"panelClass\"\n  >\n  <ng-template ng-option-tmp let-item=\"item\" let-index=\"index\">\n    @if (item.imageUrl && !item.imageUrl.includes('avatar-default')) {\n      <img [src]=\"item.imageUrl\" width=\"20\" height=\"20\" alt=\"\" />\n    } @else if (item.id) {\n      <nb-icon class=\"avatar-fallback\" icon=\"person-outline\"></nb-icon>\n    }\n    <span [title]=\"getFullName(item)\">{{ getShortenedName(item.firstName, item.lastName, 42) }}</span>\n  </ng-template>\n  <ng-template ng-label-tmp let-item=\"item\">\n    <div class=\"selector-template\" [title]=\"getFullName(item)\">\n      @if (item.imageUrl && !item.imageUrl.includes('avatar-default')) {\n        <img height=\"20\" width=\"20\" [src]=\"item.imageUrl\" alt=\"\" />\n      } @else if (item.id) {\n        <nb-icon class=\"avatar-fallback\" icon=\"person-outline\"></nb-icon>\n      }\n      <span>{{ getFullName(item) }}</span>\n    </div>\n  </ng-template>\n</ng-select>\n", styles: ["ng-select .selector-template{display:flex;align-items:center;gap:.375rem;min-width:0}ng-select .selector-template span{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}ng-select img{flex:none;width:1.125rem;height:1.125rem;border-radius:var(--gauzy-radius-sm, 6px);object-fit:cover}ng-select .avatar-fallback{flex:none;display:flex;align-items:center;justify-content:center;width:1.125rem;height:1.125rem;border-radius:var(--gauzy-radius-sm, 6px);background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--gauzy-text-color-2, var(--text-hint-color));font-size:.75rem}ng-select .avatar-fallback svg{width:1em;height:1em}:host ::ng-deep .ng-select .ng-select-container .ng-value-container{min-width:0}:host ::ng-deep .ng-select .ng-select-container .ng-value,:host ::ng-deep .ng-select .ng-select-container .ng-placeholder{min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i4.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i5.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i5.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i6.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i7.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "directive", type: i7.NgOptionTemplateDirective, selector: "[ng-option-tmp]" }, { kind: "directive", type: i7.NgLabelTemplateDirective, selector: "[ng-label-tmp]" }, { kind: "directive", type: i8.ImgDirective, selector: "img", inputs: ["type", "skipDefaultImage", "enableFadeIn"] }, { kind: "pipe", type: i4.AsyncPipe, name: "async" }, { kind: "pipe", type: i9.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
};
EmployeeSelectorComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Router,
        NavigationService,
        EmployeesService,
        Store,
        DateRangePickerBuilderService,
        ActivatedRoute,
        ChangeDetectorRef,
        EmployeeStore,
        ToastrService,
        TruncatePipe])
], EmployeeSelectorComponent);
export { EmployeeSelectorComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeSelectorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-employee-selector', changeDetection: ChangeDetectionStrategy.OnPush, standalone: false, template: "<ng-select\n  #select\n  [addTag]=\"(hasEditEmployee$ | async) && addTag ? createNew : null\"\n  [clearable]=\"isClearable()\"\n  [disabled]=\"disabled\"\n  [(items)]=\"employees\"\n  (change)=\"selectEmployee($event); select.blur()\"\n  (clear)=\"select.blur()\"\n  [(ngModel)]=\"selectedEmployee\"\n  [placeholder]=\"placeholder || 'FORM.PLACEHOLDERS.ALL_EMPLOYEES' | translate\"\n  [addTagText]=\"'FORM.PLACEHOLDERS.ADD_EMPLOYEE' | translate\"\n  [searchFn]=\"searchEmployee\"\n  bindName=\"firstName\"\n  appendTo=\"body\"\n  class=\"employee gauzy-entity-select\"\n  [ngClass]=\"panelClass\"\n  >\n  <ng-template ng-option-tmp let-item=\"item\" let-index=\"index\">\n    @if (item.imageUrl && !item.imageUrl.includes('avatar-default')) {\n      <img [src]=\"item.imageUrl\" width=\"20\" height=\"20\" alt=\"\" />\n    } @else if (item.id) {\n      <nb-icon class=\"avatar-fallback\" icon=\"person-outline\"></nb-icon>\n    }\n    <span [title]=\"getFullName(item)\">{{ getShortenedName(item.firstName, item.lastName, 42) }}</span>\n  </ng-template>\n  <ng-template ng-label-tmp let-item=\"item\">\n    <div class=\"selector-template\" [title]=\"getFullName(item)\">\n      @if (item.imageUrl && !item.imageUrl.includes('avatar-default')) {\n        <img height=\"20\" width=\"20\" [src]=\"item.imageUrl\" alt=\"\" />\n      } @else if (item.id) {\n        <nb-icon class=\"avatar-fallback\" icon=\"person-outline\"></nb-icon>\n      }\n      <span>{{ getFullName(item) }}</span>\n    </div>\n  </ng-template>\n</ng-select>\n", styles: ["ng-select .selector-template{display:flex;align-items:center;gap:.375rem;min-width:0}ng-select .selector-template span{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}ng-select img{flex:none;width:1.125rem;height:1.125rem;border-radius:var(--gauzy-radius-sm, 6px);object-fit:cover}ng-select .avatar-fallback{flex:none;display:flex;align-items:center;justify-content:center;width:1.125rem;height:1.125rem;border-radius:var(--gauzy-radius-sm, 6px);background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--gauzy-text-color-2, var(--text-hint-color));font-size:.75rem}ng-select .avatar-fallback svg{width:1em;height:1em}:host ::ng-deep .ng-select .ng-select-container .ng-value-container{min-width:0}:host ::ng-deep .ng-select .ng-select-container .ng-value,:host ::ng-deep .ng-select .ng-select-container .ng-placeholder{min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.Router }, { type: i2.NavigationService }, { type: i2.EmployeesService }, { type: i2.Store }, { type: i2.DateRangePickerBuilderService }, { type: i1.ActivatedRoute }, { type: i0.ChangeDetectorRef }, { type: i2.EmployeeStore }, { type: i2.ToastrService }, { type: i3.TruncatePipe }], propDecorators: { clearable: [{
                type: Input
            }], addTag: [{
                type: Input
            }], skipGlobalChange: [{
                type: Input
            }], disabled: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], defaultSelected: [{
                type: Input
            }], showAllEmployeesOption: [{
                type: Input
            }], dropdownClass: [{
                type: Input
            }], selectedDateRange: [{
                type: Input
            }], selectedEmployee: [{
                type: Input
            }], selectionChanged: [{
                type: Output
            }] } });
//# sourceMappingURL=employee.component.js.map