import { OnInit, OnDestroy } from '@angular/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IEventType, IEmployee } from '@gauzy/contracts';
import { EmployeesService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class AppointmentFormComponent extends TranslationBaseComponent implements OnInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly route;
    private readonly router;
    private readonly employeeService;
    loading: boolean;
    selectedRange: {
        start: Date;
        end: Date;
    };
    selectedEventType: IEventType;
    allowedDuration: number;
    employee: IEmployee;
    constructor(translateService: TranslateService, route: ActivatedRoute, router: Router, employeeService: EmployeesService);
    ngOnInit(): void;
    /**
     * Calculate allowed duration in minutes
     *
     * @param eventType
     * @returns
     */
    private calculateAllowedDuration;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AppointmentFormComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AppointmentFormComponent, "ng-component", never, {}, {}, never, never, false, never>;
}
