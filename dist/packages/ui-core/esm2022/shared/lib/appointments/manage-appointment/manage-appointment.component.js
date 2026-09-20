import { __decorate, __metadata } from "tslib";
import { Component, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { firstValueFrom } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import moment from 'moment';
import timezone from 'moment-timezone';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EmployeeAppointmentStatus } from '@gauzy/contracts';
import { AppointmentEmployeesService, AvailabilitySlotsService, EmployeeAppointmentService, EmployeesService, Store, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { EmployeeScheduleComponent } from '../employee-schedules/employee-schedule.component';
import { EmployeeSelectComponent } from '../../employee/employee-multi-select/employee-multi-select.component';
import { AlertModalComponent } from '../../components/alert-modal/alert-modal.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/router";
import * as i3 from "@angular/forms";
import * as i4 from "@gauzy/ui-core/core";
import * as i5 from "@nebular/theme";
import * as i6 from "@ng-select/ng-select";
import * as i7 from "../../components/back-navigation/back-navigation.component";
import * as i8 from "../../timer-picker/timer-picker/timer-picker.component";
import * as i9 from "../../timer-picker/timer-range-picker/timer-range-picker.component";
import * as i10 from "../../employee/employee-multi-select/employee-multi-select.component";
let ManageAppointmentComponent = class ManageAppointmentComponent extends TranslationBaseComponent {
    constructor(translateService, _route, _router, _fb, _store, _dialogService, _employeeService, _employeeAppointmentService, _appointmentEmployeesService, _availabilitySlotsService, _toastrService, _cdr) {
        super(translateService);
        this.translateService = translateService;
        this._route = _route;
        this._router = _router;
        this._fb = _fb;
        this._store = _store;
        this._dialogService = _dialogService;
        this._employeeService = _employeeService;
        this._employeeAppointmentService = _employeeAppointmentService;
        this._appointmentEmployeesService = _appointmentEmployeesService;
        this._availabilitySlotsService = _availabilitySlotsService;
        this._toastrService = _toastrService;
        this._cdr = _cdr;
        this.employees = [];
        this.hidePrivateFields = false;
        this.save = new EventEmitter();
        this.cancel = new EventEmitter();
        this.employeeAvailability = {};
        this.selectedEmployeeIds = [];
        this.selectedEmployeeAppointmentIds = [];
        this.emailAddresses = [];
    }
    ngOnInit() {
        if (this.selectedRange) {
            this.start = this.selectedRange.start;
            this.end = this.selectedRange.end;
        }
        else {
            this._route.queryParams.subscribe((params) => {
                this.selectedRange = {
                    start: params.dateStart,
                    end: params.dateEnd
                };
                this.timezone = this.timezone || params.timezone || timezone.tz.guess();
            });
        }
        this.timezoneOffset = timezone.tz(this.timezone).format('Z');
        timezone.tz.setDefault(this.timezone);
        this._store.selectedOrganization$
            .pipe(filter((organization) => !!organization), untilDestroyed(this))
            .subscribe(async (org) => {
            if (org) {
                this._selectedOrganizationId = org.id;
                await this._loadEmployees().then(() => this._parseParams());
            }
        });
        this._route.params
            .pipe(switchMap(async (params) => {
            if (!params.employeeId)
                return;
            try {
                // Get employee by ID
                this.employee = await firstValueFrom(this._employeeService.getEmployeeById(params.employeeId, ['user']));
            }
            catch (error) {
                console.log('Error while loading employee', error);
            }
        }), untilDestroyed(this))
            .subscribe();
        this._initializeForm();
    }
    ngAfterViewInit() {
        this._cdr.detectChanges();
    }
    _patchFormValue() {
        this.form.patchValue({
            emails: this.employeeAppointment.emails
                ? this.employeeAppointment.emails.split(', ').map((o) => ({ emailAddress: o }))
                : '',
            agenda: this.employeeAppointment.agenda,
            location: this.employeeAppointment.location,
            description: this.employeeAppointment.description,
            invitees: this.employeeAppointment.invitees,
            selectedRange: this.selectedRange,
            bufferTime: this.employeeAppointment.bufferTimeInMins ? true : false,
            breakTime: this.employeeAppointment.breakTimeInMins ? true : false,
            bufferTimeStart: this.employeeAppointment.bufferTimeStart,
            bufferTimeEnd: this.employeeAppointment.bufferTimeEnd,
            bufferTimeInMins: this.employeeAppointment.bufferTimeInMins,
            breakTimeInMins: this.employeeAppointment.breakTimeInMins,
            breakStartTime: this.employeeAppointment.breakStartTime
        });
        this.emails = this.form.get('emails');
    }
    emailListValidator(control) {
        const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
        const invalid = (control.value || []).find((tag) => {
            return !emailPattern.test(tag.emailAddress || '');
        });
        return invalid ? { emails: invalid } : null;
    }
    addTagFn(emailAddress) {
        return { emailAddress: emailAddress, tag: true };
    }
    _initializeForm() {
        this.form = this._fb.group({
            emails: ['', Validators.compose([Validators.required, this.emailListValidator])],
            agenda: ['', Validators.required],
            location: [''],
            description: [''],
            invitees: [{ value: [] }, Validators.required],
            selectedRange: this.selectedRange,
            bufferTime: [],
            breakTime: [],
            bufferTimeStart: [''],
            bufferTimeEnd: [''],
            bufferTimeInMins: [''],
            breakTimeInMins: [''],
            breakStartTime: ['']
        });
        this.emails = this.form.get('emails');
    }
    async _loadEmployees() {
        const { tenantId } = this._store.user;
        const organizationId = this._selectedOrganizationId;
        this.employees = (await firstValueFrom(this._employeeService
            .getAll(['user'], {
            tenantId,
            organizationId
        })
            .pipe(untilDestroyed(this)))).items;
    }
    _parseParams() {
        this._route.params.pipe(untilDestroyed(this)).subscribe(async (params) => {
            const id = params.appointmentId || this.appointmentId;
            if (id) {
                this.editMode = true;
                const appointment = await firstValueFrom(this._employeeAppointmentService.getById(id));
                const selectedEmployees = await firstValueFrom(this._appointmentEmployeesService.getById(appointment.id).pipe(untilDestroyed(this)));
                this.selectedEmployeeIds = selectedEmployees.map((o) => o.employeeId);
                this.selectedEmployeeAppointmentIds = selectedEmployees.map((o) => o.id);
                this.start = new Date(appointment.startDateTime);
                this.end = new Date(appointment.endDateTime);
                if (!this.selectedRange.start) {
                    this.selectedRange = {
                        start: this.start,
                        end: this.end
                    };
                }
                this.employeeAppointment = appointment;
                this._patchFormValue();
            }
            this.fetchAvailabilitySlotsForAllEmployees();
        });
    }
    async cancelAppointment() {
        try {
            const dialog = this._dialogService.open(AlertModalComponent, {
                context: {
                    data: {
                        title: this.getTranslation('APPOINTMENTS_PAGE.CANCEL_APPOINTMENT'),
                        message: this.getTranslation('APPOINTMENTS_PAGE.ARE_YOU_SURE'),
                        status: 'danger'
                    }
                }
            });
            const response = await firstValueFrom(dialog.onClose);
            if (!!response) {
                if (response === 'yes') {
                    await this._employeeAppointmentService.update(this.employeeAppointment.id, {
                        status: EmployeeAppointmentStatus.CANCELLED
                    });
                    this._toastrService.success('APPOINTMENTS_PAGE.CANCEL_SUCCESS');
                    history.back();
                }
            }
        }
        catch (error) {
            this._toastrService.danger(this.getTranslation('APPOINTMENTS_PAGE.CANCEL_FAIL'), this.getTranslation('TOASTR.TITLE.ERROR'));
        }
    }
    async fetchAvailabilitySlotsForAllEmployees() {
        const { tenantId } = this._store.user;
        const slots = (await this._availabilitySlotsService.getAll([], {
            organizationId: this._selectedOrganizationId,
            tenantId
        })).items;
        this.employees = this.employees.filter((e) => e.id !==
            (this.employee
                ? this.employee.id
                : this._store.selectedEmployee
                    ? this._store.selectedEmployee.id
                    : null));
        this.employees.map((e) => {
            const dateSpecificSlots = [];
            const recurringSlots = [];
            slots.forEach((s) => {
                if (s.employeeId === e.id && s.type === 'Recurring') {
                    recurringSlots.push(s);
                }
                else if (s.employeeId === e.id) {
                    dateSpecificSlots.push(s);
                }
            });
            this.employeeAvailability[e.id] = dateSpecificSlots.filter((s) => s.employeeId === e.id &&
                moment(this.selectedRange.start).isBetween(moment(s.startTime), moment(s.endTime), 'day', '[]'));
            if (this.employeeAvailability[e.id].length === 0) {
                const appointmentDay = moment(this.selectedRange.start).format('dddd');
                this.employeeAvailability[e.id] = recurringSlots.filter((s) => moment(s.startTime).format('dddd') === appointmentDay);
            }
        });
    }
    async onSaveRequest() {
        try {
            let tenantId = null;
            if (this._store.user) {
                tenantId = this._store.user.tenantId;
            }
            const employeeAppointmentRequest = {
                emails: this.emails.value && this.emails.value.map((email) => email.emailAddress).join(', '),
                agenda: this.form.get('agenda').value,
                location: this.form.get('location').value,
                description: this.form.get('description').value,
                startDateTime: this.form.get('selectedRange').value.start,
                endDateTime: this.form.get('selectedRange').value.end,
                bufferTimeStart: this.form.get('bufferTimeStart').value,
                bufferTimeEnd: this.form.get('bufferTimeEnd').value,
                bufferTimeInMins: this.form.get('bufferTimeInMins').value,
                breakTimeInMins: this.form.get('breakTimeInMins').value,
                breakStartTime: new Date(moment(this.form.get('selectedRange').value.start).format('YYYY-MM-DD') +
                    ' ' +
                    this.form.get('breakStartTime').value),
                employeeId: this.employee
                    ? this.employee.id
                    : this._store.selectedEmployee
                        ? this._store.selectedEmployee.id
                        : null,
                organizationId: this._selectedOrganizationId,
                tenantId
            };
            if (!this.employeeAppointment) {
                this.employeeAppointment = await this._employeeAppointmentService.create(employeeAppointmentRequest);
            }
            else {
                await this._employeeAppointmentService.update(this.employeeAppointment.id, employeeAppointmentRequest);
                // Removing all previously selected employee ids
                for (const id of this.selectedEmployeeAppointmentIds) {
                    await this._appointmentEmployeesService.delete(id);
                }
            }
            for (const e of this.selectedEmployeeIds) {
                await this._appointmentEmployeesService.add({
                    employeeId: e,
                    appointmentId: this.employeeAppointment.id,
                    employeeAppointment: this.employeeAppointment
                });
            }
            this._toastrService.success('APPOINTMENTS_PAGE.SAVE_SUCCESS');
            this.employee
                ? this._router.navigate([`/share/employee/${this.employee.id}/confirm/${this.employeeAppointment.id}`])
                : this._router.navigate(['/pages/employees/appointments']);
        }
        catch (error) {
            this._toastrService.danger('APPOINTMENTS_PAGE.SAVE_FAILED');
        }
    }
    async onMembersSelected(ev) {
        const startDateTime = this.form.get('selectedRange').value.start;
        const endDateTime = this.form.get('selectedRange').value.end;
        const added = ev.find((o) => !this.selectedEmployeeIds.includes(o));
        if (added) {
            const slots = this.employeeAvailability[added];
            const slotInSelectedRange = slots.find((s) => moment(startDateTime).isBetween(moment(s.startTime), moment(s.endTime), 'minutes', '[]') &&
                moment(endDateTime).isBetween(moment(s.startTime), moment(s.endTime), 'minutes', '[]'));
            if ((slots.length > 0 && !slotInSelectedRange) || slots.length === 0) {
                const dialog = this._dialogService.open(EmployeeScheduleComponent, {
                    context: {
                        schedule: {
                            employeeName: this.employees.find((o) => o.id === added).user.name,
                            slots,
                            timezone: this.timezone
                        }
                    }
                });
                const response = await firstValueFrom(dialog.onClose);
                if (response !== 'yes') {
                    this.employeeSelector.employeeId = ev.filter((o) => o !== added);
                    return;
                }
            }
        }
        this.selectedEmployeeIds = ev;
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ManageAppointmentComponent, deps: [{ token: i1.TranslateService }, { token: i2.ActivatedRoute }, { token: i2.Router }, { token: i3.UntypedFormBuilder }, { token: i4.Store }, { token: i5.NbDialogService }, { token: i4.EmployeesService }, { token: i4.EmployeeAppointmentService }, { token: i4.AppointmentEmployeesService }, { token: i4.AvailabilitySlotsService }, { token: i4.ToastrService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ManageAppointmentComponent, isStandalone: false, selector: "ga-manage-appointment", inputs: { employee: "employee", employeeAppointment: "employeeAppointment", disabled: "disabled", appointmentId: "appointmentId", allowedDuration: "allowedDuration", hidePrivateFields: "hidePrivateFields", timezone: "timezone", selectedRange: "selectedRange" }, outputs: { save: "save", cancel: "cancel" }, providers: [AppointmentEmployeesService, AvailabilitySlotsService, EmployeeAppointmentService], viewQueries: [{ propertyName: "employeeSelector", first: true, predicate: ["employeeSelector"], descendants: true }], usesInheritance: true, ngImport: i0, template: "<nb-card class=\"card-scroll\">\n\t<nb-card-header class=\"header\">\n\t\t<ngx-back-navigation></ngx-back-navigation>\n\t\t<h4>\n\t\t\t{{ (editMode ? 'APPOINTMENTS_PAGE.EDIT_APPOINTMENT' : 'APPOINTMENTS_PAGE.ADD_APPOINTMENT') | translate }}\n\t\t</h4>\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t<div class=\"appointment-form\">\n\t\t\t@if (form) {\n\t\t\t<form [formGroup]=\"form\">\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label for=\"agenda\" class=\"label\">{{ 'FORM.LABELS.MEETING_AGENDA' | translate }}</label>\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\tid=\"agenda\"\n\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\tformControlName=\"agenda\"\n\t\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.MEETING_AGENDA' | translate }}\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t\t<ngx-timer-range-picker\n\t\t\t\t\t\t\t[timezoneOffset]=\"timezoneOffset\"\n\t\t\t\t\t\t\t[slotStartTime]=\"start\"\n\t\t\t\t\t\t\t[slotEndTime]=\"end\"\n\t\t\t\t\t\t\t[maxDate]=\"selectedRange.end\"\n\t\t\t\t\t\t\t[minDate]=\"selectedRange.start\"\n\t\t\t\t\t\t\t[allowedDuration]=\"allowedDuration\"\n\t\t\t\t\t\t\t[disableDatePicker]=\"disabled\"\n\t\t\t\t\t\t\t[disableEndPicker]=\"disabled\"\n\t\t\t\t\t\t\tname=\"selectedRange\"\n\t\t\t\t\t\t\tformControlName=\"selectedRange\"\n\t\t\t\t\t\t\tfromEmployeeAppointment=\"true\"\n\t\t\t\t\t\t></ngx-timer-range-picker>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-2\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<nb-checkbox formControlName=\"bufferTime\">\n\t\t\t\t\t\t\t\t{{ 'APPOINTMENTS_PAGE.BUFFER_TIME' | translate }}\n\t\t\t\t\t\t\t</nb-checkbox>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t@if (form.get('bufferTime').value) {\n\t\t\t\t\t<div class=\"col-2\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<nb-checkbox formControlName=\"bufferTimeStart\">\n\t\t\t\t\t\t\t\t{{ 'APPOINTMENTS_PAGE.BUFFER_AT_START' | translate }}\n\t\t\t\t\t\t\t</nb-checkbox>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t} @if (form.get('bufferTime').value) {\n\t\t\t\t\t<div class=\"col-2\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<nb-checkbox formControlName=\"bufferTimeEnd\">\n\t\t\t\t\t\t\t\t{{ 'APPOINTMENTS_PAGE.BUFFER_AT_END' | translate }}\n\t\t\t\t\t\t\t</nb-checkbox>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t@if (form.get('bufferTime').value) {\n\t\t\t\t\t<div class=\"col-6 form-group\">\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\tid=\"bufferTimeInMins\"\n\t\t\t\t\t\t\ttype=\"number\"\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t[min]=\"0\"\n\t\t\t\t\t\t\tformControlName=\"bufferTimeInMins\"\n\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.BUFFER_TIME' | translate }}\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-3\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<nb-checkbox formControlName=\"breakTime\">\n\t\t\t\t\t\t\t\t{{ 'APPOINTMENTS_PAGE.BREAK_TIME' | translate }}\n\t\t\t\t\t\t\t</nb-checkbox>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t@if (form.get('breakTime').value) {\n\t\t\t\t\t<div class=\"col-6 form-group\">\n\t\t\t\t\t\t<ga-timer-picker\n\t\t\t\t\t\t\tname=\"break_start_time\"\n\t\t\t\t\t\t\t[min]=\"form.get('selectedRange').value.start\"\n\t\t\t\t\t\t\t[max]=\"form.get('selectedRange').value.end\"\n\t\t\t\t\t\t\tformControlName=\"breakStartTime\"\n\t\t\t\t\t\t></ga-timer-picker>\n\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t@if (form.get('breakTime').value) {\n\t\t\t\t\t<div class=\"col-6 form-group\">\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\tid=\"breakTimeInMins\"\n\t\t\t\t\t\t\ttype=\"number\"\n\t\t\t\t\t\t\t[min]=\"0\"\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\tformControlName=\"breakTimeInMins\"\n\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.BREAK_TIME' | translate }}\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label for=\"location\" class=\"label\">{{ 'FORM.LABELS.MEETING_LOCATION' | translate }}</label>\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\tid=\"location\"\n\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\tformControlName=\"location\"\n\t\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.MEETING_LOCATION' | translate }}\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label for=\"description\" class=\"label\">{{\n\t\t\t\t\t\t\t\t'FORM.LABELS.MEETING_DESCRIPTION' | translate\n\t\t\t\t\t\t\t}}</label>\n\t\t\t\t\t\t\t<textarea\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\tid=\"description\"\n\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\tformControlName=\"description\"\n\t\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.MEETING_DESCRIPTION' | translate }}\"\n\t\t\t\t\t\t\t></textarea>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t@if (!hidePrivateFields) {\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label for=\"description\" class=\"label\">{{\n\t\t\t\t\t\t\t\t'FORM.LABELS.MEETING_INVITEES' | translate\n\t\t\t\t\t\t\t}}</label>\n\t\t\t\t\t\t\t<ga-employee-multi-select\n\t\t\t\t\t\t\t\t#employeeSelector\n\t\t\t\t\t\t\t\t[label]=\"false\"\n\t\t\t\t\t\t\t\t[selectedEmployeeIds]=\"selectedEmployeeIds\"\n\t\t\t\t\t\t\t\t[allEmployees]=\"employees\"\n\t\t\t\t\t\t\t\t(selectedChange)=\"onMembersSelected($event)\"\n\t\t\t\t\t\t\t></ga-employee-multi-select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t} @if (hidePrivateFields) {\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label for=\"emailsSelect\" class=\"label\">{{ 'FORM.LABELS.EMAILS' | translate }}</label>\n\t\t\t\t\t\t\t<ng-select\n\t\t\t\t\t\t\t\tid=\"emailsSelect\"\n\t\t\t\t\t\t\t\tclass=\"adjust-height\"\n\t\t\t\t\t\t\t\t[items]=\"[]\"\n\t\t\t\t\t\t\t\t[addTag]=\"addTagFn\"\n\t\t\t\t\t\t\t\t[hideSelected]=\"true\"\n\t\t\t\t\t\t\t\tmultiple=\"true\"\n\t\t\t\t\t\t\t\tbindLabel=\"emailAddress\"\n\t\t\t\t\t\t\t\tformControlName=\"emails\"\n\t\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.EMAILS' | translate }}\"\n\t\t\t\t\t\t\t\tnotFoundText=\"{{ 'FORM.PLACEHOLDERS.EMAILS' | translate }}\"\n\t\t\t\t\t\t\t\tappendTo=\"body\"\n\t\t\t\t\t\t\t\t[class.item-invalid]=\"emails.invalid && (emails.dirty || emails.touched)\"\n\t\t\t\t\t\t\t\t[class.item-valid]=\"emails.valid && (emails.dirty || emails.touched)\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t</ng-select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t</form>\n\t\t\t}\n\t\t</div>\n\t</nb-card-body>\n\t<nb-card-footer>\n\t\t<button status=\"success\" nbButton (click)=\"onSaveRequest()\">\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t\t@if (editMode) {\n\t\t<button style=\"margin-left: 10px\" status=\"warning\" nbButton (click)=\"cancelAppointment()\">\n\t\t\t{{ 'APPOINTMENTS_PAGE.CANCEL_APPOINTMENT' | translate }}\n\t\t</button>\n\t\t}\n\t</nb-card-footer>\n</nb-card>\n", styles: [":host .item-invalid ::ng-deep .ng-select-container{border:1px solid red;border-color:var(--color-danger-default)}:host .item-valid ::ng-deep .ng-select-container{border:1px solid green;border-color:var(--color-success-default)}:host #emailsSelect ::ng-deep .ng-clear-wrapper{width:20px}:host #emailsSelect ::ng-deep .ng-arrow-wrapper{display:none}.header{display:flex}:host nb-card,:host nb-card-body,:host nb-card-footer{background-color:var(--gauzy-card-2)}:host ::ng-deep ngx-timer-range-picker{display:flex;justify-content:space-between;width:100%}:host ::ng-deep ngx-timer-range-picker .row{width:50%}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i5.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i5.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i5.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i5.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i5.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i5.NbCheckboxComponent, selector: "nb-checkbox", inputs: ["checked", "disabled", "status", "indeterminate"], outputs: ["checkedChange"] }, { kind: "directive", type: i5.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i6.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "directive", type: i3.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i3.MinValidator, selector: "input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]", inputs: ["min"] }, { kind: "directive", type: i3.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i3.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i7.BackNavigationComponent, selector: "ngx-back-navigation", inputs: ["haveLink"] }, { kind: "component", type: i8.TimerPickerComponent, selector: "ga-timer-picker", inputs: ["disabled", "min", "max"], outputs: ["change"] }, { kind: "component", type: i9.TimerRangePickerComponent, selector: "ngx-timer-range-picker", inputs: ["slotStartTime", "slotEndTime", "allowedDuration", "disableEndPicker", "disableDatePicker", "fromEmployeeAppointment", "timezoneOffset", "maxDate", "minDate", "disabledDates"] }, { kind: "component", type: i10.EmployeeSelectComponent, selector: "ga-employee-multi-select", inputs: ["reset", "allEmployees", "selectedEmployeeIds", "multiple", "label", "disabled", "placeholder"], outputs: ["selectedChange", "onLoadEmployees"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
ManageAppointmentComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        ActivatedRoute,
        Router,
        UntypedFormBuilder,
        Store,
        NbDialogService,
        EmployeesService,
        EmployeeAppointmentService,
        AppointmentEmployeesService,
        AvailabilitySlotsService,
        ToastrService,
        ChangeDetectorRef])
], ManageAppointmentComponent);
export { ManageAppointmentComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ManageAppointmentComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-manage-appointment', providers: [AppointmentEmployeesService, AvailabilitySlotsService, EmployeeAppointmentService], standalone: false, template: "<nb-card class=\"card-scroll\">\n\t<nb-card-header class=\"header\">\n\t\t<ngx-back-navigation></ngx-back-navigation>\n\t\t<h4>\n\t\t\t{{ (editMode ? 'APPOINTMENTS_PAGE.EDIT_APPOINTMENT' : 'APPOINTMENTS_PAGE.ADD_APPOINTMENT') | translate }}\n\t\t</h4>\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t<div class=\"appointment-form\">\n\t\t\t@if (form) {\n\t\t\t<form [formGroup]=\"form\">\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label for=\"agenda\" class=\"label\">{{ 'FORM.LABELS.MEETING_AGENDA' | translate }}</label>\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\tid=\"agenda\"\n\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\tformControlName=\"agenda\"\n\t\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.MEETING_AGENDA' | translate }}\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t\t<ngx-timer-range-picker\n\t\t\t\t\t\t\t[timezoneOffset]=\"timezoneOffset\"\n\t\t\t\t\t\t\t[slotStartTime]=\"start\"\n\t\t\t\t\t\t\t[slotEndTime]=\"end\"\n\t\t\t\t\t\t\t[maxDate]=\"selectedRange.end\"\n\t\t\t\t\t\t\t[minDate]=\"selectedRange.start\"\n\t\t\t\t\t\t\t[allowedDuration]=\"allowedDuration\"\n\t\t\t\t\t\t\t[disableDatePicker]=\"disabled\"\n\t\t\t\t\t\t\t[disableEndPicker]=\"disabled\"\n\t\t\t\t\t\t\tname=\"selectedRange\"\n\t\t\t\t\t\t\tformControlName=\"selectedRange\"\n\t\t\t\t\t\t\tfromEmployeeAppointment=\"true\"\n\t\t\t\t\t\t></ngx-timer-range-picker>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-2\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<nb-checkbox formControlName=\"bufferTime\">\n\t\t\t\t\t\t\t\t{{ 'APPOINTMENTS_PAGE.BUFFER_TIME' | translate }}\n\t\t\t\t\t\t\t</nb-checkbox>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t@if (form.get('bufferTime').value) {\n\t\t\t\t\t<div class=\"col-2\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<nb-checkbox formControlName=\"bufferTimeStart\">\n\t\t\t\t\t\t\t\t{{ 'APPOINTMENTS_PAGE.BUFFER_AT_START' | translate }}\n\t\t\t\t\t\t\t</nb-checkbox>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t} @if (form.get('bufferTime').value) {\n\t\t\t\t\t<div class=\"col-2\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<nb-checkbox formControlName=\"bufferTimeEnd\">\n\t\t\t\t\t\t\t\t{{ 'APPOINTMENTS_PAGE.BUFFER_AT_END' | translate }}\n\t\t\t\t\t\t\t</nb-checkbox>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t@if (form.get('bufferTime').value) {\n\t\t\t\t\t<div class=\"col-6 form-group\">\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\tid=\"bufferTimeInMins\"\n\t\t\t\t\t\t\ttype=\"number\"\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t[min]=\"0\"\n\t\t\t\t\t\t\tformControlName=\"bufferTimeInMins\"\n\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.BUFFER_TIME' | translate }}\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-3\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<nb-checkbox formControlName=\"breakTime\">\n\t\t\t\t\t\t\t\t{{ 'APPOINTMENTS_PAGE.BREAK_TIME' | translate }}\n\t\t\t\t\t\t\t</nb-checkbox>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t@if (form.get('breakTime').value) {\n\t\t\t\t\t<div class=\"col-6 form-group\">\n\t\t\t\t\t\t<ga-timer-picker\n\t\t\t\t\t\t\tname=\"break_start_time\"\n\t\t\t\t\t\t\t[min]=\"form.get('selectedRange').value.start\"\n\t\t\t\t\t\t\t[max]=\"form.get('selectedRange').value.end\"\n\t\t\t\t\t\t\tformControlName=\"breakStartTime\"\n\t\t\t\t\t\t></ga-timer-picker>\n\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t@if (form.get('breakTime').value) {\n\t\t\t\t\t<div class=\"col-6 form-group\">\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\tid=\"breakTimeInMins\"\n\t\t\t\t\t\t\ttype=\"number\"\n\t\t\t\t\t\t\t[min]=\"0\"\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\tformControlName=\"breakTimeInMins\"\n\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.BREAK_TIME' | translate }}\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label for=\"location\" class=\"label\">{{ 'FORM.LABELS.MEETING_LOCATION' | translate }}</label>\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\tid=\"location\"\n\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\tformControlName=\"location\"\n\t\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.MEETING_LOCATION' | translate }}\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-6\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label for=\"description\" class=\"label\">{{\n\t\t\t\t\t\t\t\t'FORM.LABELS.MEETING_DESCRIPTION' | translate\n\t\t\t\t\t\t\t}}</label>\n\t\t\t\t\t\t\t<textarea\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\tid=\"description\"\n\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\tformControlName=\"description\"\n\t\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.MEETING_DESCRIPTION' | translate }}\"\n\t\t\t\t\t\t\t></textarea>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t@if (!hidePrivateFields) {\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label for=\"description\" class=\"label\">{{\n\t\t\t\t\t\t\t\t'FORM.LABELS.MEETING_INVITEES' | translate\n\t\t\t\t\t\t\t}}</label>\n\t\t\t\t\t\t\t<ga-employee-multi-select\n\t\t\t\t\t\t\t\t#employeeSelector\n\t\t\t\t\t\t\t\t[label]=\"false\"\n\t\t\t\t\t\t\t\t[selectedEmployeeIds]=\"selectedEmployeeIds\"\n\t\t\t\t\t\t\t\t[allEmployees]=\"employees\"\n\t\t\t\t\t\t\t\t(selectedChange)=\"onMembersSelected($event)\"\n\t\t\t\t\t\t\t></ga-employee-multi-select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t} @if (hidePrivateFields) {\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label for=\"emailsSelect\" class=\"label\">{{ 'FORM.LABELS.EMAILS' | translate }}</label>\n\t\t\t\t\t\t\t<ng-select\n\t\t\t\t\t\t\t\tid=\"emailsSelect\"\n\t\t\t\t\t\t\t\tclass=\"adjust-height\"\n\t\t\t\t\t\t\t\t[items]=\"[]\"\n\t\t\t\t\t\t\t\t[addTag]=\"addTagFn\"\n\t\t\t\t\t\t\t\t[hideSelected]=\"true\"\n\t\t\t\t\t\t\t\tmultiple=\"true\"\n\t\t\t\t\t\t\t\tbindLabel=\"emailAddress\"\n\t\t\t\t\t\t\t\tformControlName=\"emails\"\n\t\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.EMAILS' | translate }}\"\n\t\t\t\t\t\t\t\tnotFoundText=\"{{ 'FORM.PLACEHOLDERS.EMAILS' | translate }}\"\n\t\t\t\t\t\t\t\tappendTo=\"body\"\n\t\t\t\t\t\t\t\t[class.item-invalid]=\"emails.invalid && (emails.dirty || emails.touched)\"\n\t\t\t\t\t\t\t\t[class.item-valid]=\"emails.valid && (emails.dirty || emails.touched)\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t</ng-select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t</form>\n\t\t\t}\n\t\t</div>\n\t</nb-card-body>\n\t<nb-card-footer>\n\t\t<button status=\"success\" nbButton (click)=\"onSaveRequest()\">\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t\t@if (editMode) {\n\t\t<button style=\"margin-left: 10px\" status=\"warning\" nbButton (click)=\"cancelAppointment()\">\n\t\t\t{{ 'APPOINTMENTS_PAGE.CANCEL_APPOINTMENT' | translate }}\n\t\t</button>\n\t\t}\n\t</nb-card-footer>\n</nb-card>\n", styles: [":host .item-invalid ::ng-deep .ng-select-container{border:1px solid red;border-color:var(--color-danger-default)}:host .item-valid ::ng-deep .ng-select-container{border:1px solid green;border-color:var(--color-success-default)}:host #emailsSelect ::ng-deep .ng-clear-wrapper{width:20px}:host #emailsSelect ::ng-deep .ng-arrow-wrapper{display:none}.header{display:flex}:host nb-card,:host nb-card-body,:host nb-card-footer{background-color:var(--gauzy-card-2)}:host ::ng-deep ngx-timer-range-picker{display:flex;justify-content:space-between;width:100%}:host ::ng-deep ngx-timer-range-picker .row{width:50%}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.ActivatedRoute }, { type: i2.Router }, { type: i3.UntypedFormBuilder }, { type: i4.Store }, { type: i5.NbDialogService }, { type: i4.EmployeesService }, { type: i4.EmployeeAppointmentService }, { type: i4.AppointmentEmployeesService }, { type: i4.AvailabilitySlotsService }, { type: i4.ToastrService }, { type: i0.ChangeDetectorRef }], propDecorators: { employee: [{
                type: Input
            }], employeeAppointment: [{
                type: Input
            }], disabled: [{
                type: Input
            }], appointmentId: [{
                type: Input
            }], allowedDuration: [{
                type: Input
            }], hidePrivateFields: [{
                type: Input
            }], timezone: [{
                type: Input
            }], save: [{
                type: Output
            }], cancel: [{
                type: Output
            }], selectedRange: [{
                type: Input
            }], employeeSelector: [{
                type: ViewChild,
                args: ['employeeSelector']
            }] } });
//# sourceMappingURL=manage-appointment.component.js.map