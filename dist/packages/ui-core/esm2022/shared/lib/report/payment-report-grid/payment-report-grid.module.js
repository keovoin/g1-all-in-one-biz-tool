import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared.module';
import { PaymentReportGridComponent } from './payment-report-grid.component';
import { ProjectColumnViewModule } from '../project-column-view/project-column-view.module';
import { NoDataMessageModule } from '../../smart-data-layout/no-data-message/no-data-message.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class PaymentReportGridModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PaymentReportGridModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: PaymentReportGridModule, declarations: [PaymentReportGridComponent], imports: [CommonModule,
            FormsModule,
            NbCardModule,
            NbIconModule,
            NbSelectModule,
            NbSpinnerModule, i1.TranslateModule, SharedModule,
            ProjectColumnViewModule,
            NoDataMessageModule], exports: [PaymentReportGridComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PaymentReportGridModule, imports: [CommonModule,
            FormsModule,
            NbCardModule,
            NbIconModule,
            NbSelectModule,
            NbSpinnerModule,
            TranslateModule.forChild(),
            SharedModule,
            ProjectColumnViewModule,
            NoDataMessageModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PaymentReportGridModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [PaymentReportGridComponent],
                    exports: [PaymentReportGridComponent],
                    imports: [
                        CommonModule,
                        FormsModule,
                        NbCardModule,
                        NbIconModule,
                        NbSelectModule,
                        NbSpinnerModule,
                        TranslateModule.forChild(),
                        SharedModule,
                        ProjectColumnViewModule,
                        NoDataMessageModule
                    ]
                }]
        }] });
//# sourceMappingURL=payment-report-grid.module.js.map