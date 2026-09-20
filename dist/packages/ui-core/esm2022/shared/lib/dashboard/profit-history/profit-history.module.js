import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbIconModule, NbCardModule, NbSpinnerModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { SmartDataViewLayoutModule } from '../../smart-data-layout/smart-data-view-layout.module';
import { ProfitHistoryComponent } from './profit-history.component';
import { ExpenseTableComponent } from './table-components/expense-table.component';
import { IncomeTableComponent } from './table-components/income-table.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class ProfitHistoryModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProfitHistoryModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ProfitHistoryModule, declarations: [ProfitHistoryComponent, ExpenseTableComponent, IncomeTableComponent], imports: [CommonModule,
            NbIconModule,
            NbCardModule,
            NbSpinnerModule, i1.TranslateModule, SmartDataViewLayoutModule], exports: [ProfitHistoryComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProfitHistoryModule, imports: [CommonModule,
            NbIconModule,
            NbCardModule,
            NbSpinnerModule,
            TranslateModule.forChild(),
            SmartDataViewLayoutModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProfitHistoryModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        NbIconModule,
                        NbCardModule,
                        NbSpinnerModule,
                        TranslateModule.forChild(),
                        SmartDataViewLayoutModule
                    ],
                    exports: [ProfitHistoryComponent],
                    declarations: [ProfitHistoryComponent, ExpenseTableComponent, IncomeTableComponent]
                }]
        }] });
//# sourceMappingURL=profit-history.module.js.map