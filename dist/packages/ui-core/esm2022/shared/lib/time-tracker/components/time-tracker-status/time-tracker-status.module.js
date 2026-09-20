import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeTrackerStatusService } from './time-tracker-status.service';
import { TimeTrackerStatusComponent } from './time-tracker-status.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { NbTooltipModule } from '@nebular/theme';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class TimeTrackerStatusModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeTrackerStatusModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: TimeTrackerStatusModule, declarations: [TimeTrackerStatusComponent], imports: [CommonModule, FontAwesomeModule, i1.TranslateModule, NbTooltipModule], exports: [TimeTrackerStatusComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeTrackerStatusModule, providers: [TimeTrackerStatusService], imports: [CommonModule, FontAwesomeModule, TranslateModule.forChild(), NbTooltipModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeTrackerStatusModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [TimeTrackerStatusComponent],
                    imports: [CommonModule, FontAwesomeModule, TranslateModule.forChild(), NbTooltipModule],
                    exports: [TimeTrackerStatusComponent],
                    providers: [TimeTrackerStatusService]
                }]
        }] });
//# sourceMappingURL=time-tracker-status.module.js.map