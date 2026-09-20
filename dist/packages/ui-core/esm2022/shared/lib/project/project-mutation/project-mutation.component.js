var ProjectMutationComponent_1;
import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { EMPTY, firstValueFrom, of, switchMap } from 'rxjs';
import { catchError, debounceTime, filter, finalize, tap } from 'rxjs/operators';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { uniq } from 'underscore';
import { SyncTags } from '@gauzy/constants';
import { ProjectBillingEnum, ProjectOwnerEnum, TaskListTypeEnum, ContactType, OrganizationProjectBudgetTypeEnum, PermissionsEnum } from '@gauzy/contracts';
import { environment } from '@gauzy/ui-config';
import { DUMMY_PROFILE_IMAGE, distinctUntilChange } from '@gauzy/ui-core/common';
import { GithubService, OrganizationContactService, OrganizationProjectsService, OrganizationTeamsService, CompareDateValidator, ErrorHandlingService, ToastrService, Store } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { patterns } from '@gauzy/constants';
import { FormHelpers } from '../../forms/helpers';
import { ProjectModuleMutationComponent } from '../../project-module/project-module-mutation/project-module-mutation.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@angular/forms";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "@ngx-translate/core";
import * as i5 from "@nebular/theme";
import * as i6 from "@angular/common";
import * as i7 from "@ng-select/ng-select";
import * as i8 from "../../rich-text-editor/rich-text-editor.component";
import * as i9 from "ngx-color-picker";
import * as i10 from "../../directives/autocomplete-off.directive";
import * as i11 from "../../directives/img.directive";
import * as i12 from "../../modules/currency/currency.component";
import * as i13 from "../../employee/employee-multi-select/employee-multi-select.component";
import * as i14 from "../../image-uploader/image-uploader.component";
import * as i15 from "../../tags/tags-color-input/tags-color-input.component";
import * as i16 from "../../selectors/team/team/team.component";
import * as i17 from "../../integrations/github/repository-selector/repository-selector.component";
import * as i18 from "../../project-module/project-module-table/project-module-table.component";
import * as i19 from "../../pipes/replace.pipe";
let ProjectMutationComponent = class ProjectMutationComponent extends TranslationBaseComponent {
    static { ProjectMutationComponent_1 = this; }
    static buildForm(fb) {
        const form = fb.group({
            imageUrl: [],
            imageId: [],
            tags: [],
            teams: [],
            public: [],
            billable: [],
            name: [null, Validators.required],
            organizationContact: [],
            billing: [ProjectBillingEnum.RATE],
            currency: [environment.DEFAULT_CURRENCY],
            startDate: [],
            endDate: [],
            owner: [ProjectOwnerEnum.CLIENT],
            taskListType: [TaskListTypeEnum.GRID],
            description: [],
            code: [],
            color: [],
            budget: [],
            budgetType: [OrganizationProjectBudgetTypeEnum.HOURS],
            openSource: [],
            projectUrl: [null, Validators.compose([Validators.pattern(new RegExp(patterns.websiteUrl))])],
            openSourceProjectUrl: [null, Validators.compose([Validators.pattern(new RegExp(patterns.websiteUrl))])]
        }, {
            validators: [CompareDateValidator.validateDate('startDate', 'endDate')]
        });
        form.get('teams').setValue([]);
        return form;
    }
    static buildSettingForm(fb) {
        const form = fb.group({
            isTasksAutoSync: [],
            isTasksAutoSyncOnLabel: [],
            syncTag: []
        });
        return form;
    }
    get integration() {
        // Get the integration tenant or boolean value.
        return this._integration;
    }
    set integration(value) {
        // Set the integration tenant or boolean value.
        this._integration = value;
    }
    get project() {
        // Get the organization project.
        return this._project;
    }
    set project(project) {
        // Set the organization project.
        this._project = project;
        // Sync the form with the new project data
        this._syncProject();
    }
    get projectName() {
        return this.form.get('name');
    }
    get projectUrl() {
        return this.form.get('projectUrl');
    }
    get openSourceProjectUrl() {
        return this.form.get('openSourceProjectUrl');
    }
    constructor(_router, _fb, _store, _toastrService, translateService, _errorHandler, _organizationTeamService, _organizationContactService, _githubService, _organizationProjectsService, _dialogService) {
        super(translateService);
        this._router = _router;
        this._fb = _fb;
        this._store = _store;
        this._toastrService = _toastrService;
        this.translateService = translateService;
        this._errorHandler = _errorHandler;
        this._organizationTeamService = _organizationTeamService;
        this._organizationContactService = _organizationContactService;
        this._githubService = _githubService;
        this._organizationProjectsService = _organizationProjectsService;
        this._dialogService = _dialogService;
        this.FormHelpers = FormHelpers;
        this.OrganizationProjectBudgetTypeEnum = OrganizationProjectBudgetTypeEnum;
        this.TaskListTypeEnum = TaskListTypeEnum;
        this.memberIds = [];
        this.managerIds = [];
        this.selectedEmployeeIds = [];
        this.selectedManagerIds = [];
        this.selectedTeamIds = [];
        this.billings = Object.values(ProjectBillingEnum);
        this.owners = Object.values(ProjectOwnerEnum);
        this.taskViewModeTypes = Object.values(TaskListTypeEnum);
        this.showSprintManage = false;
        /*
         * Project Mutation Form
         */
        this.form = ProjectMutationComponent_1.buildForm(this._fb);
        /*
         * Project Setting Mutation Form
         */
        this.projectSettingForm = ProjectMutationComponent_1.buildSettingForm(this._fb);
        this.teams = [];
        this.organizationContacts = [];
        this.canceled = new EventEmitter();
        this.onSubmitted = new EventEmitter();
        /**
         * Adds a new organization contact with the provided name.
         *
         * @param {string} name - The name of the new organization contact.
         * @returns {Promise<IOrganizationContact>} - Returns a promise that resolves to the created organization contact.
         *
         * @throws {Error} - Handles errors using the error handler service if the contact creation fails.
         */
        this.addNewOrganizationContact = async (name) => {
            try {
                const { id: organizationId, tenantId } = this.organization;
                // Create a new organization contact
                const contact = await this._organizationContactService.create({
                    name,
                    organizationId,
                    tenantId,
                    contactType: ContactType.CLIENT
                });
                // Display a success message if the contact is created
                if (contact) {
                    const { name } = contact;
                    this._toastrService.success('NOTES.ORGANIZATIONS.EDIT_ORGANIZATIONS_CONTACTS.ADD_CONTACT', { name });
                }
                return contact;
            }
            catch (error) {
                // Handle any errors that occur during the contact creation process
                this._errorHandler.handleError(error);
            }
        };
    }
    ngOnInit() {
        this._store.selectedOrganization$
            .pipe(distinctUntilChange(), debounceTime(100), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this._loadDefaultCurrency()), tap(() => this._syncProject()), tap(() => this._getOrganizationContacts()), tap(() => this._getOrganizationTeams()), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Lifecycle hook that is called after the component's view has been initialized.
     * It sets up an event listener for changes to the 'syncTag' form control.
     */
    ngAfterViewInit() {
        // Get a reference to the 'isTasksAutoSyncOnLabel' form control within the 'projectSettingForm'.
        const isTasksAutoSyncOnLabelControl = this.projectSettingForm.get('isTasksAutoSyncOnLabel');
        const syncTagControl = this.projectSettingForm.get('syncTag');
        isTasksAutoSyncOnLabelControl.valueChanges
            .pipe(switchMap((value) => {
            if (value) {
                syncTagControl.enable();
            }
            else {
                syncTagControl.disable();
            }
            syncTagControl.updateValueAndValidity();
            return of(value); // Emit the same value.
        }), untilDestroyed(this) // Automatically unsubscribe when the component is destroyed.
        )
            .subscribe();
    }
    /**
     * Load default organization currency
     */
    _loadDefaultCurrency() {
        if (!this.organization) {
            return;
        }
        const currency = this.organization.currency || environment.DEFAULT_CURRENCY;
        if (currency) {
            this.form.get('currency').setValue(currency);
            this.form.get('currency').updateValueAndValidity();
        }
    }
    async _getOrganizationContacts() {
        if (!this.organization) {
            return;
        }
        const { id: organizationId, tenantId } = this.organization;
        const { items } = await this._organizationContactService.getAll([], {
            organizationId,
            tenantId
        });
        items.forEach((i) => {
            this.organizationContacts = uniq([...this.organizationContacts, { name: i.name, organizationContactId: i.id, id: i.id }], 'id');
        });
    }
    /**
     * Get organization teams
     *
     * @returns
     */
    async _getOrganizationTeams() {
        if (!this.organization ||
            !this._store.hasAnyPermission(PermissionsEnum.ALL_ORG_VIEW, PermissionsEnum.ORG_TEAM_VIEW)) {
            return;
        }
        const { tenantId } = this._store.user;
        const { id: organizationId } = this.organization;
        this.teams = (await this._organizationTeamService.getAll([], {
            organizationId,
            tenantId
        })).items;
    }
    changeProjectOwner(owner) {
        const clientControl = this.form.get('client');
        if (owner === ProjectOwnerEnum.INTERNAL && clientControl) {
            clientControl.setValue('');
        }
    }
    /**
     * Sync edit organization project
     *
     * @param project
     */
    _syncProject() {
        if (!this.project) {
            return;
        }
        const project = this.project;
        // Selected Members Ids
        this.selectedEmployeeIds = (project.members || [])
            .filter((member) => !member.isManager)
            .map((member) => member.employeeId);
        this.memberIds = this.selectedEmployeeIds;
        // Selected Managers Ids
        this.selectedManagerIds = (project.members || [])
            .filter((member) => member.isManager)
            .map((member) => member.employeeId);
        this.managerIds = this.selectedManagerIds;
        this.form.patchValue({
            imageUrl: project.imageUrl || null,
            imageId: project.imageId || null,
            tags: project.tags || [],
            public: project.public || false,
            billable: project.billable || false,
            name: project.name || null,
            organizationContact: project.organizationContact || null,
            billing: project.billing || ProjectBillingEnum.RATE,
            currency: project.currency,
            startDate: project.startDate ? new Date(project.startDate) : null,
            endDate: project.endDate ? new Date(project.endDate) : null,
            owner: project.owner || ProjectOwnerEnum.CLIENT,
            taskListType: project.taskListType || TaskListTypeEnum.GRID,
            description: project.description || null,
            code: project.code || null,
            color: project.color || null,
            budget: project.budget || null,
            budgetType: project.budgetType || OrganizationProjectBudgetTypeEnum.HOURS,
            openSource: project.openSource || null,
            projectUrl: project.projectUrl || null,
            openSourceProjectUrl: project.openSourceProjectUrl || null,
            teams: (this.project.teams || []).map((team) => team.id)
        });
        this.form.updateValueAndValidity();
        /** Project Integration Setting Patch Value*/
        this.projectSettingForm.patchValue({
            isTasksAutoSync: project.isTasksAutoSync || false,
            isTasksAutoSyncOnLabel: project.isTasksAutoSyncOnLabel || false,
            syncTag: project.syncTag || ''
        });
        this.projectSettingForm.updateValueAndValidity();
    }
    /**
     * Public toggle action
     * @param state
     */
    togglePublic(state) {
        this.form.get('public').setValue(state);
        this.form.get('public').updateValueAndValidity();
    }
    /**
     * Billable toggle action
     * @param state
     */
    toggleBillable(state) {
        this.form.get('billable').setValue(state);
        this.form.get('billable').updateValueAndValidity();
    }
    /**
     * Open source toggle action
     * @param state
     */
    toggleOpenSource(state) {
        this.form.get('openSource').setValue(state);
        this.form.get('openSource').updateValueAndValidity();
    }
    /**
     * Handles the selection of managers and updates the `managerIds` property.
     *
     * @param {ID[]} managerIds - An array of selected manager IDs.
     * The function is called when managers are selected, and it sets the `managerIds` property
     * with the array of selected IDs.
     */
    onManagersSelected(managerIds) {
        this.managerIds = managerIds;
    }
    /**
     * Handles the selection of members and updates the `memberIds` property.
     *
     * @param {ID[]} memberIds - An array of selected member IDs.
     * The function is called when members are selected, and it sets the `memberIds` property
     * with the array of selected IDs.
     */
    onMembersSelected(memberIds) {
        this.memberIds = memberIds;
    }
    /**
     * Updates the form's teams field with the selected organization teams.
     *
     * @param {IOrganizationTeam[]} teams - An array of selected organization teams.
     */
    onTeamsSelected(teams) {
        this.form.get('teams').setValue(teams);
        this.form.get('teams').updateValueAndValidity();
    }
    /**
     * Navigates to the organization projects page, canceling the current project workflow.
     *
     * This method is typically called when the user decides to cancel the project creation/edit process.
     */
    navigateToCancelProject() {
        this._router.navigate(['/pages/organization/projects']);
    }
    /**
     * Handles the submission of the project mutation form.
     *
     * @returns void
     */
    onSubmit() {
        if (this.form.invalid) {
            return;
        }
        // Emit the form values
        this.onSubmitted.emit(this.getFormValues());
    }
    /**
     * Extracts and processes form values for submission.
     *
     * @returns {object} - The processed form values.
     */
    getFormValues() {
        // Destructure the form values in one step
        const { name, code, projectUrl, owner, organizationContact, startDate, endDate, description, tags, billing, currency, budget, budgetType, openSource, openSourceProjectUrl, color, taskListType, public: isPublic, billable, imageId, teams } = this.form.value;
        return {
            // Main Step
            name,
            code,
            projectUrl,
            owner,
            organizationContactId: organizationContact?.id || null,
            startDate,
            endDate,
            memberIds: this.memberIds.filter((memberId) => !this.managerIds.includes(memberId)),
            managerIds: this.managerIds,
            teams: teams.map((id) => this.teams.find((team) => team.id === id)).filter(Boolean),
            // Description Step
            description,
            tags: tags || [],
            // Billing Step
            billing,
            billingFlat: [ProjectBillingEnum.RATE, ProjectBillingEnum.FLAT_FEE].includes(billing),
            currency,
            // Budget Step
            budget,
            budgetType,
            // Open Source Step
            openSource,
            openSourceProjectUrl,
            // Setting Step
            color,
            taskListType,
            public: isPublic,
            billable,
            // Image Step
            imageId
        };
    }
    /**
     * Updates the form's tags field with the selected tags.
     *
     * @param {ITag[]} selectedTags - An array of selected tags.
     */
    selectedTagsEvent(selectedTags) {
        this.form.get('tags').setValue(selectedTags);
        this.form.get('tags').updateValueAndValidity();
    }
    /**
     * Navigates to the tasks settings page for the selected project.
     */
    openTasksSettings() {
        // Get the selected project
        const project = this.project;
        // Navigate to the tasks settings page with the selected project
        this._router.navigate(['/pages/tasks/settings', project.id], { state: project });
    }
    /*
     * On Changed Currency Event Emitter
     */
    currencyChanged($event) { }
    /**
     * Upload project logo
     *
     * @param image
     */
    updateImageAsset(image) {
        try {
            if (image && image.id) {
                this.form.get('imageId').setValue(image.id);
                this.form.get('imageUrl').setValue(image.fullUrl);
            }
            else {
                this.form.get('imageUrl').setValue(DUMMY_PROFILE_IMAGE);
            }
            this.form.updateValueAndValidity();
        }
        catch (error) {
            console.log('Error while uploading project logo', error);
            this.handleImageUploadError(error);
        }
    }
    handleImageUploadError(error) {
        this._toastrService.danger(error);
    }
    /**
     * Selects a GitHub repository and retrieves its associated issues.
     * @param repository - The GitHub repository to select.
     */
    selectRepository(repository) {
        if (!this.organization || !this.integration) {
            return;
        }
        /**  */
        try {
            this.loading = false;
            const { id: organizationId, tenantId } = this.organization;
            const { id: projectId, name } = this.project;
            const integrationId = this.integration['id'];
            /** */
            const request = {
                organizationId,
                tenantId,
                integrationId,
                repository
            };
            // Fetch entity settings by integration ID and handle the result as an observable
            this._githubService
                .syncGithubRepository(request)
                .pipe(switchMap(({ id: repositoryId }) => {
                return this._organizationProjectsService.updateProjectSetting(projectId, {
                    organizationId,
                    tenantId,
                    customFields: { repositoryId },
                    ...(!this.projectSettingForm.get('syncTag').value ? { syncTag: SyncTags.GAUZY } : {})
                });
            }), tap(() => {
                this._toastrService.success('NOTES.ORGANIZATIONS.EDIT_ORGANIZATIONS_PROJECTS.SYNC_REPOSITORY', {
                    repository: repository.full_name,
                    project: name
                });
            }), catchError((error) => {
                this._errorHandler.handleError(error);
                return EMPTY;
            }), 
            // Execute the following code block when the observable completes or errors
            finalize(() => {
                // Set the 'loading' flag to false to indicate that data loading is complete
                this.loading = false;
            }), 
            // Automatically unsubscribe when the component is destroyed
            untilDestroyed(this))
                .subscribe();
        }
        catch (error) {
            this._errorHandler.handleError(error);
        }
    }
    /**
     * Trigger a change in the synchronization tag for project auto-sync settings.
     * This function updates the project's auto-sync settings.
     */
    changeSyncTag() {
        this.updateProjectAutoSyncSetting();
    }
    /**
     * Updates project auto-sync settings.
     * This method is typically invoked in response to user actions.
     */
    updateProjectAutoSyncSetting() {
        // Check if the 'organization' or 'integration' properties are not available.
        if (!this.organization || !this.integration) {
            return; // Abort the method execution.
        }
        /**  */
        try {
            // Set the 'loading' property to 'false' to indicate that data loading is not in progress.
            this.loading = false;
            // Extract the 'organizationId' and 'tenantId' from the 'organization' property.
            const { id: organizationId, tenantId } = this.organization;
            // Extract the 'projectId' from the 'project' property.
            const { id: projectId, name } = this.project;
            // Create a 'request' object of type 'IOrganizationProjectSetting'.
            // It contains 'organizationId', 'tenantId', and auto-sync settings taken from 'this.projectSettingForm.value'.
            const request = {
                organizationId,
                tenantId,
                ...this.projectSettingForm.value
            };
            // Call the 'updateProjectSetting' method of the '_organizationProjectsService'
            // to update project settings with 'projectId' and the 'request'
            this._organizationProjectsService
                .updateProjectSetting(projectId, request)
                .pipe(tap(() => {
                const message = 'NOTES.ORGANIZATIONS.EDIT_ORGANIZATIONS_PROJECTS.AUTO_SYNC_SETTING';
                this._toastrService.success(message, { project: name });
            }), catchError((error) => {
                this._errorHandler.handleError(error);
                return EMPTY;
            }), 
            // Execute the following code block when the observable completes or errors
            finalize(() => {
                // Set the 'loading' flag to false to indicate that data loading is complete
                this.loading = false;
            }), 
            // Automatically unsubscribe when the component is destroyed
            untilDestroyed(this))
                .subscribe();
        }
        catch (error) {
            this._errorHandler.handleError(error);
        }
    }
    /**
     * Opens a dialog for creating a new project module
     * @param createModule - Flag indicating if this is a new module creation (true) or edit (false)
     * @returns Promise that resolves when the dialog is closed
     */
    async createProjectModuleDialog() {
        try {
            await firstValueFrom(this._dialogService.open(ProjectModuleMutationComponent, {
                context: {
                    project: this.project,
                    createModule: true
                }
            }).onClose);
        }
        catch (error) {
            const message = error.message || 'Error while creating project module';
            this._toastrService.danger(message, 'Project Module Error');
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectMutationComponent, deps: [{ token: i1.Router }, { token: i2.UntypedFormBuilder }, { token: i3.Store }, { token: i3.ToastrService }, { token: i4.TranslateService }, { token: i3.ErrorHandlingService }, { token: i3.OrganizationTeamsService }, { token: i3.OrganizationContactService }, { token: i3.GithubService }, { token: i3.OrganizationProjectsService }, { token: i5.NbDialogService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ProjectMutationComponent, isStandalone: false, selector: "ga-project-mutation", inputs: { integration: "integration", project: "project", teams: "teams", organizationContacts: "organizationContacts" }, outputs: { canceled: "canceled", onSubmitted: "onSubmitted" }, viewQueries: [{ propertyName: "actionButtons", first: true, predicate: ["actionButtons"], descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<nb-card>\n\t<nb-card-body>\n\t\t<form [formGroup]=\"form\">\n\t\t\t<nb-tabset>\n\t\t\t\t<nb-tab [tabTitle]=\"'ORGANIZATIONS_PAGE.MAIN' | translate\" [tabIcon]=\"'person-outline'\">\n\t\t\t\t\t<div class=\"project-tab-container\">\n\t\t\t\t\t\t<div class=\"project-image-container\">\n\t\t\t\t\t\t\t<div class=\"project-image-photo\">\n\t\t\t\t\t\t\t\t<ngx-image-uploader\n\t\t\t\t\t\t\t\t\t(changeHoverState)=\"hoverState = $event\"\n\t\t\t\t\t\t\t\t\t(uploadedImageAsset)=\"updateImageAsset($event)\"\n\t\t\t\t\t\t\t\t\t(uploadImageAssetError)=\"handleImageUploadError($event)\"\n\t\t\t\t\t\t\t\t></ngx-image-uploader>\n\t\t\t\t\t\t\t\t@if (form && form.get('imageUrl').value) {\n\t\t\t\t\t\t\t\t<svg\n\t\t\t\t\t\t\t\t\txmlns=\"http://www.w3.org/2000/svg\"\n\t\t\t\t\t\t\t\t\txmlns:xlink=\"http://www.w3.org/1999/xlink\"\n\t\t\t\t\t\t\t\t\twidth=\"68\"\n\t\t\t\t\t\t\t\t\theight=\"68\"\n\t\t\t\t\t\t\t\t\tviewBox=\"0 0 68 68\"\n\t\t\t\t\t\t\t\t\t[style.opacity]=\"hoverState ? '1' : '0.3'\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<defs>\n\t\t\t\t\t\t\t\t\t\t<path\n\t\t\t\t\t\t\t\t\t\t\tid=\"a\"\n\t\t\t\t\t\t\t\t\t\t\td=\"M28.667 31.333a2 2 0 1 0-.002-4.001 2 2 0 0 0 .002 4.001m13.333 12H26.748l9.34-7.793c.328-.279.923-.277 1.244-.001l6.001 5.12V42c0 .736-.597 1.333-1.333 1.333M26 24.667h16c.736 0 1.333.597 1.333 1.333v11.152l-4.27-3.643c-1.32-1.122-3.386-1.122-4.694-.008l-9.702 8.096V26c0-.736.597-1.333 1.333-1.333M42 22H26c-2.205 0-4 1.795-4 4v16c0 2.205 1.795 4 4 4h16c2.205 0 4-1.795 4-4V26c0-2.205-1.795-4-4-4\"\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t</defs>\n\t\t\t\t\t\t\t\t\t<g fill=\"none\" fill-rule=\"evenodd\">\n\t\t\t\t\t\t\t\t\t\t<circle cx=\"34\" cy=\"34\" r=\"34\" fill=\"#0091FF\" opacity=\".3\" />\n\t\t\t\t\t\t\t\t\t\t<circle cx=\"34\" cy=\"34\" r=\"26\" fill=\"#0091FF\" opacity=\".9\" />\n\t\t\t\t\t\t\t\t\t\t<use fill=\"#FFF\" fill-rule=\"nonzero\" xlink:href=\"#a\" />\n\t\t\t\t\t\t\t\t\t</g>\n\t\t\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t<div class=\"image-overlay\" [style.opacity]=\"hoverState ? '0.2' : '0'\"></div>\n\n\t\t\t\t\t\t\t\t@if (form && form.get('imageUrl').value) {\n\t\t\t\t\t\t\t\t<img\n\t\t\t\t\t\t\t\t\t[src]=\"form.get('imageUrl').value\"\n\t\t\t\t\t\t\t\t\talt=\"Contact Photo\"\n\t\t\t\t\t\t\t\t\t(mouseenter)=\"hoverState = true\"\n\t\t\t\t\t\t\t\t\t(mouseleave)=\"hoverState = false\"\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t} @if (!form || !form.get('imageUrl').value) {\n\t\t\t\t\t\t\t\t<div class=\"image\">\n\t\t\t\t\t\t\t\t\t<span><i class=\"fas fa-image\"></i>Add or Drop Image</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"project-form-container\">\n\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t<div class=\"form-group col-6\">\n\t\t\t\t\t\t\t\t\t<label for=\"name\" class=\"label\">{{ 'FORM.PLACEHOLDERS.NAME' | translate }}</label>\n\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\t#name\n\t\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t\tformControlName=\"name\"\n\t\t\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.NAME' | translate\"\n\t\t\t\t\t\t\t\t\t\tid=\"name\"\n\t\t\t\t\t\t\t\t\t\t[status]=\"FormHelpers.isInvalidControl(form, 'name') ? 'danger' : 'basic'\"\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t@if (FormHelpers.isInvalidControl(form, 'name')) {\n\t\t\t\t\t\t\t\t\t<p class=\"caption status-danger\">\n\t\t\t\t\t\t\t\t\t\t{{ 'FORM.ERROR.PROJECT_NAME' | translate }}\n\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"form-group col-6\">\n\t\t\t\t\t\t\t\t\t<label for=\"code\" class=\"label\">{{ 'FORM.PLACEHOLDERS.CODE' | translate }}</label>\n\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\t#code\n\t\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t\tformControlName=\"code\"\n\t\t\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.CODE' | translate\"\n\t\t\t\t\t\t\t\t\t\tid=\"code\"\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t<div class=\"form-group col-6\">\n\t\t\t\t\t\t\t\t\t<label for=\"projectUrl\" class=\"label\">\n\t\t\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.PROJECT_URL' | translate }}\n\t\t\t\t\t\t\t\t\t</label>\n\n\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.PROJECT_URL' | translate }}\"\n\t\t\t\t\t\t\t\t\t\tid=\"projectUrl\"\n\t\t\t\t\t\t\t\t\t\tformControlName=\"projectUrl\"\n\t\t\t\t\t\t\t\t\t\t[status]=\"FormHelpers.isInvalidControl(form, 'projectUrl') ? 'danger' : 'basic'\"\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t@if (projectUrl.hasError('pattern')) {\n\t\t\t\t\t\t\t\t\t<div class=\"caption status-danger position-absolute\">\n\t\t\t\t\t\t\t\t\t\t{{ 'FORM.ERROR.PROJECT_URL' | translate }}\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"form-group col-6\">\n\t\t\t\t\t\t\t\t\t<ga-employee-multi-select\n\t\t\t\t\t\t\t\t\t\t[selectedEmployeeIds]=\"selectedManagerIds\"\n\t\t\t\t\t\t\t\t\t\t(selectedChange)=\"onManagersSelected($event)\"\n\t\t\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.LABELS.ADD_REMOVE_MANAGERS' | translate\"\n\t\t\t\t\t\t\t\t\t\t[label]=\"'FORM.LABELS.ADD_REMOVE_MANAGERS' | translate\"\n\t\t\t\t\t\t\t\t\t></ga-employee-multi-select>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t<div class=\"form-group col-6\">\n\t\t\t\t\t\t\t\t\t<label for=\"owner\" class=\"label\">{{ 'FORM.PLACEHOLDERS.OWNER' | translate }}</label>\n\t\t\t\t\t\t\t\t\t<nb-select\n\t\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.OWNER' | translate }}\"\n\t\t\t\t\t\t\t\t\t\tformControlName=\"owner\"\n\t\t\t\t\t\t\t\t\t\tid=\"owner\"\n\t\t\t\t\t\t\t\t\t\t(selectedChange)=\"changeProjectOwner($event)\"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t@for (owner of owners; track owner) {\n\t\t\t\t\t\t\t\t\t\t<nb-option [value]=\"owner\">{{ 'SM_TABLE.' + owner | translate }} </nb-option>\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t</nb-select>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"form-group col-6\">\n\t\t\t\t\t\t\t\t\t<label for=\"organizationContacts\" class=\"label\">\n\t\t\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.CLIENTS' | translate }}\n\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t<ng-select\n\t\t\t\t\t\t\t\t\t\t[addTag]=\"addNewOrganizationContact\"\n\t\t\t\t\t\t\t\t\t\t[items]=\"organizationContacts\"\n\t\t\t\t\t\t\t\t\t\tbindLabel=\"name\"\n\t\t\t\t\t\t\t\t\t\t[searchable]=\"true\"\n\t\t\t\t\t\t\t\t\t\t#organizationContact\n\t\t\t\t\t\t\t\t\t\tformControlName=\"organizationContact\"\n\t\t\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.CLIENTS' | translate\"\n\t\t\t\t\t\t\t\t\t\tappendTo=\"body\"\n\t\t\t\t\t\t\t\t\t></ng-select>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t<div class=\"form-group col-6\">\n\t\t\t\t\t\t\t\t\t<ga-employee-multi-select\n\t\t\t\t\t\t\t\t\t\t[selectedEmployeeIds]=\"selectedEmployeeIds\"\n\t\t\t\t\t\t\t\t\t\t(selectedChange)=\"onMembersSelected($event)\"\n\t\t\t\t\t\t\t\t\t></ga-employee-multi-select>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"form-group col-6\">\n\t\t\t\t\t\t\t\t\t<ga-team-selector\n\t\t\t\t\t\t\t\t\t\tformControlName=\"teams\"\n\t\t\t\t\t\t\t\t\t\t[skipGlobalChange]=\"true\"\n\t\t\t\t\t\t\t\t\t\t[multiple]=\"true\"\n\t\t\t\t\t\t\t\t\t\t[showAllOption]=\"false\"\n\t\t\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.ADD_REMOVE_TEAMS' | translate\"\n\t\t\t\t\t\t\t\t\t\t[defaultSelected]=\"false\"\n\t\t\t\t\t\t\t\t\t\t[label]=\"'FORM.PLACEHOLDERS.ADD_REMOVE_TEAMS' | translate\"\n\t\t\t\t\t\t\t\t\t\t(onChanged)=\"onTeamsSelected($event)\"\n\t\t\t\t\t\t\t\t\t></ga-team-selector>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t<div class=\"form-group col-6\">\n\t\t\t\t\t\t\t\t\t<div class=\"w-75\">\n\t\t\t\t\t\t\t\t\t\t<label for=\"start-date-project\" class=\"label\">{{\n\t\t\t\t\t\t\t\t\t\t\t'FORM.PLACEHOLDERS.START_DATE_PROJECT' | translate\n\t\t\t\t\t\t\t\t\t\t}}</label>\n\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\t[nbDatepicker]=\"startDate\"\n\t\t\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t\t\tformControlName=\"startDate\"\n\t\t\t\t\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.START_DATE_PROJECT' | translate }}\"\n\t\t\t\t\t\t\t\t\t\t\tid=\"start-date-project\"\n\t\t\t\t\t\t\t\t\t\t\t[status]=\"\n\t\t\t\t\t\t\t\t\t\t\t\tFormHelpers.isInvalidControl(form, 'startDate') ? 'danger' : 'basic'\n\t\t\t\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t<nb-datepicker #startDate></nb-datepicker>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"form-group col-6\">\n\t\t\t\t\t\t\t\t\t<div class=\"w-75\">\n\t\t\t\t\t\t\t\t\t\t<label for=\"end-date-project\" class=\"label\">{{\n\t\t\t\t\t\t\t\t\t\t\t'FORM.PLACEHOLDERS.END_DATE_PROJECT' | translate\n\t\t\t\t\t\t\t\t\t\t}}</label>\n\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\t[nbDatepicker]=\"endDate\"\n\t\t\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t\t\tformControlName=\"endDate\"\n\t\t\t\t\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.END_DATE_PROJECT' | translate }}\"\n\t\t\t\t\t\t\t\t\t\t\tid=\"end-date-project\"\n\t\t\t\t\t\t\t\t\t\t\t[status]=\"\n\t\t\t\t\t\t\t\t\t\t\t\tFormHelpers.isInvalidControl(form, 'endDate') ? 'danger' : 'basic'\n\t\t\t\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t<nb-datepicker #endDate></nb-datepicker>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</nb-tab>\n\t\t\t\t<nb-tab [tabTitle]=\"'ORGANIZATIONS_PAGE.DESCRIPTION' | translate\">\n\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t<div class=\"col-8\">\n\t\t\t\t\t\t\t<label\n\t\t\t\t\t\t\t\tfor=\"description\"\n\t\t\t\t\t\t\t\tclass=\"label\"\n\t\t\t\t\t\t\t\t[innerHtml]=\"'FORM.PLACEHOLDERS.DESCRIPTION' | translate\"\n\t\t\t\t\t\t\t></label>\n\t\t\t\t\t\t\t<ga-rich-text-editor\n\t\t\t\t\t\t\t\tformControlName=\"description\"\n\t\t\t\t\t\t\t\tpreset=\"standard\"\n\t\t\t\t\t\t\t\toutputFormat=\"html\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.DESCRIPTION' | translate\"\n\t\t\t\t\t\t\t></ga-rich-text-editor>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"row mt-3\">\n\t\t\t\t\t\t<div class=\"col-8\">\n\t\t\t\t\t\t\t<ga-tags-color-input\n\t\t\t\t\t\t\t\t[selectedTags]=\"form.get('tags').value\"\n\t\t\t\t\t\t\t\t(selectedTagsEvent)=\"selectedTagsEvent($event)\"\n\t\t\t\t\t\t\t\t[isOrgLevel]=\"true\"\n\t\t\t\t\t\t\t></ga-tags-color-input>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</nb-tab>\n\t\t\t\t<nb-tab [tabTitle]=\"'ORGANIZATIONS_PAGE.BILLING' | translate\">\n\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t<div class=\"form-group col-4\">\n\t\t\t\t\t\t\t<label for=\"billing\" class=\"label\">{{ 'FORM.PLACEHOLDERS.BILLING' | translate }}</label>\n\t\t\t\t\t\t\t<nb-select\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.BILLING' | translate }}\"\n\t\t\t\t\t\t\t\tformControlName=\"billing\"\n\t\t\t\t\t\t\t\tid=\"billing\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t@for (billing of billings; track billing) {\n\t\t\t\t\t\t\t\t<nb-option [value]=\"billing\">\n\t\t\t\t\t\t\t\t\t{{ 'SM_TABLE.' + billing | translate }}\n\t\t\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</nb-select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t\t<ga-currency formControlName=\"currency\" (optionChange)=\"currencyChanged($event)\">\n\t\t\t\t\t\t\t</ga-currency>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</nb-tab>\n\t\t\t\t<nb-tab [tabTitle]=\"'ORGANIZATIONS_PAGE.BUDGET' | translate\">\n\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t<div class=\"form-group col-4\">\n\t\t\t\t\t\t\t<label class=\"label\">{{ 'FORM.PLACEHOLDERS.BUDGET_TYPE' | translate }}</label>\n\t\t\t\t\t\t\t<nb-select\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.BUDGET_TYPE' | translate\"\n\t\t\t\t\t\t\t\tformControlName=\"budgetType\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t@for (budgetType of OrganizationProjectBudgetTypeEnum | keyvalue; track budgetType) {\n\t\t\t\t\t\t\t\t<nb-option [value]=\"budgetType.value\">\n\t\t\t\t\t\t\t\t\t{{ budgetType.value | titlecase }}\n\t\t\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</nb-select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t@if (form.controls.budgetType.value === OrganizationProjectBudgetTypeEnum.HOURS) {\n\t\t\t\t\t\t<div class=\"form-group col-4\">\n\t\t\t\t\t\t\t<label class=\"label\">{{ 'FORM.PLACEHOLDERS.HOURS' | translate }}</label>\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\ttype=\"number\"\n\t\t\t\t\t\t\t\t[min]=\"0\"\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\tformControlName=\"budget\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.HOURS' | translate\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t} @if (form.controls.budgetType.value === OrganizationProjectBudgetTypeEnum.COST) {\n\t\t\t\t\t\t<div class=\"form-group col-4\">\n\t\t\t\t\t\t\t<label class=\"label\">{{ 'FORM.PLACEHOLDERS.COST' | translate }}</label>\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\ttype=\"number\"\n\t\t\t\t\t\t\t\t[min]=\"0\"\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\tformControlName=\"budget\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.COST' | translate\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t</nb-tab>\n\t\t\t\t<nb-tab [tabTitle]=\"'ORGANIZATIONS_PAGE.OPEN_SOURCE' | translate\">\n\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t<div class=\"col-4 d-flex align-items-center\">\n\t\t\t\t\t\t\t<nb-toggle\n\t\t\t\t\t\t\t\tclass=\"project-toggle\"\n\t\t\t\t\t\t\t\tlabelPosition=\"start\"\n\t\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\t\t[checked]=\"form.get('openSource').value\"\n\t\t\t\t\t\t\t\t(checkedChange)=\"toggleOpenSource($event)\"\n\t\t\t\t\t\t\t\tformControlName=\"openSource\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.IS_PROJECT_OPEN_SOURCE' | translate }}\n\t\t\t\t\t\t\t</nb-toggle>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t@if (form.get('openSource').value) {\n\t\t\t\t\t\t<div class=\"form-group col-4\">\n\t\t\t\t\t\t\t<label for=\"openSourceProjectUrl\" class=\"label\">\n\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.OPEN_SOURCE_PROJECT_URL' | translate }}\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\tplaceholder=\"https://github.com/...\"\n\t\t\t\t\t\t\t\tid=\"openSourceProjectUrl\"\n\t\t\t\t\t\t\t\tformControlName=\"openSourceProjectUrl\"\n\t\t\t\t\t\t\t\t[status]=\"\n\t\t\t\t\t\t\t\t\tFormHelpers.isInvalidControl(form, 'openSourceProjectUrl') ? 'danger' : 'basic'\n\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t@if (openSourceProjectUrl.hasError('pattern')) {\n\t\t\t\t\t\t\t<div class=\"caption status-danger position-absolute\">\n\t\t\t\t\t\t\t\t{{ 'FORM.ERROR.OPEN_SOURCE_PROJECT_URL' | translate }}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t</nb-tab>\n\t\t\t\t@if (form.get('taskListType').value == TaskListTypeEnum.SPRINT && project) {\n\t\t\t\t<nb-tab [tabTitle]=\"'ORGANIZATIONS_PAGE.SPRINTS' | translate\">\n\t\t\t\t\t<ngx-tasks-sprint-settings-view [project]=\"project\"></ngx-tasks-sprint-settings-view>\n\t\t\t\t</nb-tab>\n\t\t\t\t}\n\t\t\t\t<nb-tab [tabTitle]=\"'ORGANIZATIONS_PAGE.SETTINGS' | translate\" [style.minHeight]=\"'330px'\">\n\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t<div class=\"form-group col-3\">\n\t\t\t\t\t\t\t<label for=\"color\" class=\"label\">{{ 'FORM.PLACEHOLDERS.COLOR' | translate }}</label>\n\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\tformControlName=\"color\"\n\t\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.COLOR' | translate }}\"\n\t\t\t\t\t\t\t\tid=\"color\"\n\t\t\t\t\t\t\t\t[colorPicker]=\"form.get('color').value\"\n\t\t\t\t\t\t\t\t[style.background-color]=\"form.get('color').value + ' !important'\"\n\t\t\t\t\t\t\t\t[style.color]=\"'#fff'\"\n\t\t\t\t\t\t\t\tautocomplete-off\n\t\t\t\t\t\t\t\t[value]=\"form.get('color').value\"\n\t\t\t\t\t\t\t\t(colorPickerChange)=\"form.get('color').setValue($event)\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"form-group col-3\">\n\t\t\t\t\t\t\t<label for=\"owner\" class=\"label\">{{\n\t\t\t\t\t\t\t\t'FORM.PLACEHOLDERS.TASK_VIEW_MODE' | translate\n\t\t\t\t\t\t\t}}</label>\n\t\t\t\t\t\t\t<nb-select\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.TASK_VIEW_MODE' | translate }}\"\n\t\t\t\t\t\t\t\tformControlName=\"taskListType\"\n\t\t\t\t\t\t\t\tid=\"taskListType\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t@for (mode of taskViewModeTypes; track mode) {\n\t\t\t\t\t\t\t\t<nb-option [value]=\"mode\">{{ mode }} </nb-option>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</nb-select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t<div class=\"col-2 d-flex align-items-center\">\n\t\t\t\t\t\t\t<nb-toggle\n\t\t\t\t\t\t\t\t#public\n\t\t\t\t\t\t\t\tclass=\"project-toggle\"\n\t\t\t\t\t\t\t\tlabelPosition=\"start\"\n\t\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\t\t[checked]=\"form.get('public').value\"\n\t\t\t\t\t\t\t\tformControlName=\"public\"\n\t\t\t\t\t\t\t\t(checkedChange)=\"togglePublic($event)\"\n\t\t\t\t\t\t\t\t>{{ 'FORM.PLACEHOLDERS.SWITCH_PROJECT_STATE' | translate }}</nb-toggle\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-2 d-flex align-items-center\">\n\t\t\t\t\t\t\t<nb-toggle\n\t\t\t\t\t\t\t\t#billable\n\t\t\t\t\t\t\t\tclass=\"project-toggle\"\n\t\t\t\t\t\t\t\tlabelPosition=\"start\"\n\t\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\t\t[checked]=\"form.get('billable').value\"\n\t\t\t\t\t\t\t\tformControlName=\"billable\"\n\t\t\t\t\t\t\t\t(checkedChange)=\"toggleBillable($event)\"\n\t\t\t\t\t\t\t\t>{{ 'FORM.PLACEHOLDERS.BILLABLE' | translate }}</nb-toggle\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</nb-tab>\n\t\t\t\t@if (integration) {\n\t\t\t\t<nb-tab [tabTitle]=\"'ORGANIZATIONS_PAGE.INTEGRATIONS' | translate\">\n\t\t\t\t\t<div class=\"setting-block block\">\n\t\t\t\t\t\t<div class=\"setting-row p-2\">\n\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t<div class=\"col-8\">\n\t\t\t\t\t\t\t\t\t<div class=\"h-12 w-12 flex-shrink-0\">\n\t\t\t\t\t\t\t\t\t\t<img\n\t\t\t\t\t\t\t\t\t\t\twidth=\"70px\"\n\t\t\t\t\t\t\t\t\t\t\theight=\"70px\"\n\t\t\t\t\t\t\t\t\t\t\t[src]=\"integration.integration.fullImgUrl\"\n\t\t\t\t\t\t\t\t\t\t\t[alt]=\"[integration.integration.title]\"\n\t\t\t\t\t\t\t\t\t\t\t[title]=\"integration.integration.name | replace : '_' : ' '\"\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t\t\t\t<div class=\"h-12 w-12 flex-shrink-0\">\n\t\t\t\t\t\t\t\t\t\t<ngx-github-repository-selector\n\t\t\t\t\t\t\t\t\t\t\t[sourceId]=\"project?.repository?.repositoryId\"\n\t\t\t\t\t\t\t\t\t\t\t[integration]=\"integration\"\n\t\t\t\t\t\t\t\t\t\t\t(onChanged)=\"selectRepository($event)\"\n\t\t\t\t\t\t\t\t\t\t></ngx-github-repository-selector>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</nb-tab>\n\t\t\t\t} @if (integration) {\n\t\t\t\t<nb-tab [tabTitle]=\"'ORGANIZATIONS_PAGE.AUTOMATION' | translate\">\n\t\t\t\t\t<form [formGroup]=\"projectSettingForm\">\n\t\t\t\t\t\t<div class=\"fields\">\n\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t\t\t<label for=\"isTasksAutoSync\" class=\"label\">\n\t\t\t\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.AUTO_SYNC_TASKS' | translate }}\n\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t<nb-toggle\n\t\t\t\t\t\t\t\t\t\t\tid=\"isTasksAutoSync\"\n\t\t\t\t\t\t\t\t\t\t\tclass=\"d-block\"\n\t\t\t\t\t\t\t\t\t\t\tformControlName=\"isTasksAutoSync\"\n\t\t\t\t\t\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t\t\t\t\t\tlabelPosition=\"start\"\n\t\t\t\t\t\t\t\t\t\t\t(change)=\"updateProjectAutoSyncSetting()\"\n\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t{{ 'FORM.PLACEHOLDERS.AUTO_SYNC_TASKS' | translate }}\n\t\t\t\t\t\t\t\t\t\t</nb-toggle>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t\t\t<label for=\"isTasksAutoSyncOnLabel\" class=\"label\">\n\t\t\t\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.AUTO_SYNC_TASKS_BASED_ON_LABEL' | translate }}\n\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t<nb-toggle\n\t\t\t\t\t\t\t\t\t\t\tid=\"isTasksAutoSyncOnLabel\"\n\t\t\t\t\t\t\t\t\t\t\tclass=\"d-block\"\n\t\t\t\t\t\t\t\t\t\t\tformControlName=\"isTasksAutoSyncOnLabel\"\n\t\t\t\t\t\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t\t\t\t\t\tlabelPosition=\"start\"\n\t\t\t\t\t\t\t\t\t\t\t(change)=\"updateProjectAutoSyncSetting()\"\n\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t{{ 'FORM.PLACEHOLDERS.AUTO_SYNC_TASKS_BASED_ON_LABEL' | translate }}\n\t\t\t\t\t\t\t\t\t\t</nb-toggle>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t\t\t<label for=\"syncTag\" class=\"label\">\n\t\t\t\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.AUTO_SYNC_TAG' | translate }}\n\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\tid=\"syncTag\"\n\t\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t\t\tformControlName=\"syncTag\"\n\t\t\t\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.AUTO_SYNC_TAG' | translate\"\n\t\t\t\t\t\t\t\t\t\t\t(change)=\"changeSyncTag($event)\"\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</form>\n\t\t\t\t</nb-tab>\n\t\t\t\t} @if (project?.id) {\n\t\t\t\t<nb-tab [tabTitle]=\"'TASKS_PAGE.MODULE' | translate\">\n\t\t\t\t\t<ngx-project-module-table [projectId]=\"project.id\"></ngx-project-module-table>\n\t\t\t\t</nb-tab>\n\t\t\t\t}\n\t\t\t</nb-tabset>\n\t\t\t<ng-container [ngTemplateOutlet]=\"actionButtons\"></ng-container>\n\t\t</form>\n\t</nb-card-body>\n</nb-card>\n\n<ng-template #actionButtons>\n\t<div class=\"form-group action-buttons\">\n\t\t<button class=\"mr-3\" (click)=\"navigateToCancelProject()\" nbButton status=\"basic\" outline>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button class=\"mr-3\" nbButton status=\"success\" [disabled]=\"form.invalid\" (click)=\"onSubmit()\">\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t\t@if (project?.id) {\n\t\t<button class=\"mr-3\" nbButton status=\"success\" (click)=\"createProjectModuleDialog()\">\n\t\t\t{{ 'BUTTONS.ADD_MODULE' | translate }}\n\t\t</button>\n\t\t} @if (project) { @if (form.get('taskListType').value === TaskListTypeEnum.SPRINT) {\n\t\t<button nbButton class=\"float-right\" status=\"success\" (click)=\"openTasksSettings()\">\n\t\t\t{{ 'BUTTONS.MANAGE_SPRINTS' | translate }}\n\t\t</button>\n\t\t} }\n\t</div>\n</ng-template>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host nb-card{background-color:var(--gauzy-card-1)}.project-toggle{margin-top:20px}.action-buttons{display:flex;justify-content:flex-start}[dir=rtl] :host ::ng-deep nb-card{margin:-16px -18px -16px -8px}[dir=ltr] :host ::ng-deep nb-card{margin:-16px -8px -16px -18px}:host ::ng-deep nb-card nb-card-body{padding:0}:host ::ng-deep nb-card nb-card-body nb-tab.content-active,:host ::ng-deep nb-card nb-card-body .action-buttons{background-color:var(--gauzy-card-2, rgba(126, 126, 143, .08));margin:0}:host ::ng-deep nb-card nb-card-body nb-tab.content-active{height:calc(100vh - 22.5rem)}:host ::ng-deep nb-card nb-card-body .action-buttons{padding:1rem 2rem;border-radius:0 0 var(--border-radius) var(--border-radius)}:host ::ng-deep nb-card nb-card-body input,:host ::ng-deep nb-card nb-card-body nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep nb-card nb-card-body .ng-select .ng-select-container{background-color:var(--background-basic-color-1)!important}:host ::ng-deep nb-card nb-card-body .ng-select .ng-select-container input{background-color:unset!important}:host ::ng-deep nb-toggle div.checked+span.text{color:var(--text-primary-color)}:host ::ng-deep nb-toggle div+span.text{color:var(--gauzy-text-color-2, var(--text-hint-color))}:host ::ng-deep label{font-size:14px;font-weight:600;line-height:11px;letter-spacing:0em;text-align:left;color:var(--gauzy-text-color-2, var(--text-hint-color))}.project-tab-container{display:flex;gap:1rem}.project-tab-container .project-form-container{width:65%}.project-image-container{transition:transform .15s ease-in-out;display:flex;flex-direction:column;position:relative;margin-right:3rem}.project-image-container .project-image-photo{width:fit-content;height:294px;position:relative}.project-image-container .project-image-photo .image-overlay{pointer-events:none;background:#000;position:absolute;height:100%;width:100%;border-radius:var(--border-radius)}.project-image-container .project-image-photo img,.project-image-container .project-image-photo .image{width:299px;height:294px;object-fit:cover;border-radius:var(--border-radius)}.project-image-container .project-image-photo .image{background-color:#7e7e8f1a}.project-image-container .project-image-photo .image i{margin:5px}.project-image-container .project-image-photo .image>span{color:var(--gauzy-text-color-2, rgb(126, 126, 143));z-index:2;transition:opacity .2s ease-in;position:absolute;top:calc(50% - 8px);left:calc(50% - 70.5px)}.project-image-container .project-image-photo svg{z-index:2;transition:opacity .2s ease-in;opacity:.3;position:absolute;top:calc(50% - 34px);left:calc(50% - 34px)}.project-image-container .project-image-photo svg g circle{fill:var(--text-primary-color)}:host ::ng-deep ngx-image-uploader input{height:100%!important}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-card-1, var(--card-background-color))!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-card-1, var(--card-background-color))!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:transparent}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i6.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i2.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i2.MinValidator, selector: "input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]", inputs: ["min"] }, { kind: "directive", type: i2.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i2.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i5.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i5.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i5.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "directive", type: i5.NbDatepickerDirective, selector: "input[nbDatepicker]", inputs: ["nbDatepicker"] }, { kind: "component", type: i5.NbDatepickerComponent, selector: "nb-datepicker", inputs: ["date"], outputs: ["dateChange"] }, { kind: "directive", type: i5.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i5.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i5.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "component", type: i5.NbTabsetComponent, selector: "nb-tabset", inputs: ["fullWidth", "routeParam"], outputs: ["changeTab"] }, { kind: "component", type: i5.NbTabComponent, selector: "nb-tab", inputs: ["tabTitle", "tabId", "badgeDot", "tabIcon", "disabled", "responsive", "route", "active", "lazyLoad", "badgeText", "badgeStatus", "badgePosition"] }, { kind: "component", type: i5.NbToggleComponent, selector: "nb-toggle", inputs: ["checked", "disabled", "status", "labelPosition"], outputs: ["checkedChange"] }, { kind: "component", type: i7.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "component", type: i8.RichTextEditorComponent, selector: "ga-rich-text-editor", inputs: ["preset", "placeholder", "outputFormat", "minHeight", "maxHeight", "characterLimit", "showCharacterCount", "editorClass", "disabled"], outputs: ["created", "changed", "focused", "blurred"] }, { kind: "directive", type: i9.ColorPickerDirective, selector: "[colorPicker]", inputs: ["colorPicker", "cpWidth", "cpHeight", "cpToggle", "cpDisabled", "cpIgnoredElements", "cpFallbackColor", "cpColorMode", "cpCmykEnabled", "cpOutputFormat", "cpAlphaChannel", "cpDisableInput", "cpDialogDisplay", "cpSaveClickOutside", "cpCloseClickOutside", "cpUseRootViewContainer", "cpPosition", "cpPositionOffset", "cpPositionRelativeToArrow", "cpOKButton", "cpOKButtonText", "cpOKButtonClass", "cpCancelButton", "cpCancelButtonText", "cpCancelButtonClass", "cpEyeDropper", "cpPresetLabel", "cpPresetColors", "cpPresetColorsClass", "cpMaxPresetColorsLength", "cpPresetEmptyMessage", "cpPresetEmptyMessageClass", "cpAddColorButton", "cpAddColorButtonText", "cpAddColorButtonClass", "cpRemoveColorButtonClass", "cpArrowPosition", "cpExtraTemplate"], outputs: ["cpInputChange", "cpToggleChange", "cpSliderChange", "cpSliderDragEnd", "cpSliderDragStart", "colorPickerOpen", "colorPickerClose", "colorPickerCancel", "colorPickerSelect", "colorPickerChange", "cpCmykColorChange", "cpPresetColorsChange"], exportAs: ["ngxColorPicker"] }, { kind: "directive", type: i10.AutocompleteOffDirective, selector: "[autocomplete-off]" }, { kind: "directive", type: i11.ImgDirective, selector: "img", inputs: ["type", "skipDefaultImage", "enableFadeIn"] }, { kind: "component", type: i12.CurrencyComponent, selector: "ga-currency", inputs: ["formControl", "currency", "placeholder", "label"], outputs: ["optionChange"] }, { kind: "component", type: i13.EmployeeSelectComponent, selector: "ga-employee-multi-select", inputs: ["reset", "allEmployees", "selectedEmployeeIds", "multiple", "label", "disabled", "placeholder"], outputs: ["selectedChange", "onLoadEmployees"] }, { kind: "component", type: i14.ImageUploaderComponent, selector: "ngx-image-uploader", inputs: ["styles", "folder"], outputs: ["changeHoverState", "uploadedImageAsset", "uploadImageAssetError"] }, { kind: "component", type: i15.TagsColorInputComponent, selector: "ga-tags-color-input", inputs: ["selectedTags", "isOrgLevel", "isTenantLevel", "multiple", "label", "addTag"], outputs: ["selectedTagsEvent"] }, { kind: "component", type: i16.TeamSelectorComponent, selector: "ga-team-selector", inputs: ["shortened", "dropdownClass", "disabled", "multiple", "label", "placeholder", "skipGlobalChange", "defaultSelected", "showAllOption", "organizationTeamId", "employeeId", "projectId"], outputs: ["onChanged"] }, { kind: "component", type: i17.RepositorySelectorComponent, selector: "ngx-github-repository-selector", inputs: ["placeholder", "selected", "integration", "sourceId"], outputs: ["onChanged", "afterLoad"] }, { kind: "component", type: i18.ProjectModuleTableComponent, selector: "ngx-project-module-table", inputs: ["projectId"] }, { kind: "pipe", type: i6.TitleCasePipe, name: "titlecase" }, { kind: "pipe", type: i6.KeyValuePipe, name: "keyvalue" }, { kind: "pipe", type: i19.ReplacePipe, name: "replace" }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
};
ProjectMutationComponent = ProjectMutationComponent_1 = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Router,
        UntypedFormBuilder,
        Store,
        ToastrService,
        TranslateService,
        ErrorHandlingService,
        OrganizationTeamsService,
        OrganizationContactService,
        GithubService,
        OrganizationProjectsService,
        NbDialogService])
], ProjectMutationComponent);
export { ProjectMutationComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectMutationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-project-mutation', standalone: false, template: "<nb-card>\n\t<nb-card-body>\n\t\t<form [formGroup]=\"form\">\n\t\t\t<nb-tabset>\n\t\t\t\t<nb-tab [tabTitle]=\"'ORGANIZATIONS_PAGE.MAIN' | translate\" [tabIcon]=\"'person-outline'\">\n\t\t\t\t\t<div class=\"project-tab-container\">\n\t\t\t\t\t\t<div class=\"project-image-container\">\n\t\t\t\t\t\t\t<div class=\"project-image-photo\">\n\t\t\t\t\t\t\t\t<ngx-image-uploader\n\t\t\t\t\t\t\t\t\t(changeHoverState)=\"hoverState = $event\"\n\t\t\t\t\t\t\t\t\t(uploadedImageAsset)=\"updateImageAsset($event)\"\n\t\t\t\t\t\t\t\t\t(uploadImageAssetError)=\"handleImageUploadError($event)\"\n\t\t\t\t\t\t\t\t></ngx-image-uploader>\n\t\t\t\t\t\t\t\t@if (form && form.get('imageUrl').value) {\n\t\t\t\t\t\t\t\t<svg\n\t\t\t\t\t\t\t\t\txmlns=\"http://www.w3.org/2000/svg\"\n\t\t\t\t\t\t\t\t\txmlns:xlink=\"http://www.w3.org/1999/xlink\"\n\t\t\t\t\t\t\t\t\twidth=\"68\"\n\t\t\t\t\t\t\t\t\theight=\"68\"\n\t\t\t\t\t\t\t\t\tviewBox=\"0 0 68 68\"\n\t\t\t\t\t\t\t\t\t[style.opacity]=\"hoverState ? '1' : '0.3'\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<defs>\n\t\t\t\t\t\t\t\t\t\t<path\n\t\t\t\t\t\t\t\t\t\t\tid=\"a\"\n\t\t\t\t\t\t\t\t\t\t\td=\"M28.667 31.333a2 2 0 1 0-.002-4.001 2 2 0 0 0 .002 4.001m13.333 12H26.748l9.34-7.793c.328-.279.923-.277 1.244-.001l6.001 5.12V42c0 .736-.597 1.333-1.333 1.333M26 24.667h16c.736 0 1.333.597 1.333 1.333v11.152l-4.27-3.643c-1.32-1.122-3.386-1.122-4.694-.008l-9.702 8.096V26c0-.736.597-1.333 1.333-1.333M42 22H26c-2.205 0-4 1.795-4 4v16c0 2.205 1.795 4 4 4h16c2.205 0 4-1.795 4-4V26c0-2.205-1.795-4-4-4\"\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t</defs>\n\t\t\t\t\t\t\t\t\t<g fill=\"none\" fill-rule=\"evenodd\">\n\t\t\t\t\t\t\t\t\t\t<circle cx=\"34\" cy=\"34\" r=\"34\" fill=\"#0091FF\" opacity=\".3\" />\n\t\t\t\t\t\t\t\t\t\t<circle cx=\"34\" cy=\"34\" r=\"26\" fill=\"#0091FF\" opacity=\".9\" />\n\t\t\t\t\t\t\t\t\t\t<use fill=\"#FFF\" fill-rule=\"nonzero\" xlink:href=\"#a\" />\n\t\t\t\t\t\t\t\t\t</g>\n\t\t\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t<div class=\"image-overlay\" [style.opacity]=\"hoverState ? '0.2' : '0'\"></div>\n\n\t\t\t\t\t\t\t\t@if (form && form.get('imageUrl').value) {\n\t\t\t\t\t\t\t\t<img\n\t\t\t\t\t\t\t\t\t[src]=\"form.get('imageUrl').value\"\n\t\t\t\t\t\t\t\t\talt=\"Contact Photo\"\n\t\t\t\t\t\t\t\t\t(mouseenter)=\"hoverState = true\"\n\t\t\t\t\t\t\t\t\t(mouseleave)=\"hoverState = false\"\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t} @if (!form || !form.get('imageUrl').value) {\n\t\t\t\t\t\t\t\t<div class=\"image\">\n\t\t\t\t\t\t\t\t\t<span><i class=\"fas fa-image\"></i>Add or Drop Image</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"project-form-container\">\n\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t<div class=\"form-group col-6\">\n\t\t\t\t\t\t\t\t\t<label for=\"name\" class=\"label\">{{ 'FORM.PLACEHOLDERS.NAME' | translate }}</label>\n\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\t#name\n\t\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t\tformControlName=\"name\"\n\t\t\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.NAME' | translate\"\n\t\t\t\t\t\t\t\t\t\tid=\"name\"\n\t\t\t\t\t\t\t\t\t\t[status]=\"FormHelpers.isInvalidControl(form, 'name') ? 'danger' : 'basic'\"\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t@if (FormHelpers.isInvalidControl(form, 'name')) {\n\t\t\t\t\t\t\t\t\t<p class=\"caption status-danger\">\n\t\t\t\t\t\t\t\t\t\t{{ 'FORM.ERROR.PROJECT_NAME' | translate }}\n\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"form-group col-6\">\n\t\t\t\t\t\t\t\t\t<label for=\"code\" class=\"label\">{{ 'FORM.PLACEHOLDERS.CODE' | translate }}</label>\n\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\t#code\n\t\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t\tformControlName=\"code\"\n\t\t\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.CODE' | translate\"\n\t\t\t\t\t\t\t\t\t\tid=\"code\"\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t<div class=\"form-group col-6\">\n\t\t\t\t\t\t\t\t\t<label for=\"projectUrl\" class=\"label\">\n\t\t\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.PROJECT_URL' | translate }}\n\t\t\t\t\t\t\t\t\t</label>\n\n\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.PROJECT_URL' | translate }}\"\n\t\t\t\t\t\t\t\t\t\tid=\"projectUrl\"\n\t\t\t\t\t\t\t\t\t\tformControlName=\"projectUrl\"\n\t\t\t\t\t\t\t\t\t\t[status]=\"FormHelpers.isInvalidControl(form, 'projectUrl') ? 'danger' : 'basic'\"\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t@if (projectUrl.hasError('pattern')) {\n\t\t\t\t\t\t\t\t\t<div class=\"caption status-danger position-absolute\">\n\t\t\t\t\t\t\t\t\t\t{{ 'FORM.ERROR.PROJECT_URL' | translate }}\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"form-group col-6\">\n\t\t\t\t\t\t\t\t\t<ga-employee-multi-select\n\t\t\t\t\t\t\t\t\t\t[selectedEmployeeIds]=\"selectedManagerIds\"\n\t\t\t\t\t\t\t\t\t\t(selectedChange)=\"onManagersSelected($event)\"\n\t\t\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.LABELS.ADD_REMOVE_MANAGERS' | translate\"\n\t\t\t\t\t\t\t\t\t\t[label]=\"'FORM.LABELS.ADD_REMOVE_MANAGERS' | translate\"\n\t\t\t\t\t\t\t\t\t></ga-employee-multi-select>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t<div class=\"form-group col-6\">\n\t\t\t\t\t\t\t\t\t<label for=\"owner\" class=\"label\">{{ 'FORM.PLACEHOLDERS.OWNER' | translate }}</label>\n\t\t\t\t\t\t\t\t\t<nb-select\n\t\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.OWNER' | translate }}\"\n\t\t\t\t\t\t\t\t\t\tformControlName=\"owner\"\n\t\t\t\t\t\t\t\t\t\tid=\"owner\"\n\t\t\t\t\t\t\t\t\t\t(selectedChange)=\"changeProjectOwner($event)\"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t@for (owner of owners; track owner) {\n\t\t\t\t\t\t\t\t\t\t<nb-option [value]=\"owner\">{{ 'SM_TABLE.' + owner | translate }} </nb-option>\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t</nb-select>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"form-group col-6\">\n\t\t\t\t\t\t\t\t\t<label for=\"organizationContacts\" class=\"label\">\n\t\t\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.CLIENTS' | translate }}\n\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t<ng-select\n\t\t\t\t\t\t\t\t\t\t[addTag]=\"addNewOrganizationContact\"\n\t\t\t\t\t\t\t\t\t\t[items]=\"organizationContacts\"\n\t\t\t\t\t\t\t\t\t\tbindLabel=\"name\"\n\t\t\t\t\t\t\t\t\t\t[searchable]=\"true\"\n\t\t\t\t\t\t\t\t\t\t#organizationContact\n\t\t\t\t\t\t\t\t\t\tformControlName=\"organizationContact\"\n\t\t\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.CLIENTS' | translate\"\n\t\t\t\t\t\t\t\t\t\tappendTo=\"body\"\n\t\t\t\t\t\t\t\t\t></ng-select>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t<div class=\"form-group col-6\">\n\t\t\t\t\t\t\t\t\t<ga-employee-multi-select\n\t\t\t\t\t\t\t\t\t\t[selectedEmployeeIds]=\"selectedEmployeeIds\"\n\t\t\t\t\t\t\t\t\t\t(selectedChange)=\"onMembersSelected($event)\"\n\t\t\t\t\t\t\t\t\t></ga-employee-multi-select>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"form-group col-6\">\n\t\t\t\t\t\t\t\t\t<ga-team-selector\n\t\t\t\t\t\t\t\t\t\tformControlName=\"teams\"\n\t\t\t\t\t\t\t\t\t\t[skipGlobalChange]=\"true\"\n\t\t\t\t\t\t\t\t\t\t[multiple]=\"true\"\n\t\t\t\t\t\t\t\t\t\t[showAllOption]=\"false\"\n\t\t\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.ADD_REMOVE_TEAMS' | translate\"\n\t\t\t\t\t\t\t\t\t\t[defaultSelected]=\"false\"\n\t\t\t\t\t\t\t\t\t\t[label]=\"'FORM.PLACEHOLDERS.ADD_REMOVE_TEAMS' | translate\"\n\t\t\t\t\t\t\t\t\t\t(onChanged)=\"onTeamsSelected($event)\"\n\t\t\t\t\t\t\t\t\t></ga-team-selector>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t<div class=\"form-group col-6\">\n\t\t\t\t\t\t\t\t\t<div class=\"w-75\">\n\t\t\t\t\t\t\t\t\t\t<label for=\"start-date-project\" class=\"label\">{{\n\t\t\t\t\t\t\t\t\t\t\t'FORM.PLACEHOLDERS.START_DATE_PROJECT' | translate\n\t\t\t\t\t\t\t\t\t\t}}</label>\n\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\t[nbDatepicker]=\"startDate\"\n\t\t\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t\t\tformControlName=\"startDate\"\n\t\t\t\t\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.START_DATE_PROJECT' | translate }}\"\n\t\t\t\t\t\t\t\t\t\t\tid=\"start-date-project\"\n\t\t\t\t\t\t\t\t\t\t\t[status]=\"\n\t\t\t\t\t\t\t\t\t\t\t\tFormHelpers.isInvalidControl(form, 'startDate') ? 'danger' : 'basic'\n\t\t\t\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t<nb-datepicker #startDate></nb-datepicker>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"form-group col-6\">\n\t\t\t\t\t\t\t\t\t<div class=\"w-75\">\n\t\t\t\t\t\t\t\t\t\t<label for=\"end-date-project\" class=\"label\">{{\n\t\t\t\t\t\t\t\t\t\t\t'FORM.PLACEHOLDERS.END_DATE_PROJECT' | translate\n\t\t\t\t\t\t\t\t\t\t}}</label>\n\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\t[nbDatepicker]=\"endDate\"\n\t\t\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t\t\tformControlName=\"endDate\"\n\t\t\t\t\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.END_DATE_PROJECT' | translate }}\"\n\t\t\t\t\t\t\t\t\t\t\tid=\"end-date-project\"\n\t\t\t\t\t\t\t\t\t\t\t[status]=\"\n\t\t\t\t\t\t\t\t\t\t\t\tFormHelpers.isInvalidControl(form, 'endDate') ? 'danger' : 'basic'\n\t\t\t\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t<nb-datepicker #endDate></nb-datepicker>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</nb-tab>\n\t\t\t\t<nb-tab [tabTitle]=\"'ORGANIZATIONS_PAGE.DESCRIPTION' | translate\">\n\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t<div class=\"col-8\">\n\t\t\t\t\t\t\t<label\n\t\t\t\t\t\t\t\tfor=\"description\"\n\t\t\t\t\t\t\t\tclass=\"label\"\n\t\t\t\t\t\t\t\t[innerHtml]=\"'FORM.PLACEHOLDERS.DESCRIPTION' | translate\"\n\t\t\t\t\t\t\t></label>\n\t\t\t\t\t\t\t<ga-rich-text-editor\n\t\t\t\t\t\t\t\tformControlName=\"description\"\n\t\t\t\t\t\t\t\tpreset=\"standard\"\n\t\t\t\t\t\t\t\toutputFormat=\"html\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.DESCRIPTION' | translate\"\n\t\t\t\t\t\t\t></ga-rich-text-editor>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"row mt-3\">\n\t\t\t\t\t\t<div class=\"col-8\">\n\t\t\t\t\t\t\t<ga-tags-color-input\n\t\t\t\t\t\t\t\t[selectedTags]=\"form.get('tags').value\"\n\t\t\t\t\t\t\t\t(selectedTagsEvent)=\"selectedTagsEvent($event)\"\n\t\t\t\t\t\t\t\t[isOrgLevel]=\"true\"\n\t\t\t\t\t\t\t></ga-tags-color-input>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</nb-tab>\n\t\t\t\t<nb-tab [tabTitle]=\"'ORGANIZATIONS_PAGE.BILLING' | translate\">\n\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t<div class=\"form-group col-4\">\n\t\t\t\t\t\t\t<label for=\"billing\" class=\"label\">{{ 'FORM.PLACEHOLDERS.BILLING' | translate }}</label>\n\t\t\t\t\t\t\t<nb-select\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.BILLING' | translate }}\"\n\t\t\t\t\t\t\t\tformControlName=\"billing\"\n\t\t\t\t\t\t\t\tid=\"billing\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t@for (billing of billings; track billing) {\n\t\t\t\t\t\t\t\t<nb-option [value]=\"billing\">\n\t\t\t\t\t\t\t\t\t{{ 'SM_TABLE.' + billing | translate }}\n\t\t\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</nb-select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t\t<ga-currency formControlName=\"currency\" (optionChange)=\"currencyChanged($event)\">\n\t\t\t\t\t\t\t</ga-currency>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</nb-tab>\n\t\t\t\t<nb-tab [tabTitle]=\"'ORGANIZATIONS_PAGE.BUDGET' | translate\">\n\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t<div class=\"form-group col-4\">\n\t\t\t\t\t\t\t<label class=\"label\">{{ 'FORM.PLACEHOLDERS.BUDGET_TYPE' | translate }}</label>\n\t\t\t\t\t\t\t<nb-select\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.BUDGET_TYPE' | translate\"\n\t\t\t\t\t\t\t\tformControlName=\"budgetType\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t@for (budgetType of OrganizationProjectBudgetTypeEnum | keyvalue; track budgetType) {\n\t\t\t\t\t\t\t\t<nb-option [value]=\"budgetType.value\">\n\t\t\t\t\t\t\t\t\t{{ budgetType.value | titlecase }}\n\t\t\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</nb-select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t@if (form.controls.budgetType.value === OrganizationProjectBudgetTypeEnum.HOURS) {\n\t\t\t\t\t\t<div class=\"form-group col-4\">\n\t\t\t\t\t\t\t<label class=\"label\">{{ 'FORM.PLACEHOLDERS.HOURS' | translate }}</label>\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\ttype=\"number\"\n\t\t\t\t\t\t\t\t[min]=\"0\"\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\tformControlName=\"budget\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.HOURS' | translate\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t} @if (form.controls.budgetType.value === OrganizationProjectBudgetTypeEnum.COST) {\n\t\t\t\t\t\t<div class=\"form-group col-4\">\n\t\t\t\t\t\t\t<label class=\"label\">{{ 'FORM.PLACEHOLDERS.COST' | translate }}</label>\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\ttype=\"number\"\n\t\t\t\t\t\t\t\t[min]=\"0\"\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\tformControlName=\"budget\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.COST' | translate\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t</nb-tab>\n\t\t\t\t<nb-tab [tabTitle]=\"'ORGANIZATIONS_PAGE.OPEN_SOURCE' | translate\">\n\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t<div class=\"col-4 d-flex align-items-center\">\n\t\t\t\t\t\t\t<nb-toggle\n\t\t\t\t\t\t\t\tclass=\"project-toggle\"\n\t\t\t\t\t\t\t\tlabelPosition=\"start\"\n\t\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\t\t[checked]=\"form.get('openSource').value\"\n\t\t\t\t\t\t\t\t(checkedChange)=\"toggleOpenSource($event)\"\n\t\t\t\t\t\t\t\tformControlName=\"openSource\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.IS_PROJECT_OPEN_SOURCE' | translate }}\n\t\t\t\t\t\t\t</nb-toggle>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t@if (form.get('openSource').value) {\n\t\t\t\t\t\t<div class=\"form-group col-4\">\n\t\t\t\t\t\t\t<label for=\"openSourceProjectUrl\" class=\"label\">\n\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.OPEN_SOURCE_PROJECT_URL' | translate }}\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\tplaceholder=\"https://github.com/...\"\n\t\t\t\t\t\t\t\tid=\"openSourceProjectUrl\"\n\t\t\t\t\t\t\t\tformControlName=\"openSourceProjectUrl\"\n\t\t\t\t\t\t\t\t[status]=\"\n\t\t\t\t\t\t\t\t\tFormHelpers.isInvalidControl(form, 'openSourceProjectUrl') ? 'danger' : 'basic'\n\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t@if (openSourceProjectUrl.hasError('pattern')) {\n\t\t\t\t\t\t\t<div class=\"caption status-danger position-absolute\">\n\t\t\t\t\t\t\t\t{{ 'FORM.ERROR.OPEN_SOURCE_PROJECT_URL' | translate }}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t</nb-tab>\n\t\t\t\t@if (form.get('taskListType').value == TaskListTypeEnum.SPRINT && project) {\n\t\t\t\t<nb-tab [tabTitle]=\"'ORGANIZATIONS_PAGE.SPRINTS' | translate\">\n\t\t\t\t\t<ngx-tasks-sprint-settings-view [project]=\"project\"></ngx-tasks-sprint-settings-view>\n\t\t\t\t</nb-tab>\n\t\t\t\t}\n\t\t\t\t<nb-tab [tabTitle]=\"'ORGANIZATIONS_PAGE.SETTINGS' | translate\" [style.minHeight]=\"'330px'\">\n\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t<div class=\"form-group col-3\">\n\t\t\t\t\t\t\t<label for=\"color\" class=\"label\">{{ 'FORM.PLACEHOLDERS.COLOR' | translate }}</label>\n\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\tformControlName=\"color\"\n\t\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.COLOR' | translate }}\"\n\t\t\t\t\t\t\t\tid=\"color\"\n\t\t\t\t\t\t\t\t[colorPicker]=\"form.get('color').value\"\n\t\t\t\t\t\t\t\t[style.background-color]=\"form.get('color').value + ' !important'\"\n\t\t\t\t\t\t\t\t[style.color]=\"'#fff'\"\n\t\t\t\t\t\t\t\tautocomplete-off\n\t\t\t\t\t\t\t\t[value]=\"form.get('color').value\"\n\t\t\t\t\t\t\t\t(colorPickerChange)=\"form.get('color').setValue($event)\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"form-group col-3\">\n\t\t\t\t\t\t\t<label for=\"owner\" class=\"label\">{{\n\t\t\t\t\t\t\t\t'FORM.PLACEHOLDERS.TASK_VIEW_MODE' | translate\n\t\t\t\t\t\t\t}}</label>\n\t\t\t\t\t\t\t<nb-select\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\tplaceholder=\"{{ 'FORM.PLACEHOLDERS.TASK_VIEW_MODE' | translate }}\"\n\t\t\t\t\t\t\t\tformControlName=\"taskListType\"\n\t\t\t\t\t\t\t\tid=\"taskListType\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t@for (mode of taskViewModeTypes; track mode) {\n\t\t\t\t\t\t\t\t<nb-option [value]=\"mode\">{{ mode }} </nb-option>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</nb-select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t<div class=\"col-2 d-flex align-items-center\">\n\t\t\t\t\t\t\t<nb-toggle\n\t\t\t\t\t\t\t\t#public\n\t\t\t\t\t\t\t\tclass=\"project-toggle\"\n\t\t\t\t\t\t\t\tlabelPosition=\"start\"\n\t\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\t\t[checked]=\"form.get('public').value\"\n\t\t\t\t\t\t\t\tformControlName=\"public\"\n\t\t\t\t\t\t\t\t(checkedChange)=\"togglePublic($event)\"\n\t\t\t\t\t\t\t\t>{{ 'FORM.PLACEHOLDERS.SWITCH_PROJECT_STATE' | translate }}</nb-toggle\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-2 d-flex align-items-center\">\n\t\t\t\t\t\t\t<nb-toggle\n\t\t\t\t\t\t\t\t#billable\n\t\t\t\t\t\t\t\tclass=\"project-toggle\"\n\t\t\t\t\t\t\t\tlabelPosition=\"start\"\n\t\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\t\t[checked]=\"form.get('billable').value\"\n\t\t\t\t\t\t\t\tformControlName=\"billable\"\n\t\t\t\t\t\t\t\t(checkedChange)=\"toggleBillable($event)\"\n\t\t\t\t\t\t\t\t>{{ 'FORM.PLACEHOLDERS.BILLABLE' | translate }}</nb-toggle\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</nb-tab>\n\t\t\t\t@if (integration) {\n\t\t\t\t<nb-tab [tabTitle]=\"'ORGANIZATIONS_PAGE.INTEGRATIONS' | translate\">\n\t\t\t\t\t<div class=\"setting-block block\">\n\t\t\t\t\t\t<div class=\"setting-row p-2\">\n\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t<div class=\"col-8\">\n\t\t\t\t\t\t\t\t\t<div class=\"h-12 w-12 flex-shrink-0\">\n\t\t\t\t\t\t\t\t\t\t<img\n\t\t\t\t\t\t\t\t\t\t\twidth=\"70px\"\n\t\t\t\t\t\t\t\t\t\t\theight=\"70px\"\n\t\t\t\t\t\t\t\t\t\t\t[src]=\"integration.integration.fullImgUrl\"\n\t\t\t\t\t\t\t\t\t\t\t[alt]=\"[integration.integration.title]\"\n\t\t\t\t\t\t\t\t\t\t\t[title]=\"integration.integration.name | replace : '_' : ' '\"\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t\t\t\t<div class=\"h-12 w-12 flex-shrink-0\">\n\t\t\t\t\t\t\t\t\t\t<ngx-github-repository-selector\n\t\t\t\t\t\t\t\t\t\t\t[sourceId]=\"project?.repository?.repositoryId\"\n\t\t\t\t\t\t\t\t\t\t\t[integration]=\"integration\"\n\t\t\t\t\t\t\t\t\t\t\t(onChanged)=\"selectRepository($event)\"\n\t\t\t\t\t\t\t\t\t\t></ngx-github-repository-selector>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</nb-tab>\n\t\t\t\t} @if (integration) {\n\t\t\t\t<nb-tab [tabTitle]=\"'ORGANIZATIONS_PAGE.AUTOMATION' | translate\">\n\t\t\t\t\t<form [formGroup]=\"projectSettingForm\">\n\t\t\t\t\t\t<div class=\"fields\">\n\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t\t\t<label for=\"isTasksAutoSync\" class=\"label\">\n\t\t\t\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.AUTO_SYNC_TASKS' | translate }}\n\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t<nb-toggle\n\t\t\t\t\t\t\t\t\t\t\tid=\"isTasksAutoSync\"\n\t\t\t\t\t\t\t\t\t\t\tclass=\"d-block\"\n\t\t\t\t\t\t\t\t\t\t\tformControlName=\"isTasksAutoSync\"\n\t\t\t\t\t\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t\t\t\t\t\tlabelPosition=\"start\"\n\t\t\t\t\t\t\t\t\t\t\t(change)=\"updateProjectAutoSyncSetting()\"\n\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t{{ 'FORM.PLACEHOLDERS.AUTO_SYNC_TASKS' | translate }}\n\t\t\t\t\t\t\t\t\t\t</nb-toggle>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t\t\t<label for=\"isTasksAutoSyncOnLabel\" class=\"label\">\n\t\t\t\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.AUTO_SYNC_TASKS_BASED_ON_LABEL' | translate }}\n\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t<nb-toggle\n\t\t\t\t\t\t\t\t\t\t\tid=\"isTasksAutoSyncOnLabel\"\n\t\t\t\t\t\t\t\t\t\t\tclass=\"d-block\"\n\t\t\t\t\t\t\t\t\t\t\tformControlName=\"isTasksAutoSyncOnLabel\"\n\t\t\t\t\t\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t\t\t\t\t\tlabelPosition=\"start\"\n\t\t\t\t\t\t\t\t\t\t\t(change)=\"updateProjectAutoSyncSetting()\"\n\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t{{ 'FORM.PLACEHOLDERS.AUTO_SYNC_TASKS_BASED_ON_LABEL' | translate }}\n\t\t\t\t\t\t\t\t\t\t</nb-toggle>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t\t\t<label for=\"syncTag\" class=\"label\">\n\t\t\t\t\t\t\t\t\t\t\t{{ 'FORM.LABELS.AUTO_SYNC_TAG' | translate }}\n\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\t\tid=\"syncTag\"\n\t\t\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t\t\tformControlName=\"syncTag\"\n\t\t\t\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.AUTO_SYNC_TAG' | translate\"\n\t\t\t\t\t\t\t\t\t\t\t(change)=\"changeSyncTag($event)\"\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</form>\n\t\t\t\t</nb-tab>\n\t\t\t\t} @if (project?.id) {\n\t\t\t\t<nb-tab [tabTitle]=\"'TASKS_PAGE.MODULE' | translate\">\n\t\t\t\t\t<ngx-project-module-table [projectId]=\"project.id\"></ngx-project-module-table>\n\t\t\t\t</nb-tab>\n\t\t\t\t}\n\t\t\t</nb-tabset>\n\t\t\t<ng-container [ngTemplateOutlet]=\"actionButtons\"></ng-container>\n\t\t</form>\n\t</nb-card-body>\n</nb-card>\n\n<ng-template #actionButtons>\n\t<div class=\"form-group action-buttons\">\n\t\t<button class=\"mr-3\" (click)=\"navigateToCancelProject()\" nbButton status=\"basic\" outline>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button class=\"mr-3\" nbButton status=\"success\" [disabled]=\"form.invalid\" (click)=\"onSubmit()\">\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t\t@if (project?.id) {\n\t\t<button class=\"mr-3\" nbButton status=\"success\" (click)=\"createProjectModuleDialog()\">\n\t\t\t{{ 'BUTTONS.ADD_MODULE' | translate }}\n\t\t</button>\n\t\t} @if (project) { @if (form.get('taskListType').value === TaskListTypeEnum.SPRINT) {\n\t\t<button nbButton class=\"float-right\" status=\"success\" (click)=\"openTasksSettings()\">\n\t\t\t{{ 'BUTTONS.MANAGE_SPRINTS' | translate }}\n\t\t</button>\n\t\t} }\n\t</div>\n</ng-template>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host nb-card{background-color:var(--gauzy-card-1)}.project-toggle{margin-top:20px}.action-buttons{display:flex;justify-content:flex-start}[dir=rtl] :host ::ng-deep nb-card{margin:-16px -18px -16px -8px}[dir=ltr] :host ::ng-deep nb-card{margin:-16px -8px -16px -18px}:host ::ng-deep nb-card nb-card-body{padding:0}:host ::ng-deep nb-card nb-card-body nb-tab.content-active,:host ::ng-deep nb-card nb-card-body .action-buttons{background-color:var(--gauzy-card-2, rgba(126, 126, 143, .08));margin:0}:host ::ng-deep nb-card nb-card-body nb-tab.content-active{height:calc(100vh - 22.5rem)}:host ::ng-deep nb-card nb-card-body .action-buttons{padding:1rem 2rem;border-radius:0 0 var(--border-radius) var(--border-radius)}:host ::ng-deep nb-card nb-card-body input,:host ::ng-deep nb-card nb-card-body nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep nb-card nb-card-body .ng-select .ng-select-container{background-color:var(--background-basic-color-1)!important}:host ::ng-deep nb-card nb-card-body .ng-select .ng-select-container input{background-color:unset!important}:host ::ng-deep nb-toggle div.checked+span.text{color:var(--text-primary-color)}:host ::ng-deep nb-toggle div+span.text{color:var(--gauzy-text-color-2, var(--text-hint-color))}:host ::ng-deep label{font-size:14px;font-weight:600;line-height:11px;letter-spacing:0em;text-align:left;color:var(--gauzy-text-color-2, var(--text-hint-color))}.project-tab-container{display:flex;gap:1rem}.project-tab-container .project-form-container{width:65%}.project-image-container{transition:transform .15s ease-in-out;display:flex;flex-direction:column;position:relative;margin-right:3rem}.project-image-container .project-image-photo{width:fit-content;height:294px;position:relative}.project-image-container .project-image-photo .image-overlay{pointer-events:none;background:#000;position:absolute;height:100%;width:100%;border-radius:var(--border-radius)}.project-image-container .project-image-photo img,.project-image-container .project-image-photo .image{width:299px;height:294px;object-fit:cover;border-radius:var(--border-radius)}.project-image-container .project-image-photo .image{background-color:#7e7e8f1a}.project-image-container .project-image-photo .image i{margin:5px}.project-image-container .project-image-photo .image>span{color:var(--gauzy-text-color-2, rgb(126, 126, 143));z-index:2;transition:opacity .2s ease-in;position:absolute;top:calc(50% - 8px);left:calc(50% - 70.5px)}.project-image-container .project-image-photo svg{z-index:2;transition:opacity .2s ease-in;opacity:.3;position:absolute;top:calc(50% - 34px);left:calc(50% - 34px)}.project-image-container .project-image-photo svg g circle{fill:var(--text-primary-color)}:host ::ng-deep ngx-image-uploader input{height:100%!important}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-card-1, var(--card-background-color))!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-card-1, var(--card-background-color))!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:transparent}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.Router }, { type: i2.UntypedFormBuilder }, { type: i3.Store }, { type: i3.ToastrService }, { type: i4.TranslateService }, { type: i3.ErrorHandlingService }, { type: i3.OrganizationTeamsService }, { type: i3.OrganizationContactService }, { type: i3.GithubService }, { type: i3.OrganizationProjectsService }, { type: i5.NbDialogService }], propDecorators: { integration: [{
                type: Input
            }], project: [{
                type: Input
            }], teams: [{
                type: Input
            }], organizationContacts: [{
                type: Input
            }], canceled: [{
                type: Output
            }], onSubmitted: [{
                type: Output
            }], actionButtons: [{
                type: ViewChild,
                args: ['actionButtons', { static: true }]
            }] } });
//# sourceMappingURL=project-mutation.component.js.map