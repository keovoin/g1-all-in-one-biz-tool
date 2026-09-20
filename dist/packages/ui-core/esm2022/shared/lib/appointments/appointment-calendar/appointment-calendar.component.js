import { __decorate, __metadata } from "tslib";
import { Component, ViewChild, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { NbDialogService } from '@nebular/theme';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { FullCalendarComponent } from '@fullcalendar/angular';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import moment from 'moment';
import timezone from 'moment-timezone';
import { WeekDaysEnum } from '@gauzy/contracts';
import { convertLocalToTimezone } from '@gauzy/ui-core/common';
import { AppointmentEmployeesService, AvailabilitySlotsService, EmployeeAppointmentService, Store, TimeOffService, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { dayOfWeekAsString } from '../../selectors/date-range-picker/date-picker.utils';
import { TimezoneSelectorComponent } from '../timezone-selector/timezone-selector.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/router";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "@nebular/theme";
import * as i5 from "@fullcalendar/angular";
import * as i6 from "@angular/common";
import * as i7 from "ngx-permissions";
import * as i8 from "../../components/header-title/header-title.component";
let AppointmentCalendarComponent = class AppointmentCalendarComponent extends TranslationBaseComponent {
    constructor(translateService, _router, _store, _toastrService, _dialogService, _availabilitySlotsService, _employeeAppointmentService, _timeOffService, _appointmentEmployeesService) {
        super(translateService);
        this.translateService = translateService;
        this._router = _router;
        this._store = _store;
        this._toastrService = _toastrService;
        this._dialogService = _dialogService;
        this._availabilitySlotsService = _availabilitySlotsService;
        this._employeeAppointmentService = _employeeAppointmentService;
        this._timeOffService = _timeOffService;
        this._appointmentEmployeesService = _appointmentEmployeesService;
        this.selectedTimeZoneName = timezone.tz.guess();
        this.selectedTimeZoneOffset = timezone.tz(this.selectedTimeZoneName).format('Z');
        this.calendarEvents = [];
        this.hiddenDays = [];
        this.headerToolbarOptions = {
            left: 'next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        };
        /**
         * Inputs
         */
        this.showHeader = true;
    }
    ngOnInit() {
        this.getCalendarOption();
        this.calendarEvents = [];
        if (this.selectedEventType) {
            this.allowedDuration =
                this.selectedEventType.durationUnit === 'Day(s)'
                    ? this.selectedEventType.duration * 24 * 60
                    : this.selectedEventType.durationUnit === 'Hour(s)'
                        ? this.selectedEventType.duration * 60
                        : this.selectedEventType.duration * 1;
        }
        this._store.selectedOrganization$
            .pipe(filter((organization) => !!organization), untilDestroyed(this))
            .subscribe((org) => {
            if (org) {
                this.organization = org;
                this._selectedOrganizationId = org.id;
                if (org.timeZone && !this.selectedEventType) {
                    this.selectedTimeZoneName = org.timeZone;
                    this.selectedTimeZoneOffset = timezone.tz(org.timeZone).format('Z');
                }
            }
        });
        this._store.selectedEmployee$
            .pipe(filter((employee) => !!employee), untilDestroyed(this), debounceTime(500))
            .subscribe((employee) => {
            // Will only call in case of public appointment booking
            if (this.employee && this.employee.id && this.selectedEventType) {
                return this.renderAppointmentsAndSlots(this.employee.id);
            }
            if (employee && employee.id) {
                this._selectedEmployeeId = employee.id;
                this.renderAppointmentsAndSlots(this._selectedEmployeeId);
            }
            else {
                this._selectedEmployeeId = null;
                this.renderAppointmentsAndSlots(null);
                if (this.calendarComponent.getApi()) {
                    this.calendarComponent.getApi().refetchEvents();
                }
            }
        });
    }
    getCalendarOption() {
        // Get yesterday's day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        let currentDay = moment().subtract(1, 'day').day();
        // Loop to hide days from yesterday until Sunday
        while (currentDay >= 0) {
            this.hiddenDays.push(currentDay);
            currentDay--;
        }
        this.calendarOptions = {
            eventClick: this.handleEventClick.bind(this),
            events: this.getEvents.bind(this),
            initialView: 'timeGridWeek',
            headerToolbar: this.headerToolbarOptions,
            hiddenDays: this.hiddenDays,
            themeSystem: 'bootstrap',
            plugins: [dayGridPlugin, timeGrigPlugin, interactionPlugin, bootstrapPlugin, momentTimezonePlugin],
            weekends: true,
            height: 'auto',
            dayHeaderDidMount: this.headerMount.bind(this),
            firstDay: dayOfWeekAsString(this._store?.selectedOrganization?.startWeekOn || WeekDaysEnum.MONDAY),
            selectable: true,
            select: this.handleEventSelect.bind(this)
        };
    }
    handleEventClick({ event }) {
        const id = event._def.extendedProps.id;
        if (event._def.extendedProps.type !== 'BookedSlot') {
            this._router.navigate([this.appointmentFormURL || this.getManageRoute(this._selectedEmployeeId, id)], {
                queryParams: {
                    dateStart: event._instance.range.start.toISOString(),
                    dateEnd: event._instance.range.end.toISOString(),
                    selectedEventType: this.selectedEventType,
                    timezone: this.selectedTimeZoneName
                }
            });
        }
        else {
            const config = {
                dateStart: event._instance.range.start,
                dateEnd: event._instance.range.end,
                selectedEventType: this.selectedEventType,
                timezone: this.selectedTimeZoneName
            };
            const prevSlot = this.calendarEvents.find((o) => new Date(o.end.toString()).getTime() === event.start.getTime());
            const nextSlot = this.calendarEvents.find((o) => new Date(o.start.toString()).getTime() === event.end.getTime());
            if (prevSlot &&
                nextSlot &&
                nextSlot.extendedProps['type'] !== 'BookedSlot' &&
                prevSlot.extendedProps['type'] !== 'BookedSlot') {
                config.dateStart = new Date(prevSlot.start.toString());
                config.dateEnd = new Date(nextSlot.end.toString());
            }
            this._router.navigate([this.getManageRoute(this._selectedEmployeeId, id)], { queryParams: config });
        }
    }
    handleEventSelect(info) {
        const { start, end } = info; // start and end are the selected date range
        // You can also check additional conditions before processing
        if (start && end) {
            const config = {
                dateStart: start,
                dateEnd: end,
                timezone: this.selectedTimeZoneName
            };
            // Check if there are existing events around the selected range
            const prevSlot = this.calendarEvents.find((o) => new Date(o.end.toString()).getTime() === start.getTime());
            const nextSlot = this.calendarEvents.find((o) => new Date(o.start.toString()).getTime() === end.getTime());
            if (prevSlot &&
                nextSlot &&
                nextSlot.extendedProps['type'] !== 'BookedSlot' &&
                prevSlot.extendedProps['type'] !== 'BookedSlot') {
                // If the previous and next slots are available, extend the range
                config.dateStart = new Date(prevSlot.start.toString());
                config.dateEnd = new Date(nextSlot.end.toString());
            }
            // Redirect to the event management or booking form
            this._router.navigate([this.getManageRoute(this.employee ? this.employee.id : this._selectedEmployeeId)], {
                queryParams: config
            });
        }
    }
    async fetchTimeOff() {
        const data = await firstValueFrom(this._timeOffService.getAllTimeOffRecords(['employees', 'employees.user'], {
            organizationId: this._selectedOrganizationId,
            tenantId: this.organization.tenantId,
            employeeId: this._selectedEmployeeId || (this.employee && this.employee.id) || null
        }));
        this.timeOff = data.items;
    }
    bookPublicAppointment() {
        this._selectedEmployeeId
            ? this._router.navigate([`/share/employee/${this._selectedEmployeeId}`])
            : this._router.navigate(['/share/employee']);
    }
    renderAppointmentsAndSlots(employeeId) {
        const { tenantId } = this._store.user;
        const findObj = {
            status: null,
            organizationId: this.organization.id,
            tenantId,
            employeeId: employeeId || null
        };
        this._employeeAppointmentService
            .getAll(['employee', 'employee.user'], findObj)
            .pipe(untilDestroyed(this))
            .subscribe(async (appointments) => {
            this.calendarEvents = [];
            this.calendarComponent.getApi().refetchEvents();
            this.appointments = appointments.items;
            await this.fetchTimeOff();
            this.renderBookedAppointments(this.appointments);
            if (employeeId) {
                await this.fetchEmployeeAppointments(employeeId);
            }
            await this._fetchAvailableSlots(employeeId);
        });
    }
    // fetch appointments where the employee is an invitee
    async fetchEmployeeAppointments(employeeId) {
        const employeeAppointments = await firstValueFrom(this._appointmentEmployeesService.findEmployeeAppointments(employeeId).pipe(untilDestroyed(this)));
        this.renderBookedAppointments(employeeAppointments.map((o) => o.employeeAppointment).filter((o) => o && o.status !== 'Cancelled'));
    }
    renderBookedAppointments(appointments) {
        for (const appointment of appointments) {
            this.checkAndAddEventToCalendar(moment(appointment.startDateTime).utc().format(), moment(appointment.endDateTime).utc().format(), appointment.id, 'BookedSlot');
        }
    }
    getEvents(arg, callback) {
        callback(this.calendarEvents);
    }
    getManageRoute(employeeId = '', appointmentId = '') {
        return `/pages/employees/appointments/manage/${employeeId}` + (appointmentId ? `/${appointmentId}` : '');
    }
    async _fetchAvailableSlots(employeeId) {
        const { tenantId } = this._store.user;
        const findObj = {
            organizationId: this._selectedOrganizationId,
            tenantId,
            employeeId: employeeId || null
        };
        try {
            const slots = await this._availabilitySlotsService.getAll([], findObj);
            this.slots = slots.items;
            this.dateSpecificSlots = this.slots.filter((o) => o.type === 'Default');
            this.recurringSlots = this.slots.filter((o) => o.type === 'Recurring');
            const currentStart = this.calendarComponent.getApi().view.currentStart;
            const currentEnd = this.calendarComponent.getApi().view.currentEnd;
            let dayDiff = moment(currentEnd).diff(currentStart, 'days');
            while (dayDiff > 0) {
                this._prepareSlots(new Date(moment(currentStart).add(dayDiff, 'days').format()));
                dayDiff--;
            }
        }
        catch (error) {
            this._toastrService.danger('NOTES.AVAILABILITY_SLOTS.ERROR', null, {
                error: error.error.message || error.message
            });
        }
    }
    openEventTypes() {
        this._router.navigate(['/pages/employees/event-types']);
    }
    headerMount(config) {
        const currentStart = this.calendarComponent.getApi().view.currentStart;
        const currentEnd = this.calendarComponent.getApi().view.currentEnd;
        const hideDays = moment().isBetween(currentStart, currentEnd, 'day', '[]') ? this.hiddenDays : [];
        this.calendarComponent.getApi().setOption('hiddenDays', hideDays);
        this.headerToolbarOptions.left = moment(currentStart).isSameOrBefore(moment(), 'day') ? 'next' : 'prev,next';
        this.calendarComponent.getApi().setOption('headerToolbar', this.headerToolbarOptions);
    }
    _prepareSlots(date) {
        if (!this.slots || moment(date).isBefore(moment()))
            return;
        const day = moment(date).day();
        let foundDateSpecificSlot = false;
        const slot = this.dateSpecificSlots.find((o) => moment(o.startTime).format('MMM Do YY') === moment(date).format('MMM Do YY'));
        if (slot) {
            foundDateSpecificSlot = true;
            this.getAvailabilitySlots(slot);
        }
        if (foundDateSpecificSlot)
            return this.calendarComponent.getApi().refetchEvents();
        for (const innerSlot of this.recurringSlots) {
            const startDay = moment(innerSlot.startTime).day();
            if (startDay !== day)
                continue;
            const startHours = moment(innerSlot.startTime).hours();
            const startMinutes = moment(innerSlot.startTime).minutes();
            const endDay = moment(innerSlot.endTime).day();
            const endHours = moment(innerSlot.endTime).hours();
            const endMinutes = moment(innerSlot.endTime).minutes();
            const eventStartDate = moment(date).set('hours', startHours).set('minutes', startMinutes);
            const eventEndDate = moment(date)
                .add(endDay - day, 'days')
                .set('hours', endHours)
                .set('minutes', endMinutes);
            innerSlot.startTime = new Date(eventStartDate.format());
            innerSlot.endTime = new Date(eventEndDate.format());
            this.getAvailabilitySlots(innerSlot);
        }
        this.calendarComponent.getApi().refetchEvents();
    }
    checkAndAddEventToCalendar(startTime, endTime, id, type) {
        if (startTime === endTime ||
            new Date(startTime).getTime() < new Date().getTime() ||
            this.timeOff.find((o) => o.status === 'Approved' &&
                (moment(startTime).isBetween(o.start, o.end, 'day', '[]') ||
                    moment(endTime).isBetween(o.start, o.end, 'day', '[]'))))
            return;
        const durationCheck = type === 'AvailabilitySlot' ? true : false;
        const find = this.calendarEvents.find((o) => new Date(o.start.toString()).getTime() === new Date(startTime).getTime() &&
            new Date(o.end.toString()).getTime() === new Date(endTime).getTime());
        const allowedDuration = moment(endTime).diff(moment(startTime), 'minutes') >= this.allowedDuration;
        if (!find || !durationCheck || this._selectedEmployeeId || this._selectedOrganizationId || allowedDuration) {
            const startDate = moment(convertLocalToTimezone(startTime, null, this.selectedTimeZoneName)).format('YYYY-MM-DD hh:mm:ss');
            const endDate = moment(convertLocalToTimezone(endTime, null, this.selectedTimeZoneName)).format('YYYY-MM-DD hh:mm:ss');
            this.calendarEvents.push({
                start: startDate,
                end: endDate,
                extendedProps: {
                    id: id,
                    type: type
                },
                backgroundColor: durationCheck ? 'green' : 'red'
            });
        }
    }
    getAvailabilitySlots(slot) {
        const appointmentsOnDay = this.appointments
            .filter((o) => moment(o.startDateTime).utc().isSame(moment(slot.startTime).utc()) ||
            moment(o.startDateTime).utc().isBetween(moment(slot.startTime).utc(), moment(slot.endTime).utc()))
            .sort((a, b) => (moment(a.startDateTime).utc().isBefore(moment(b.startDateTime).utc()) ? -1 : 1));
        for (let index = 0; index < appointmentsOnDay.length; index++) {
            const appointmentOne = appointmentsOnDay[index];
            const appointmentTwo = appointmentsOnDay[index + 1];
            if (moment(appointmentOne.startDateTime).utc().isSame(moment(slot.startTime).utc()) &&
                (!appointmentTwo ||
                    moment(appointmentTwo.startDateTime).utc().isAfter(moment(appointmentOne.endDateTime).utc()))) {
                this.checkAndAddEventToCalendar(moment(appointmentOne.endDateTime).utc().format(), moment((appointmentTwo && appointmentTwo.startDateTime) || slot.endTime)
                    .utc()
                    .format(), slot.id, 'AvailabilitySlot');
            }
            else if (moment(appointmentOne.startDateTime).utc().isAfter(moment(slot.startTime).utc())) {
                const prevAppointment = appointmentsOnDay[index - 1];
                this.checkAndAddEventToCalendar(moment((prevAppointment && prevAppointment.endDateTime) || slot.startTime)
                    .utc()
                    .format(), moment(appointmentOne.startDateTime).utc().format(), slot.id, 'AvailabilitySlot');
                if (!appointmentTwo) {
                    this.checkAndAddEventToCalendar(moment(appointmentOne.endDateTime).utc().format(), moment(slot.endTime).utc().format(), slot.id, 'AvailabilitySlot');
                }
            }
        }
        if (appointmentsOnDay.length === 0) {
            this.checkAndAddEventToCalendar(moment(slot.startTime).utc().format(), moment(slot.endTime).utc().format(), slot.id, 'AvailabilitySlot');
        }
    }
    _prepareEvent(appointment) {
        let eventStartTime = appointment.startDateTime;
        let eventEndTime = appointment.endDateTime;
        if (appointment.bufferTimeStart) {
            eventStartTime = new Date(moment(appointment.startDateTime)
                .add(appointment.bufferTimeInMins, 'minutes')
                .format());
            this.calendarEvents.push({
                title: `Buffer for ${appointment.agenda}`,
                start: new Date(moment(appointment.startDateTime).format()),
                end: eventStartTime,
                extendedProps: {
                    id: appointment.id
                },
                backgroundColor: 'grey'
            });
        }
        if (appointment.bufferTimeEnd) {
            eventEndTime = new Date(moment(appointment.endDateTime)
                .subtract(appointment.bufferTimeInMins, 'minutes')
                .format());
            this.calendarEvents.push({
                title: `Buffer for ${appointment.agenda}`,
                start: eventEndTime,
                end: new Date(moment(appointment.endDateTime).format()),
                extendedProps: {
                    id: appointment.id
                },
                backgroundColor: 'grey'
            });
        }
        if (appointment.breakTimeInMins) {
            const breakEventStartTime = new Date(appointment.breakStartTime);
            this.calendarEvents.push({
                title: appointment.agenda,
                start: eventStartTime,
                end: breakEventStartTime,
                extendedProps: {
                    id: appointment.id
                }
            });
            const afterBreakStartTime = new Date(moment(breakEventStartTime)
                .add(appointment.breakTimeInMins, 'minutes')
                .format());
            this.calendarEvents.push({
                title: `Break Time ${appointment.agenda}`,
                start: breakEventStartTime,
                end: afterBreakStartTime,
                extendedProps: {
                    id: appointment.id
                },
                backgroundColor: 'lightblue'
            });
            this.calendarEvents.push({
                title: appointment.agenda,
                start: afterBreakStartTime,
                end: eventEndTime,
                extendedProps: {
                    id: appointment.id
                }
            });
        }
        else {
            this.calendarEvents.push({
                title: appointment.agenda,
                start: eventStartTime,
                end: eventEndTime,
                extendedProps: {
                    id: appointment.id
                }
            });
        }
    }
    /**
     * Select timezone
     */
    selectTimezone() {
        this._dialogService
            .open(TimezoneSelectorComponent, {
            context: {
                selectedTimezone: this.selectedTimeZoneName
            }
        })
            .onClose.pipe(untilDestroyed(this))
            .subscribe(async (data) => {
            if (data) {
                this.selectedTimeZoneName = data;
                this.selectedTimeZoneOffset = timezone.tz(data).format('Z');
                this.setCalendarTimezone(this.selectedTimeZoneName);
            }
        });
    }
    markUnavailability() { }
    /*
     * Set calendar timezone option
     */
    setCalendarTimezone(timeZone) {
        if (this.calendarComponent) {
            if (this._selectedEmployeeId) {
                this.renderAppointmentsAndSlots(this._selectedEmployeeId);
            }
            else {
                this._selectedEmployeeId = null;
                this.calendarEvents = [];
                this.renderAppointmentsAndSlots(null);
                if (this.calendarComponent.getApi()) {
                    this.calendarComponent.getApi().refetchEvents();
                }
            }
        }
    }
    manageAppointments() {
        this._router.navigate([this.getManageRoute()]);
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AppointmentCalendarComponent, deps: [{ token: i1.TranslateService }, { token: i2.Router }, { token: i3.Store }, { token: i3.ToastrService }, { token: i4.NbDialogService }, { token: i3.AvailabilitySlotsService }, { token: i3.EmployeeAppointmentService }, { token: i3.TimeOffService }, { token: i3.AppointmentEmployeesService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: AppointmentCalendarComponent, isStandalone: false, selector: "ngx-appointment-calendar", inputs: { showHeader: "showHeader", appointmentFormURL: "appointmentFormURL", employee: "employee", selectedEventType: "selectedEventType" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => AppointmentCalendarComponent),
                multi: true
            }
        ], viewQueries: [{ propertyName: "calendarComponent", first: true, predicate: ["calendar"], descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<nb-card>\n\t@if (showHeader) {\n\t\t<nb-card-header>\n\t\t\t<ng-container [ngTemplateOutlet]=\"headerTemplate\"></ng-container>\n\t\t</nb-card-header>\n\t}\n\t<nb-card-body>\n\t\t<div class=\"calendar-container\">\n\t\t\t<full-calendar #calendar [options]=\"calendarOptions\"></full-calendar>\n\t\t</div>\n\t</nb-card-body>\n</nb-card>\n\n<ng-template #headerTemplate>\n\t<div class=\"main-header\">\n\t\t<h4>\n\t\t\t<ngx-header-title>{{ 'MENU.APPOINTMENTS' | translate }}</ngx-header-title>\n\t\t</h4>\n\t\t<div class=\"float-right\">\n\t\t\t<button\n\t\t\t\tclass=\"\"\n\t\t\t\tstatus=\"info\"\n\t\t\t\tsize=\"small\"\n\t\t\t\toutline\n\t\t\t\tnbButton\n\t\t\t\ttype=\"button\"\n\t\t\t\t[routerLink]=\"'/pages/employees/schedules/recurring-availability'\"\n\t\t\t>\n\t\t\t\t{{ 'BUTTONS.SCHEDULES' | translate }}\n\t\t\t</button>\n\t\t\t<ng-template ngxPermissionsOnly=\"EVENT_TYPES_VIEW\">\n\t\t\t\t<button\n\t\t\t\t\tclass=\"mr-2 ml-2\"\n\t\t\t\t\tstatus=\"warning\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\toutline\n\t\t\t\t\tnbButton\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t(click)=\"openEventTypes()\"\n\t\t\t\t>\n\t\t\t\t\t{{ 'BUTTONS.EVENT_TYPES' | translate }}\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\t\t\t<button\n\t\t\t\tclass=\"\"\n\t\t\t\tstatus=\"primary\"\n\t\t\t\tsize=\"small\"\n\t\t\t\toutline\n\t\t\t\tnbButton\n\t\t\t\ttype=\"button\"\n\t\t\t\t(click)=\"bookPublicAppointment()\"\n\t\t\t>\n\t\t\t\t{{ 'BUTTONS.PUBLIC_APPOINTMENT_BOOK' | translate }}\n\t\t\t</button>\n\t\t</div>\n\t</div>\n\t<div class=\"block-info\">\n\t\t{{ 'PUBLIC_APPOINTMENTS.TIMEZONE' | translate }}\n\t\t<!--  -->\n\t\t<strong> {{ selectedTimeZoneName }} {{ selectedTimeZoneOffset }} </strong>\n\t\t<!--  -->\n\t\t<a style=\"cursor: pointer; color: var(--link-text-color)\" (click)=\"selectTimezone()\">\n\t\t\t{{ 'PUBLIC_APPOINTMENTS.CHANGE' | translate }}\n\t\t</a>\n\t</div>\n</ng-template>\n", styles: [".action{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border:none}.action[nbButton].appearance-filled.status-basic{background-color:var(--gauzy-card-2)}.action.info[nbButton].appearance-filled.status-basic,.action.info-text-1[nbButton].appearance-filled.status-basic{color:var(--gauzy-action-info-text)}.action.secondary{color:var(--text-hint-color)}.action.success{color:var(--gauzy-action-success-text)}.action.warning{color:var(--gauzy-action-warning-text)}.action.orange{color:#ffab2d}.action.primary{color:var(--text-primary-color)}.action.primary.soft[nbButton].appearance-filled.status-basic{background-color:#6e49e81a}.action.select-nb ::ng-deep{box-shadow:none}.action.select-nb ::ng-deep .select-button{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));background:var(--gauzy-card-2)}button{margin:5px}.actions{background:var(--gauzy-card-2);border-radius:var(--button-rectangle-border-radius);padding:2px 4px!important}.gauzy-button-container{display:flex;justify-content:flex-end;width:100%;padding-bottom:0}.card-custom-header{display:flex;flex-direction:column;width:100%;padding-bottom:0}:host ::ng-deep input{border-radius:var(--border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host nb-card,:host nb-card-body{background-color:var(--gauzy-card-2);margin:0;display:flex;flex-direction:column}:host nb-card .table-scroll-container,:host nb-card .grid-scroll-container,:host nb-card-body .table-scroll-container,:host nb-card-body .grid-scroll-container{flex:1 1 auto;min-height:0;max-height:unset}:host nb-card-body{border-radius:0 0 var(--border-radius) var(--border-radius)}[dir=ltr] :host nb-card-body{padding:1rem .5rem 1rem 18px}[dir=rtl] :host nb-card-body{padding:1rem 18px 1rem .5rem}:host nb-card,:host nb-card-header{border-radius:var(--border-radius)}:host nb-card{display:flex;flex-flow:column;height:100%;border-radius:var(--border-radius)}:host nb-card nb-card-header{flex:0 1 auto}:host nb-card nb-card-body{flex:1 1 auto;overflow:unset;height:calc(100vh - calc(var(--header-height) + var(--footer-height)) - 13.125rem + 3.75rem)}:host nb-card nb-card-footer{flex:0 1 auto}.main-header{display:flex;align-items:center;justify-content:space-between}.block-info{font-size:14px;font-weight:400;line-height:11px;letter-spacing:0em;text-align:left;margin:1rem 0}:host nb-card,:host nb-card-body{background-color:var(--gauzy-card-2)}:host nb-card-body{height:calc(100vh - 16.5rem)!important}:host .calendar-container{height:100%;overflow:auto}:host [nbButton].appearance-outline.status-info,:host [nbButton].appearance-outline.status-warning,:host [nbButton].appearance-outline.status-primary{border-width:0;box-shadow:var(--gauzy-shadow)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i4.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i4.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i4.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i4.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i5.FullCalendarComponent, selector: "full-calendar", inputs: ["options", "deepChangeDetection", "events", "eventSources", "resources"] }, { kind: "directive", type: i6.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i2.RouterLink, selector: "[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "info", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }, { kind: "directive", type: i7.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "component", type: i8.HeaderTitleComponent, selector: "ngx-header-title", inputs: ["allowEmployee", "allowOrganization"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
AppointmentCalendarComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        Router,
        Store,
        ToastrService,
        NbDialogService,
        AvailabilitySlotsService,
        EmployeeAppointmentService,
        TimeOffService,
        AppointmentEmployeesService])
], AppointmentCalendarComponent);
export { AppointmentCalendarComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AppointmentCalendarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-appointment-calendar', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => AppointmentCalendarComponent),
                            multi: true
                        }
                    ], standalone: false, template: "<nb-card>\n\t@if (showHeader) {\n\t\t<nb-card-header>\n\t\t\t<ng-container [ngTemplateOutlet]=\"headerTemplate\"></ng-container>\n\t\t</nb-card-header>\n\t}\n\t<nb-card-body>\n\t\t<div class=\"calendar-container\">\n\t\t\t<full-calendar #calendar [options]=\"calendarOptions\"></full-calendar>\n\t\t</div>\n\t</nb-card-body>\n</nb-card>\n\n<ng-template #headerTemplate>\n\t<div class=\"main-header\">\n\t\t<h4>\n\t\t\t<ngx-header-title>{{ 'MENU.APPOINTMENTS' | translate }}</ngx-header-title>\n\t\t</h4>\n\t\t<div class=\"float-right\">\n\t\t\t<button\n\t\t\t\tclass=\"\"\n\t\t\t\tstatus=\"info\"\n\t\t\t\tsize=\"small\"\n\t\t\t\toutline\n\t\t\t\tnbButton\n\t\t\t\ttype=\"button\"\n\t\t\t\t[routerLink]=\"'/pages/employees/schedules/recurring-availability'\"\n\t\t\t>\n\t\t\t\t{{ 'BUTTONS.SCHEDULES' | translate }}\n\t\t\t</button>\n\t\t\t<ng-template ngxPermissionsOnly=\"EVENT_TYPES_VIEW\">\n\t\t\t\t<button\n\t\t\t\t\tclass=\"mr-2 ml-2\"\n\t\t\t\t\tstatus=\"warning\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\toutline\n\t\t\t\t\tnbButton\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t(click)=\"openEventTypes()\"\n\t\t\t\t>\n\t\t\t\t\t{{ 'BUTTONS.EVENT_TYPES' | translate }}\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\t\t\t<button\n\t\t\t\tclass=\"\"\n\t\t\t\tstatus=\"primary\"\n\t\t\t\tsize=\"small\"\n\t\t\t\toutline\n\t\t\t\tnbButton\n\t\t\t\ttype=\"button\"\n\t\t\t\t(click)=\"bookPublicAppointment()\"\n\t\t\t>\n\t\t\t\t{{ 'BUTTONS.PUBLIC_APPOINTMENT_BOOK' | translate }}\n\t\t\t</button>\n\t\t</div>\n\t</div>\n\t<div class=\"block-info\">\n\t\t{{ 'PUBLIC_APPOINTMENTS.TIMEZONE' | translate }}\n\t\t<!--  -->\n\t\t<strong> {{ selectedTimeZoneName }} {{ selectedTimeZoneOffset }} </strong>\n\t\t<!--  -->\n\t\t<a style=\"cursor: pointer; color: var(--link-text-color)\" (click)=\"selectTimezone()\">\n\t\t\t{{ 'PUBLIC_APPOINTMENTS.CHANGE' | translate }}\n\t\t</a>\n\t</div>\n</ng-template>\n", styles: [".action{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border:none}.action[nbButton].appearance-filled.status-basic{background-color:var(--gauzy-card-2)}.action.info[nbButton].appearance-filled.status-basic,.action.info-text-1[nbButton].appearance-filled.status-basic{color:var(--gauzy-action-info-text)}.action.secondary{color:var(--text-hint-color)}.action.success{color:var(--gauzy-action-success-text)}.action.warning{color:var(--gauzy-action-warning-text)}.action.orange{color:#ffab2d}.action.primary{color:var(--text-primary-color)}.action.primary.soft[nbButton].appearance-filled.status-basic{background-color:#6e49e81a}.action.select-nb ::ng-deep{box-shadow:none}.action.select-nb ::ng-deep .select-button{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));background:var(--gauzy-card-2)}button{margin:5px}.actions{background:var(--gauzy-card-2);border-radius:var(--button-rectangle-border-radius);padding:2px 4px!important}.gauzy-button-container{display:flex;justify-content:flex-end;width:100%;padding-bottom:0}.card-custom-header{display:flex;flex-direction:column;width:100%;padding-bottom:0}:host ::ng-deep input{border-radius:var(--border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host nb-card,:host nb-card-body{background-color:var(--gauzy-card-2);margin:0;display:flex;flex-direction:column}:host nb-card .table-scroll-container,:host nb-card .grid-scroll-container,:host nb-card-body .table-scroll-container,:host nb-card-body .grid-scroll-container{flex:1 1 auto;min-height:0;max-height:unset}:host nb-card-body{border-radius:0 0 var(--border-radius) var(--border-radius)}[dir=ltr] :host nb-card-body{padding:1rem .5rem 1rem 18px}[dir=rtl] :host nb-card-body{padding:1rem 18px 1rem .5rem}:host nb-card,:host nb-card-header{border-radius:var(--border-radius)}:host nb-card{display:flex;flex-flow:column;height:100%;border-radius:var(--border-radius)}:host nb-card nb-card-header{flex:0 1 auto}:host nb-card nb-card-body{flex:1 1 auto;overflow:unset;height:calc(100vh - calc(var(--header-height) + var(--footer-height)) - 13.125rem + 3.75rem)}:host nb-card nb-card-footer{flex:0 1 auto}.main-header{display:flex;align-items:center;justify-content:space-between}.block-info{font-size:14px;font-weight:400;line-height:11px;letter-spacing:0em;text-align:left;margin:1rem 0}:host nb-card,:host nb-card-body{background-color:var(--gauzy-card-2)}:host nb-card-body{height:calc(100vh - 16.5rem)!important}:host .calendar-container{height:100%;overflow:auto}:host [nbButton].appearance-outline.status-info,:host [nbButton].appearance-outline.status-warning,:host [nbButton].appearance-outline.status-primary{border-width:0;box-shadow:var(--gauzy-shadow)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.Router }, { type: i3.Store }, { type: i3.ToastrService }, { type: i4.NbDialogService }, { type: i3.AvailabilitySlotsService }, { type: i3.EmployeeAppointmentService }, { type: i3.TimeOffService }, { type: i3.AppointmentEmployeesService }], propDecorators: { showHeader: [{
                type: Input
            }], appointmentFormURL: [{
                type: Input
            }], employee: [{
                type: Input
            }], selectedEventType: [{
                type: Input
            }], calendarComponent: [{
                type: ViewChild,
                args: ['calendar', { static: true }]
            }] } });
//# sourceMappingURL=appointment-calendar.component.js.map