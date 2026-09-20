import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbDatepickerModule, NbIconModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared.module';
import { TimerPickerComponent } from './timer-picker/timer-picker.component';
import { TimerRangePickerComponent } from './timer-range-picker/timer-range-picker.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class TimerPickerModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimerPickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: TimerPickerModule, declarations: [TimerPickerComponent, TimerRangePickerComponent], imports: [CommonModule,
            FormsModule,
            NbDatepickerModule,
            NbIconModule,
            NgSelectModule, i1.TranslateModule, SharedModule], exports: [TimerPickerComponent, TimerRangePickerComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimerPickerModule, imports: [CommonModule,
            FormsModule,
            NbDatepickerModule,
            NbIconModule,
            NgSelectModule,
            TranslateModule.forChild(),
            SharedModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimerPickerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [TimerPickerComponent, TimerRangePickerComponent],
                    exports: [TimerPickerComponent, TimerRangePickerComponent],
                    imports: [
                        CommonModule,
                        FormsModule,
                        NbDatepickerModule,
                        NbIconModule,
                        NgSelectModule,
                        TranslateModule.forChild(),
                        SharedModule
                    ]
                }]
        }] });
//# sourceMappingURL=timer-picker.module.js.map