import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbIconModule, NbTooltipModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { EditEmployeeMembershipFormComponent } from './edit-employee-membership-form.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class EditEmployeeMembershipFormModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EditEmployeeMembershipFormModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: EditEmployeeMembershipFormModule, declarations: [EditEmployeeMembershipFormComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NgSelectModule,
            NbIconModule,
            NbTooltipModule, i1.TranslateModule], exports: [EditEmployeeMembershipFormComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EditEmployeeMembershipFormModule, imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbButtonModule,
            NgSelectModule,
            NbIconModule,
            NbTooltipModule,
            TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EditEmployeeMembershipFormModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbButtonModule,
                        NgSelectModule,
                        NbIconModule,
                        NbTooltipModule,
                        TranslateModule.forChild()
                    ],
                    exports: [EditEmployeeMembershipFormComponent],
                    declarations: [EditEmployeeMembershipFormComponent]
                }]
        }] });
//# sourceMappingURL=edit-employee-membership-form.module.js.map