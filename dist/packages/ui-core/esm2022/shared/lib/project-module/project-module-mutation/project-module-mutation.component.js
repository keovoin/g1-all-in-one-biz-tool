import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProjectModuleStatusEnum, TaskParticipantEnum } from '@gauzy/contracts';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { EmployeesService, OrganizationTeamsService, Store, OrganizationProjectModuleService, SprintService, TasksService, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@angular/forms";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "@ngx-translate/core";
import * as i5 from "../../rich-text-editor/rich-text-editor.component";
import * as i6 from "../../selectors/project/project/project.component";
import * as i7 from "../../employee/employee-multi-select/employee-multi-select.component";
import * as i8 from "../../tasks/task-select/task/task.component";
let ProjectModuleMutationComponent = class ProjectModuleMutationComponent extends TranslationBaseComponent {
    get projectModule() {
        return this._projectModule;
    }
    set projectModule(value) {
        this._projectModule = value;
        this.populateForm(value);
    }
    get project() {
        return this._project;
    }
    set project(value) {
        this._project = value;
        this.form.get('projectId').setValue(value?.id || null);
    }
    constructor(dialogRef, fb, store, translateService, employeesService, organizationTeamsService, organizationProjectModuleService, organizationSprintService, tasksService, toastrService) {
        super(translateService);
        this.dialogRef = dialogRef;
        this.fb = fb;
        this.store = store;
        this.translateService = translateService;
        this.employeesService = employeesService;
        this.organizationTeamsService = organizationTeamsService;
        this.organizationProjectModuleService = organizationProjectModuleService;
        this.organizationSprintService = organizationSprintService;
        this.tasksService = tasksService;
        this.toastrService = toastrService;
        this.memberIds = [];
        this.managerIds = [];
        this.selectedEmployeeIds = [];
        this.selectedManagerIds = [];
        this.employees = [];
        this.teams = [];
        this.selectedTeams = [];
        this.tasks = [];
        this.organizationSprints = [];
        this.availableParentModules = [];
        this.taskParticipantEnum = TaskParticipantEnum;
        this.participants = TaskParticipantEnum.EMPLOYEES;
        this.projectModuleStatuses = Object.values(ProjectModuleStatusEnum);
        this.form = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            status: [ProjectModuleStatusEnum.BACKLOG],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            isFavorite: [false],
            parentId: [],
            projectId: [null, Validators.required],
            managerIds: [],
            memberIds: [],
            organizationSprints: [],
            teams: [],
            tasks: []
        });
        this.createModule = false;
    }
    /**
     * Initializes component and loads necessary data.
     */
    ngOnInit() {
        this.loadOrganizationData();
        this.loadAvailableParentModules();
        this.loadTasks();
        this.findOrganizationSprints();
    }
    /**
     * Populates form fields with data from an existing project module.
     * @param module - The selected project module data.
     */
    populateForm(module) {
        if (!module)
            return;
        const { name, description, status, startDate, endDate, isFavorite, projectId, parentId, members = [], organizationSprints, teams = [], tasks = [] } = module;
        this.form.patchValue({
            name,
            description,
            status,
            startDate,
            endDate,
            isFavorite,
            projectId,
            parentId,
            members: members.map((m) => m.id),
            organizationSprints,
            teams: teams.map((t) => t.id),
            tasks: tasks.map((task) => task.id)
        });
        this.selectedEmployeeIds = (module.members || [])
            .filter((member) => !member.isManager)
            .map((member) => member.employeeId);
        this.memberIds = this.selectedEmployeeIds;
        // Selected Managers Ids
        this.selectedManagerIds = (module.members || [])
            .filter((member) => member.isManager)
            .map((member) => member.employeeId);
        this.managerIds = this.selectedManagerIds;
        this.selectedTeams = teams.map((t) => t.id);
    }
    /**
     * Validates and saves the form data to create or update the project module.
     */
    onSave() {
        if (this.form.invalid)
            return;
        this.createOrUpdateModule();
    }
    /**
     * Creates a new project module or updates the existing module based on form data.
     */
    async createOrUpdateModule() {
        try {
            // Update form fields with valid members, teams, and tasks
            this.updateFormFields();
            // Prepare form values
            const formValue = {
                ...this.form.value,
                organizationId: this.organization.id,
                organization: this.organization
            };
            let module;
            // Determine if we are creating or updating a module
            if (this.createModule) {
                module = await firstValueFrom(this.organizationProjectModuleService.create(formValue));
                this.toastrService.success(this.translateService.instant('TOASTR.MESSAGE.MODULE_CREATED'), this.translateService.instant('TOASTR.TITLE.SUCCESS'));
            }
            else {
                module = await firstValueFrom(this.organizationProjectModuleService.update(this.projectModule.id, formValue));
                this.toastrService.success(this.translateService.instant('TOASTR.MESSAGE.MODULE_UPDATED'), this.translateService.instant('TOASTR.TITLE.SUCCESS'));
            }
            this.organizationProjectModuleService.notifyModuleUpdated();
            // Close the dialog and return the created/updated module
            this.dialogRef.close(module);
        }
        catch (error) {
            // Display an error toast
            this.toastrService.danger(this.translateService.instant('TOASTR.MESSAGE.MODULE_SAVE_ERROR'), this.translateService.instant('TOASTR.TITLE.ERROR'));
            console.error('Failed to save module:', error);
        }
    }
    /**
     * Updates form fields with valid members, teams, and tasks.
     */
    updateFormFields() {
        this.form.get('memberIds').setValue(this.memberIds.filter((memberId) => !this.managerIds.includes(memberId)));
        this.form
            .get('managerIds')
            .setValue(this.managerIds.filter((managerId) => this.employees.some((emp) => emp.id === managerId)));
        this.form
            .get('teams')
            .setValue((this.selectedTeams || []).map((id) => this.teams.find((t) => t.id === id)).filter(Boolean));
        this.form
            .get('tasks')
            .setValue((this.form.get('tasks').value || [])
            .map((id) => this.tasks.find((t) => t.id === id))
            .filter(Boolean));
    }
    /**
     * Loads selected organization data and initializes employees and teams.
     */
    async loadOrganizationData() {
        const organization$ = this.store.selectedOrganization$;
        organization$
            .pipe(distinctUntilChange(), filter(Boolean), tap((org) => (this.organization = org)), tap(() => this.loadEmployees()), tap(() => this.loadTeams()), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Loads the employees for the currently selected organization.
     *
     * Retrieves all employees associated with the current organization and tenant,
     * including their user details, and assigns them to the `employees` property.
     */
    async loadEmployees() {
        if (!this.organization)
            return;
        const { id: organizationId, tenantId } = this.organization;
        try {
            const { items: employees = [] } = await firstValueFrom(this.employeesService.getAll(['user'], { organizationId, tenantId }));
            this.employees = employees;
        }
        catch (error) {
            console.error('Failed to load employees:', error);
            this.employees = [];
        }
    }
    /**
     * Loads available teams for the selected organization.
     *
     * Retrieves all teams associated with the current organization and tenant,
     * including their members, and assigns them to the `teams` property.
     */
    async loadTeams() {
        if (!this.organization)
            return;
        const { id: organizationId, tenantId } = this.organization;
        try {
            const { items: teams = [] } = await this.organizationTeamsService.getAll(['members'], {
                organizationId,
                tenantId
            });
            this.teams = teams;
        }
        catch (error) {
            this.teams = [];
        }
    }
    /**
     * Loads available tasks for the selected project and organization.
     *
     * Retrieves all tasks associated with the current organization, tenant,
     * and selected project, then assigns them to the `tasks` property.
     */
    async loadTasks() {
        if (!this.organization)
            return;
        const { id: organizationId, tenantId } = this.organization;
        const projectId = this.form.get('projectId')?.value;
        try {
            const { items: tasks = [] } = await firstValueFrom(this.tasksService.getAllTasks({ projectId, organizationId, tenantId }));
            this.tasks = tasks;
        }
        catch (error) {
            this.tasks = [];
        }
    }
    /**
     * Loads available parent modules based on the selected project ID.
     *
     * Retrieves parent modules associated with the selected project and assigns
     * them to the `availableParentModules` property.
     */
    async loadAvailableParentModules() {
        if (!this.organization)
            return;
        const projectId = this.form.get('projectId')?.value;
        try {
            const modules = await firstValueFrom(this.organizationProjectModuleService.getAllModulesByProjectId({ projectId }));
            this.availableParentModules = modules?.items || [];
        }
        catch (error) {
            this.availableParentModules = [];
        }
    }
    /**
     * Fetches sprints associated with the organization.
     */
    findOrganizationSprints() {
        this.organizationSprintService.getAllSprints().subscribe({
            next: (sprints) => {
                this.organizationSprints = sprints.items;
            },
            error: (error) => {
                console.error('Error fetching organization sprints:', error);
            }
        });
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
     * Updates the selected teams based on the user's selection.
     *
     * @param teamsSelection - An array of team IDs selected by the user.
     */
    onTeamsSelected(teamsSelection) {
        this.selectedTeams = [...teamsSelection];
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectModuleMutationComponent, deps: [{ token: i1.NbDialogRef }, { token: i2.UntypedFormBuilder }, { token: i3.Store }, { token: i4.TranslateService }, { token: i3.EmployeesService }, { token: i3.OrganizationTeamsService }, { token: i3.OrganizationProjectModuleService }, { token: i3.SprintService }, { token: i3.TasksService }, { token: i3.ToastrService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ProjectModuleMutationComponent, isStandalone: false, selector: "ngx-project-module-mutation", inputs: { createModule: "createModule", projectModule: "projectModule", project: "project" }, usesInheritance: true, ngImport: i0, template: "<nb-card class=\"main\">\n  <nb-card-header class=\"d-flex flex-column\">\n    <div class=\"cancel\">\n      <i class=\"fas fa-times\" role=\"button\" (click)=\"dialogRef.close()\"></i>\n    </div>\n    <h5 class=\"title\">\n      {{ (!createModule ? 'Edit Module' : 'Add Module') | translate }}\n    </h5>\n  </nb-card-header>\n  <nb-card-body class=\"body\">\n    <form [formGroup]=\"form\">\n      <!-- Project Selection -->\n      <div class=\"row\">\n        <div class=\"col-sm-6\">\n          <div class=\"form-group\">\n            <label class=\"label\">{{ 'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.PROJECT' | translate }}</label>\n            <ga-project-selector\n              formControlName=\"projectId\"\n              [placeholder]=\"'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.SELECT_PROJECT' | translate\"\n              [skipGlobalChange]=\"true\"\n              [defaultSelected]=\"false\"\n              [showAllOption]=\"false\"\n            ></ga-project-selector>\n          </div>\n        </div>\n        <div class=\"col-sm-6\">\n          <div class=\"form-group\">\n            <label class=\"label\">{{ 'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.STATUS' | translate }}</label>\n            <nb-select formControlName=\"status\" fullWidth>\n              @for (status of projectModuleStatuses; track status) {\n                <nb-option [value]=\"status\">\n                  {{ status }}\n                </nb-option>\n              }\n            </nb-select>\n          </div>\n        </div>\n      </div>\n\n      <!-- Participants -->\n      <div class=\"row\">\n        <!-- Employee Multi-Select -->\n        <div class=\"col-sm-12\">\n          <div class=\"form-group\">\n            <ga-employee-multi-select\n              [selectedEmployeeIds]=\"selectedEmployeeIds\"\n              [allEmployees]=\"employees\"\n              (selectedChange)=\"onMembersSelected($event)\"\n            ></ga-employee-multi-select>\n          </div>\n        </div>\n\n        <!-- Team Multi-Select -->\n        <div class=\"col-sm-12\">\n          <div class=\"form-group\">\n            <label class=\"label\">{{\n              'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.SELECT_TEAMS' | translate\n            }}</label>\n            <nb-select\n              formControlName=\"teams\"\n              multiple\n              [selected]=\"selectedTeams\"\n              (selectedChange)=\"onTeamsSelected($event)\"\n              fullWidth\n              [placeholder]=\"'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.CHOOSE_TEAMS' | translate\"\n              >\n              @for (team of teams; track team) {\n                <nb-option [value]=\"team.id\">{{ team.name }}</nb-option>\n              }\n            </nb-select>\n          </div>\n        </div>\n      </div>\n\n      <!-- Module Details -->\n      <div class=\"row\">\n        <div class=\"col-sm-6\">\n          <div class=\"form-group\">\n            <label class=\"label\">{{ 'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.NAME' | translate }}</label>\n            <input\n              class=\"name-input\"\n              formControlName=\"name\"\n              type=\"text\"\n              nbInput\n              [placeholder]=\"'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.ENTER_NAME' | translate\"\n              />\n            </div>\n          </div>\n          <div class=\"col-sm-6\">\n            <div class=\"form-group\">\n              <label class=\"label\">{{\n                'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.PARENT_MODULE' | translate\n              }}</label>\n              <nb-select\n                formControlName=\"parentId\"\n                [placeholder]=\"'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.SELECT_PARENT' | translate\"\n                fullWidth\n                >\n                @for (module of availableParentModules; track module) {\n                  <nb-option [value]=\"module.id\">\n                    {{ module.name }}\n                  </nb-option>\n                }\n              </nb-select>\n            </div>\n          </div>\n        </div>\n\n        <!-- Managers Selection -->\n        <div class=\"row\">\n          <div class=\"col-sm-6\">\n            <div class=\"form-group\">\n              <label class=\"label\">{{ 'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.MANAGER' | translate }}</label>\n\n              <ga-employee-multi-select\n                [selectedEmployeeIds]=\"selectedManagerIds\"\n                [allEmployees]=\"employees\"\n                class=\"employees\"\n                (selectedChange)=\"onManagersSelected($event)\"\n              ></ga-employee-multi-select>\n            </div>\n          </div>\n\n          <!-- Organization Sprints -->\n          <div class=\"col-sm-6\">\n            <div class=\"form-group\">\n              <label class=\"label\">{{\n                'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.ORGANIZATION_SPRINTS' | translate\n              }}</label>\n              <nb-select\n                formControlName=\"organizationSprints\"\n                multiple\n                [placeholder]=\"'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.SELECT_SPRINTS' | translate\"\n                fullWidth\n                >\n                @for (sprint of organizationSprints; track sprint) {\n                  <nb-option [value]=\"sprint.id\">\n                    {{ sprint.name }}\n                  </nb-option>\n                }\n              </nb-select>\n            </div>\n          </div>\n        </div>\n\n        <div class=\"row\">\n          <div class=\"col-sm-12\">\n            <div class=\"form-group\">\n              <label>{{ 'TIMER_TRACKER.SELECT_TASK' | translate }}</label>\n              <ga-task-selector\n                name=\"taskId\"\n                [projectId]=\"form.get('projectId').value\"\n                formControlName=\"tasks\"\n                [multiple]=\"true\"\n                [required]=\"organization?.requireTask\"\n              ></ga-task-selector>\n            </div>\n          </div>\n        </div>\n        <!-- Date and Description -->\n        <div class=\"row\">\n          <div class=\"col-sm-6\">\n            <div class=\"form-group\">\n              <label for=\"startDate\" class=\"label\">{{\n                'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.START_DATE' | translate\n              }}</label>\n              <input\n                formControlName=\"startDate\"\n                type=\"text\"\n                nbInput\n                [placeholder]=\"'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.SELECT_START_DATE' | translate\"\n                [nbDatepicker]=\"startDatePicker\"\n                id=\"startDate\"\n                fullWidth\n                />\n                <nb-datepicker #startDatePicker></nb-datepicker>\n              </div>\n            </div>\n            <div class=\"col-sm-6\">\n              <div class=\"form-group\">\n                <label for=\"endDate\" class=\"label\">{{\n                  'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.END_DATE' | translate\n                }}</label>\n                <input\n                  formControlName=\"endDate\"\n                  type=\"text\"\n                  nbInput\n                  [placeholder]=\"'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.SELECT_END_DATE' | translate\"\n                  [nbDatepicker]=\"endDatePicker\"\n                  id=\"endDate\"\n                  [min]=\"form.get('startDate').value\"\n                  fullWidth\n                  />\n                  <nb-datepicker #endDatePicker></nb-datepicker>\n                </div>\n              </div>\n            </div>\n\n            <!-- Is Favorite Switch -->\n            <div class=\"row\">\n              <div class=\"col-sm-12\">\n                <nb-toggle formControlName=\"isFavorite\" class=\"favorite-switch\">\n                  {{ 'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.IS_FAVORITE' | translate }}\n                </nb-toggle>\n              </div>\n            </div>\n\n            <!-- Description -->\n            <div class=\"row\">\n              <div class=\"col-sm-12\">\n                <div class=\"form-group\">\n                  <label class=\"label\">{{ 'TASKS_PAGE.TASKS_DESCRIPTION' | translate }}</label>\n                  <ga-rich-text-editor\n                    class=\"description\"\n                    formControlName=\"description\"\n                    preset=\"standard\"\n                    outputFormat=\"html\"\n                    [placeholder]=\"'FORM.PLACEHOLDERS.DESCRIPTION' | translate\"\n                  ></ga-rich-text-editor>\n                </div>\n              </div>\n            </div>\n          </form>\n        </nb-card-body>\n        <nb-card-footer class=\"text-left\">\n          <button (click)=\"dialogRef.close()\" status=\"basic\" outline class=\"mr-3\" nbButton>\n            {{ 'BUTTONS.CANCEL' | translate }}\n          </button>\n          <button (click)=\"onSave()\" [disabled]=\"form.invalid\" status=\"success\" nbButton>\n            {{ 'BUTTONS.SAVE' | translate }}\n          </button>\n        </nb-card-footer>\n      </nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}.body{width:550px}.description{margin-top:10px;height:150px}.name-input{min-width:100%}.estimate-inputs{display:flex;justify-content:space-between}.estimate-inputs input{width:30%;padding:.4rem!important}.nb-radio{display:inline-block}:host nb-card{background-color:var(--gauzy-card-1)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i2.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i2.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "directive", type: i2.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i2.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i5.RichTextEditorComponent, selector: "ga-rich-text-editor", inputs: ["preset", "placeholder", "outputFormat", "minHeight", "maxHeight", "characterLimit", "showCharacterCount", "editorClass", "disabled"], outputs: ["created", "changed", "focused", "blurred"] }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "directive", type: i1.NbDatepickerDirective, selector: "input[nbDatepicker]", inputs: ["nbDatepicker"] }, { kind: "component", type: i1.NbDatepickerComponent, selector: "nb-datepicker", inputs: ["date"], outputs: ["dateChange"] }, { kind: "directive", type: i1.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i1.NbToggleComponent, selector: "nb-toggle", inputs: ["checked", "disabled", "status", "labelPosition"], outputs: ["checkedChange"] }, { kind: "component", type: i1.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i1.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "component", type: i6.ProjectSelectorComponent, selector: "ga-project-selector", inputs: ["shortened", "dropdownClass", "disabled", "multiple", "label", "placeholder", "skipGlobalChange", "defaultSelected", "showAllOption", "projectId", "employeeId", "organizationContactId"], outputs: ["onChanged"] }, { kind: "component", type: i7.EmployeeSelectComponent, selector: "ga-employee-multi-select", inputs: ["reset", "allEmployees", "selectedEmployeeIds", "multiple", "label", "disabled", "placeholder"], outputs: ["selectedChange", "onLoadEmployees"] }, { kind: "component", type: i8.TaskSelectorComponent, selector: "ga-task-selector", inputs: ["placeholder", "multiple", "disabled", "addTag", "projectId", "employeeId"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
};
ProjectModuleMutationComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbDialogRef,
        UntypedFormBuilder,
        Store,
        TranslateService,
        EmployeesService,
        OrganizationTeamsService,
        OrganizationProjectModuleService,
        SprintService,
        TasksService,
        ToastrService])
], ProjectModuleMutationComponent);
export { ProjectModuleMutationComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectModuleMutationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-project-module-mutation', standalone: false, template: "<nb-card class=\"main\">\n  <nb-card-header class=\"d-flex flex-column\">\n    <div class=\"cancel\">\n      <i class=\"fas fa-times\" role=\"button\" (click)=\"dialogRef.close()\"></i>\n    </div>\n    <h5 class=\"title\">\n      {{ (!createModule ? 'Edit Module' : 'Add Module') | translate }}\n    </h5>\n  </nb-card-header>\n  <nb-card-body class=\"body\">\n    <form [formGroup]=\"form\">\n      <!-- Project Selection -->\n      <div class=\"row\">\n        <div class=\"col-sm-6\">\n          <div class=\"form-group\">\n            <label class=\"label\">{{ 'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.PROJECT' | translate }}</label>\n            <ga-project-selector\n              formControlName=\"projectId\"\n              [placeholder]=\"'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.SELECT_PROJECT' | translate\"\n              [skipGlobalChange]=\"true\"\n              [defaultSelected]=\"false\"\n              [showAllOption]=\"false\"\n            ></ga-project-selector>\n          </div>\n        </div>\n        <div class=\"col-sm-6\">\n          <div class=\"form-group\">\n            <label class=\"label\">{{ 'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.STATUS' | translate }}</label>\n            <nb-select formControlName=\"status\" fullWidth>\n              @for (status of projectModuleStatuses; track status) {\n                <nb-option [value]=\"status\">\n                  {{ status }}\n                </nb-option>\n              }\n            </nb-select>\n          </div>\n        </div>\n      </div>\n\n      <!-- Participants -->\n      <div class=\"row\">\n        <!-- Employee Multi-Select -->\n        <div class=\"col-sm-12\">\n          <div class=\"form-group\">\n            <ga-employee-multi-select\n              [selectedEmployeeIds]=\"selectedEmployeeIds\"\n              [allEmployees]=\"employees\"\n              (selectedChange)=\"onMembersSelected($event)\"\n            ></ga-employee-multi-select>\n          </div>\n        </div>\n\n        <!-- Team Multi-Select -->\n        <div class=\"col-sm-12\">\n          <div class=\"form-group\">\n            <label class=\"label\">{{\n              'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.SELECT_TEAMS' | translate\n            }}</label>\n            <nb-select\n              formControlName=\"teams\"\n              multiple\n              [selected]=\"selectedTeams\"\n              (selectedChange)=\"onTeamsSelected($event)\"\n              fullWidth\n              [placeholder]=\"'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.CHOOSE_TEAMS' | translate\"\n              >\n              @for (team of teams; track team) {\n                <nb-option [value]=\"team.id\">{{ team.name }}</nb-option>\n              }\n            </nb-select>\n          </div>\n        </div>\n      </div>\n\n      <!-- Module Details -->\n      <div class=\"row\">\n        <div class=\"col-sm-6\">\n          <div class=\"form-group\">\n            <label class=\"label\">{{ 'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.NAME' | translate }}</label>\n            <input\n              class=\"name-input\"\n              formControlName=\"name\"\n              type=\"text\"\n              nbInput\n              [placeholder]=\"'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.ENTER_NAME' | translate\"\n              />\n            </div>\n          </div>\n          <div class=\"col-sm-6\">\n            <div class=\"form-group\">\n              <label class=\"label\">{{\n                'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.PARENT_MODULE' | translate\n              }}</label>\n              <nb-select\n                formControlName=\"parentId\"\n                [placeholder]=\"'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.SELECT_PARENT' | translate\"\n                fullWidth\n                >\n                @for (module of availableParentModules; track module) {\n                  <nb-option [value]=\"module.id\">\n                    {{ module.name }}\n                  </nb-option>\n                }\n              </nb-select>\n            </div>\n          </div>\n        </div>\n\n        <!-- Managers Selection -->\n        <div class=\"row\">\n          <div class=\"col-sm-6\">\n            <div class=\"form-group\">\n              <label class=\"label\">{{ 'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.MANAGER' | translate }}</label>\n\n              <ga-employee-multi-select\n                [selectedEmployeeIds]=\"selectedManagerIds\"\n                [allEmployees]=\"employees\"\n                class=\"employees\"\n                (selectedChange)=\"onManagersSelected($event)\"\n              ></ga-employee-multi-select>\n            </div>\n          </div>\n\n          <!-- Organization Sprints -->\n          <div class=\"col-sm-6\">\n            <div class=\"form-group\">\n              <label class=\"label\">{{\n                'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.ORGANIZATION_SPRINTS' | translate\n              }}</label>\n              <nb-select\n                formControlName=\"organizationSprints\"\n                multiple\n                [placeholder]=\"'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.SELECT_SPRINTS' | translate\"\n                fullWidth\n                >\n                @for (sprint of organizationSprints; track sprint) {\n                  <nb-option [value]=\"sprint.id\">\n                    {{ sprint.name }}\n                  </nb-option>\n                }\n              </nb-select>\n            </div>\n          </div>\n        </div>\n\n        <div class=\"row\">\n          <div class=\"col-sm-12\">\n            <div class=\"form-group\">\n              <label>{{ 'TIMER_TRACKER.SELECT_TASK' | translate }}</label>\n              <ga-task-selector\n                name=\"taskId\"\n                [projectId]=\"form.get('projectId').value\"\n                formControlName=\"tasks\"\n                [multiple]=\"true\"\n                [required]=\"organization?.requireTask\"\n              ></ga-task-selector>\n            </div>\n          </div>\n        </div>\n        <!-- Date and Description -->\n        <div class=\"row\">\n          <div class=\"col-sm-6\">\n            <div class=\"form-group\">\n              <label for=\"startDate\" class=\"label\">{{\n                'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.START_DATE' | translate\n              }}</label>\n              <input\n                formControlName=\"startDate\"\n                type=\"text\"\n                nbInput\n                [placeholder]=\"'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.SELECT_START_DATE' | translate\"\n                [nbDatepicker]=\"startDatePicker\"\n                id=\"startDate\"\n                fullWidth\n                />\n                <nb-datepicker #startDatePicker></nb-datepicker>\n              </div>\n            </div>\n            <div class=\"col-sm-6\">\n              <div class=\"form-group\">\n                <label for=\"endDate\" class=\"label\">{{\n                  'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.END_DATE' | translate\n                }}</label>\n                <input\n                  formControlName=\"endDate\"\n                  type=\"text\"\n                  nbInput\n                  [placeholder]=\"'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.SELECT_END_DATE' | translate\"\n                  [nbDatepicker]=\"endDatePicker\"\n                  id=\"endDate\"\n                  [min]=\"form.get('startDate').value\"\n                  fullWidth\n                  />\n                  <nb-datepicker #endDatePicker></nb-datepicker>\n                </div>\n              </div>\n            </div>\n\n            <!-- Is Favorite Switch -->\n            <div class=\"row\">\n              <div class=\"col-sm-12\">\n                <nb-toggle formControlName=\"isFavorite\" class=\"favorite-switch\">\n                  {{ 'PROJECT_MANAGEMENT_PAGE.PROJECT_MODULE.IS_FAVORITE' | translate }}\n                </nb-toggle>\n              </div>\n            </div>\n\n            <!-- Description -->\n            <div class=\"row\">\n              <div class=\"col-sm-12\">\n                <div class=\"form-group\">\n                  <label class=\"label\">{{ 'TASKS_PAGE.TASKS_DESCRIPTION' | translate }}</label>\n                  <ga-rich-text-editor\n                    class=\"description\"\n                    formControlName=\"description\"\n                    preset=\"standard\"\n                    outputFormat=\"html\"\n                    [placeholder]=\"'FORM.PLACEHOLDERS.DESCRIPTION' | translate\"\n                  ></ga-rich-text-editor>\n                </div>\n              </div>\n            </div>\n          </form>\n        </nb-card-body>\n        <nb-card-footer class=\"text-left\">\n          <button (click)=\"dialogRef.close()\" status=\"basic\" outline class=\"mr-3\" nbButton>\n            {{ 'BUTTONS.CANCEL' | translate }}\n          </button>\n          <button (click)=\"onSave()\" [disabled]=\"form.invalid\" status=\"success\" nbButton>\n            {{ 'BUTTONS.SAVE' | translate }}\n          </button>\n        </nb-card-footer>\n      </nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}.body{width:550px}.description{margin-top:10px;height:150px}.name-input{min-width:100%}.estimate-inputs{display:flex;justify-content:space-between}.estimate-inputs input{width:30%;padding:.4rem!important}.nb-radio{display:inline-block}:host nb-card{background-color:var(--gauzy-card-1)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i2.UntypedFormBuilder }, { type: i3.Store }, { type: i4.TranslateService }, { type: i3.EmployeesService }, { type: i3.OrganizationTeamsService }, { type: i3.OrganizationProjectModuleService }, { type: i3.SprintService }, { type: i3.TasksService }, { type: i3.ToastrService }], propDecorators: { createModule: [{
                type: Input
            }], projectModule: [{
                type: Input
            }], project: [{
                type: Input
            }] } });
//# sourceMappingURL=project-module-mutation.component.js.map