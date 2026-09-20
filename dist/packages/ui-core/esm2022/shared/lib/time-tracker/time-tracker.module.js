import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NbAlertModule, NbButtonModule, NbCheckboxModule, NbDatepickerModule, NbIconModule, NbTooltipModule } from '@nebular/theme';
import { NgxDraggableDomModule } from 'ngx-draggable-dom';
import { NgxPermissionsModule } from 'ngx-permissions';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { TimeTrackerService } from '@gauzy/ui-core/core';
import { TimeTrackerComponent } from './time-tracker/time-tracker.component';
import { TimeTrackerStatusModule } from './components/time-tracker-status/time-tracker-status.module';
import { SharedModule } from '../shared.module';
import { TimerPickerModule } from '../timer-picker/timer-picker.module';
import { TaskSelectModule } from '../tasks/task-select/task-select.module';
import { ProjectSelectModule } from '../selectors/project/project.module';
import { TeamSelectModule } from '../selectors/team/team.module';
import { ContactSelectorModule } from '../contact-selector/contact-selector.module';
import * as i0 from "@angular/core";
import * as i1 from "ngx-permissions";
import * as i2 from "@ngx-translate/core";
export class TimeTrackerModule {
    /**
     * Returns a ModuleWithProviders object that specifies the TimeTrackerModule and its providers.
     *
     * @return {ModuleWithProviders<TimeTrackerModule>} A ModuleWithProviders object with the TimeTrackerModule and its providers.
     */
    static forRoot() {
        return {
            ngModule: TimeTrackerModule,
            providers: [TimeTrackerService]
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeTrackerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: TimeTrackerModule, declarations: [TimeTrackerComponent], imports: [CommonModule,
            FormsModule,
            RouterModule,
            FontAwesomeModule,
            NbAlertModule,
            NbButtonModule,
            NbCheckboxModule,
            NbDatepickerModule,
            NbIconModule,
            NbTooltipModule,
            NgxDraggableDomModule, i1.NgxPermissionsModule, i2.TranslateModule, SharedModule,
            TimerPickerModule,
            TaskSelectModule,
            ProjectSelectModule,
            TeamSelectModule,
            ContactSelectorModule,
            TimeTrackerStatusModule], exports: [TimeTrackerComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeTrackerModule, imports: [CommonModule,
            FormsModule,
            RouterModule,
            FontAwesomeModule,
            NbAlertModule,
            NbButtonModule,
            NbCheckboxModule,
            NbDatepickerModule,
            NbIconModule,
            NbTooltipModule,
            NgxDraggableDomModule,
            NgxPermissionsModule.forChild(),
            TranslateModule.forChild(),
            SharedModule,
            TimerPickerModule,
            TaskSelectModule,
            ProjectSelectModule,
            TeamSelectModule,
            ContactSelectorModule,
            TimeTrackerStatusModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeTrackerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [TimeTrackerComponent],
                    imports: [
                        CommonModule,
                        FormsModule,
                        RouterModule,
                        FontAwesomeModule,
                        NbAlertModule,
                        NbButtonModule,
                        NbCheckboxModule,
                        NbDatepickerModule,
                        NbIconModule,
                        NbTooltipModule,
                        NgxDraggableDomModule,
                        NgxPermissionsModule.forChild(),
                        TranslateModule.forChild(),
                        SharedModule,
                        TimerPickerModule,
                        TaskSelectModule,
                        ProjectSelectModule,
                        TeamSelectModule,
                        ContactSelectorModule,
                        TimeTrackerStatusModule
                    ],
                    exports: [TimeTrackerComponent]
                }]
        }] });
//# sourceMappingURL=time-tracker.module.js.map