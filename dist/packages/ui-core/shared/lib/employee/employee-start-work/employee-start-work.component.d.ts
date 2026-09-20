import { NbDialogRef } from '@nebular/theme';
import { EmployeeEndWorkComponent } from '../employee-end-work-popup/employee-end-work.component';
import * as i0 from "@angular/core";
export declare class EmployeeStartWorkComponent {
    protected readonly dialogRef: NbDialogRef<EmployeeEndWorkComponent>;
    startWorkValue: Date;
    employeeFullName: string;
    constructor(dialogRef: NbDialogRef<EmployeeEndWorkComponent>);
    closeDialog(): void;
    startWork(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeStartWorkComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EmployeeStartWorkComponent, "ga-employee-start-work", never, {}, {}, never, never, false, never>;
}
