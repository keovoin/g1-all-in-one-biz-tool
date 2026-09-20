import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { catchError, filter, of, switchMap, tap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EmployeesService, ErrorHandlingService, EventTypeService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/router";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "@nebular/theme";
import * as i5 from "@gauzy/ui-core/shared";
import * as i6 from "@angular/common";
let CreateAppointmentComponent = class CreateAppointmentComponent extends TranslationBaseComponent {
    constructor(translateService, _route, _router, _employeeService, _eventTypeService, _errorHandlingService) {
        super(translateService);
        this.translateService = translateService;
        this._route = _route;
        this._router = _router;
        this._employeeService = _employeeService;
        this._eventTypeService = _eventTypeService;
        this._errorHandlingService = _errorHandlingService;
        this.loading = true;
    }
    ngOnInit() {
        this.employee$ = this._route.params.pipe(
        // Ensure the route parameters are valid
        filter((params) => !!params.id), 
        // Fetch the employee from the employee service
        switchMap((params) => this._employeeService.getEmployeeById(params.id, ['user'])), 
        // Store the employee in the 'employee' property
        tap((employee) => (this.employee = employee)), 
        // Handle errors
        catchError((error) => {
            // Handle and log errors
            this._errorHandlingService.handleError(error);
            // Navigate to the 404 page
            this._router.navigate(['/share/404']);
            // Return null to avoid breaking the observable chain
            return of(null);
        }), tap((employee) => {
            if (employee) {
                this.loading = false;
                this.appointmentFormURL = `/share/employee/${employee.id}/create-appointment`;
            }
        }), 
        // Handle component lifecycle to avoid memory leaks
        untilDestroyed(this));
        this.eventType$ = this._route.params.pipe(
        // Ensure the route parameters are valid
        filter((params) => !!params.eventId), 
        // Fetch the event type from the event type service
        switchMap((params) => this._eventTypeService.getEventTypeById(params.eventId)), 
        // Store the event type in the 'eventType' property
        tap((eventType) => (this.eventType = eventType)), 
        // Handle errors
        catchError((error) => {
            // Handle and log errors
            this._errorHandlingService.handleError(error);
            // Navigate to the 404 page
            this._router.navigate(['/share/404']);
            // Return null to avoid breaking the observable chain
            return of(null);
        }), 
        // Handle component lifecycle to avoid memory leaks
        untilDestroyed(this));
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CreateAppointmentComponent, deps: [{ token: i1.TranslateService }, { token: i2.ActivatedRoute }, { token: i2.Router }, { token: i3.EmployeesService }, { token: i3.EventTypeService }, { token: i3.ErrorHandlingService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: CreateAppointmentComponent, isStandalone: false, selector: "ng-component", providers: [EventTypeService], usesInheritance: true, ngImport: i0, template: "<nb-card [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n  <nb-card-header>\n    <div class=\"main-header\">\n      <h4>{{ 'PUBLIC_APPOINTMENTS.PICK_DATETIME' | translate }}</h4>\n    </div>\n  </nb-card-header>\n  <nb-card-body>\n    @if (employee$ | async; as employee) {\n      @if (eventType$ | async; as eventType) {\n        <div class=\"row\">\n          @if (employee) {\n            <div class=\"employee-info col-9\">\n              <img class=\"employee-image\" [src]=\"employee.user.imageUrl\" alt=\"Employee Avatar\" />\n              <div class=\"employee-details\">\n                <span class=\"employee-name\">\n                  {{ employee.fullName }}\n                </span>\n                <div class=\"employee-position\">\n                  {{ employee.organizationPosition?.name }}\n                </div>\n                <div class=\"transparent\">\n                  <strong>{{ employee.user?.email }}</strong>\n                </div>\n              </div>\n            </div>\n          }\n          @if (eventType) {\n            <div class=\"col-3\">\n              <div>\n                <div class=\"block-info\">\n                  {{ 'PUBLIC_APPOINTMENTS.EVENT_TYPE' | translate }}\n                  <strong> {{ eventType.title }} </strong>\n                </div>\n              </div>\n              <div>\n                {{ 'PUBLIC_APPOINTMENTS.DURATION' | translate }}\n                <strong> {{ eventType.duration }} {{ eventType.durationUnit }} </strong>\n              </div>\n              <div>\n                {{ eventType.description }}\n              </div>\n            </div>\n          }\n        </div>\n        <div class=\"calendar\">\n          <ngx-appointment-calendar\n            [employee]=\"employee\"\n            [selectedEventType]=\"eventType\"\n            [appointmentFormURL]=\"appointmentFormURL\"\n            [showHeader]=\"false\"\n          ></ngx-appointment-calendar>\n        </div>\n      }\n    }\n  </nb-card-body>\n</nb-card>\n", styles: [".employee-info,.org-info{display:flex}.employee-info .employee-image,.employee-info .org-image,.org-info .employee-image,.org-info .org-image{max-width:70px;max-height:70px;border-radius:13px;margin-right:24px;margin-left:24px}.employee-info .employee-details,.employee-info .org-details,.org-info .employee-details,.org-info .org-details{display:flex;flex-direction:column;justify-content:center}.employee-info .employee-details .employee-name,.employee-info .employee-details .org-name,.employee-info .org-details .employee-name,.employee-info .org-details .org-name,.org-info .employee-details .employee-name,.org-info .employee-details .org-name,.org-info .org-details .employee-name,.org-info .org-details .org-name{font-weight:700;font-size:18px}.employee-info .employee-details .employee-position,.employee-info .employee-details .org-position,.employee-info .org-details .employee-position,.employee-info .org-details .org-position,.org-info .employee-details .employee-position,.org-info .employee-details .org-position,.org-info .org-details .employee-position,.org-info .org-details .org-position{font-size:14px}.transparent{opacity:.7}.body-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:25px;margin-top:25px}.block-content{display:flex;justify-content:space-between;width:100%}.block-content .block-info{display:flex;justify-content:space-between;align-items:center;width:560px;padding-left:30px}.block-content .block-info .row{width:100%}.calendar{margin-top:20px}.row{margin-bottom:20px}\n"], dependencies: [{ kind: "component", type: i4.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i4.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i4.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "directive", type: i4.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "component", type: i5.AppointmentCalendarComponent, selector: "ngx-appointment-calendar", inputs: ["showHeader", "appointmentFormURL", "employee", "selectedEventType"] }, { kind: "directive", type: i5.ImgDirective, selector: "img", inputs: ["type", "skipDefaultImage", "enableFadeIn"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }, { kind: "pipe", type: i6.AsyncPipe, name: "async" }] }); }
};
CreateAppointmentComponent = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [TranslateService,
        ActivatedRoute,
        Router,
        EmployeesService,
        EventTypeService,
        ErrorHandlingService])
], CreateAppointmentComponent);
export { CreateAppointmentComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CreateAppointmentComponent, decorators: [{
            type: Component,
            args: [{ providers: [EventTypeService], standalone: false, template: "<nb-card [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n  <nb-card-header>\n    <div class=\"main-header\">\n      <h4>{{ 'PUBLIC_APPOINTMENTS.PICK_DATETIME' | translate }}</h4>\n    </div>\n  </nb-card-header>\n  <nb-card-body>\n    @if (employee$ | async; as employee) {\n      @if (eventType$ | async; as eventType) {\n        <div class=\"row\">\n          @if (employee) {\n            <div class=\"employee-info col-9\">\n              <img class=\"employee-image\" [src]=\"employee.user.imageUrl\" alt=\"Employee Avatar\" />\n              <div class=\"employee-details\">\n                <span class=\"employee-name\">\n                  {{ employee.fullName }}\n                </span>\n                <div class=\"employee-position\">\n                  {{ employee.organizationPosition?.name }}\n                </div>\n                <div class=\"transparent\">\n                  <strong>{{ employee.user?.email }}</strong>\n                </div>\n              </div>\n            </div>\n          }\n          @if (eventType) {\n            <div class=\"col-3\">\n              <div>\n                <div class=\"block-info\">\n                  {{ 'PUBLIC_APPOINTMENTS.EVENT_TYPE' | translate }}\n                  <strong> {{ eventType.title }} </strong>\n                </div>\n              </div>\n              <div>\n                {{ 'PUBLIC_APPOINTMENTS.DURATION' | translate }}\n                <strong> {{ eventType.duration }} {{ eventType.durationUnit }} </strong>\n              </div>\n              <div>\n                {{ eventType.description }}\n              </div>\n            </div>\n          }\n        </div>\n        <div class=\"calendar\">\n          <ngx-appointment-calendar\n            [employee]=\"employee\"\n            [selectedEventType]=\"eventType\"\n            [appointmentFormURL]=\"appointmentFormURL\"\n            [showHeader]=\"false\"\n          ></ngx-appointment-calendar>\n        </div>\n      }\n    }\n  </nb-card-body>\n</nb-card>\n", styles: [".employee-info,.org-info{display:flex}.employee-info .employee-image,.employee-info .org-image,.org-info .employee-image,.org-info .org-image{max-width:70px;max-height:70px;border-radius:13px;margin-right:24px;margin-left:24px}.employee-info .employee-details,.employee-info .org-details,.org-info .employee-details,.org-info .org-details{display:flex;flex-direction:column;justify-content:center}.employee-info .employee-details .employee-name,.employee-info .employee-details .org-name,.employee-info .org-details .employee-name,.employee-info .org-details .org-name,.org-info .employee-details .employee-name,.org-info .employee-details .org-name,.org-info .org-details .employee-name,.org-info .org-details .org-name{font-weight:700;font-size:18px}.employee-info .employee-details .employee-position,.employee-info .employee-details .org-position,.employee-info .org-details .employee-position,.employee-info .org-details .org-position,.org-info .employee-details .employee-position,.org-info .employee-details .org-position,.org-info .org-details .employee-position,.org-info .org-details .org-position{font-size:14px}.transparent{opacity:.7}.body-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:25px;margin-top:25px}.block-content{display:flex;justify-content:space-between;width:100%}.block-content .block-info{display:flex;justify-content:space-between;align-items:center;width:560px;padding-left:30px}.block-content .block-info .row{width:100%}.calendar{margin-top:20px}.row{margin-bottom:20px}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.ActivatedRoute }, { type: i2.Router }, { type: i3.EmployeesService }, { type: i3.EventTypeService }, { type: i3.ErrorHandlingService }] });
//# sourceMappingURL=create-appointment.component.js.map