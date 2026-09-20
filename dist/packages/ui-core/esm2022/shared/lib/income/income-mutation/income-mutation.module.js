import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbCardModule, NbButtonModule, NbIconModule, NbDatepickerModule, NbInputModule, NbSelectModule, NbCheckboxModule, NbTooltipModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { IncomeService, OrganizationsService } from '@gauzy/ui-core/core';
import { SelectorsModule } from '../../selectors/selectors.module';
import { CurrencyModule } from '../../modules/currency/currency.module';
import { ContactSelectModule } from '../../contact-select/contact-select.module';
import { TagsColorInputModule } from '../../tags/tags-color-input/tags-color-input.module';
import { IncomeMutationComponent } from './income-mutation.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class IncomeMutationModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IncomeMutationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: IncomeMutationModule, declarations: [IncomeMutationComponent], imports: [CommonModule,
            FormsModule,
            NbCardModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbIconModule,
            NgSelectModule,
            NbDatepickerModule,
            NbInputModule,
            NbSelectModule,
            NbCheckboxModule,
            NbTooltipModule, i1.TranslateModule, SelectorsModule,
            CurrencyModule,
            ContactSelectModule,
            TagsColorInputModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IncomeMutationModule, providers: [IncomeService, OrganizationsService], imports: [CommonModule,
            FormsModule,
            NbCardModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbIconModule,
            NgSelectModule,
            NbDatepickerModule,
            NbInputModule,
            NbSelectModule,
            NbCheckboxModule,
            NbTooltipModule,
            TranslateModule.forChild(),
            SelectorsModule,
            CurrencyModule,
            ContactSelectModule,
            TagsColorInputModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IncomeMutationModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        NbCardModule,
                        ReactiveFormsModule,
                        NbButtonModule,
                        NbIconModule,
                        NgSelectModule,
                        NbDatepickerModule,
                        NbInputModule,
                        NbSelectModule,
                        NbCheckboxModule,
                        NbTooltipModule,
                        TranslateModule.forChild(),
                        SelectorsModule,
                        CurrencyModule,
                        ContactSelectModule,
                        TagsColorInputModule
                    ],
                    declarations: [IncomeMutationComponent],
                    providers: [IncomeService, OrganizationsService]
                }]
        }] });
//# sourceMappingURL=income-mutation.module.js.map