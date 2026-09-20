import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbAccordionModule, NbBadgeModule, NbCardModule, NbIconModule, NbSelectModule, NbSpinnerModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared.module';
import { TableComponentsModule } from '../../table-components/table-components.module';
import { DailyGridComponent } from './daily-grid.component';
import { ProjectColumnViewModule } from '../project-column-view/project-column-view.module';
import { NoDataMessageModule } from '../../smart-data-layout/no-data-message/no-data-message.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class DailyGridModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DailyGridModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: DailyGridModule, declarations: [DailyGridComponent], imports: [CommonModule,
            FormsModule,
            NbAccordionModule,
            NbBadgeModule,
            NbCardModule,
            NbIconModule,
            NbSelectModule,
            NbSpinnerModule,
            NbTooltipModule, i1.TranslateModule, SharedModule,
            ProjectColumnViewModule,
            TableComponentsModule,
            NoDataMessageModule], exports: [DailyGridComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DailyGridModule, imports: [CommonModule,
            FormsModule,
            NbAccordionModule,
            NbBadgeModule,
            NbCardModule,
            NbIconModule,
            NbSelectModule,
            NbSpinnerModule,
            NbTooltipModule,
            TranslateModule.forChild(),
            SharedModule,
            ProjectColumnViewModule,
            TableComponentsModule,
            NoDataMessageModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DailyGridModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        NbAccordionModule,
                        NbBadgeModule,
                        NbCardModule,
                        NbIconModule,
                        NbSelectModule,
                        NbSpinnerModule,
                        NbTooltipModule,
                        TranslateModule.forChild(),
                        SharedModule,
                        ProjectColumnViewModule,
                        TableComponentsModule,
                        NoDataMessageModule
                    ],
                    declarations: [DailyGridComponent],
                    exports: [DailyGridComponent]
                }]
        }] });
//# sourceMappingURL=daily-grid.module.js.map