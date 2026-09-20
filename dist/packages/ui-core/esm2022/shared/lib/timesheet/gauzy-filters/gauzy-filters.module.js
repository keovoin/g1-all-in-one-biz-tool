import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbButtonModule, NbIconModule, NbPopoverModule, NbSelectModule } from '@nebular/theme';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../pipes/pipes.module';
import { GauzyFiltersComponent } from './gauzy-filters.component';
import { TimezoneFilterModule } from './timezone-filter/timezone-filter.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class GauzyFiltersModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GauzyFiltersModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: GauzyFiltersModule, declarations: [GauzyFiltersComponent], imports: [CommonModule,
            FormsModule,
            NbButtonModule,
            NbIconModule,
            NbPopoverModule,
            NbSelectModule,
            NgxSliderModule, i1.TranslateModule, PipesModule,
            TimezoneFilterModule], exports: [GauzyFiltersComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GauzyFiltersModule, imports: [CommonModule,
            FormsModule,
            NbButtonModule,
            NbIconModule,
            NbPopoverModule,
            NbSelectModule,
            NgxSliderModule,
            TranslateModule.forChild(),
            PipesModule,
            TimezoneFilterModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GauzyFiltersModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [GauzyFiltersComponent],
                    exports: [GauzyFiltersComponent],
                    imports: [
                        CommonModule,
                        FormsModule,
                        NbButtonModule,
                        NbIconModule,
                        NbPopoverModule,
                        NbSelectModule,
                        NgxSliderModule,
                        TranslateModule.forChild(),
                        PipesModule,
                        TimezoneFilterModule
                    ]
                }]
        }] });
//# sourceMappingURL=gauzy-filters.module.js.map