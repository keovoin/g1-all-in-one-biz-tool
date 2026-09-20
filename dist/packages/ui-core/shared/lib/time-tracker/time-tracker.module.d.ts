import { ModuleWithProviders } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./time-tracker/time-tracker.component";
import * as i2 from "@angular/common";
import * as i3 from "@angular/forms";
import * as i4 from "@angular/router";
import * as i5 from "@fortawesome/angular-fontawesome";
import * as i6 from "@nebular/theme";
import * as i7 from "ngx-draggable-dom";
import * as i8 from "ngx-permissions";
import * as i9 from "@ngx-translate/core";
import * as i10 from "../shared.module";
import * as i11 from "../timer-picker/timer-picker.module";
import * as i12 from "../tasks/task-select/task-select.module";
import * as i13 from "../selectors/project/project.module";
import * as i14 from "../selectors/team/team.module";
import * as i15 from "../contact-selector/contact-selector.module";
import * as i16 from "./components/time-tracker-status/time-tracker-status.module";
export declare class TimeTrackerModule {
    /**
     * Returns a ModuleWithProviders object that specifies the TimeTrackerModule and its providers.
     *
     * @return {ModuleWithProviders<TimeTrackerModule>} A ModuleWithProviders object with the TimeTrackerModule and its providers.
     */
    static forRoot(): ModuleWithProviders<TimeTrackerModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimeTrackerModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<TimeTrackerModule, [typeof i1.TimeTrackerComponent], [typeof i2.CommonModule, typeof i3.FormsModule, typeof i4.RouterModule, typeof i5.FontAwesomeModule, typeof i6.NbAlertModule, typeof i6.NbButtonModule, typeof i6.NbCheckboxModule, typeof i6.NbDatepickerModule, typeof i6.NbIconModule, typeof i6.NbTooltipModule, typeof i7.NgxDraggableDomModule, typeof i8.NgxPermissionsModule, typeof i9.TranslateModule, typeof i10.SharedModule, typeof i11.TimerPickerModule, typeof i12.TaskSelectModule, typeof i13.ProjectSelectModule, typeof i14.TeamSelectModule, typeof i15.ContactSelectorModule, typeof i16.TimeTrackerStatusModule], [typeof i1.TimeTrackerComponent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<TimeTrackerModule>;
}
