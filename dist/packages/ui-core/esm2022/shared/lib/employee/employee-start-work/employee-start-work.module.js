import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbDatepickerModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../pipes/pipes.module';
import { EmployeeStartWorkComponent } from './employee-start-work.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class EmployeeStartWorkModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeStartWorkModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: EmployeeStartWorkModule, declarations: [EmployeeStartWorkComponent], imports: [CommonModule,
            FormsModule,
            NbButtonModule,
            NbCardModule,
            NbIconModule,
            NbInputModule,
            NbDatepickerModule, i1.TranslateModule, PipesModule], exports: [EmployeeStartWorkComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeStartWorkModule, imports: [CommonModule,
            FormsModule,
            NbButtonModule,
            NbCardModule,
            NbIconModule,
            NbInputModule,
            NbDatepickerModule,
            TranslateModule.forChild(),
            PipesModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeStartWorkModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        NbButtonModule,
                        NbCardModule,
                        NbIconModule,
                        NbInputModule,
                        NbDatepickerModule,
                        TranslateModule.forChild(),
                        PipesModule
                    ],
                    declarations: [EmployeeStartWorkComponent],
                    exports: [EmployeeStartWorkComponent]
                }]
        }] });
//# sourceMappingURL=employee-start-work.module.js.map