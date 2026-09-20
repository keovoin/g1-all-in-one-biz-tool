import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbIconModule, NbCardModule, NbButtonModule, NbInputModule, NbSelectModule, NbCheckboxModule, NbRadioModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { ApprovalPolicyService, RequestApprovalService } from '@gauzy/ui-core/core';
import { Store } from '@gauzy/ui-core/core';
import { RequestApprovalMutationComponent } from './approvals-mutation.component';
import { EmployeeMultiSelectModule } from '../employee/employee-multi-select/employee-multi-select.module';
import { TagsColorInputModule } from '../tags/tags-color-input/tags-color-input.module';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class RequestApprovalMutationModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RequestApprovalMutationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: RequestApprovalMutationModule, declarations: [RequestApprovalMutationComponent], imports: [CommonModule,
            FormsModule,
            NbCardModule,
            NbIconModule,
            NbCheckboxModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbInputModule,
            NbSelectModule,
            NbRadioModule,
            NgSelectModule,
            EmployeeMultiSelectModule,
            TagsColorInputModule, i1.TranslateModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RequestApprovalMutationModule, providers: [RequestApprovalService, ApprovalPolicyService, Store], imports: [CommonModule,
            FormsModule,
            NbCardModule,
            NbIconModule,
            NbCheckboxModule,
            ReactiveFormsModule,
            NbButtonModule,
            NbInputModule,
            NbSelectModule,
            NbRadioModule,
            NgSelectModule,
            EmployeeMultiSelectModule,
            TagsColorInputModule,
            TranslateModule.forChild()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RequestApprovalMutationModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        NbCardModule,
                        NbIconModule,
                        NbCheckboxModule,
                        ReactiveFormsModule,
                        NbButtonModule,
                        NbInputModule,
                        NbSelectModule,
                        NbRadioModule,
                        NgSelectModule,
                        EmployeeMultiSelectModule,
                        TagsColorInputModule,
                        TranslateModule.forChild()
                    ],
                    declarations: [RequestApprovalMutationComponent],
                    providers: [RequestApprovalService, ApprovalPolicyService, Store]
                }]
        }] });
//# sourceMappingURL=approvals-mutation.module.js.map