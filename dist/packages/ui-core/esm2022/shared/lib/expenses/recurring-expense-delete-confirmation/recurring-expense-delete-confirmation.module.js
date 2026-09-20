import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbRadioModule, NbCardModule, NbButtonModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { RecurringExpenseDeleteConfirmationComponent } from './recurring-expense-delete-confirmation.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class RecurringExpenseDeleteConfirmationModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecurringExpenseDeleteConfirmationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: RecurringExpenseDeleteConfirmationModule, declarations: [RecurringExpenseDeleteConfirmationComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbRadioModule,
            NbCardModule,
            NbButtonModule, i1.TranslateModule], exports: [RecurringExpenseDeleteConfirmationComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecurringExpenseDeleteConfirmationModule, imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbRadioModule,
            NbCardModule,
            NbButtonModule,
            TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecurringExpenseDeleteConfirmationModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbRadioModule,
                        NbCardModule,
                        NbButtonModule,
                        TranslateModule.forChild()
                    ],
                    exports: [RecurringExpenseDeleteConfirmationComponent],
                    declarations: [RecurringExpenseDeleteConfirmationComponent]
                }]
        }] });
//# sourceMappingURL=recurring-expense-delete-confirmation.module.js.map