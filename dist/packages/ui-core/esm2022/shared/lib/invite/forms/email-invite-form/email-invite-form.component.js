import { __decorate, __metadata } from "tslib";
import { Component, ElementRef, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { InvitationTypeEnum, RolesEnum, InvitationExpirationEnum } from '@gauzy/contracts';
import { firstValueFrom } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { NbTagInputDirective } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, EmailValidator, InviteService, RoleService } from '@gauzy/ui-core/core';
import { Store } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { FormHelpers } from '../../../forms/helpers';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/forms";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "@nebular/theme";
import * as i5 from "@ng-select/ng-select";
import * as i6 from "../../../directives/autocomplete-off.directive";
import * as i7 from "../../../user/forms/fields/role/role.component";
let EmailInviteFormComponent = class EmailInviteFormComponent extends TranslationBaseComponent {
    get invitationType() {
        return this._invitationType;
    }
    set invitationType(value) {
        this._invitationType = value;
        this.setFormValidators();
    }
    constructor(translateService, _fb, _inviteService, _rolesService, _store, _authService, 
    // Added ChangeDetectorRef for manual change detection
    _cdr) {
        super(translateService);
        this.translateService = translateService;
        this._fb = _fb;
        this._inviteService = _inviteService;
        this._rolesService = _rolesService;
        this._store = _store;
        this._authService = _authService;
        this._cdr = _cdr;
        this.FormHelpers = FormHelpers;
        this.invitationTypeEnum = InvitationTypeEnum;
        this.organizationProjects = [];
        this.organizationContacts = [];
        this.organizationDepartments = [];
        this.organizationTeams = [];
        /**
         * Build email invite form group
         *
         */
        this.form = this._fb.group({
            emails: [null, Validators.required],
            projects: [[]],
            startedWorkOn: [new Date()],
            appliedDate: [],
            departments: [[]],
            organizationContacts: [[]],
            role: [],
            invitationExpirationPeriod: [],
            teams: [[]]
        }, {
            validators: [EmailValidator.pattern('emails')]
        });
        this.emails = new Set([]);
        this.excludes = [];
        this.invitationExpiryOptions = [
            {
                label: this.getTranslation('INVITE_PAGE.INVITATION_EXPIRATION_OPTIONS.DAY'),
                value: InvitationExpirationEnum.DAY
            },
            {
                label: this.getTranslation('INVITE_PAGE.INVITATION_EXPIRATION_OPTIONS.WEEK'),
                value: InvitationExpirationEnum.WEEK
            },
            {
                label: this.getTranslation('INVITE_PAGE.INVITATION_EXPIRATION_OPTIONS.TWO_WEEK'),
                value: InvitationExpirationEnum.TWO_WEEK
            },
            {
                label: this.getTranslation('INVITE_PAGE.INVITATION_EXPIRATION_OPTIONS.MONTH'),
                value: InvitationExpirationEnum.MONTH
            },
            {
                label: this.getTranslation('INVITE_PAGE.INVITATION_EXPIRATION_OPTIONS.NEVER'),
                value: InvitationExpirationEnum.NEVER
            }
        ];
    }
    ngOnInit() {
        this._store.user$
            .pipe(filter((user) => !!user), tap((user) => (this.user = user)), tap(() => this.excludeRoles()), untilDestroyed(this))
            .subscribe();
        this._store.selectedOrganization$
            .pipe(filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap((organization) => this.setInvitationPeriodFormValue(organization)), untilDestroyed(this))
            .subscribe();
    }
    ngAfterViewInit() { }
    /**
     * Force Angular change detection cycle
     * This helps ensure UI is properly updated
     */
    detectChanges() {
        this._cdr.detectChanges();
    }
    /**
     * Exclude roles
     */
    async excludeRoles() {
        const hasSuperAdminRole = await firstValueFrom(this._authService.hasRole([RolesEnum.SUPER_ADMIN]));
        this.excludes = [RolesEnum.EMPLOYEE];
        if (!hasSuperAdminRole) {
            this.excludes.push(RolesEnum.SUPER_ADMIN);
        }
    }
    isEmployeeInvitation() {
        return this.invitationType === InvitationTypeEnum.EMPLOYEE;
    }
    isCandidateInvitation() {
        return this.invitationType === InvitationTypeEnum.CANDIDATE;
    }
    /**
     * SELECT all organization projects
     */
    selectAllProjects() {
        const formControl = this.form.get('projects');
        const currentValue = formControl.value || [];
        const allProjectIds = this.organizationProjects.map((project) => project.id).filter(Boolean);
        // Better check for complete selection - ensures all items are selected and no extras
        const allSelected = allProjectIds.length > 0 &&
            currentValue.length === allProjectIds.length &&
            allProjectIds.every((id) => currentValue.includes(id));
        // Toggle selection based on current state
        if (allSelected) {
            formControl.setValue([]);
        }
        else {
            formControl.setValue([...allProjectIds]);
        }
        // Ensure Angular recognizes the changes
        formControl.markAsDirty();
        formControl.updateValueAndValidity();
        this.detectChanges();
    }
    /**
     * SELECT all organization departments and update form control value
     */
    selectAllDepartments() {
        const formControl = this.form.get('departments');
        const currentValue = formControl.value || [];
        const allDepartmentIds = this.organizationDepartments.map((department) => department.id).filter(Boolean);
        // Better check for complete selection - ensures all items are selected and no extras
        const allSelected = allDepartmentIds.length > 0 &&
            currentValue.length === allDepartmentIds.length &&
            allDepartmentIds.every((id) => currentValue.includes(id));
        if (allSelected) {
            formControl.setValue([]);
        }
        else {
            formControl.setValue([...allDepartmentIds]);
        }
        // Ensure Angular recognizes the changes
        formControl.markAsDirty();
        formControl.updateValueAndValidity();
        this.detectChanges();
    }
    /**
     * SELECT all organization contacts and update form control value
     */
    selectAllOrganizationContacts() {
        const formControl = this.form.get('organizationContacts');
        const currentValue = formControl.value || [];
        const allContactIds = this.organizationContacts.map((contact) => contact.id).filter(Boolean);
        // Better check for complete selection - ensures all items are selected and no extras
        const allSelected = allContactIds.length > 0 &&
            currentValue.length === allContactIds.length &&
            allContactIds.every((id) => currentValue.includes(id));
        if (allSelected) {
            formControl.setValue([]);
        }
        else {
            formControl.setValue([...allContactIds]);
        }
        // Ensure Angular recognizes the changes
        formControl.markAsDirty();
        formControl.updateValueAndValidity();
        this.detectChanges();
    }
    /**
     * SELECT all organization teams and update form control value
     */
    selectAllTeams() {
        const formControl = this.form.get('teams');
        const currentValue = formControl.value || [];
        const allTeamIds = this.organizationTeams.map((team) => team.id).filter(Boolean);
        // Better check for complete selection - ensures all items are selected and no extras
        const allSelected = allTeamIds.length > 0 &&
            currentValue.length === allTeamIds.length &&
            allTeamIds.every((id) => currentValue.includes(id));
        if (allSelected) {
            formControl.setValue([]);
        }
        else {
            formControl.setValue([...allTeamIds]);
        }
        // Ensure Angular recognizes the changes
        formControl.markAsDirty();
        formControl.updateValueAndValidity();
        this.detectChanges();
    }
    /**
     * Retrieves the role from the form based on the invitation type.
     * Defaults to a viewer role if no specific role is found in the form.
     * @returns The role enum value.
     */
    getRoleFromForm() {
        if (this.isEmployeeInvitation()) {
            return RolesEnum.EMPLOYEE;
        }
        if (this.isCandidateInvitation()) {
            return RolesEnum.CANDIDATE;
        }
        // Default to viewer role if form role value is not set
        const formRole = this.form.get('role').value;
        return formRole ? formRole.name : RolesEnum.VIEWER;
    }
    /**
     *
     * @returns
     */
    async saveInvites() {
        if (this.form.invalid) {
            return;
        }
        const { id: organizationId, tenantId } = this.organization;
        const role = await firstValueFrom(this._rolesService.getRoleByOptions({
            name: this.getRoleFromForm(),
            tenantId
        }));
        const { startedWorkOn, appliedDate, emails, invitationExpirationPeriod, projects = [], departments = [], organizationContacts = [], teams = [] } = this.form.value;
        return await this._inviteService.createWithEmails({
            emailIds: emails,
            projectIds: projects,
            departmentIds: departments,
            organizationContactIds: organizationContacts,
            teamIds: teams,
            roleId: role.id,
            organizationId,
            tenantId,
            inviteType: this.invitationType,
            startedWorkOn: startedWorkOn ? new Date(startedWorkOn) : null,
            appliedDate: appliedDate ? new Date(appliedDate) : null,
            invitationExpirationPeriod
        });
    }
    /**
     * Remove email from emails form control
     *
     * @param tagToRemove
     */
    onEmailRemove(tagToRemove) {
        this.emails.delete(tagToRemove.text);
        this.form.patchValue({
            emails: [...this.emails.entries()].map(([email]) => email)
        });
    }
    /**
     * Add emails to form emails control
     *
     * @param param0
     */
    onEmailAdd({ value, input }) {
        if (value) {
            this.emails.add(value);
        }
        input.nativeElement.value = '';
        this.form.patchValue({
            emails: [...this.emails.entries()].map(([email]) => email)
        });
    }
    /**
     * Email focus out event fire
     *
     * @param event
     */
    onFocusOut(event) {
        const value = event.target.value;
        this.onEmailAdd({
            value,
            input: this.tagInput
        });
    }
    /**
     * Reset emails form control
     *
     */
    onResetEmails() {
        [...this.emails.entries()].forEach(([email]) => {
            this.emails.delete(email);
        });
        this.form.patchValue({
            emails: [...this.emails.entries()].map(([email]) => email)
        });
    }
    /**
     * SET form validators
     *
     */
    setFormValidators() {
        if (this.isEmployeeInvitation() || this.isCandidateInvitation()) {
            this.form.get('role').clearValidators();
        }
        else {
            this.form.get('role').setValidators([Validators.required]);
        }
        this.form.get('role').updateValueAndValidity();
    }
    /**
     * SET invitation period as per organization selection
     *
     * @param organization
     */
    setInvitationPeriodFormValue(organization) {
        if (organization.invitesAllowed) {
            /**
             * The organization stores `inviteExpiryPeriod` as a free number of days (its settings form only
             * enforces a minimum), but the invite endpoint accepts only `InvitationExpirationEnum` values.
             * Anything else matches no option — the select renders blank and the invite is rejected with
             * "invitationExpirationPeriod must be one of the following values" — so fall back to the default.
             */
            const storedExpiryPeriod = organization.inviteExpiryPeriod;
            const isSupportedExpiryPeriod = this.invitationExpiryOptions.some((option) => option.value === storedExpiryPeriod);
            const inviteExpiryPeriod = isSupportedExpiryPeriod ? storedExpiryPeriod : InvitationExpirationEnum.TWO_WEEK;
            this.form.get('invitationExpirationPeriod').setValue(inviteExpiryPeriod);
            this.form.get('invitationExpirationPeriod').updateValueAndValidity();
        }
    }
    /**
     * On Selection Change
     * @param role
     */
    onSelectionChange(role) {
        this.form.get('role').setValue(role);
        this.form.get('role').updateValueAndValidity();
    }
    ngOnDestroy() {
        this.emails.clear();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmailInviteFormComponent, deps: [{ token: i1.TranslateService }, { token: i2.UntypedFormBuilder }, { token: i3.InviteService }, { token: i3.RoleService }, { token: i3.Store }, { token: i3.AuthService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: EmailInviteFormComponent, isStandalone: false, selector: "ga-email-invite-form", inputs: { organizationProjects: "organizationProjects", organizationContacts: "organizationContacts", organizationDepartments: "organizationDepartments", organizationTeams: "organizationTeams", invitationType: "invitationType" }, viewQueries: [{ propertyName: "tagInput", first: true, predicate: NbTagInputDirective, descendants: true, read: ElementRef }], usesInheritance: true, ngImport: i0, template: "<form [formGroup]=\"form\" autocomplete-off>\n\t<div class=\"row\">\n\t\t<div class=\"col-sm-12\">\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"emails\" class=\"label\">\n\t\t\t\t\t{{ 'FORM.LABELS.EMAILS' | translate }}\n\t\t\t\t</label>\n\t\t\t\t<nb-form-field>\n\t\t\t\t\t<nb-tag-list class=\"custom-tag-list\" (tagRemove)=\"onEmailRemove($event)\">\n\t\t\t\t\t\t@for (email of emails; track email) {\n\t\t\t\t\t\t<nb-tag [text]=\"email\" [size]=\"'tiny'\" removable></nb-tag>\n\t\t\t\t\t\t}\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tid=\"emails\"\n\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\tname=\"emails\"\n\t\t\t\t\t\t\tnbTagInput\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t(tagAdd)=\"onEmailAdd($event)\"\n\t\t\t\t\t\t\t(focusout)=\"onFocusOut($event)\"\n\t\t\t\t\t\t\t[status]=\"FormHelpers.isInvalidControl(form, 'emails') ? 'danger' : 'basic'\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</nb-tag-list>\n\t\t\t\t\t@if (emails.size > 0) {\n\t\t\t\t\t<nb-icon nbSuffix icon=\"close-outline\" pack=\"eva\" (click)=\"onResetEmails()\"></nb-icon>\n\t\t\t\t\t}\n\t\t\t\t</nb-form-field>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t@if (invitationType === invitationTypeEnum.CANDIDATE) {\n\t<div class=\"row\">\n\t\t<div class=\"col-sm-12\">\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"appliedDate\" class=\"label\">\n\t\t\t\t\t{{ 'FORM.LABELS.APPLIED_DATE_LABEL' | translate }}\n\t\t\t\t</label>\n\t\t\t\t<input\n\t\t\t\t\tid=\"appliedDate\"\n\t\t\t\t\t[nbDatepicker]=\"appliedDatePicker\"\n\t\t\t\t\tnbInput\n\t\t\t\t\tfullWidth\n\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.START_DATE' | translate\"\n\t\t\t\t\tformControlName=\"appliedDate\"\n\t\t\t\t/>\n\t\t\t\t<nb-datepicker #appliedDatePicker></nb-datepicker>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t} @if (invitationType === invitationTypeEnum.EMPLOYEE) {\n\t<div class=\"row\">\n\t\t<div class=\"col-sm-6\">\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"projectSelection\" class=\"label label-with-select\">\n\t\t\t\t\t{{ 'FORM.LABELS.PROJECTS_OPTIONAL' | translate }}\n\t\t\t\t\t<button nbButton ghost size=\"tiny\" type=\"button\" (click)=\"selectAllProjects()\">\n\t\t\t\t\t\t{{ 'BUTTONS.SELECT_ALL' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</label>\n\t\t\t\t<ng-select\n\t\t\t\t\tid=\"projectSelection\"\n\t\t\t\t\tclass=\"adjust-height\"\n\t\t\t\t\t[hideSelected]=\"false\"\n\t\t\t\t\t[multiple]=\"true\"\n\t\t\t\t\tbindLabel=\"name\"\n\t\t\t\t\tbindValue=\"id\"\n\t\t\t\t\tappendTo=\"body\"\n\t\t\t\t\tformControlName=\"projects\"\n\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.PROJECTS' | translate\"\n\t\t\t\t\t(change)=\"detectChanges()\"\n\t\t\t\t>\n\t\t\t\t\t@for (project of organizationProjects; track project) {\n\t\t\t\t\t<ng-option [value]=\"project.id\">\n\t\t\t\t\t\t{{ project.name }}\n\t\t\t\t\t</ng-option>\n\t\t\t\t\t}\n\t\t\t\t</ng-select>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"col-sm-6\">\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"contactSelection\" class=\"label label-with-select\">\n\t\t\t\t\t{{ 'FORM.LABELS.CONTACTS_OPTIONAL' | translate }}\n\t\t\t\t\t<button nbButton ghost size=\"tiny\" type=\"button\" (click)=\"selectAllOrganizationContacts()\">\n\t\t\t\t\t\t{{ 'BUTTONS.SELECT_ALL' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</label>\n\t\t\t\t<ng-select\n\t\t\t\t\tid=\"contactSelection\"\n\t\t\t\t\tclass=\"adjust-height\"\n\t\t\t\t\t[hideSelected]=\"false\"\n\t\t\t\t\t[multiple]=\"true\"\n\t\t\t\t\tbindLabel=\"name\"\n\t\t\t\t\tbindValue=\"id\"\n\t\t\t\t\tappendTo=\"body\"\n\t\t\t\t\tformControlName=\"organizationContacts\"\n\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.CONTACTS' | translate\"\n\t\t\t\t\t(change)=\"detectChanges()\"\n\t\t\t\t>\n\t\t\t\t\t@for (contact of organizationContacts; track contact) {\n\t\t\t\t\t<ng-option [value]=\"contact.id\">\n\t\t\t\t\t\t{{ contact.name }}\n\t\t\t\t\t</ng-option>\n\t\t\t\t\t}\n\t\t\t\t</ng-select>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t} @if (invitationType === invitationTypeEnum.EMPLOYEE || invitationType === invitationTypeEnum.CANDIDATE) {\n\t<div class=\"row\">\n\t\t@if (invitationType === invitationTypeEnum.EMPLOYEE) {\n\t\t<div class=\"col-6\">\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"teamSelection\" class=\"label label-with-select\">\n\t\t\t\t\t{{ 'FORM.LABELS.TEAMS_OPTIONAL' | translate }}\n\t\t\t\t\t<button nbButton ghost size=\"tiny\" type=\"button\" (click)=\"selectAllTeams()\">\n\t\t\t\t\t\t{{ 'BUTTONS.SELECT_ALL' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</label>\n\t\t\t\t<ng-select\n\t\t\t\t\tid=\"teamSelection\"\n\t\t\t\t\tclass=\"adjust-height\"\n\t\t\t\t\t[hideSelected]=\"false\"\n\t\t\t\t\t[multiple]=\"true\"\n\t\t\t\t\tbindLabel=\"name\"\n\t\t\t\t\tbindValue=\"id\"\n\t\t\t\t\tappendTo=\"body\"\n\t\t\t\t\tformControlName=\"teams\"\n\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.TEAMS' | translate\"\n\t\t\t\t\t(change)=\"detectChanges()\"\n\t\t\t\t>\n\t\t\t\t\t@for (team of organizationTeams; track team) {\n\t\t\t\t\t<ng-option [value]=\"team.id\">\n\t\t\t\t\t\t{{ team.name }}\n\t\t\t\t\t</ng-option>\n\t\t\t\t\t}\n\t\t\t\t</ng-select>\n\t\t\t</div>\n\t\t</div>\n\t\t}\n\t\t<div\n\t\t\t[class.col-6]=\"invitationType === invitationTypeEnum.EMPLOYEE\"\n\t\t\t[class.col-12]=\"!(invitationType === invitationTypeEnum.EMPLOYEE)\"\n\t\t>\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"departmentSelection\" class=\"label label-with-select\">\n\t\t\t\t\t{{ 'FORM.LABELS.DEPARTMENTS_OPTIONAL' | translate }}\n\t\t\t\t\t<button nbButton ghost size=\"tiny\" type=\"button\" (click)=\"selectAllDepartments()\">\n\t\t\t\t\t\t{{ 'BUTTONS.SELECT_ALL' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</label>\n\t\t\t\t<ng-select\n\t\t\t\t\tid=\"departmentSelection\"\n\t\t\t\t\tclass=\"adjust-height\"\n\t\t\t\t\t[hideSelected]=\"false\"\n\t\t\t\t\t[multiple]=\"true\"\n\t\t\t\t\tbindLabel=\"name\"\n\t\t\t\t\tbindValue=\"id\"\n\t\t\t\t\tappendTo=\"body\"\n\t\t\t\t\tformControlName=\"departments\"\n\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.DEPARTMENTS' | translate\"\n\t\t\t\t\t(change)=\"detectChanges()\"\n\t\t\t\t>\n\t\t\t\t\t@for (department of organizationDepartments; track department) {\n\t\t\t\t\t<ng-option [value]=\"department.id\">\n\t\t\t\t\t\t{{ department.name }}\n\t\t\t\t\t</ng-option>\n\t\t\t\t\t}\n\t\t\t\t</ng-select>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t} @if (invitationType === invitationTypeEnum.USER) {\n\t<div class=\"row\">\n\t\t<div class=\"col-12\">\n\t\t\t<ngx-role-form-field\n\t\t\t\tid=\"role\"\n\t\t\t\tformControlName=\"role\"\n\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.ROLE' | translate\"\n\t\t\t\t[label]=\"'FORM.LABELS.ROLE' | translate\"\n\t\t\t\t[excludes]=\"excludes\"\n\t\t\t\t(selectedChange)=\"onSelectionChange($event)\"\n\t\t\t></ngx-role-form-field>\n\t\t</div>\n\t</div>\n\t} @if (invitationType !== invitationTypeEnum.CANDIDATE) {\n\t<div class=\"row\">\n\t\t<div class=\"col-sm-6\">\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"startedWorkOn\" class=\"label\">\n\t\t\t\t\t{{ 'FORM.LABELS.START_DATE' | translate }}\n\t\t\t\t\t<nb-icon\n\t\t\t\t\t\t[nbTooltip]=\"'FORM.NOTIFICATIONS.STARTED_WORK_ON' | translate\"\n\t\t\t\t\t\ticon=\"question-mark-circle-outline\"\n\t\t\t\t\t></nb-icon>\n\t\t\t\t</label>\n\t\t\t\t<nb-form-field>\n\t\t\t\t\t<input\n\t\t\t\t\t\tid=\"startedWorkOn\"\n\t\t\t\t\t\t[nbDatepicker]=\"startedWorkDatepicker\"\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.START_DATE' | translate\"\n\t\t\t\t\t\tformControlName=\"startedWorkOn\"\n\t\t\t\t\t/>\n\t\t\t\t\t<nb-datepicker #startedWorkDatepicker></nb-datepicker>\n\t\t\t\t</nb-form-field>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t} @if (invitationExpiryOptions.length > 0) {\n\t<div class=\"row\">\n\t\t<div class=\"col-sm-6\">\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"invitationExpirationPeriod\" class=\"label\">\n\t\t\t\t\t{{ 'FORM.LABELS.INVITATION_EXPIRATION' | translate }}\n\t\t\t\t</label>\n\t\t\t\t<nb-select\n\t\t\t\t\tid=\"invitationExpirationPeriod\"\n\t\t\t\t\tfullWidth\n\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.INVITATION_EXPIRATION' | translate\"\n\t\t\t\t\tformControlName=\"invitationExpirationPeriod\"\n\t\t\t\t>\n\t\t\t\t\t@for (option of invitationExpiryOptions; track option) {\n\t\t\t\t\t<nb-option [value]=\"option?.value\">\n\t\t\t\t\t\t{{ option?.label }}\n\t\t\t\t\t</nb-option>\n\t\t\t\t\t}\n\t\t\t\t</nb-select>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t}\n</form>\n", styles: [":host .remove-icon div{cursor:pointer}:host .remove-icon{padding-left:7px;padding-right:7px;padding-top:2px}:host .adjust-height ::ng-deep .ng-select-container{height:auto}:host ::ng-deep .custom-tag-list.nb-tag-list-with-input.size-medium{box-shadow:var(--gauzy-shadow) inset;background-color:var(--gauzy-card-2)}:host ::ng-deep .custom-tag-list.nb-tag-list-with-input.size-medium input{box-shadow:unset}:host .item-invalid ::ng-deep .ng-select-container{border:1px solid;border-color:var(--color-danger-default)}:host .item-valid ::ng-deep .ng-select-container{border:1px solid;border-color:var(--color-success-default)}:host .label-with-select{display:flex;justify-content:space-between;align-items:center}:host #emailsSelect ::ng-deep .ng-clear-wrapper{width:20px}:host #emailsSelect ::ng-deep .ng-arrow-wrapper{display:none}:host .employee-padding{margin-bottom:50px}:host .notes{text-indent:1em}:host .notes p{margin:5px 0 0 2px;color:#eac72d;font-size:.75rem;font-weight:300;line-height:initial}:host nb-tag-list nb-tag::ng-deep{text-transform:initial}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i2.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i2.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i2.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i4.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "directive", type: i4.NbDatepickerDirective, selector: "input[nbDatepicker]", inputs: ["nbDatepicker"] }, { kind: "component", type: i4.NbDatepickerComponent, selector: "nb-datepicker", inputs: ["date"], outputs: ["dateChange"] }, { kind: "component", type: i4.NbFormFieldComponent, selector: "nb-form-field" }, { kind: "directive", type: i4.NbSuffixDirective, selector: "[nbSuffix]" }, { kind: "component", type: i4.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i4.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i4.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i4.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "component", type: i4.NbTagComponent, selector: "nb-tag", inputs: ["text", "selected", "removable", "appearance", "status", "size", "role"], outputs: ["remove", "selectedChange"], exportAs: ["nbTag"] }, { kind: "component", type: i4.NbTagListComponent, selector: "nb-tag-list", inputs: ["size", "tabIndex", "role", "multiple"], outputs: ["tagRemove"], exportAs: ["nbTagList"] }, { kind: "directive", type: i4.NbTagInputDirective, selector: "input[nbTagInput]", inputs: ["separatorKeys"], outputs: ["tagAdd"], exportAs: ["nbTagInput"] }, { kind: "directive", type: i4.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "component", type: i5.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "component", type: i5.NgOptionComponent, selector: "ng-option", inputs: ["value", "disabled"] }, { kind: "directive", type: i6.AutocompleteOffDirective, selector: "[autocomplete-off]" }, { kind: "component", type: i7.RoleFormFieldComponent, selector: "ngx-role-form-field", inputs: ["excludes", "id", "size", "placeholder", "label", "ctrl"], outputs: ["selectedChange"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
EmailInviteFormComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        UntypedFormBuilder,
        InviteService,
        RoleService,
        Store,
        AuthService,
        ChangeDetectorRef])
], EmailInviteFormComponent);
export { EmailInviteFormComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmailInviteFormComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-email-invite-form', standalone: false, template: "<form [formGroup]=\"form\" autocomplete-off>\n\t<div class=\"row\">\n\t\t<div class=\"col-sm-12\">\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"emails\" class=\"label\">\n\t\t\t\t\t{{ 'FORM.LABELS.EMAILS' | translate }}\n\t\t\t\t</label>\n\t\t\t\t<nb-form-field>\n\t\t\t\t\t<nb-tag-list class=\"custom-tag-list\" (tagRemove)=\"onEmailRemove($event)\">\n\t\t\t\t\t\t@for (email of emails; track email) {\n\t\t\t\t\t\t<nb-tag [text]=\"email\" [size]=\"'tiny'\" removable></nb-tag>\n\t\t\t\t\t\t}\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tid=\"emails\"\n\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\tname=\"emails\"\n\t\t\t\t\t\t\tnbTagInput\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t(tagAdd)=\"onEmailAdd($event)\"\n\t\t\t\t\t\t\t(focusout)=\"onFocusOut($event)\"\n\t\t\t\t\t\t\t[status]=\"FormHelpers.isInvalidControl(form, 'emails') ? 'danger' : 'basic'\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</nb-tag-list>\n\t\t\t\t\t@if (emails.size > 0) {\n\t\t\t\t\t<nb-icon nbSuffix icon=\"close-outline\" pack=\"eva\" (click)=\"onResetEmails()\"></nb-icon>\n\t\t\t\t\t}\n\t\t\t\t</nb-form-field>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t@if (invitationType === invitationTypeEnum.CANDIDATE) {\n\t<div class=\"row\">\n\t\t<div class=\"col-sm-12\">\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"appliedDate\" class=\"label\">\n\t\t\t\t\t{{ 'FORM.LABELS.APPLIED_DATE_LABEL' | translate }}\n\t\t\t\t</label>\n\t\t\t\t<input\n\t\t\t\t\tid=\"appliedDate\"\n\t\t\t\t\t[nbDatepicker]=\"appliedDatePicker\"\n\t\t\t\t\tnbInput\n\t\t\t\t\tfullWidth\n\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.START_DATE' | translate\"\n\t\t\t\t\tformControlName=\"appliedDate\"\n\t\t\t\t/>\n\t\t\t\t<nb-datepicker #appliedDatePicker></nb-datepicker>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t} @if (invitationType === invitationTypeEnum.EMPLOYEE) {\n\t<div class=\"row\">\n\t\t<div class=\"col-sm-6\">\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"projectSelection\" class=\"label label-with-select\">\n\t\t\t\t\t{{ 'FORM.LABELS.PROJECTS_OPTIONAL' | translate }}\n\t\t\t\t\t<button nbButton ghost size=\"tiny\" type=\"button\" (click)=\"selectAllProjects()\">\n\t\t\t\t\t\t{{ 'BUTTONS.SELECT_ALL' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</label>\n\t\t\t\t<ng-select\n\t\t\t\t\tid=\"projectSelection\"\n\t\t\t\t\tclass=\"adjust-height\"\n\t\t\t\t\t[hideSelected]=\"false\"\n\t\t\t\t\t[multiple]=\"true\"\n\t\t\t\t\tbindLabel=\"name\"\n\t\t\t\t\tbindValue=\"id\"\n\t\t\t\t\tappendTo=\"body\"\n\t\t\t\t\tformControlName=\"projects\"\n\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.PROJECTS' | translate\"\n\t\t\t\t\t(change)=\"detectChanges()\"\n\t\t\t\t>\n\t\t\t\t\t@for (project of organizationProjects; track project) {\n\t\t\t\t\t<ng-option [value]=\"project.id\">\n\t\t\t\t\t\t{{ project.name }}\n\t\t\t\t\t</ng-option>\n\t\t\t\t\t}\n\t\t\t\t</ng-select>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"col-sm-6\">\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"contactSelection\" class=\"label label-with-select\">\n\t\t\t\t\t{{ 'FORM.LABELS.CONTACTS_OPTIONAL' | translate }}\n\t\t\t\t\t<button nbButton ghost size=\"tiny\" type=\"button\" (click)=\"selectAllOrganizationContacts()\">\n\t\t\t\t\t\t{{ 'BUTTONS.SELECT_ALL' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</label>\n\t\t\t\t<ng-select\n\t\t\t\t\tid=\"contactSelection\"\n\t\t\t\t\tclass=\"adjust-height\"\n\t\t\t\t\t[hideSelected]=\"false\"\n\t\t\t\t\t[multiple]=\"true\"\n\t\t\t\t\tbindLabel=\"name\"\n\t\t\t\t\tbindValue=\"id\"\n\t\t\t\t\tappendTo=\"body\"\n\t\t\t\t\tformControlName=\"organizationContacts\"\n\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.CONTACTS' | translate\"\n\t\t\t\t\t(change)=\"detectChanges()\"\n\t\t\t\t>\n\t\t\t\t\t@for (contact of organizationContacts; track contact) {\n\t\t\t\t\t<ng-option [value]=\"contact.id\">\n\t\t\t\t\t\t{{ contact.name }}\n\t\t\t\t\t</ng-option>\n\t\t\t\t\t}\n\t\t\t\t</ng-select>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t} @if (invitationType === invitationTypeEnum.EMPLOYEE || invitationType === invitationTypeEnum.CANDIDATE) {\n\t<div class=\"row\">\n\t\t@if (invitationType === invitationTypeEnum.EMPLOYEE) {\n\t\t<div class=\"col-6\">\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"teamSelection\" class=\"label label-with-select\">\n\t\t\t\t\t{{ 'FORM.LABELS.TEAMS_OPTIONAL' | translate }}\n\t\t\t\t\t<button nbButton ghost size=\"tiny\" type=\"button\" (click)=\"selectAllTeams()\">\n\t\t\t\t\t\t{{ 'BUTTONS.SELECT_ALL' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</label>\n\t\t\t\t<ng-select\n\t\t\t\t\tid=\"teamSelection\"\n\t\t\t\t\tclass=\"adjust-height\"\n\t\t\t\t\t[hideSelected]=\"false\"\n\t\t\t\t\t[multiple]=\"true\"\n\t\t\t\t\tbindLabel=\"name\"\n\t\t\t\t\tbindValue=\"id\"\n\t\t\t\t\tappendTo=\"body\"\n\t\t\t\t\tformControlName=\"teams\"\n\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.TEAMS' | translate\"\n\t\t\t\t\t(change)=\"detectChanges()\"\n\t\t\t\t>\n\t\t\t\t\t@for (team of organizationTeams; track team) {\n\t\t\t\t\t<ng-option [value]=\"team.id\">\n\t\t\t\t\t\t{{ team.name }}\n\t\t\t\t\t</ng-option>\n\t\t\t\t\t}\n\t\t\t\t</ng-select>\n\t\t\t</div>\n\t\t</div>\n\t\t}\n\t\t<div\n\t\t\t[class.col-6]=\"invitationType === invitationTypeEnum.EMPLOYEE\"\n\t\t\t[class.col-12]=\"!(invitationType === invitationTypeEnum.EMPLOYEE)\"\n\t\t>\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"departmentSelection\" class=\"label label-with-select\">\n\t\t\t\t\t{{ 'FORM.LABELS.DEPARTMENTS_OPTIONAL' | translate }}\n\t\t\t\t\t<button nbButton ghost size=\"tiny\" type=\"button\" (click)=\"selectAllDepartments()\">\n\t\t\t\t\t\t{{ 'BUTTONS.SELECT_ALL' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</label>\n\t\t\t\t<ng-select\n\t\t\t\t\tid=\"departmentSelection\"\n\t\t\t\t\tclass=\"adjust-height\"\n\t\t\t\t\t[hideSelected]=\"false\"\n\t\t\t\t\t[multiple]=\"true\"\n\t\t\t\t\tbindLabel=\"name\"\n\t\t\t\t\tbindValue=\"id\"\n\t\t\t\t\tappendTo=\"body\"\n\t\t\t\t\tformControlName=\"departments\"\n\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.DEPARTMENTS' | translate\"\n\t\t\t\t\t(change)=\"detectChanges()\"\n\t\t\t\t>\n\t\t\t\t\t@for (department of organizationDepartments; track department) {\n\t\t\t\t\t<ng-option [value]=\"department.id\">\n\t\t\t\t\t\t{{ department.name }}\n\t\t\t\t\t</ng-option>\n\t\t\t\t\t}\n\t\t\t\t</ng-select>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t} @if (invitationType === invitationTypeEnum.USER) {\n\t<div class=\"row\">\n\t\t<div class=\"col-12\">\n\t\t\t<ngx-role-form-field\n\t\t\t\tid=\"role\"\n\t\t\t\tformControlName=\"role\"\n\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.ROLE' | translate\"\n\t\t\t\t[label]=\"'FORM.LABELS.ROLE' | translate\"\n\t\t\t\t[excludes]=\"excludes\"\n\t\t\t\t(selectedChange)=\"onSelectionChange($event)\"\n\t\t\t></ngx-role-form-field>\n\t\t</div>\n\t</div>\n\t} @if (invitationType !== invitationTypeEnum.CANDIDATE) {\n\t<div class=\"row\">\n\t\t<div class=\"col-sm-6\">\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"startedWorkOn\" class=\"label\">\n\t\t\t\t\t{{ 'FORM.LABELS.START_DATE' | translate }}\n\t\t\t\t\t<nb-icon\n\t\t\t\t\t\t[nbTooltip]=\"'FORM.NOTIFICATIONS.STARTED_WORK_ON' | translate\"\n\t\t\t\t\t\ticon=\"question-mark-circle-outline\"\n\t\t\t\t\t></nb-icon>\n\t\t\t\t</label>\n\t\t\t\t<nb-form-field>\n\t\t\t\t\t<input\n\t\t\t\t\t\tid=\"startedWorkOn\"\n\t\t\t\t\t\t[nbDatepicker]=\"startedWorkDatepicker\"\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.START_DATE' | translate\"\n\t\t\t\t\t\tformControlName=\"startedWorkOn\"\n\t\t\t\t\t/>\n\t\t\t\t\t<nb-datepicker #startedWorkDatepicker></nb-datepicker>\n\t\t\t\t</nb-form-field>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t} @if (invitationExpiryOptions.length > 0) {\n\t<div class=\"row\">\n\t\t<div class=\"col-sm-6\">\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"invitationExpirationPeriod\" class=\"label\">\n\t\t\t\t\t{{ 'FORM.LABELS.INVITATION_EXPIRATION' | translate }}\n\t\t\t\t</label>\n\t\t\t\t<nb-select\n\t\t\t\t\tid=\"invitationExpirationPeriod\"\n\t\t\t\t\tfullWidth\n\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.INVITATION_EXPIRATION' | translate\"\n\t\t\t\t\tformControlName=\"invitationExpirationPeriod\"\n\t\t\t\t>\n\t\t\t\t\t@for (option of invitationExpiryOptions; track option) {\n\t\t\t\t\t<nb-option [value]=\"option?.value\">\n\t\t\t\t\t\t{{ option?.label }}\n\t\t\t\t\t</nb-option>\n\t\t\t\t\t}\n\t\t\t\t</nb-select>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t}\n</form>\n", styles: [":host .remove-icon div{cursor:pointer}:host .remove-icon{padding-left:7px;padding-right:7px;padding-top:2px}:host .adjust-height ::ng-deep .ng-select-container{height:auto}:host ::ng-deep .custom-tag-list.nb-tag-list-with-input.size-medium{box-shadow:var(--gauzy-shadow) inset;background-color:var(--gauzy-card-2)}:host ::ng-deep .custom-tag-list.nb-tag-list-with-input.size-medium input{box-shadow:unset}:host .item-invalid ::ng-deep .ng-select-container{border:1px solid;border-color:var(--color-danger-default)}:host .item-valid ::ng-deep .ng-select-container{border:1px solid;border-color:var(--color-success-default)}:host .label-with-select{display:flex;justify-content:space-between;align-items:center}:host #emailsSelect ::ng-deep .ng-clear-wrapper{width:20px}:host #emailsSelect ::ng-deep .ng-arrow-wrapper{display:none}:host .employee-padding{margin-bottom:50px}:host .notes{text-indent:1em}:host .notes p{margin:5px 0 0 2px;color:#eac72d;font-size:.75rem;font-weight:300;line-height:initial}:host nb-tag-list nb-tag::ng-deep{text-transform:initial}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.UntypedFormBuilder }, { type: i3.InviteService }, { type: i3.RoleService }, { type: i3.Store }, { type: i3.AuthService }, { type: i0.ChangeDetectorRef }], propDecorators: { organizationProjects: [{
                type: Input
            }], organizationContacts: [{
                type: Input
            }], organizationDepartments: [{
                type: Input
            }], organizationTeams: [{
                type: Input
            }], invitationType: [{
                type: Input
            }], tagInput: [{
                type: ViewChild,
                args: [NbTagInputDirective, { read: ElementRef }]
            }] } });
//# sourceMappingURL=email-invite-form.component.js.map