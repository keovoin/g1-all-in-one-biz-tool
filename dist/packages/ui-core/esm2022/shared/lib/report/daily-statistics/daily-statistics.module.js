import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { DailyStatisticsComponent } from './daily-statistics/daily-statistics.component';
import { CounterPointComponent } from '../../counter-point/counter-point.component';
import { SharedModule } from '../../shared.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class DailyStatisticsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DailyStatisticsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: DailyStatisticsModule, declarations: [DailyStatisticsComponent], imports: [CommonModule,
            FormsModule,
            NbCardModule,
            NbIconModule,
            NbSelectModule,
            NbSpinnerModule, i1.TranslateModule, SharedModule,
            CounterPointComponent], exports: [DailyStatisticsComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DailyStatisticsModule, imports: [CommonModule,
            FormsModule,
            NbCardModule,
            NbIconModule,
            NbSelectModule,
            NbSpinnerModule,
            TranslateModule.forChild(),
            SharedModule,
            CounterPointComponent] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DailyStatisticsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [DailyStatisticsComponent],
                    exports: [DailyStatisticsComponent],
                    imports: [
                        CommonModule,
                        FormsModule,
                        NbCardModule,
                        NbIconModule,
                        NbSelectModule,
                        NbSpinnerModule,
                        TranslateModule.forChild(),
                        SharedModule,
                        CounterPointComponent
                    ]
                }]
        }] });
//# sourceMappingURL=daily-statistics.module.js.map