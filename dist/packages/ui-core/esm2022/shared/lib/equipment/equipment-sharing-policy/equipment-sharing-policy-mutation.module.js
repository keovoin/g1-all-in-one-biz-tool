import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbIconModule, NbCardModule, NbButtonModule, NbInputModule, NbSelectModule, NbCheckboxModule, NbRadioModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { EquipmentSharingPolicyService } from '@gauzy/ui-core/core';
import { EquipmentSharingPolicyMutationComponent } from './equipment-sharing-policy-mutation.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class EquipmentSharingPolicyMutationModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EquipmentSharingPolicyMutationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: EquipmentSharingPolicyMutationModule, declarations: [EquipmentSharingPolicyMutationComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbCardModule,
            NbIconModule,
            NbCheckboxModule,
            NbButtonModule,
            NbInputModule,
            NbSelectModule,
            NbRadioModule,
            NgSelectModule, i1.TranslateModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EquipmentSharingPolicyMutationModule, providers: [EquipmentSharingPolicyService], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NbCardModule,
            NbIconModule,
            NbCheckboxModule,
            NbButtonModule,
            NbInputModule,
            NbSelectModule,
            NbRadioModule,
            NgSelectModule,
            TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EquipmentSharingPolicyMutationModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NbCardModule,
                        NbIconModule,
                        NbCheckboxModule,
                        NbButtonModule,
                        NbInputModule,
                        NbSelectModule,
                        NbRadioModule,
                        NgSelectModule,
                        TranslateModule.forChild()
                    ],
                    declarations: [EquipmentSharingPolicyMutationComponent],
                    providers: [EquipmentSharingPolicyService]
                }]
        }] });
//# sourceMappingURL=equipment-sharing-policy-mutation.module.js.map