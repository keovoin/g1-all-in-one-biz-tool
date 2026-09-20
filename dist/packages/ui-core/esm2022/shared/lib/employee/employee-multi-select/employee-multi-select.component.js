import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { combineLatest, filter, Subject, tap } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PermissionsEnum } from '@gauzy/contracts';
import { DateRangePickerBuilderService, EmployeesService } from '@gauzy/ui-core/core';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@angular/forms";
import * as i3 from "@nebular/theme";
import * as i4 from "../../components/avatar/avatar.component";
import * as i5 from "@ngx-translate/core";
let EmployeeSelectComponent = class EmployeeSelectComponent {
    set reset(value) {
        if (value) {
            if (this.multiple) {
                this.select.setValue([]);
                this.select.updateValueAndValidity();
            }
            else {
                this.select.reset();
            }
        }
    }
    get allEmployees() {
        return this._allEmployees;
    }
    set allEmployees(value) {
        this._allEmployees = value;
        this.employees = this._allEmployees;
    }
    get selectedEmployeeIds() {
        return this.val;
    }
    set selectedEmployeeIds(value) {
        this.preSelected = value;
        this.select.setValue(value);
        this.select.updateValueAndValidity();
    }
    set employees(employees) {
        this._employees = employees;
        this.onLoadEmployees.emit(employees);
    }
    get employees() {
        return this._employees;
    }
    constructor(employeesService, store, dateRangePickerBuilderService) {
        this.employeesService = employeesService;
        this.store = store;
        this.dateRangePickerBuilderService = dateRangePickerBuilderService;
        /**
         * Getter & Setter for employees
         */
        this._employees = [];
        this.selectedChange = new EventEmitter();
        this.onLoadEmployees = new EventEmitter();
        this.multiple = true;
        this.label = 'FORM.PLACEHOLDERS.ADD_REMOVE_EMPLOYEES';
        this.disabled = false;
        this.placeholder = 'FORM.PLACEHOLDERS.ADD_REMOVE_EMPLOYEES';
        this.select = new FormControl();
        this.val = null;
        this.changeValue$ = new Subject();
        this.onChange = () => { };
        this.onTouched = () => { };
        this.organization = this.store.selectedOrganization;
    }
    set employeeId(value) {
        this.changeValue$.next(value);
    }
    get employeeId() {
        return this.val;
    }
    async ngOnInit() {
        this.changeValue$.pipe(debounceTime(100), untilDestroyed(this)).subscribe((value) => {
            this.checkForMultiSelectValue(value);
            this.onChange(this.val);
        });
        this.select.valueChanges
            .pipe(tap((value) => (this.employeeId = value)), untilDestroyed(this))
            .subscribe();
        const selectedDateRange$ = this.dateRangePickerBuilderService.selectedDateRange$;
        combineLatest([selectedDateRange$])
            .pipe(filter(([dateRange]) => !!dateRange), tap(([dateRange]) => {
            this.selectedDateRange = dateRange;
        }), tap(async () => {
            if (!this.allEmployees || this.allEmployees.length === 0) {
                await this.getWorkingEmployees();
            }
            this.select.setValue(this.preSelected);
            this.loaded = true;
        }), untilDestroyed(this))
            .subscribe();
    }
    checkForMultiSelectValue(val) {
        if (this.multiple) {
            this.val = val instanceof Array ? val : [val];
        }
        else {
            this.val = val instanceof Array ? val[0] : val;
        }
    }
    onMembersSelected(selectEvent) {
        this.selectedChange.emit(selectEvent);
    }
    writeValue(value) {
        this.changeValue$.next(value);
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    /**
     * Get working employees of the selected month
     */
    async getWorkingEmployees() {
        if (!this.store.hasAnyPermission(PermissionsEnum.CHANGE_SELECTED_EMPLOYEE) &&
            !this.store.hasAnyPermission(PermissionsEnum.SELECT_EMPLOYEE)) {
            return;
        }
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        const { items = [] } = await this.employeesService.getWorking(organizationId, tenantId, this.selectedDateRange, true);
        this.employees = items;
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeSelectComponent, deps: [{ token: i1.EmployeesService }, { token: i1.Store }, { token: i1.DateRangePickerBuilderService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: EmployeeSelectComponent, isStandalone: false, selector: "ga-employee-multi-select", inputs: { reset: "reset", allEmployees: "allEmployees", selectedEmployeeIds: "selectedEmployeeIds", multiple: "multiple", label: "label", disabled: "disabled", placeholder: "placeholder" }, outputs: { selectedChange: "selectedChange", onLoadEmployees: "onLoadEmployees" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => EmployeeSelectComponent),
                multi: true
            }
        ], ngImport: i0, template: "@if (label) {\n  <label class=\"label\">{{ label | translate }}</label>\n}\n@if (loaded) {\n  <nb-select\n    [formControl]=\"select\"\n    [multiple]=\"multiple\"\n    (selectedChange)=\"onMembersSelected($event)\"\n    fullWidth\n    [disabled]=\"disabled\"\n    [(selected)]=\"preSelected\"\n    [placeholder]=\"placeholder | translate\"\n    >\n    @for (employee of employees; track employee) {\n      <nb-option [value]=\"employee.id\">\n        <ngx-avatar\n          size=\"sm\"\n          [src]=\"employee.user?.imageUrl\"\n          [name]=\"employee.user?.name\"\n          [isOption]=\"true\"\n        ></ngx-avatar>\n      </nb-option>\n    }\n  </nb-select>\n}\n", styles: [":host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container{flex-wrap:nowrap;overflow:hidden}ngx-avatar ::ng-deep .inner-wrapper{display:flex;flex-direction:row}ngx-avatar ::ng-deep .inner-wrapper .names-wrapper{margin:0 10px}\n"], dependencies: [{ kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "component", type: i3.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i3.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "component", type: i4.AvatarComponent, selector: "ngx-avatar", inputs: ["size", "src", "appendCaption", "caption", "id", "isOption", "employee", "value", "name"] }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
};
EmployeeSelectComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [EmployeesService,
        Store,
        DateRangePickerBuilderService])
], EmployeeSelectComponent);
export { EmployeeSelectComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeSelectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-employee-multi-select', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => EmployeeSelectComponent),
                            multi: true
                        }
                    ], standalone: false, template: "@if (label) {\n  <label class=\"label\">{{ label | translate }}</label>\n}\n@if (loaded) {\n  <nb-select\n    [formControl]=\"select\"\n    [multiple]=\"multiple\"\n    (selectedChange)=\"onMembersSelected($event)\"\n    fullWidth\n    [disabled]=\"disabled\"\n    [(selected)]=\"preSelected\"\n    [placeholder]=\"placeholder | translate\"\n    >\n    @for (employee of employees; track employee) {\n      <nb-option [value]=\"employee.id\">\n        <ngx-avatar\n          size=\"sm\"\n          [src]=\"employee.user?.imageUrl\"\n          [name]=\"employee.user?.name\"\n          [isOption]=\"true\"\n        ></ngx-avatar>\n      </nb-option>\n    }\n  </nb-select>\n}\n", styles: [":host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container{flex-wrap:nowrap;overflow:hidden}ngx-avatar ::ng-deep .inner-wrapper{display:flex;flex-direction:row}ngx-avatar ::ng-deep .inner-wrapper .names-wrapper{margin:0 10px}\n"] }]
        }], ctorParameters: () => [{ type: i1.EmployeesService }, { type: i1.Store }, { type: i1.DateRangePickerBuilderService }], propDecorators: { reset: [{
                type: Input
            }], allEmployees: [{
                type: Input
            }], selectedEmployeeIds: [{
                type: Input
            }], selectedChange: [{
                type: Output
            }], onLoadEmployees: [{
                type: Output
            }], multiple: [{
                type: Input
            }], label: [{
                type: Input
            }], disabled: [{
                type: Input
            }], placeholder: [{
                type: Input
            }] } });
//# sourceMappingURL=employee-multi-select.component.js.map