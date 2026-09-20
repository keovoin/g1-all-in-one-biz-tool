import { OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { TranslateService } from '@ngx-translate/core';
import { IEmployeeAppointment, ITimeOff, IEventType, IEmployee, IAvailabilitySlot, IOrganization } from '@gauzy/contracts';
import { AppointmentEmployeesService, AvailabilitySlotsService, EmployeeAppointmentService, Store, TimeOffService, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class AppointmentCalendarComponent extends TranslationBaseComponent implements OnInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly _router;
    private readonly _store;
    private readonly _toastrService;
    private readonly _dialogService;
    private readonly _availabilitySlotsService;
    private readonly _employeeAppointmentService;
    private readonly _timeOffService;
    private readonly _appointmentEmployeesService;
    organization: IOrganization;
    selectedTimeZoneName: string;
    selectedTimeZoneOffset: string;
    calendarOptions: CalendarOptions;
    allowedDuration: number;
    calendarEvents: EventInput[];
    _selectedOrganizationId: string;
    _selectedEmployeeId: string;
    slots: IAvailabilitySlot[];
    dateSpecificSlots: IAvailabilitySlot[];
    recurringSlots: IAvailabilitySlot[];
    appointments: IEmployeeAppointment[];
    timeOff: ITimeOff[];
    hiddenDays: number[];
    headerToolbarOptions: {
        left: string;
        center: string;
        right: string;
    };
    /**
     * Inputs
     */
    showHeader: boolean;
    appointmentFormURL: string;
    employee: IEmployee;
    selectedEventType: IEventType;
    /**
     *
     */
    calendarComponent: FullCalendarComponent;
    constructor(translateService: TranslateService, _router: Router, _store: Store, _toastrService: ToastrService, _dialogService: NbDialogService, _availabilitySlotsService: AvailabilitySlotsService, _employeeAppointmentService: EmployeeAppointmentService, _timeOffService: TimeOffService, _appointmentEmployeesService: AppointmentEmployeesService);
    ngOnInit(): void;
    getCalendarOption(): void;
    handleEventClick({ event }: EventClickArg): void;
    handleEventSelect(info: any): void;
    fetchTimeOff(): Promise<void>;
    bookPublicAppointment(): void;
    renderAppointmentsAndSlots(employeeId: string): void;
    fetchEmployeeAppointments(employeeId: string): Promise<void>;
    renderBookedAppointments(appointments: any): void;
    getEvents(arg: any, callback: any): void;
    getManageRoute(employeeId?: string, appointmentId?: string): string;
    private _fetchAvailableSlots;
    openEventTypes(): void;
    headerMount(config: any): void;
    private _prepareSlots;
    checkAndAddEventToCalendar(startTime: string, endTime: string, id: string, type: string): void;
    getAvailabilitySlots(slot: IAvailabilitySlot): void;
    private _prepareEvent;
    /**
     * Select timezone
     */
    selectTimezone(): void;
    markUnavailability(): void;
    setCalendarTimezone(timeZone: string): void;
    manageAppointments(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AppointmentCalendarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AppointmentCalendarComponent, "ngx-appointment-calendar", never, { "showHeader": { "alias": "showHeader"; "required": false; }; "appointmentFormURL": { "alias": "appointmentFormURL"; "required": false; }; "employee": { "alias": "employee"; "required": false; }; "selectedEventType": { "alias": "selectedEventType"; "required": false; }; }, {}, never, never, false, never>;
}
