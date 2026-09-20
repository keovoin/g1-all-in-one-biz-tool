import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbIconModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared.module';
import { SmartDataViewLayoutModule } from '../../smart-data-layout/smart-data-view-layout.module';
import { TableComponentsModule } from '../../table-components/table-components.module';
import { RecurringExpenseHistoryComponent } from './recurring-expense-history.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class RecurringExpenseHistoryModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecurringExpenseHistoryModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: RecurringExpenseHistoryModule, declarations: [RecurringExpenseHistoryComponent], imports: [CommonModule,
            NbIconModule, i1.TranslateModule, SharedModule,
            SmartDataViewLayoutModule,
            TableComponentsModule], exports: [RecurringExpenseHistoryComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecurringExpenseHistoryModule, imports: [CommonModule,
            NbIconModule,
            TranslateModule.forChild(),
            SharedModule,
            SmartDataViewLayoutModule,
            TableComponentsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecurringExpenseHistoryModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        NbIconModule,
                        TranslateModule.forChild(),
                        SharedModule,
                        SmartDataViewLayoutModule,
                        TableComponentsModule
                    ],
                    exports: [RecurringExpenseHistoryComponent],
                    declarations: [RecurringExpenseHistoryComponent]
                }]
        }] });
//# sourceMappingURL=recurring-expense-history.module.js.map