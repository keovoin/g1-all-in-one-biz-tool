import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbCheckboxModule, NbIconModule, NbInputModule, NbSpinnerModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared.module';
import { ManageAppointmentComponent } from './manage-appointment.component';
import { EmployeeScheduleModule } from '../employee-schedules/employee-schedule.module';
import { TimerPickerModule } from '../../timer-picker/timer-picker.module';
import { EmployeeMultiSelectModule } from '../../employee/employee-multi-select/employee-multi-select.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class ManageAppointmentModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ManageAppointmentModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ManageAppointmentModule, declarations: [ManageAppointmentComponent], imports: [NbButtonModule,
            NbCardModule,
            NbCheckboxModule,
            NbIconModule,
            NbInputModule,
            NbSpinnerModule,
            NgSelectModule, i1.TranslateModule, SharedModule,
            EmployeeScheduleModule,
            TimerPickerModule,
            EmployeeMultiSelectModule], exports: [ManageAppointmentComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ManageAppointmentModule, imports: [NbButtonModule,
            NbCardModule,
            NbCheckboxModule,
            NbIconModule,
            NbInputModule,
            NbSpinnerModule,
            NgSelectModule,
            TranslateModule.forChild(),
            SharedModule,
            EmployeeScheduleModule,
            TimerPickerModule,
            EmployeeMultiSelectModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ManageAppointmentModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        NbButtonModule,
                        NbCardModule,
                        NbCheckboxModule,
                        NbIconModule,
                        NbInputModule,
                        NbSpinnerModule,
                        NgSelectModule,
                        TranslateModule.forChild(),
                        SharedModule,
                        EmployeeScheduleModule,
                        TimerPickerModule,
                        EmployeeMultiSelectModule
                    ],
                    exports: [ManageAppointmentComponent],
                    declarations: [ManageAppointmentComponent]
                }]
        }] });
//# sourceMappingURL=manage-appointment.module.js.map