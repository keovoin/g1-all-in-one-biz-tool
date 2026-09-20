import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbSelectModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeeSelectComponent } from './employee-multi-select.component';
import { SharedModule } from '../../shared.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class EmployeeMultiSelectModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeMultiSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: EmployeeMultiSelectModule, declarations: [EmployeeSelectComponent], imports: [CommonModule, FormsModule, ReactiveFormsModule, NbSelectModule, i1.TranslateModule, SharedModule], exports: [EmployeeSelectComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeMultiSelectModule, imports: [CommonModule, FormsModule, ReactiveFormsModule, NbSelectModule, TranslateModule.forChild(), SharedModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeMultiSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, ReactiveFormsModule, NbSelectModule, TranslateModule.forChild(), SharedModule],
                    declarations: [EmployeeSelectComponent],
                    exports: [EmployeeSelectComponent]
                }]
        }] });
//# sourceMappingURL=employee-multi-select.module.js.map