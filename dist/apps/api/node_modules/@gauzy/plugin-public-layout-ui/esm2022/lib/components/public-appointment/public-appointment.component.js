import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, of, switchMap } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { EmployeesService, ErrorHandlingService, EventTypeService, Store } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/router";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "@nebular/theme";
import * as i5 from "@gauzy/ui-core/shared";
import * as i6 from "@angular/common";
let PublicAppointmentComponent = class PublicAppointmentComponent extends TranslationBaseComponent {
    constructor(translateService, _router, _route, _store, _employeeService, _eventTypeService, _errorHandlingService) {
        super(translateService);
        this.translateService = translateService;
        this._router = _router;
        this._route = _route;
        this._store = _store;
        this._employeeService = _employeeService;
        this._eventTypeService = _eventTypeService;
        this._errorHandlingService = _errorHandlingService;
        this.loading = false;
        this.eventTypes = [];
    }
    ngOnInit() {
        // Create an observable for the employee based on route parameters
        this.employee$ = this._route.params.pipe(
        // Ensure the route parameters are valid
        filter((params) => !!params.id), 
        // Fetch the employee from the employee service
        switchMap((params) => this._employeeService.getEmployeeById(params.id, ['user'])), 
        // Store the employee in the 'employee' property
        tap((employee) => (this.employee = employee)), 
        // Fetch event types
        tap(() => this.getEventTypes()), 
        // Handle errors
        catchError((error) => {
            // Handle and log errors
            this._errorHandlingService.handleError(error);
            return of(null);
        }), 
        // Handle component lifecycle to avoid memory leaks
        untilDestroyed(this));
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
     * Fetches and processes event types based on the organization and employee details.
     *
     * @returns {Promise<void>}
     */
    async getEventTypes() {
        if (!this.organization || !this.employee) {
            return;
        }
        // Set loading state to true
        this.loading = true;
        // Extract organization and employee IDs
        const { id: organizationId, tenantId } = this.organization;
        const { id: employeeId } = this.employee;
        try {
            let { items } = await this._eventTypeService.getAll(['employee', 'employee.user', 'tags'], {
                organizationId,
                tenantId,
                employee: { id: employeeId },
                isActive: true,
                isArchived: false
            });
            // If no event types are found for the employee, fetch generic event types
            if (items.length === 0) {
                ({ items } = await this._eventTypeService.getAll(['tags'], {
                    organizationId,
                    tenantId,
                    isActive: true,
                    isArchived: false
                }));
            }
            // If exactly one event type is found, navigate to its page
            if (items.length === 1) {
                // Get the first event type
                const eventType = items[0];
                // Navigate to the event type page
                this._router.navigate([`/share/employee/${employeeId}/${eventType.id}`]);
            }
            else if (items.length > 0) {
                this.eventTypesExist = true;
            }
            // Sort event types by duration and duration unit
            const eventTypesOrder = ['Minute(s)', 'Hour(s)', 'Day(s)'];
            // Sort event types by duration and duration unit
            this.eventTypes = items.sort((a, b) => {
                // Compare by duration unit first
                const comparison = eventTypesOrder.indexOf(a.durationUnit) - eventTypesOrder.indexOf(b.durationUnit);
                // If duration units are the same, compare by duration
                return comparison !== 0 ? comparison : a.duration - b.duration;
            });
        }
        catch (error) {
            console.error('Error while fetching event types:', error);
            // Handle and log errors
            this._errorHandlingService.handleError(error);
        }
        finally {
            // Set loading state to false
            this.loading = false;
        }
    }
    /**
     * Select event type
     *
     * @param id
     */
    selectEventType(id) {
        this._router.navigate([`${this._router.url}/${id}`]);
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PublicAppointmentComponent, deps: [{ token: i1.TranslateService }, { token: i2.Router }, { token: i2.ActivatedRoute }, { token: i3.Store }, { token: i3.EmployeesService }, { token: i3.EventTypeService }, { token: i3.ErrorHandlingService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: PublicAppointmentComponent, isStandalone: false, selector: "ga-public-appointment", providers: [EventTypeService], usesInheritance: true, ngImport: i0, template: "<nb-card [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n  <nb-card-header>\n    <div class=\"main-header\">\n      <h4>{{ 'PUBLIC_APPOINTMENTS.BOOK_APPOINTMENTS' | translate }}</h4>\n    </div>\n  </nb-card-header>\n  <nb-card-body>\n    @if (organization$ | async; as organization) {\n      @if (employee$ | async; as employee) {\n        <div class=\"employee-info\">\n          <img class=\"employee-image\" [src]=\"employee.user?.imageUrl\" alt=\"Employee Avatar\" />\n          <div class=\"employee-details\">\n            <span class=\"employee-name\">{{ employee?.fullName }}</span>\n            <div class=\"employee-position\">\n              {{ employee.organizationPosition?.name }}\n            </div>\n            <div class=\"transparent\">\n              <strong>{{ employee.user?.email }}</strong>\n            </div>\n          </div>\n        </div>\n      }\n      <div class=\"body-header\">\n        <h5>\n          {{\n          (eventTypesExist\n          ? 'PUBLIC_APPOINTMENTS.SELECT_EVENT_TYPES'\n          : 'PUBLIC_APPOINTMENTS.NO_ACTIVE_EVENT_TYPES'\n          ) | translate\n          }}\n        </h5>\n      </div>\n      @if (eventTypesExist) {\n        <div>\n          @for (eventType of eventTypes; track eventType) {\n            <div class=\"row block-content\">\n              <div class=\"col-3\">\n                <div class=\"block-info\">\n                  <strong>{{ eventType.title }}</strong>\n                </div>\n              </div>\n              <div class=\"col-3\">\n                {{ 'PUBLIC_APPOINTMENTS.DURATION' | translate }}\n                <strong>{{ eventType.duration }} {{ eventType.durationUnit }}</strong>\n              </div>\n              <div class=\"col-3 text-right\">\n                <button (click)=\"selectEventType(eventType.id)\" status=\"success\" nbButton>\n                  {{ 'BUTTONS.SELECT' | translate }}\n                </button>\n              </div>\n            </div>\n          }\n        </div>\n      }\n    }\n  </nb-card-body>\n</nb-card>\n", styles: [".employee-info,.org-info{display:flex}.employee-info .employee-image,.employee-info .org-image,.org-info .employee-image,.org-info .org-image{max-width:70px;max-height:70px;border-radius:13px;margin-right:24px;margin-left:24px}.employee-info .employee-details,.employee-info .org-details,.org-info .employee-details,.org-info .org-details{display:flex;flex-direction:column;justify-content:center}.employee-info .employee-details .employee-name,.employee-info .employee-details .org-name,.employee-info .org-details .employee-name,.employee-info .org-details .org-name,.org-info .employee-details .employee-name,.org-info .employee-details .org-name,.org-info .org-details .employee-name,.org-info .org-details .org-name{font-weight:700;font-size:18px}.employee-info .employee-details .employee-position,.employee-info .employee-details .org-position,.employee-info .org-details .employee-position,.employee-info .org-details .org-position,.org-info .employee-details .employee-position,.org-info .employee-details .org-position,.org-info .org-details .employee-position,.org-info .org-details .org-position{font-size:14px}.transparent{opacity:.7}.body-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:25px;margin-top:25px}.block-content{display:flex;justify-content:space-between;width:100%}.block-content .block-info{display:flex;justify-content:space-between;align-items:center;width:560px;padding-left:30px}.block-content .block-info .row{width:100%}.calendar{margin-top:20px}.row{margin-bottom:20px}\n"], dependencies: [{ kind: "component", type: i4.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i4.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i4.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i4.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "directive", type: i4.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "directive", type: i5.ImgDirective, selector: "img", inputs: ["type", "skipDefaultImage", "enableFadeIn"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }, { kind: "pipe", type: i6.AsyncPipe, name: "async" }] }); }
};
PublicAppointmentComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        Router,
        ActivatedRoute,
        Store,
        EmployeesService,
        EventTypeService,
        ErrorHandlingService])
], PublicAppointmentComponent);
export { PublicAppointmentComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PublicAppointmentComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-public-appointment', providers: [EventTypeService], standalone: false, template: "<nb-card [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n  <nb-card-header>\n    <div class=\"main-header\">\n      <h4>{{ 'PUBLIC_APPOINTMENTS.BOOK_APPOINTMENTS' | translate }}</h4>\n    </div>\n  </nb-card-header>\n  <nb-card-body>\n    @if (organization$ | async; as organization) {\n      @if (employee$ | async; as employee) {\n        <div class=\"employee-info\">\n          <img class=\"employee-image\" [src]=\"employee.user?.imageUrl\" alt=\"Employee Avatar\" />\n          <div class=\"employee-details\">\n            <span class=\"employee-name\">{{ employee?.fullName }}</span>\n            <div class=\"employee-position\">\n              {{ employee.organizationPosition?.name }}\n            </div>\n            <div class=\"transparent\">\n              <strong>{{ employee.user?.email }}</strong>\n            </div>\n          </div>\n        </div>\n      }\n      <div class=\"body-header\">\n        <h5>\n          {{\n          (eventTypesExist\n          ? 'PUBLIC_APPOINTMENTS.SELECT_EVENT_TYPES'\n          : 'PUBLIC_APPOINTMENTS.NO_ACTIVE_EVENT_TYPES'\n          ) | translate\n          }}\n        </h5>\n      </div>\n      @if (eventTypesExist) {\n        <div>\n          @for (eventType of eventTypes; track eventType) {\n            <div class=\"row block-content\">\n              <div class=\"col-3\">\n                <div class=\"block-info\">\n                  <strong>{{ eventType.title }}</strong>\n                </div>\n              </div>\n              <div class=\"col-3\">\n                {{ 'PUBLIC_APPOINTMENTS.DURATION' | translate }}\n                <strong>{{ eventType.duration }} {{ eventType.durationUnit }}</strong>\n              </div>\n              <div class=\"col-3 text-right\">\n                <button (click)=\"selectEventType(eventType.id)\" status=\"success\" nbButton>\n                  {{ 'BUTTONS.SELECT' | translate }}\n                </button>\n              </div>\n            </div>\n          }\n        </div>\n      }\n    }\n  </nb-card-body>\n</nb-card>\n", styles: [".employee-info,.org-info{display:flex}.employee-info .employee-image,.employee-info .org-image,.org-info .employee-image,.org-info .org-image{max-width:70px;max-height:70px;border-radius:13px;margin-right:24px;margin-left:24px}.employee-info .employee-details,.employee-info .org-details,.org-info .employee-details,.org-info .org-details{display:flex;flex-direction:column;justify-content:center}.employee-info .employee-details .employee-name,.employee-info .employee-details .org-name,.employee-info .org-details .employee-name,.employee-info .org-details .org-name,.org-info .employee-details .employee-name,.org-info .employee-details .org-name,.org-info .org-details .employee-name,.org-info .org-details .org-name{font-weight:700;font-size:18px}.employee-info .employee-details .employee-position,.employee-info .employee-details .org-position,.employee-info .org-details .employee-position,.employee-info .org-details .org-position,.org-info .employee-details .employee-position,.org-info .employee-details .org-position,.org-info .org-details .employee-position,.org-info .org-details .org-position{font-size:14px}.transparent{opacity:.7}.body-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:25px;margin-top:25px}.block-content{display:flex;justify-content:space-between;width:100%}.block-content .block-info{display:flex;justify-content:space-between;align-items:center;width:560px;padding-left:30px}.block-content .block-info .row{width:100%}.calendar{margin-top:20px}.row{margin-bottom:20px}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.Router }, { type: i2.ActivatedRoute }, { type: i3.Store }, { type: i3.EmployeesService }, { type: i3.EventTypeService }, { type: i3.ErrorHandlingService }] });
//# sourceMappingURL=public-appointment.component.js.map