import { ElementRef, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ICreateEmailInvitesOutput, InvitationTypeEnum, IOrganizationProject, RolesEnum, IOrganizationContact, IOrganizationDepartment, IOrganization, IUser, InvitationExpirationEnum, IRole, IOrganizationTeam } from '@gauzy/contracts';
import { NbTagComponent, NbTagInputAddEvent } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, InviteService, RoleService } from '@gauzy/ui-core/core';
import { Store } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { FormHelpers } from '../../../forms/helpers';
import * as i0 from "@angular/core";
export declare class EmailInviteFormComponent extends TranslationBaseComponent implements OnInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly _fb;
    private readonly _inviteService;
    private readonly _rolesService;
    private readonly _store;
    private readonly _authService;
    private readonly _cdr;
    FormHelpers: typeof FormHelpers;
    invitationTypeEnum: typeof InvitationTypeEnum;
    organizationProjects: IOrganizationProject[];
    organizationContacts: IOrganizationContact[];
    organizationDepartments: IOrganizationDepartment[];
    organizationTeams: IOrganizationTeam[];
    private _invitationType;
    get invitationType(): InvitationTypeEnum;
    set invitationType(value: InvitationTypeEnum);
    /**
     * Build email invite form group
     *
     */
    form: UntypedFormGroup;
    tagInput: ElementRef<HTMLInputElement>;
    user: IUser;
    organization: IOrganization;
    emails: Set<string>;
    excludes: RolesEnum[];
    invitationExpiryOptions: {
        label: string;
        value: InvitationExpirationEnum;
    }[];
    constructor(translateService: TranslateService, _fb: UntypedFormBuilder, _inviteService: InviteService, _rolesService: RoleService, _store: Store, _authService: AuthService, _cdr: ChangeDetectorRef);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Force Angular change detection cycle
     * This helps ensure UI is properly updated
     */
    detectChanges(): void;
    /**
     * Exclude roles
     */
    excludeRoles(): Promise<void>;
    isEmployeeInvitation(): boolean;
    isCandidateInvitation(): boolean;
    /**
     * SELECT all organization projects
     */
    selectAllProjects(): void;
    /**
     * SELECT all organization departments and update form control value
     */
    selectAllDepartments(): void;
    /**
     * SELECT all organization contacts and update form control value
     */
    selectAllOrganizationContacts(): void;
    /**
     * SELECT all organization teams and update form control value
     */
    selectAllTeams(): void;
    /**
     * Retrieves the role from the form based on the invitation type.
     * Defaults to a viewer role if no specific role is found in the form.
     * @returns The role enum value.
     */
    getRoleFromForm(): RolesEnum;
    /**
     *
     * @returns
     */
    saveInvites(): Promise<ICreateEmailInvitesOutput>;
    /**
     * Remove email from emails form control
     *
     * @param tagToRemove
     */
    onEmailRemove(tagToRemove: NbTagComponent): void;
    /**
     * Add emails to form emails control
     *
     * @param param0
     */
    onEmailAdd({ value, input }: NbTagInputAddEvent): void;
    /**
     * Email focus out event fire
     *
     * @param event
     */
    onFocusOut(event: any): void;
    /**
     * Reset emails form control
     *
     */
    onResetEmails(): void;
    /**
     * SET form validators
     *
     */
    setFormValidators(): void;
    /**
     * SET invitation period as per organization selection
     *
     * @param organization
     */
    setInvitationPeriodFormValue(organization: IOrganization): void;
    /**
     * On Selection Change
     * @param role
     */
    onSelectionChange(role: IRole): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmailInviteFormComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EmailInviteFormComponent, "ga-email-invite-form", never, { "organizationProjects": { "alias": "organizationProjects"; "required": false; }; "organizationContacts": { "alias": "organizationContacts"; "required": false; }; "organizationDepartments": { "alias": "organizationDepartments"; "required": false; }; "organizationTeams": { "alias": "organizationTeams"; "required": false; }; "invitationType": { "alias": "invitationType"; "required": false; }; }, {}, never, never, false, never>;
}
