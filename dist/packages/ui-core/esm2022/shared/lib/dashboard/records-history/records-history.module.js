import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { SmartDataViewLayoutModule } from '../../smart-data-layout/smart-data-view-layout.module';
import { RecordsHistoryComponent } from './records-history.component';
import * as i0 from "@angular/core";
export class RecordsHistoryModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecordsHistoryModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: RecordsHistoryModule, declarations: [RecordsHistoryComponent], imports: [CommonModule, NbIconModule, NbSpinnerModule, NbCardModule, SmartDataViewLayoutModule], exports: [RecordsHistoryComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecordsHistoryModule, imports: [CommonModule, NbIconModule, NbSpinnerModule, NbCardModule, SmartDataViewLayoutModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecordsHistoryModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NbIconModule, NbSpinnerModule, NbCardModule, SmartDataViewLayoutModule],
                    exports: [RecordsHistoryComponent],
                    declarations: [RecordsHistoryComponent]
                }]
        }] });
//# sourceMappingURL=records-history.module.js.map