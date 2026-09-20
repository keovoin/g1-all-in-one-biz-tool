import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbIconModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { BaseChartDirective } from 'ng2-charts';
import { LineChartComponent } from './line-chart.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class LineChartModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LineChartModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: LineChartModule, declarations: [LineChartComponent], imports: [CommonModule, NbIconModule, i1.TranslateModule, BaseChartDirective], exports: [LineChartComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LineChartModule, imports: [CommonModule, NbIconModule, TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LineChartModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [LineChartComponent],
                    exports: [LineChartComponent],
                    imports: [CommonModule, NbIconModule, TranslateModule.forChild(), BaseChartDirective]
                }]
        }] });
//# sourceMappingURL=line-chart.module.js.map