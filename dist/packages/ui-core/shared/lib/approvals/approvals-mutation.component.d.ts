import { OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, FormGroupDirective } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { IRequestApproval, IEmployee, IOrganizationTeam, IApprovalPolicy, ITag } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { Store } from '@gauzy/ui-core/core';
import { ApprovalPolicyService, EmployeesService, OrganizationTeamsService, RequestApprovalService } from '@gauzy/ui-core/core';
import { FormHelpers } from '../forms/helpers';
import * as i0 from "@angular/core";
export declare class RequestApprovalMutationComponent extends TranslationBaseComponent implements OnInit, OnDestroy {
    readonly dialogRef: NbDialogRef<RequestApprovalMutationComponent>;
    private readonly approvalPolicyService;
    private readonly requestApprovalService;
    private readonly employeesService;
    private readonly organizationTeamsService;
    private readonly fb;
    readonly translationService: TranslateService;
    readonly store: Store;
    private readonly router;
    FormHelpers: typeof FormHelpers;
    formDirective: FormGroupDirective;
    form: UntypedFormGroup;
    requestApproval: IRequestApproval;
    organizationId: string;
    tenantId: string;
    participants: string;
    selectedMembers: string[];
    selectedTeams: string[];
    employees: IEmployee[];
    approvalPolicies: IApprovalPolicy[];
    teams: IOrganizationTeam[];
    selectedEmployees: string[];
    selectedApprovalPolicy: string[];
    tags: ITag[];
    constructor(dialogRef: NbDialogRef<RequestApprovalMutationComponent>, approvalPolicyService: ApprovalPolicyService, requestApprovalService: RequestApprovalService, employeesService: EmployeesService, organizationTeamsService: OrganizationTeamsService, fb: UntypedFormBuilder, translationService: TranslateService, store: Store, router: Router);
    navigateToPolicy(): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
    loadEmployees(): Promise<void>;
    loadApprovalPolicies(): Promise<void>;
    loadSelectedOrganization(): void;
    onApprovalPolicySelected(approvalPolicySelection: string[]): void;
    loadTeams(): Promise<void>;
    initializeForm(): Promise<void>;
    closeDialog(requestApproval?: IRequestApproval): void;
    onSubmit(): Promise<void>;
    selectedTagsEvent(currentTagSelection: ITag[]): void;
    onMembersSelected(members: string[]): void;
    onEmployeesSelected(employeeSelection: string[]): void;
    onTeamsSelected(teamsSelection: string[]): void;
    onParticipantsChange(participants: string): void;
    /**
     * Handle setting the participant values based on type
     */
    setParticipantsValues(): void;
    /**
     * Reset approval request mutation form after save
     */
    onReset(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RequestApprovalMutationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RequestApprovalMutationComponent, "ngx-approval-mutation", never, {}, {}, never, never, false, never>;
}
