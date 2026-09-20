import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EmployeeAppointmentService, ErrorHandlingService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/router";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "@nebular/theme";
import * as i5 from "@gauzy/ui-core/shared";
import * as i6 from "@angular/common";
let EditAppointmentComponent = class EditAppointmentComponent extends TranslationBaseComponent {
    constructor(translateService, _route, _router, _employeeAppointmentService, _errorHandlingService) {
        super(translateService);
        this.translateService = translateService;
        this._route = _route;
        this._router = _router;
        this._employeeAppointmentService = _employeeAppointmentService;
        this._errorHandlingService = _errorHandlingService;
    }
    ngOnInit() {
        // Create an observable for the appointment based on route parameters
        this.appointmentId$ = this._route.queryParams.pipe(
        // Ensure the route parameters are valid
        switchMap(({ token }) => {
            if (!token) {
                throw new Error('token missing');
            }
            return from(this._employeeAppointmentService.decodeToken(token));
        }), 
        // Handle errors and redirect to 404 page
        catchError((error) => {
            // Handle and log errors
            this._errorHandlingService.handleError(error);
            // Redirect to 404 page
            this._router.navigate(['/share/404']);
            // Return an empty observable to maintain type consistency
            return EMPTY; // Return an empty observable to maintain type consistency
        }), 
        // Handle component lifecycle to avoid memory leaks
        untilDestroyed(this));
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EditAppointmentComponent, deps: [{ token: i1.TranslateService }, { token: i2.ActivatedRoute }, { token: i2.Router }, { token: i3.EmployeeAppointmentService }, { token: i3.ErrorHandlingService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: EditAppointmentComponent, isStandalone: false, selector: "ga-edit-appointment", usesInheritance: true, ngImport: i0, template: "@if (appointmentId$ | async; as appointmentId) {\n  <nb-card>\n    <ga-manage-appointment\n      [hidePrivateFields]=\"true\"\n      [disabled]=\"true\"\n      [appointmentId]=\"appointmentId\"\n    ></ga-manage-appointment>\n  </nb-card>\n}\n", dependencies: [{ kind: "component", type: i4.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i5.ManageAppointmentComponent, selector: "ga-manage-appointment", inputs: ["employee", "employeeAppointment", "disabled", "appointmentId", "allowedDuration", "hidePrivateFields", "timezone", "selectedRange"], outputs: ["save", "cancel"] }, { kind: "pipe", type: i6.AsyncPipe, name: "async" }] }); }
};
EditAppointmentComponent = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [TranslateService,
        ActivatedRoute,
        Router,
        EmployeeAppointmentService,
        ErrorHandlingService])
], EditAppointmentComponent);
export { EditAppointmentComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EditAppointmentComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-edit-appointment', standalone: false, template: "@if (appointmentId$ | async; as appointmentId) {\n  <nb-card>\n    <ga-manage-appointment\n      [hidePrivateFields]=\"true\"\n      [disabled]=\"true\"\n      [appointmentId]=\"appointmentId\"\n    ></ga-manage-appointment>\n  </nb-card>\n}\n" }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.ActivatedRoute }, { type: i2.Router }, { type: i3.EmployeeAppointmentService }, { type: i3.ErrorHandlingService }] });
//# sourceMappingURL=edit-appointment.component.js.map