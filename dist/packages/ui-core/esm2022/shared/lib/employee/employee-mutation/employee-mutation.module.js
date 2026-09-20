import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbButtonModule, NbIconModule, NbStepperModule, NbTagModule, NbSpinnerModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeesService, OrganizationsService, RoleService } from '@gauzy/ui-core/core';
import { UserFormsModule } from '../../user/forms/user-forms.module';
import { EmployeeMutationComponent } from './employee-mutation.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class EmployeeMutationModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeMutationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: EmployeeMutationModule, declarations: [EmployeeMutationComponent], imports: [CommonModule,
            FormsModule,
            NbCardModule,
            NbButtonModule,
            NbIconModule,
            NbStepperModule,
            NbTagModule,
            NbSpinnerModule,
            UserFormsModule, i1.TranslateModule], exports: [EmployeeMutationComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeMutationModule, providers: [OrganizationsService, EmployeesService, RoleService], imports: [CommonModule,
            FormsModule,
            NbCardModule,
            NbButtonModule,
            NbIconModule,
            NbStepperModule,
            NbTagModule,
            NbSpinnerModule,
            UserFormsModule,
            TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeMutationModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        NbCardModule,
                        NbButtonModule,
                        NbIconModule,
                        NbStepperModule,
                        NbTagModule,
                        NbSpinnerModule,
                        UserFormsModule,
                        TranslateModule.forChild()
                    ],
                    exports: [EmployeeMutationComponent],
                    declarations: [EmployeeMutationComponent],
                    providers: [OrganizationsService, EmployeesService, RoleService]
                }]
        }] });
//# sourceMappingURL=employee-mutation.module.js.map