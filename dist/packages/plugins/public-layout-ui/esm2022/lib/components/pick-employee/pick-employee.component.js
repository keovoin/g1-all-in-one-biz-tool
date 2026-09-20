import { __decorate, __metadata } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { EventTypeService, Store, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { EmployeeSelectorComponent } from '@gauzy/ui-core/shared';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/router";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "@nebular/theme";
import * as i5 from "@gauzy/ui-core/shared";
import * as i6 from "@angular/common";
let PickEmployeeComponent = class PickEmployeeComponent extends TranslationBaseComponent {
    constructor(translateService, _router, _toastrService, _eventTypeService, _store) {
        super(translateService);
        this.translateService = translateService;
        this._router = _router;
        this._toastrService = _toastrService;
        this._eventTypeService = _eventTypeService;
        this._store = _store;
    }
    ngOnInit() {
        this.organization$ = this._store.selectedOrganization$.pipe(
        // Ensure the selected organization is valid
        filter((organization) => !!organization), 
        // Fetch the unique organization
        distinctUntilChange(), 
        // Store the organization in the 'organization' property
        tap((organization) => (this.organization = organization)), 
        // Handle component lifecycle to avoid memory leaks
        untilDestroyed(this));
    }
    /**
     * Book an appointment for the selected employee
     *
     * @returns {Promise<void>}
     */
    async bookPublicEmployeeAppointment() {
        if (!this.organization) {
            return;
        }
        // Extract organization and employee IDs
        const { id: organizationId, tenantId } = this.organization;
        // Get the selected employee
        const selectedEmployeeId = this.employeeSelector.selectedEmployee?.id;
        // If an employee is selected, fetch the event types
        if (selectedEmployeeId) {
            try {
                let { items } = await this._eventTypeService.getAll(['employee', 'employee.user', 'tags'], {
                    organizationId,
                    tenantId,
                    employee: { id: selectedEmployeeId },
                    isActive: true,
                    isArchived: false
                });
                if (items.length === 0) {
                    ({ items } = await this._eventTypeService.getAll(['tags'], {
                        organizationId,
                        tenantId,
                        isActive: true,
                        isArchived: false
                    }));
                }
                // If exactly one event type is found, navigate to its page
                const navigatePath = items.length === 1
                    ? `/share/employee/${selectedEmployeeId}/${items[0].id}`
                    : `/share/employee/${selectedEmployeeId}`;
                this._router.navigate([navigatePath]);
            }
            catch (error) {
                console.error('Error while fetching event types:', error);
                this._toastrService.danger(this.getTranslation('PUBLIC_APPOINTMENTS.SELECT_EMPLOYEE_ERROR'));
            }
        }
        else {
            this._toastrService.danger(this.getTranslation('PUBLIC_APPOINTMENTS.SELECT_EMPLOYEE_ERROR'));
        }
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PickEmployeeComponent, deps: [{ token: i1.TranslateService }, { token: i2.Router }, { token: i3.ToastrService }, { token: i3.EventTypeService }, { token: i3.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: PickEmployeeComponent, isStandalone: false, selector: "ga-pick-employee", providers: [EventTypeService], viewQueries: [{ propertyName: "employeeSelector", first: true, predicate: ["employeeSelector"], descendants: true }], usesInheritance: true, ngImport: i0, template: "<nb-card [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n  <nb-card-header class=\"card-header-title\">\n    <div class=\"card-header-title\">\n      <ngx-back-navigation></ngx-back-navigation>\n      <h4>\n        {{ 'APPOINTMENTS_PAGE.SELECT_EMPLOYEE' | translate }}\n      </h4>\n    </div>\n  </nb-card-header>\n  <nb-card-body>\n    @if (organization$ | async; as organization) {\n      <div class=\"col-9\">\n        <div style=\"height: 300px\" class=\"form-group\">\n          <label for=\"description\" class=\"label\">\n            {{ 'APPOINTMENTS_PAGE.EMPLOYEE' | translate }}\n          </label>\n          <div class=\"center-div\">\n            <ga-employee-selector\n              class=\"col-6\"\n              style=\"width: 100%\"\n              #employeeSelector\n              [skipGlobalChange]=\"true\"\n              [addTag]=\"false\"\n              class=\"employees\"\n            ></ga-employee-selector>\n            <span class=\"col-1\"></span>\n            <button class=\"col-3\" (click)=\"bookPublicEmployeeAppointment()\" status=\"success\" nbButton>\n              {{ 'PUBLIC_APPOINTMENTS.BOOK_APPOINTMENT' | translate }}\n            </button>\n          </div>\n        </div>\n      </div>\n    }\n  </nb-card-body>\n</nb-card>\n", styles: [".center-div{display:flex;align-items:center;justify-content:space-between}\n"], dependencies: [{ kind: "component", type: i4.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i4.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i4.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i4.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "directive", type: i4.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "component", type: i5.EmployeeSelectorComponent, selector: "ga-employee-selector", inputs: ["clearable", "addTag", "skipGlobalChange", "disabled", "placeholder", "defaultSelected", "showAllEmployeesOption", "dropdownClass", "selectedDateRange", "selectedEmployee"], outputs: ["selectionChanged"] }, { kind: "component", type: i5.BackNavigationComponent, selector: "ngx-back-navigation", inputs: ["haveLink"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }, { kind: "pipe", type: i6.AsyncPipe, name: "async" }] }); }
};
PickEmployeeComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        Router,
        ToastrService,
        EventTypeService,
        Store])
], PickEmployeeComponent);
export { PickEmployeeComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PickEmployeeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-pick-employee', providers: [EventTypeService], standalone: false, template: "<nb-card [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n  <nb-card-header class=\"card-header-title\">\n    <div class=\"card-header-title\">\n      <ngx-back-navigation></ngx-back-navigation>\n      <h4>\n        {{ 'APPOINTMENTS_PAGE.SELECT_EMPLOYEE' | translate }}\n      </h4>\n    </div>\n  </nb-card-header>\n  <nb-card-body>\n    @if (organization$ | async; as organization) {\n      <div class=\"col-9\">\n        <div style=\"height: 300px\" class=\"form-group\">\n          <label for=\"description\" class=\"label\">\n            {{ 'APPOINTMENTS_PAGE.EMPLOYEE' | translate }}\n          </label>\n          <div class=\"center-div\">\n            <ga-employee-selector\n              class=\"col-6\"\n              style=\"width: 100%\"\n              #employeeSelector\n              [skipGlobalChange]=\"true\"\n              [addTag]=\"false\"\n              class=\"employees\"\n            ></ga-employee-selector>\n            <span class=\"col-1\"></span>\n            <button class=\"col-3\" (click)=\"bookPublicEmployeeAppointment()\" status=\"success\" nbButton>\n              {{ 'PUBLIC_APPOINTMENTS.BOOK_APPOINTMENT' | translate }}\n            </button>\n          </div>\n        </div>\n      </div>\n    }\n  </nb-card-body>\n</nb-card>\n", styles: [".center-div{display:flex;align-items:center;justify-content:space-between}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.Router }, { type: i3.ToastrService }, { type: i3.EventTypeService }, { type: i3.Store }], propDecorators: { employeeSelector: [{
                type: ViewChild,
                args: ['employeeSelector']
            }] } });
//# sourceMappingURL=pick-employee.component.js.map