import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbIconModule, NbCardModule, NbButtonModule, NbInputModule, NbSelectModule, NbCheckboxModule, NbDatepickerModule, NbRadioModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@gauzy/ui-core/core';
import { EquipmentService, EquipmentSharingPolicyService, EquipmentSharingService } from '@gauzy/ui-core/core';
import { EmployeeMultiSelectModule } from '../../employee/employee-multi-select/employee-multi-select.module';
import { EquipmentSharingMutationComponent } from './equipment-sharing-mutation.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class EquipmentSharingMutationModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EquipmentSharingMutationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: EquipmentSharingMutationModule, declarations: [EquipmentSharingMutationComponent], imports: [CommonModule,
            FormsModule,
            NbCardModule,
            NbIconModule,
            NbCheckboxModule,
            ReactiveFormsModule,
            FormsModule,
            NbButtonModule,
            NbInputModule,
            NbSelectModule,
            NbDatepickerModule,
            NgSelectModule,
            NbRadioModule, i1.TranslateModule, EmployeeMultiSelectModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EquipmentSharingMutationModule, providers: [EquipmentSharingService, Store, EquipmentService, EquipmentSharingPolicyService], imports: [CommonModule,
            FormsModule,
            NbCardModule,
            NbIconModule,
            NbCheckboxModule,
            ReactiveFormsModule,
            FormsModule,
            NbButtonModule,
            NbInputModule,
            NbSelectModule,
            NbDatepickerModule,
            NgSelectModule,
            NbRadioModule,
            TranslateModule.forChild(),
            EmployeeMultiSelectModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EquipmentSharingMutationModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        NbCardModule,
                        NbIconModule,
                        NbCheckboxModule,
                        ReactiveFormsModule,
                        FormsModule,
                        NbButtonModule,
                        NbInputModule,
                        NbSelectModule,
                        NbDatepickerModule,
                        NgSelectModule,
                        NbRadioModule,
                        TranslateModule.forChild(),
                        EmployeeMultiSelectModule
                    ],
                    declarations: [EquipmentSharingMutationComponent],
                    providers: [EquipmentSharingService, Store, EquipmentService, EquipmentSharingPolicyService]
                }]
        }] });
//# sourceMappingURL=equipment-sharing-mutation.module.js.map