import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NbSelectModule, NbFormFieldModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { GoalCustomUnitSelectComponent } from './goal-custom-unit-select.component';
import { CurrencyModule } from '../../modules/currency/currency.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class GoalCustomUnitModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoalCustomUnitModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: GoalCustomUnitModule, declarations: [GoalCustomUnitSelectComponent], imports: [CommonModule,
            NbSelectModule,
            NbFormFieldModule,
            NbIconModule,
            ReactiveFormsModule,
            FormsModule,
            NbInputModule,
            CurrencyModule, i1.TranslateModule], exports: [GoalCustomUnitSelectComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoalCustomUnitModule, imports: [CommonModule,
            NbSelectModule,
            NbFormFieldModule,
            NbIconModule,
            ReactiveFormsModule,
            FormsModule,
            NbInputModule,
            CurrencyModule,
            TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoalCustomUnitModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [GoalCustomUnitSelectComponent],
                    exports: [GoalCustomUnitSelectComponent],
                    imports: [
                        CommonModule,
                        NbSelectModule,
                        NbFormFieldModule,
                        NbIconModule,
                        ReactiveFormsModule,
                        FormsModule,
                        NbInputModule,
                        CurrencyModule,
                        TranslateModule.forChild()
                    ]
                }]
        }] });
//# sourceMappingURL=goal-custom-unit.module.js.map