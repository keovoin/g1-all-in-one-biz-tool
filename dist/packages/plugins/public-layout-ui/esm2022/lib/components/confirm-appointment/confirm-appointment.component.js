import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, UrlSerializer } from '@angular/router';
import { EMPTY, catchError, filter, firstValueFrom, of, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NbDialogService } from '@nebular/theme';
import moment from 'moment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EmployeeAppointmentStatus } from '@gauzy/contracts';
import { EmployeeAppointmentService, EmployeesService, ErrorHandlingService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { AlertModalComponent } from '@gauzy/ui-core/shared';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/router";
import * as i3 from "@angular/common";
import * as i4 from "@nebular/theme";
import * as i5 from "@gauzy/ui-core/core";
let ConfirmAppointmentComponent = class ConfirmAppointmentComponent extends TranslationBaseComponent {
    constructor(translateService, _route, _location, _urlSerializer, _router, _dialogService, _employeeService, _employeeAppointmentService, _errorHandlingService) {
        super(translateService);
        this.translateService = translateService;
        this._route = _route;
        this._location = _location;
        this._urlSerializer = _urlSerializer;
        this._router = _router;
        this._dialogService = _dialogService;
        this._employeeService = _employeeService;
        this._employeeAppointmentService = _employeeAppointmentService;
        this._errorHandlingService = _errorHandlingService;
        this.loading = false;
    }
    ngOnInit() {
        // Create an observable for the employee based on route parameters
        this.appointment$ = this._route.params.pipe(
        // Ensure the route parameters are valid
        filter((params) => !!params.appointmentId), 
        // Fetch appointment from the employee appointment service
        switchMap((params) => {
            // Get the appointment ID from the route parameters
            const appointmentId = params.appointmentId;
            // Fetch the employee appointment from the service
            return this._employeeAppointmentService.getById(appointmentId, ['employee', 'employee.user']);
        }), tap(async (appointment) => await this.getRescheduleLink(appointment)), 
        // Handle errors
        catchError((error) => {
            // Handle and log errors
            this._errorHandlingService.handleError(error);
            // Redirect to 404 page
            this._router.navigate(['/share/404']);
            // Return an empty observable
            return EMPTY;
        }), 
        // Handle component lifecycle to avoid memory leaks
        untilDestroyed(this));
    }
    /**
     * Get the reschedule link for the appointment.
     *
     * @param appointment The appointment to get the reschedule link for.
     */
    async getRescheduleLink(appointment) {
        // Get the appointment ID from the route parameters
        const appointmentId = appointment.id;
        // Get the start and end date time of the appointment
        const token = await this._employeeAppointmentService.signAppointmentId(appointmentId);
        // Get the URL to edit the appointment
        const urlTree = this._router.createUrlTree(['/share/employee/edit-appointment'], { queryParams: { token } });
        // As far as I can tell you don't really need the UrlSerializer.
        this.rescheduleLink = this._location.prepareExternalUrl(this._urlSerializer.serialize(urlTree));
    }
    /**
     * Format the appointment duration.
     *
     * @param startDateTime The start time of the appointment.
     * @param endDateTime The end time of the appointment.
     * @returns A formatted string representing the duration.
     */
    formatDuration(startDateTime, endDateTime) {
        const startFormatted = moment(startDateTime).format('llll');
        const endFormatted = moment(endDateTime).format('llll');
        return `${startFormatted} - ${endFormatted}`;
    }
    /**
     * Cancel the appointment with a confirmation dialog.
     *
     * @param appointmentId The ID of the appointment to cancel.
     */
    async cancelAppointment(appointmentId) {
        const confirmed = await this.confirmCancellation();
        if (!confirmed)
            return;
        // Update the appointment status to 'Cancelled'
        await this._employeeAppointmentService.update(appointmentId, {
            status: EmployeeAppointmentStatus.CANCELLED
        });
        // Create an observable for the appointment
        const appointment = await firstValueFrom(this._employeeAppointmentService.getById(appointmentId, ['employee', 'employee.user']));
        this.appointment$ = of(appointment);
    }
    /**
     * Opens a confirmation dialog for cancelling an appointment.
     *
     * @returns A promise that resolves to true if the user confirms, otherwise false.
     */
    async confirmCancellation() {
        // Open a confirmation dialog
        const dialog = this._dialogService.open(AlertModalComponent, {
            context: {
                data: {
                    title: this.getTranslation('APPOINTMENTS_PAGE.CANCEL_APPOINTMENT'),
                    message: this.getTranslation('APPOINTMENTS_PAGE.ARE_YOU_SURE'),
                    status: 'danger'
                }
            }
        });
        // Wait for the user to confirm cancellation
        const response = await firstValueFrom(dialog.onClose);
        // Return true if the user confirmed cancellation, false otherwise
        return response === 'yes';
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ConfirmAppointmentComponent, deps: [{ token: i1.TranslateService }, { token: i2.ActivatedRoute }, { token: i3.Location }, { token: i2.UrlSerializer }, { token: i2.Router }, { token: i4.NbDialogService }, { token: i5.EmployeesService }, { token: i5.EmployeeAppointmentService }, { token: i5.ErrorHandlingService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ConfirmAppointmentComponent, isStandalone: false, selector: "ga-confirm-appointment", providers: [EmployeeAppointmentService], usesInheritance: true, ngImport: i0, template: "@if (appointment$ | async; as appointment) {\n  <nb-card [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n    <nb-card-header>\n      <div class=\"main-header\">\n        <h4>\n          {{\n          (appointment.status\n          ? 'PUBLIC_APPOINTMENTS.APPOINTMENT_INFO'\n          : 'PUBLIC_APPOINTMENTS.CONFIRM_APPOINTMENT'\n          ) | translate\n          }}\n          @if (!appointment.status) {\n            <nb-icon icon=\"checkmark-circle-2-outline\" class=\"icons\"></nb-icon>\n          }\n        </h4>\n      </div>\n    </nb-card-header>\n    <nb-card-body>\n      <nb-card class=\"p-3\">\n        <h6>\n          {{ 'PUBLIC_APPOINTMENTS.DETAILS' | translate }}\n          <nb-icon icon=\"calendar-outline\" class=\"icons\"></nb-icon>\n        </h6>\n        <div class=\"p-2\">\n          <strong>{{ 'PUBLIC_APPOINTMENTS.HOST' | translate }}: </strong\n            ><span>{{ appointment?.employee?.user?.name }} ({{ appointment?.employee?.user?.email }})</span>\n          </div>\n          <div class=\"p-2\">\n            <strong>{{ 'FORM.LABELS.MEETING_AGENDA' | translate }}: </strong\n              ><span>{{ appointment.agenda }}</span>\n            </div>\n            @if (appointment.description) {\n              <div class=\"p-2\">\n                <strong>{{ 'FORM.LABELS.MEETING_DESCRIPTION' | translate }}: </strong>\n                <span>{{ appointment.description }}</span>\n              </div>\n            }\n            <div class=\"p-2\">\n              <strong>{{ 'PUBLIC_APPOINTMENTS.PARTICIPANTS' | translate }}: </strong>\n              <span>{{ appointment.emails }}</span>\n            </div>\n            <div class=\"p-2\">\n              <strong>{{ 'FORM.LABELS.MEETING_LOCATION' | translate }}: </strong>\n              <span>{{ appointment.location || 'N/A' }}</span>\n            </div>\n            <div class=\"p-2\">\n              <strong>{{ 'FORM.LABELS.DURATION' | translate }}: </strong>\n              <span>{{ formatDuration(appointment?.startDateTime, appointment?.endDateTime) }}</span>\n            </div>\n          </nb-card>\n          @if (!appointment.status) {\n            <nb-card>\n              <div class=\"p-3 caption-2\">\n                <span>{{ 'PUBLIC_APPOINTMENTS.EMAIL_SENT' | translate }} </span>\n              </div>\n            </nb-card>\n          }\n          @if (rescheduleLink) {\n            <nb-card>\n              <div class=\"p-3\" style=\"overflow-wrap: break-word\">\n                <strong>{{ 'PUBLIC_APPOINTMENTS.RESCHEDULE' | translate }}: </strong>\n                <a [href]=\"rescheduleLink\" target=\"_blank\" rel=\"noopener noreferrer\">\n                  {{ 'PUBLIC_APPOINTMENTS.CLICK_HERE' | translate }}\n                </a>\n              </div>\n            </nb-card>\n          }\n          @if (appointment.status) {\n            <nb-card>\n              <div class=\"p-3\">\n                <span style=\"color: red\">{{ 'PUBLIC_APPOINTMENTS.EXPIRED_OR_CANCELLED' | translate }} </span>\n              </div>\n            </nb-card>\n          }\n          @if (!appointment.status) {\n            <div class=\"col-3\" style=\"padding-left: 0%\">\n              <button (click)=\"cancelAppointment(appointment.id)\" status=\"warning\" nbButton>\n                {{ 'PUBLIC_APPOINTMENTS.CANCEL' | translate }}\n              </button>\n            </div>\n          }\n        </nb-card-body>\n      </nb-card>\n    }\n", dependencies: [{ kind: "component", type: i4.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i4.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i4.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i4.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i4.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i4.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }, { kind: "pipe", type: i3.AsyncPipe, name: "async" }] }); }
};
ConfirmAppointmentComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        ActivatedRoute,
        Location,
        UrlSerializer,
        Router,
        NbDialogService,
        EmployeesService,
        EmployeeAppointmentService,
        ErrorHandlingService])
], ConfirmAppointmentComponent);
export { ConfirmAppointmentComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ConfirmAppointmentComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-confirm-appointment', providers: [EmployeeAppointmentService], standalone: false, template: "@if (appointment$ | async; as appointment) {\n  <nb-card [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\" nbSpinnerSize=\"large\">\n    <nb-card-header>\n      <div class=\"main-header\">\n        <h4>\n          {{\n          (appointment.status\n          ? 'PUBLIC_APPOINTMENTS.APPOINTMENT_INFO'\n          : 'PUBLIC_APPOINTMENTS.CONFIRM_APPOINTMENT'\n          ) | translate\n          }}\n          @if (!appointment.status) {\n            <nb-icon icon=\"checkmark-circle-2-outline\" class=\"icons\"></nb-icon>\n          }\n        </h4>\n      </div>\n    </nb-card-header>\n    <nb-card-body>\n      <nb-card class=\"p-3\">\n        <h6>\n          {{ 'PUBLIC_APPOINTMENTS.DETAILS' | translate }}\n          <nb-icon icon=\"calendar-outline\" class=\"icons\"></nb-icon>\n        </h6>\n        <div class=\"p-2\">\n          <strong>{{ 'PUBLIC_APPOINTMENTS.HOST' | translate }}: </strong\n            ><span>{{ appointment?.employee?.user?.name }} ({{ appointment?.employee?.user?.email }})</span>\n          </div>\n          <div class=\"p-2\">\n            <strong>{{ 'FORM.LABELS.MEETING_AGENDA' | translate }}: </strong\n              ><span>{{ appointment.agenda }}</span>\n            </div>\n            @if (appointment.description) {\n              <div class=\"p-2\">\n                <strong>{{ 'FORM.LABELS.MEETING_DESCRIPTION' | translate }}: </strong>\n                <span>{{ appointment.description }}</span>\n              </div>\n            }\n            <div class=\"p-2\">\n              <strong>{{ 'PUBLIC_APPOINTMENTS.PARTICIPANTS' | translate }}: </strong>\n              <span>{{ appointment.emails }}</span>\n            </div>\n            <div class=\"p-2\">\n              <strong>{{ 'FORM.LABELS.MEETING_LOCATION' | translate }}: </strong>\n              <span>{{ appointment.location || 'N/A' }}</span>\n            </div>\n            <div class=\"p-2\">\n              <strong>{{ 'FORM.LABELS.DURATION' | translate }}: </strong>\n              <span>{{ formatDuration(appointment?.startDateTime, appointment?.endDateTime) }}</span>\n            </div>\n          </nb-card>\n          @if (!appointment.status) {\n            <nb-card>\n              <div class=\"p-3 caption-2\">\n                <span>{{ 'PUBLIC_APPOINTMENTS.EMAIL_SENT' | translate }} </span>\n              </div>\n            </nb-card>\n          }\n          @if (rescheduleLink) {\n            <nb-card>\n              <div class=\"p-3\" style=\"overflow-wrap: break-word\">\n                <strong>{{ 'PUBLIC_APPOINTMENTS.RESCHEDULE' | translate }}: </strong>\n                <a [href]=\"rescheduleLink\" target=\"_blank\" rel=\"noopener noreferrer\">\n                  {{ 'PUBLIC_APPOINTMENTS.CLICK_HERE' | translate }}\n                </a>\n              </div>\n            </nb-card>\n          }\n          @if (appointment.status) {\n            <nb-card>\n              <div class=\"p-3\">\n                <span style=\"color: red\">{{ 'PUBLIC_APPOINTMENTS.EXPIRED_OR_CANCELLED' | translate }} </span>\n              </div>\n            </nb-card>\n          }\n          @if (!appointment.status) {\n            <div class=\"col-3\" style=\"padding-left: 0%\">\n              <button (click)=\"cancelAppointment(appointment.id)\" status=\"warning\" nbButton>\n                {{ 'PUBLIC_APPOINTMENTS.CANCEL' | translate }}\n              </button>\n            </div>\n          }\n        </nb-card-body>\n      </nb-card>\n    }\n" }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.ActivatedRoute }, { type: i3.Location }, { type: i2.UrlSerializer }, { type: i2.Router }, { type: i4.NbDialogService }, { type: i5.EmployeesService }, { type: i5.EmployeeAppointmentService }, { type: i5.ErrorHandlingService }] });
//# sourceMappingURL=confirm-appointment.component.js.map