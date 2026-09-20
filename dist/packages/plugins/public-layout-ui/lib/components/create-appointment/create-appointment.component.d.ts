import { OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { IEmployee, IEventType } from '@gauzy/contracts';
import { EmployeesService, ErrorHandlingService, EventTypeService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class CreateAppointmentComponent extends TranslationBaseComponent implements OnInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly _route;
    private readonly _router;
    private readonly _employeeService;
    private readonly _eventTypeService;
    private readonly _errorHandlingService;
    employee$: Observable<IEmployee | null>;
    employee: IEmployee;
    eventType: IEventType;
    eventType$: Observable<IEventType | null>;
    loading: boolean;
    appointmentFormURL: string;
    constructor(translateService: TranslateService, _route: ActivatedRoute, _router: Router, _employeeService: EmployeesService, _eventTypeService: EventTypeService, _errorHandlingService: ErrorHandlingService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CreateAppointmentComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CreateAppointmentComponent, "ng-component", never, {}, {}, never, never, false, never>;
}
