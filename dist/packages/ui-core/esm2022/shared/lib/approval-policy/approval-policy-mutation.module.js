import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbIconModule, NbCardModule, NbButtonModule, NbInputModule, NbSelectModule, NbCheckboxModule, NbRadioModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { ApprovalPolicyService } from '@gauzy/ui-core/core';
import { Store } from '@gauzy/ui-core/core';
import { ApprovalPolicyMutationComponent } from './approval-policy-mutation.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class ApprovalPolicyMutationModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ApprovalPolicyMutationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: ApprovalPolicyMutationModule, declarations: [ApprovalPolicyMutationComponent], imports: [CommonModule,
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
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ApprovalPolicyMutationModule, providers: [ApprovalPolicyService, Store], imports: [CommonModule,
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
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ApprovalPolicyMutationModule, decorators: [{
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
                    declarations: [ApprovalPolicyMutationComponent],
                    providers: [ApprovalPolicyService, Store]
                }]
        }] });
//# sourceMappingURL=approval-policy-mutation.module.js.map