import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbButtonModule, NbIconModule, NbDatepickerModule, NbInputModule, NbSelectModule, NbCheckboxModule, NbTooltipModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SelectorsModule } from '../selectors/selectors.module';
import { FileUploaderModule } from '../file-uploader-input/file-uploader-input.module';
import { TimeOffSettingsMutationComponent } from './settings-mutation/time-off-settings-mutation.component';
import { TimeOffRequestMutationComponent } from './time-off-request-mutation/time-off-request-mutation.component';
import { TimeOffHolidayMutationComponent } from './time-off-holiday-mutation/time-off-holiday-mutation.component';
import { TimeOffPolicySelectModule } from './time-off-policy-select/time-off-policy-select.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class TimeOffMutationModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeOffMutationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: TimeOffMutationModule, declarations: [TimeOffSettingsMutationComponent, TimeOffRequestMutationComponent, TimeOffHolidayMutationComponent], imports: [FormsModule,
            CommonModule,
            ReactiveFormsModule,
            NbCardModule,
            NbButtonModule,
            NbIconModule,
            NgSelectModule,
            NbSelectModule,
            NbDatepickerModule,
            NbInputModule,
            NbCheckboxModule,
            NbTooltipModule, i1.TranslateModule, SelectorsModule,
            FileUploaderModule,
            TimeOffPolicySelectModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeOffMutationModule, imports: [FormsModule,
            CommonModule,
            ReactiveFormsModule,
            NbCardModule,
            NbButtonModule,
            NbIconModule,
            NgSelectModule,
            NbSelectModule,
            NbDatepickerModule,
            NbInputModule,
            NbCheckboxModule,
            NbTooltipModule,
            TranslateModule.forChild(),
            SelectorsModule,
            FileUploaderModule,
            TimeOffPolicySelectModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeOffMutationModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        FormsModule,
                        CommonModule,
                        ReactiveFormsModule,
                        NbCardModule,
                        NbButtonModule,
                        NbIconModule,
                        NgSelectModule,
                        NbSelectModule,
                        NbDatepickerModule,
                        NbInputModule,
                        NbCheckboxModule,
                        NbTooltipModule,
                        TranslateModule.forChild(),
                        SelectorsModule,
                        FileUploaderModule,
                        TimeOffPolicySelectModule
                    ],
                    declarations: [TimeOffSettingsMutationComponent, TimeOffRequestMutationComponent, TimeOffHolidayMutationComponent],
                    providers: []
                }]
        }] });
//# sourceMappingURL=time-off-mutation.module.js.map