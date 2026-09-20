import { OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ID, IEmployee, IEventType, IOrganization } from '@gauzy/contracts';
import { EmployeesService, ErrorHandlingService, EventTypeService, Store } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class PublicAppointmentComponent extends TranslationBaseComponent implements OnInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly _router;
    private readonly _route;
    private readonly _store;
    private readonly _employeeService;
    private readonly _eventTypeService;
    private readonly _errorHandlingService;
    employee: IEmployee;
    employee$: Observable<IEmployee | null>;
    organization: IOrganization;
    organization$: Observable<IOrganization>;
    loading: boolean;
    eventTypes: IEventType[];
    eventTypesExist: boolean;
    constructor(translateService: TranslateService, _router: Router, _route: ActivatedRoute, _store: Store, _employeeService: EmployeesService, _eventTypeService: EventTypeService, _errorHandlingService: ErrorHandlingService);
    ngOnInit(): void;
    /**
     * Fetches and processes event types based on the organization and employee details.
     *
     * @returns {Promise<void>}
     */
    getEventTypes(): Promise<void>;
    /**
     * Select event type
     *
     * @param id
     */
    selectEventType(id: ID): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PublicAppointmentComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PublicAppointmentComponent, "ga-public-appointment", never, {}, {}, never, never, false, never>;
}
