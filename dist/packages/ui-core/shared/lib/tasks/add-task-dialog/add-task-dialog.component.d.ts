import { OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { IEmployee, IOrganization, IOrganizationProject, IOrganizationProjectModule, IOrganizationTeam, ITag, ITask } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { EmployeesService, OrganizationProjectModuleService, OrganizationTeamsService, Store, TasksService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class AddTaskDialogComponent extends TranslationBaseComponent implements OnInit {
    readonly dialogRef: NbDialogRef<AddTaskDialogComponent>;
    private readonly fb;
    private readonly store;
    readonly translateService: TranslateService;
    private readonly employeesService;
    private readonly tasksService;
    private readonly organizationTeamsService;
    private organizationProjectModuleService;
    employees: IEmployee[];
    teams: IOrganizationTeam[];
    selectedMembers: string[];
    selectedTeams: string[];
    selectedModules: string[];
    selectedTask: ITask;
    availableModules: IOrganizationProjectModule[];
    organization: IOrganization;
    createTask: boolean;
    form: UntypedFormGroup;
    constructor(dialogRef: NbDialogRef<AddTaskDialogComponent>, fb: UntypedFormBuilder, store: Store, translateService: TranslateService, employeesService: EmployeesService, tasksService: TasksService, organizationTeamsService: OrganizationTeamsService, organizationProjectModuleService: OrganizationProjectModuleService);
    static buildForm(fb: UntypedFormBuilder): UntypedFormGroup;
    _task: ITask;
    get task(): ITask;
    set task(value: ITask);
    ngOnInit(): void;
    initializeForm(): void;
    onSave(): void;
    selectedTagsHandler(tags: ITag[]): void;
    selectedProject(project: IOrganizationProject): void;
    loadEmployees(): Promise<void>;
    onMembersSelected(members: string[]): void;
    loadTeams(): Promise<void>;
    onTeamsSelected(teamsSelection: string[]): void;
    onModulesSelected(modules: string[]): void;
    /**
     * Loads available modules based on the selected project ID.
     */
    private loadAvailableModules;
    /**
     * Retrieves the value of a form control by its name.
     *
     * @param control - The name of the form control whose value is to be retrieved.
     * @returns string - The value of the form control. If the control is not found or the value is null, an empty string is returned.
     */
    getControlValue(control: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<AddTaskDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AddTaskDialogComponent, "ngx-add-task-dialog", never, { "createTask": { "alias": "createTask"; "required": false; }; "task": { "alias": "task"; "required": false; }; }, {}, never, never, false, never>;
}
