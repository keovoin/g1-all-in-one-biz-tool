import { DatePipe } from '@angular/common';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import * as i0 from "@angular/core";
export declare class EmployeeEndWorkComponent {
    protected dialogRef: NbDialogRef<EmployeeEndWorkComponent>;
    private datePipe;
    private translate;
    backToWork: boolean;
    endWorkValue: Date;
    startWorkValue: Date;
    employeeFullName: string;
    errorMessage: string | null;
    constructor(dialogRef: NbDialogRef<EmployeeEndWorkComponent>, datePipe: DatePipe, translate: TranslateService);
    closeDialog(): void;
    endWork(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeEndWorkComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EmployeeEndWorkComponent, "ga-employee-end-work", never, {}, {}, never, never, false, never>;
}
