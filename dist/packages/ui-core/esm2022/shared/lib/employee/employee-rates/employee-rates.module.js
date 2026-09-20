import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbIconModule, NbSelectModule, NbInputModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { CandidateStore, EmployeeStore } from '@gauzy/ui-core/core';
import { EmployeeRatesComponent } from './employee-rates.component';
import { CurrencyModule } from '../../modules/currency';
import { PipesModule } from '../../pipes/pipes.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class EmployeeRatesModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeRatesModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: EmployeeRatesModule, declarations: [EmployeeRatesComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbInputModule,
            NbSelectModule,
            NbIconModule, i1.TranslateModule, PipesModule,
            CurrencyModule], exports: [EmployeeRatesComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeRatesModule, providers: [CandidateStore, EmployeeStore], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbInputModule,
            NbSelectModule,
            NbIconModule,
            TranslateModule.forChild(),
            PipesModule,
            CurrencyModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeRatesModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbButtonModule,
                        NbInputModule,
                        NbSelectModule,
                        NbIconModule,
                        TranslateModule.forChild(),
                        PipesModule,
                        CurrencyModule
                    ],
                    exports: [EmployeeRatesComponent],
                    declarations: [EmployeeRatesComponent],
                    providers: [CandidateStore, EmployeeStore]
                }]
        }] });
//# sourceMappingURL=employee-rates.module.js.map