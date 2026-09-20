import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbIconModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared.module';
import { SmartDataViewLayoutModule } from '../../smart-data-layout/smart-data-view-layout.module';
import { RecurringExpenseHistoryModule } from '../recurring-expense-history/recurring-expense-history.module';
import { RecurringExpenseBlockComponent } from './recurring-expense-block.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class RecurringExpenseBlockModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecurringExpenseBlockModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: RecurringExpenseBlockModule, declarations: [RecurringExpenseBlockComponent], imports: [CommonModule,
            NbIconModule,
            NbTooltipModule, i1.TranslateModule, SharedModule,
            SmartDataViewLayoutModule,
            RecurringExpenseHistoryModule], exports: [RecurringExpenseBlockComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecurringExpenseBlockModule, imports: [CommonModule,
            NbIconModule,
            NbTooltipModule,
            TranslateModule.forChild(),
            SharedModule,
            SmartDataViewLayoutModule,
            RecurringExpenseHistoryModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecurringExpenseBlockModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        NbIconModule,
                        NbTooltipModule,
                        TranslateModule.forChild(),
                        SharedModule,
                        SmartDataViewLayoutModule,
                        RecurringExpenseHistoryModule
                    ],
                    exports: [RecurringExpenseBlockComponent],
                    declarations: [RecurringExpenseBlockComponent]
                }]
        }] });
//# sourceMappingURL=recurring-expense-block.module.js.map