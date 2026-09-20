import { OnInit } from '@angular/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { IEquipmentSharingPolicy, IOrganization } from '@gauzy/contracts';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { EquipmentSharingPolicyService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class EquipmentSharingPolicyMutationComponent extends TranslationBaseComponent implements OnInit {
    dialogRef: NbDialogRef<EquipmentSharingPolicyMutationComponent>;
    private equipmentSharingPolicyService;
    private fb;
    readonly translationService: TranslateService;
    equipmentSharingPolicy: IEquipmentSharingPolicy;
    selectedOrganization: IOrganization;
    form: UntypedFormGroup;
    constructor(dialogRef: NbDialogRef<EquipmentSharingPolicyMutationComponent>, equipmentSharingPolicyService: EquipmentSharingPolicyService, fb: UntypedFormBuilder, translationService: TranslateService);
    ngOnInit(): void;
    /**
     * Initialize the form with values from the existing equipment sharing policy.
     * If no policy exists, the form fields are set to empty strings.
     */
    initializeForm(): Promise<void>;
    /**
     * Close the dialog with the given equipment sharing policy.
     * If no policy is provided, the dialog closes without passing any data.
     *
     * @param policy - The equipment sharing policy to pass when closing the dialog.
     */
    closeDialog(policy?: IEquipmentSharingPolicy): Promise<void>;
    /**
     * Save the equipment sharing policy.
     * Determines whether to create a new policy or update an existing one based on the presence of an ID.
     */
    saveEquipmentSharingPolicy(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EquipmentSharingPolicyMutationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EquipmentSharingPolicyMutationComponent, "ngx-equipment-sharing-policy-mutation", never, {}, {}, never, never, false, never>;
}
