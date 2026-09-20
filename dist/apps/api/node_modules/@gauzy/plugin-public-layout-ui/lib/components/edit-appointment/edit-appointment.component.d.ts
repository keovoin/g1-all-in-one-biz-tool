import { OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ID } from '@gauzy/contracts';
import { EmployeeAppointmentService, ErrorHandlingService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class EditAppointmentComponent extends TranslationBaseComponent implements OnInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly _route;
    private readonly _router;
    private readonly _employeeAppointmentService;
    private readonly _errorHandlingService;
    loading: boolean;
    appointmentId$: Observable<ID>;
    constructor(translateService: TranslateService, _route: ActivatedRoute, _router: Router, _employeeAppointmentService: EmployeeAppointmentService, _errorHandlingService: ErrorHandlingService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EditAppointmentComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EditAppointmentComponent, "ga-edit-appointment", never, {}, {}, never, never, false, never>;
}
