import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbAutocompleteModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbFormFieldModule, NbIconModule, NbInputModule, NbOptionModule, NbSelectModule, NbSpinnerModule, NbTooltipModule } from '@nebular/theme';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared.module';
import { DialogsModule } from '../../dialogs/dialogs.module';
import { ProjectSelectModule } from '../../selectors/project';
import { TeamSelectModule } from '../../selectors/team';
import { EditTimeLogModalComponent } from './edit-time-log-modal.component';
import { TimerPickerModule } from '../../timer-picker/timer-picker.module';
import { EmployeeMultiSelectModule } from '../../employee/employee-multi-select/employee-multi-select.module';
import { ContactSelectorModule } from '../../contact-selector/contact-selector.module';
import { TaskSelectModule } from '../../tasks/task-select/task-select.module';
import * as i0 from "@angular/core";
import * as i1 from "ngx-permissions";
import * as i2 from "@ngx-translate/core";
export class EditTimeLogModalModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EditTimeLogModalModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: EditTimeLogModalModule, declarations: [EditTimeLogModalComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbCardModule,
            NbCheckboxModule,
            NbAutocompleteModule,
            NbFormFieldModule,
            NbIconModule,
            NbInputModule,
            NbSpinnerModule,
            NbTooltipModule,
            NbSelectModule,
            NbOptionModule, i1.NgxPermissionsModule, i2.TranslateModule, SharedModule,
            DialogsModule,
            TimerPickerModule,
            TaskSelectModule,
            ProjectSelectModule,
            TeamSelectModule,
            EmployeeMultiSelectModule,
            ContactSelectorModule], exports: [EditTimeLogModalComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EditTimeLogModalModule, imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbCardModule,
            NbCheckboxModule,
            NbAutocompleteModule,
            NbFormFieldModule,
            NbIconModule,
            NbInputModule,
            NbSpinnerModule,
            NbTooltipModule,
            NbSelectModule,
            NbOptionModule,
            NgxPermissionsModule.forChild(),
            TranslateModule.forChild(),
            SharedModule,
            DialogsModule,
            TimerPickerModule,
            TaskSelectModule,
            ProjectSelectModule,
            TeamSelectModule,
            EmployeeMultiSelectModule,
            ContactSelectorModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EditTimeLogModalModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [EditTimeLogModalComponent],
                    exports: [EditTimeLogModalComponent],
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbButtonModule,
                        NbCardModule,
                        NbCheckboxModule,
                        NbAutocompleteModule,
                        NbFormFieldModule,
                        NbIconModule,
                        NbInputModule,
                        NbSpinnerModule,
                        NbTooltipModule,
                        NbSelectModule,
                        NbOptionModule,
                        NgxPermissionsModule.forChild(),
                        TranslateModule.forChild(),
                        SharedModule,
                        DialogsModule,
                        TimerPickerModule,
                        TaskSelectModule,
                        ProjectSelectModule,
                        TeamSelectModule,
                        EmployeeMultiSelectModule,
                        ContactSelectorModule
                    ]
                }]
        }] });
//# sourceMappingURL=edit-time-log-modal.module.js.map