import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbCalendarKitModule, NbCalendarModule, NbCardModule, NbDatepickerModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { NgxDaterangepickerMd as NgxDateRangePickerMd } from 'ngx-daterangepicker-material';
import { NgSelectModule } from '@ng-select/ng-select';
import { WeekDaysEnum } from '@gauzy/contracts';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeeStore, EmployeesService, OrganizationEditStore, OrganizationsService } from '@gauzy/ui-core/core';
import { DirectivesModule } from '../directives/directives.module';
import { DateSelectorComponent } from './date/date.component';
import { OrganizationSelectorComponent } from './organization/organization.component';
import { DateRangePickerComponent, dayOfWeekAsString } from './date-range-picker';
import { EmployeeSelectorComponent } from './employee/employee.component';
import { ProjectSelectModule } from './project/project.module';
import { TeamSelectModule } from './team/team.module';
import * as i0 from "@angular/core";
import * as i1 from "ngx-daterangepicker-material";
import * as i2 from "@ngx-translate/core";
const COMPONENTS = [
    DateRangePickerComponent,
    DateSelectorComponent,
    EmployeeSelectorComponent,
    OrganizationSelectorComponent
];
const MODULES = [ProjectSelectModule, TeamSelectModule];
export class SelectorsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SelectorsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: SelectorsModule, declarations: [DateRangePickerComponent,
            DateSelectorComponent,
            EmployeeSelectorComponent,
            OrganizationSelectorComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule, i1.NgxDaterangepickerMd, NbButtonModule,
            NbCalendarKitModule,
            NbCalendarModule,
            NbCardModule,
            NbDatepickerModule,
            NbIconModule,
            NbInputModule,
            NgSelectModule, i2.TranslateModule, DirectivesModule, ProjectSelectModule, TeamSelectModule], exports: [DateRangePickerComponent,
            DateSelectorComponent,
            EmployeeSelectorComponent,
            OrganizationSelectorComponent, ProjectSelectModule, TeamSelectModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SelectorsModule, providers: [OrganizationsService, OrganizationEditStore, EmployeesService, EmployeeStore], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NgxDateRangePickerMd.forRoot({
                firstDay: dayOfWeekAsString(WeekDaysEnum.MONDAY)
            }),
            NbButtonModule,
            NbCalendarKitModule,
            NbCalendarModule,
            NbCardModule,
            NbDatepickerModule,
            NbIconModule,
            NbInputModule,
            NgSelectModule,
            TranslateModule.forChild(),
            DirectivesModule, MODULES, ProjectSelectModule, TeamSelectModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SelectorsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NgxDateRangePickerMd.forRoot({
                            firstDay: dayOfWeekAsString(WeekDaysEnum.MONDAY)
                        }),
                        NbButtonModule,
                        NbCalendarKitModule,
                        NbCalendarModule,
                        NbCardModule,
                        NbDatepickerModule,
                        NbIconModule,
                        NbInputModule,
                        NgSelectModule,
                        TranslateModule.forChild(),
                        DirectivesModule,
                        ...MODULES
                    ],
                    exports: [...COMPONENTS, ...MODULES],
                    declarations: [...COMPONENTS],
                    providers: [OrganizationsService, OrganizationEditStore, EmployeesService, EmployeeStore]
                }]
        }] });
//# sourceMappingURL=selectors.module.js.map