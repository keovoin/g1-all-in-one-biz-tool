import { OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { IOrganization } from '@gauzy/contracts';
import { EventTypeService, Store, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { EmployeeSelectorComponent } from '@gauzy/ui-core/shared';
import * as i0 from "@angular/core";
export declare class PickEmployeeComponent extends TranslationBaseComponent implements OnInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly _router;
    private readonly _toastrService;
    private readonly _eventTypeService;
    private readonly _store;
    loading: boolean;
    organization: IOrganization;
    organization$: Observable<IOrganization>;
    employeeSelector: EmployeeSelectorComponent;
    constructor(translateService: TranslateService, _router: Router, _toastrService: ToastrService, _eventTypeService: EventTypeService, _store: Store);
    ngOnInit(): void;
    /**
     * Book an appointment for the selected employee
     *
     * @returns {Promise<void>}
     */
    bookPublicEmployeeAppointment(): Promise<void>;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PickEmployeeComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PickEmployeeComponent, "ga-pick-employee", never, {}, {}, never, never, false, never>;
}
