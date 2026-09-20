import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbButtonModule, NbIconModule, NbDatepickerModule, NbInputModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { UserFormsModule } from '../../user/forms/user-forms.module';
import { EmployeeEndWorkComponent } from './employee-end-work.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class EmployeeEndWorkModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeEndWorkModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: EmployeeEndWorkModule, declarations: [EmployeeEndWorkComponent], imports: [CommonModule,
            FormsModule,
            NbCardModule,
            UserFormsModule,
            NbButtonModule,
            NbIconModule,
            NbDatepickerModule,
            NbInputModule, i1.TranslateModule], exports: [EmployeeEndWorkComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeEndWorkModule, imports: [CommonModule,
            FormsModule,
            NbCardModule,
            UserFormsModule,
            NbButtonModule,
            NbIconModule,
            NbDatepickerModule,
            NbInputModule,
            TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeEndWorkModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        NbCardModule,
                        UserFormsModule,
                        NbButtonModule,
                        NbIconModule,
                        NbDatepickerModule,
                        NbInputModule,
                        TranslateModule.forChild()
                    ],
                    exports: [EmployeeEndWorkComponent],
                    declarations: [EmployeeEndWorkComponent],
                    providers: []
                }]
        }] });
//# sourceMappingURL=employee-end-work.module.js.map