import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared.module';
import { NoDataMessageModule } from '../../smart-data-layout/no-data-message/no-data-message.module';
import { AmountsOwedGridComponent } from './amounts-owed-grid.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class AmountsOwedGridModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AmountsOwedGridModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: AmountsOwedGridModule, declarations: [AmountsOwedGridComponent], imports: [CommonModule,
            FormsModule,
            NbCardModule,
            NbIconModule,
            NbSelectModule,
            NbSpinnerModule, i1.TranslateModule, SharedModule,
            NoDataMessageModule], exports: [AmountsOwedGridComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AmountsOwedGridModule, imports: [CommonModule,
            FormsModule,
            NbCardModule,
            NbIconModule,
            NbSelectModule,
            NbSpinnerModule,
            TranslateModule.forChild(),
            SharedModule,
            NoDataMessageModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AmountsOwedGridModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [AmountsOwedGridComponent],
                    exports: [AmountsOwedGridComponent],
                    imports: [
                        CommonModule,
                        FormsModule,
                        NbCardModule,
                        NbIconModule,
                        NbSelectModule,
                        NbSpinnerModule,
                        TranslateModule.forChild(),
                        SharedModule,
                        NoDataMessageModule
                    ]
                }]
        }] });
//# sourceMappingURL=amounts-owed-grid.module.js.map