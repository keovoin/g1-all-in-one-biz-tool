import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbAlertModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbDatepickerModule, NbIconModule, NbInputModule, NbSelectModule, NbSpinnerModule, NbTooltipModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { OrganizationsService } from '@gauzy/ui-core/core';
import { SelectorsModule } from '../../selectors/selectors.module';
import { CurrencyModule } from '../../modules/currency/currency.module';
import { RecurringExpenseMutationComponent } from './recurring-expense-mutation.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class RecurringExpenseMutationModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecurringExpenseMutationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: RecurringExpenseMutationModule, declarations: [RecurringExpenseMutationComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbAlertModule,
            NbButtonModule,
            NbCardModule,
            NbCheckboxModule,
            NbDatepickerModule,
            NbIconModule,
            NbInputModule,
            NbSelectModule,
            NbSpinnerModule,
            NbTooltipModule,
            NgSelectModule, i1.TranslateModule, SelectorsModule,
            CurrencyModule], exports: [RecurringExpenseMutationComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecurringExpenseMutationModule, providers: [OrganizationsService], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbAlertModule,
            NbButtonModule,
            NbCardModule,
            NbCheckboxModule,
            NbDatepickerModule,
            NbIconModule,
            NbInputModule,
            NbSelectModule,
            NbSpinnerModule,
            NbTooltipModule,
            NgSelectModule,
            TranslateModule.forChild(),
            SelectorsModule,
            CurrencyModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecurringExpenseMutationModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbAlertModule,
                        NbButtonModule,
                        NbCardModule,
                        NbCheckboxModule,
                        NbDatepickerModule,
                        NbIconModule,
                        NbInputModule,
                        NbSelectModule,
                        NbSpinnerModule,
                        NbTooltipModule,
                        NgSelectModule,
                        TranslateModule.forChild(),
                        SelectorsModule,
                        CurrencyModule
                    ],
                    exports: [RecurringExpenseMutationComponent],
                    declarations: [RecurringExpenseMutationComponent],
                    providers: [OrganizationsService]
                }]
        }] });
//# sourceMappingURL=recurring-expense-mutation.module.js.map