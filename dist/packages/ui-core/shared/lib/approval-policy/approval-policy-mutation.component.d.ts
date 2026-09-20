import { OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormGroupDirective } from '@angular/forms';
import { IApprovalPolicy, IOrganization } from '@gauzy/contracts';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@gauzy/ui-core/core';
import { ApprovalPolicyService, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { FormHelpers } from '../forms/helpers';
import * as i0 from "@angular/core";
export declare class ApprovalPolicyMutationComponent extends TranslationBaseComponent implements OnInit {
    private readonly dialogRef;
    private readonly approvalPolicyService;
    private readonly fb;
    readonly translationService: TranslateService;
    private readonly store;
    private readonly toastrService;
    FormHelpers: typeof FormHelpers;
    organization: IOrganization;
    formDirective: FormGroupDirective;
    private _approvalPolicy;
    get approvalPolicy(): IApprovalPolicy;
    set approvalPolicy(value: IApprovalPolicy);
    form: UntypedFormGroup;
    static buildForm(fb: UntypedFormBuilder): UntypedFormGroup;
    constructor(dialogRef: NbDialogRef<ApprovalPolicyMutationComponent>, approvalPolicyService: ApprovalPolicyService, fb: UntypedFormBuilder, translationService: TranslateService, store: Store, toastrService: ToastrService);
    ngOnInit(): void;
    patchForm(): void;
    closeDialog(approvalPolicy?: IApprovalPolicy): void;
    onSubmit(): Promise<void>;
    /**
     * Reset approval policy mutation form after save
     */
    onReset(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ApprovalPolicyMutationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ApprovalPolicyMutationComponent, "ngx-approval-policy-mutation", never, { "approvalPolicy": { "alias": "approvalPolicy"; "required": false; }; }, {}, never, never, false, never>;
}
