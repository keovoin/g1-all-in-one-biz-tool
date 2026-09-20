import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared.module';
import { NoDataMessageModule } from '../../smart-data-layout/no-data-message/no-data-message.module';
import { ActivitiesReportGridComponent } from './activities-report-grid.component';
import { ProgressStatusModule } from '../../progress-status/progress-status.module';
import { ProjectColumnViewModule } from '../project-column-view/project-column-view.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class ActivitiesReportGridModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ActivitiesReportGridModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ActivitiesReportGridModule, declarations: [ActivitiesReportGridComponent], imports: [CommonModule,
            FormsModule,
            NbCardModule,
            NbIconModule,
            NbSelectModule,
            NbSpinnerModule, i1.TranslateModule, SharedModule,
            ProgressStatusModule,
            ProjectColumnViewModule,
            NoDataMessageModule], exports: [ActivitiesReportGridComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ActivitiesReportGridModule, imports: [CommonModule,
            FormsModule,
            NbCardModule,
            NbIconModule,
            NbSelectModule,
            NbSpinnerModule,
            TranslateModule.forChild(),
            SharedModule,
            ProgressStatusModule,
            ProjectColumnViewModule,
            NoDataMessageModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ActivitiesReportGridModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ActivitiesReportGridComponent],
                    exports: [ActivitiesReportGridComponent],
                    imports: [
                        CommonModule,
                        FormsModule,
                        NbCardModule,
                        NbIconModule,
                        NbSelectModule,
                        NbSpinnerModule,
                        TranslateModule.forChild(),
                        SharedModule,
                        ProgressStatusModule,
                        ProjectColumnViewModule,
                        NoDataMessageModule
                    ]
                }]
        }] });
//# sourceMappingURL=activities-report-grid.module.js.map