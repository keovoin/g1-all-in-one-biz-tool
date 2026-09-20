import { OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
/**
 * Interface for the employee schedule
 */
export interface EmployeeSchedule {
    employeeName: string;
    slots: any;
    timezone: string;
}
export declare class EmployeeScheduleComponent extends TranslationBaseComponent implements OnInit {
    readonly translateService: TranslateService;
    readonly dialogRef: NbDialogRef<EmployeeScheduleComponent>;
    schedule: EmployeeSchedule;
    constructor(translateService: TranslateService, dialogRef: NbDialogRef<EmployeeScheduleComponent>);
    ngOnInit(): void;
    /**
     * Close dialog
     *
     * @param value
     */
    closeDialog(value: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeScheduleComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EmployeeScheduleComponent, "ga-employee-schedules", never, {}, {}, never, never, false, never>;
}
