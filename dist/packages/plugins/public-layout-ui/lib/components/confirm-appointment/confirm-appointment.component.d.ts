import { OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, UrlSerializer } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NbDialogService } from '@nebular/theme';
import { ID, IEmployee, IEmployeeAppointment } from '@gauzy/contracts';
import { EmployeeAppointmentService, EmployeesService, ErrorHandlingService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class ConfirmAppointmentComponent extends TranslationBaseComponent implements OnInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly _route;
    private readonly _location;
    private readonly _urlSerializer;
    private readonly _router;
    private readonly _dialogService;
    private readonly _employeeService;
    private readonly _employeeAppointmentService;
    private readonly _errorHandlingService;
    loading: boolean;
    employee: IEmployee;
    employee$: Observable<IEmployee>;
    appointment: IEmployeeAppointment;
    appointment$: Observable<IEmployeeAppointment>;
    participants: string;
    duration: string;
    rescheduleLink: string;
    constructor(translateService: TranslateService, _route: ActivatedRoute, _location: Location, _urlSerializer: UrlSerializer, _router: Router, _dialogService: NbDialogService, _employeeService: EmployeesService, _employeeAppointmentService: EmployeeAppointmentService, _errorHandlingService: ErrorHandlingService);
    ngOnInit(): void;
    /**
     * Get the reschedule link for the appointment.
     *
     * @param appointment The appointment to get the reschedule link for.
     */
    getRescheduleLink(appointment: IEmployeeAppointment): Promise<void>;
    /**
     * Format the appointment duration.
     *
     * @param startDateTime The start time of the appointment.
     * @param endDateTime The end time of the appointment.
     * @returns A formatted string representing the duration.
     */
    formatDuration(startDateTime: Date, endDateTime: Date): string;
    /**
     * Cancel the appointment with a confirmation dialog.
     *
     * @param appointmentId The ID of the appointment to cancel.
     */
    cancelAppointment(appointmentId: ID): Promise<void>;
    /**
     * Opens a confirmation dialog for cancelling an appointment.
     *
     * @returns A promise that resolves to true if the user confirms, otherwise false.
     */
    private confirmCancellation;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ConfirmAppointmentComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ConfirmAppointmentComponent, "ga-confirm-appointment", never, {}, {}, never, never, false, never>;
}
