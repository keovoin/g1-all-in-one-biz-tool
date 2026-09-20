import { AfterViewInit, EventEmitter, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { IOrganization, IOrganizationContact, ITag, ProjectOwnerEnum, TaskListTypeEnum, ICurrency, OrganizationProjectBudgetTypeEnum, IImageAsset, IOrganizationTeam, IOrganizationProject, IIntegrationTenant, IGithubRepository, ID } from '@gauzy/contracts';
import { GithubService, OrganizationContactService, OrganizationProjectsService, OrganizationTeamsService, ErrorHandlingService, ToastrService, Store } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { FormHelpers } from '../../forms/helpers';
import * as i0 from "@angular/core";
export declare class ProjectMutationComponent extends TranslationBaseComponent implements AfterViewInit, OnInit {
    private readonly _router;
    private readonly _fb;
    private readonly _store;
    private readonly _toastrService;
    readonly translateService: TranslateService;
    private readonly _errorHandler;
    private readonly _organizationTeamService;
    private readonly _organizationContactService;
    private readonly _githubService;
    private readonly _organizationProjectsService;
    private readonly _dialogService;
    FormHelpers: typeof FormHelpers;
    OrganizationProjectBudgetTypeEnum: typeof OrganizationProjectBudgetTypeEnum;
    TaskListTypeEnum: typeof TaskListTypeEnum;
    memberIds: ID[];
    managerIds: ID[];
    selectedEmployeeIds: ID[];
    selectedManagerIds: ID[];
    selectedTeamIds: ID[];
    billings: string[];
    owners: ProjectOwnerEnum[];
    taskViewModeTypes: TaskListTypeEnum[];
    showSprintManage: boolean;
    organization: IOrganization;
    hoverState: boolean;
    loading: boolean;
    form: UntypedFormGroup;
    static buildForm(fb: UntypedFormBuilder): UntypedFormGroup;
    projectSettingForm: UntypedFormGroup;
    static buildSettingForm(fb: UntypedFormBuilder): UntypedFormGroup;
    /**
     * Represents an integration tenant or a boolean value.
     */
    private _integration;
    get integration(): IIntegrationTenant | boolean;
    set integration(value: IIntegrationTenant | boolean);
    /**
     * Represents an organization project.
     */
    private _project;
    get project(): IOrganizationProject;
    set project(project: IOrganizationProject);
    teams: IOrganizationTeam[];
    organizationContacts: any[];
    canceled: EventEmitter<any>;
    onSubmitted: EventEmitter<any>;
    actionButtons: TemplateRef<any>;
    get projectName(): AbstractControl;
    get projectUrl(): AbstractControl;
    get openSourceProjectUrl(): AbstractControl;
    constructor(_router: Router, _fb: UntypedFormBuilder, _store: Store, _toastrService: ToastrService, translateService: TranslateService, _errorHandler: ErrorHandlingService, _organizationTeamService: OrganizationTeamsService, _organizationContactService: OrganizationContactService, _githubService: GithubService, _organizationProjectsService: OrganizationProjectsService, _dialogService: NbDialogService);
    ngOnInit(): void;
    /**
     * Lifecycle hook that is called after the component's view has been initialized.
     * It sets up an event listener for changes to the 'syncTag' form control.
     */
    ngAfterViewInit(): void;
    /**
     * Load default organization currency
     */
    private _loadDefaultCurrency;
    private _getOrganizationContacts;
    /**
     * Get organization teams
     *
     * @returns
     */
    private _getOrganizationTeams;
    changeProjectOwner(owner: ProjectOwnerEnum): void;
    /**
     * Sync edit organization project
     *
     * @param project
     */
    private _syncProject;
    /**
     * Public toggle action
     * @param state
     */
    togglePublic(state: boolean): void;
    /**
     * Billable toggle action
     * @param state
     */
    toggleBillable(state: boolean): void;
    /**
     * Open source toggle action
     * @param state
     */
    toggleOpenSource(state: boolean): void;
    /**
     * Handles the selection of managers and updates the `managerIds` property.
     *
     * @param {ID[]} managerIds - An array of selected manager IDs.
     * The function is called when managers are selected, and it sets the `managerIds` property
     * with the array of selected IDs.
     */
    onManagersSelected(managerIds: ID[]): void;
    /**
     * Handles the selection of members and updates the `memberIds` property.
     *
     * @param {ID[]} memberIds - An array of selected member IDs.
     * The function is called when members are selected, and it sets the `memberIds` property
     * with the array of selected IDs.
     */
    onMembersSelected(memberIds: ID[]): void;
    /**
     * Updates the form's teams field with the selected organization teams.
     *
     * @param {IOrganizationTeam[]} teams - An array of selected organization teams.
     */
    onTeamsSelected(teams: IOrganizationTeam[]): void;
    /**
     * Navigates to the organization projects page, canceling the current project workflow.
     *
     * This method is typically called when the user decides to cancel the project creation/edit process.
     */
    navigateToCancelProject(): void;
    /**
     * Handles the submission of the project mutation form.
     *
     * @returns void
     */
    onSubmit(): void;
    /**
     * Extracts and processes form values for submission.
     *
     * @returns {object} - The processed form values.
     */
    private getFormValues;
    /**
     * Updates the form's tags field with the selected tags.
     *
     * @param {ITag[]} selectedTags - An array of selected tags.
     */
    selectedTagsEvent(selectedTags: ITag[]): void;
    /**
     * Adds a new organization contact with the provided name.
     *
     * @param {string} name - The name of the new organization contact.
     * @returns {Promise<IOrganizationContact>} - Returns a promise that resolves to the created organization contact.
     *
     * @throws {Error} - Handles errors using the error handler service if the contact creation fails.
     */
    addNewOrganizationContact: (name: string) => Promise<IOrganizationContact>;
    /**
     * Navigates to the tasks settings page for the selected project.
     */
    openTasksSettings(): void;
    currencyChanged($event: ICurrency): void;
    /**
     * Upload project logo
     *
     * @param image
     */
    updateImageAsset(image: IImageAsset): void;
    handleImageUploadError(error: any): void;
    /**
     * Selects a GitHub repository and retrieves its associated issues.
     * @param repository - The GitHub repository to select.
     */
    selectRepository(repository: IGithubRepository): void;
    /**
     * Trigger a change in the synchronization tag for project auto-sync settings.
     * This function updates the project's auto-sync settings.
     */
    changeSyncTag(): void;
    /**
     * Updates project auto-sync settings.
     * This method is typically invoked in response to user actions.
     */
    updateProjectAutoSyncSetting(): void;
    /**
     * Opens a dialog for creating a new project module
     * @param createModule - Flag indicating if this is a new module creation (true) or edit (false)
     * @returns Promise that resolves when the dialog is closed
     */
    createProjectModuleDialog(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProjectMutationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProjectMutationComponent, "ga-project-mutation", never, { "integration": { "alias": "integration"; "required": false; }; "project": { "alias": "project"; "required": false; }; "teams": { "alias": "teams"; "required": false; }; "organizationContacts": { "alias": "organizationContacts"; "required": false; }; }, { "canceled": "canceled"; "onSubmitted": "onSubmitted"; }, never, never, false, never>;
}
