import { NgModule } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NbButtonModule, NbCardModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { AppointmentEmployeesService, AvailabilitySlotsService, EmployeeAppointmentService, TimeOffService } from '@gauzy/ui-core/core';
import { SharedModule } from '../../shared.module';
import { AppointmentCalendarComponent } from './appointment-calendar.component';
import { TimezoneSelectorModule } from '../timezone-selector/timezone-selector.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
const NB_MODULES = [NbButtonModule, NbCardModule, NbIconModule, NbSpinnerModule];
export class AppointmentCalendarModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AppointmentCalendarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: AppointmentCalendarModule, declarations: [AppointmentCalendarComponent], imports: [NbButtonModule, NbCardModule, NbIconModule, NbSpinnerModule, FullCalendarModule, i1.TranslateModule, SharedModule, TimezoneSelectorModule], exports: [AppointmentCalendarComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AppointmentCalendarModule, providers: [EmployeeAppointmentService, AppointmentEmployeesService, AvailabilitySlotsService, TimeOffService], imports: [NB_MODULES, FullCalendarModule, TranslateModule.forChild(), SharedModule, TimezoneSelectorModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AppointmentCalendarModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [...NB_MODULES, FullCalendarModule, TranslateModule.forChild(), SharedModule, TimezoneSelectorModule],
                    exports: [AppointmentCalendarComponent],
                    declarations: [AppointmentCalendarComponent],
                    providers: [EmployeeAppointmentService, AppointmentEmployeesService, AvailabilitySlotsService, TimeOffService]
                }]
        }] });
//# sourceMappingURL=appointment-calendar.module.js.map