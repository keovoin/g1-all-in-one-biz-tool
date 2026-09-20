import { OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { IEmployee, IOrganization, IOrganizationProject, IOrganizationProjectModule, IOrganizationSprint, IOrganizationTeam, ITask, ProjectModuleStatusEnum, TaskParticipantEnum, ID } from '@gauzy/contracts';
import { EmployeesService, OrganizationTeamsService, Store, OrganizationProjectModuleService, SprintService, TasksService, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class ProjectModuleMutationComponent extends TranslationBaseComponent implements OnInit {
    dialogRef: NbDialogRef<ProjectModuleMutationComponent>;
    private fb;
    private store;
    translateService: TranslateService;
    private employeesService;
    private organizationTeamsService;
    private organizationProjectModuleService;
    private organizationSprintService;
    private readonly tasksService;
    private readonly toastrService;
    memberIds: ID[];
    managerIds: ID[];
    selectedEmployeeIds: ID[];
    selectedManagerIds: ID[];
    employees: IEmployee[];
    teams: IOrganizationTeam[];
    selectedTeams: string[];
    tasks: ITask[];
    organizationSprints: IOrganizationSprint[];
    availableParentModules: IOrganizationProjectModule[];
    organization: IOrganization;
    taskParticipantEnum: typeof TaskParticipantEnum;
    participants: TaskParticipantEnum;
    projectModuleStatuses: ProjectModuleStatusEnum[];
    form: UntypedFormGroup;
    createModule: boolean;
    private _projectModule;
    get projectModule(): IOrganizationProjectModule;
    set projectModule(value: IOrganizationProjectModule);
    private _project;
    get project(): IOrganizationProject;
    set project(value: IOrganizationProject);
    constructor(dialogRef: NbDialogRef<ProjectModuleMutationComponent>, fb: UntypedFormBuilder, store: Store, translateService: TranslateService, employeesService: EmployeesService, organizationTeamsService: OrganizationTeamsService, organizationProjectModuleService: OrganizationProjectModuleService, organizationSprintService: SprintService, tasksService: TasksService, toastrService: ToastrService);
    /**
     * Initializes component and loads necessary data.
     */
    ngOnInit(): void;
    /**
     * Populates form fields with data from an existing project module.
     * @param module - The selected project module data.
     */
    private populateForm;
    /**
     * Validates and saves the form data to create or update the project module.
     */
    onSave(): void;
    /**
     * Creates a new project module or updates the existing module based on form data.
     */
    private createOrUpdateModule;
    /**
     * Updates form fields with valid members, teams, and tasks.
     */
    private updateFormFields;
    /**
     * Loads selected organization data and initializes employees and teams.
     */
    loadOrganizationData(): Promise<void>;
    /**
     * Loads the employees for the currently selected organization.
     *
     * Retrieves all employees associated with the current organization and tenant,
     * including their user details, and assigns them to the `employees` property.
     */
    loadEmployees(): Promise<void>;
    /**
     * Loads available teams for the selected organization.
     *
     * Retrieves all teams associated with the current organization and tenant,
     * including their members, and assigns them to the `teams` property.
     */
    loadTeams(): Promise<void>;
    /**
     * Loads available tasks for the selected project and organization.
     *
     * Retrieves all tasks associated with the current organization, tenant,
     * and selected project, then assigns them to the `tasks` property.
     */
    loadTasks(): Promise<void>;
    /**
     * Loads available parent modules based on the selected project ID.
     *
     * Retrieves parent modules associated with the selected project and assigns
     * them to the `availableParentModules` property.
     */
    private loadAvailableParentModules;
    /**
     * Fetches sprints associated with the organization.
     */
    findOrganizationSprints(): void;
    /**
     * Handles the selection of managers and updates the `managerIds` property.
     *
     * @param {ID[]} managerIds - An array of selected manager IDs.
     * The function is called when managers are selected, and it sets the `managerIds` property
     * with the array of selected IDs.
     */
    onManagersSelected(managerIds: ID[]): void;
    /**
     * Updates the selected teams based on the user's selection.
     *
     * @param teamsSelection - An array of team IDs selected by the user.
     */
    onTeamsSelected(teamsSelection: ID[]): void;
    /**
     * Handles the selection of members and updates the `memberIds` property.
     *
     * @param {ID[]} memberIds - An array of selected member IDs.
     * The function is called when members are selected, and it sets the `memberIds` property
     * with the array of selected IDs.
     */
    onMembersSelected(memberIds: ID[]): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProjectModuleMutationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProjectModuleMutationComponent, "ngx-project-module-mutation", never, { "createModule": { "alias": "createModule"; "required": false; }; "projectModule": { "alias": "projectModule"; "required": false; }; "project": { "alias": "project"; "required": false; }; }, {}, never, never, false, never>;
}
