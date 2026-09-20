var AddTaskDialogComponent_1;
import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { TaskStatusEnum } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { EmployeesService, OrganizationProjectModuleService, OrganizationTeamsService, Store, TasksService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@angular/forms";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "@ngx-translate/core";
import * as i5 from "../../rich-text-editor/rich-text-editor.component";
import * as i6 from "../../employee/employee-multi-select/employee-multi-select.component";
import * as i7 from "../../tags/tags-color-input/tags-color-input.component";
import * as i8 from "../../selectors/project/project/project.component";
import * as i9 from "../task-status-select/task-status-select.component";
import * as i10 from "../task-priority-select/task-priority-select.component";
import * as i11 from "../task-size-select/task-size-select.component";
import * as i12 from "../task-number/task-number-field.component";
import * as i13 from "../task-select/task/task.component";
let AddTaskDialogComponent = class AddTaskDialogComponent extends TranslationBaseComponent {
    static { AddTaskDialogComponent_1 = this; }
    constructor(dialogRef, fb, store, translateService, employeesService, tasksService, organizationTeamsService, organizationProjectModuleService) {
        super(translateService);
        this.dialogRef = dialogRef;
        this.fb = fb;
        this.store = store;
        this.translateService = translateService;
        this.employeesService = employeesService;
        this.tasksService = tasksService;
        this.organizationTeamsService = organizationTeamsService;
        this.organizationProjectModuleService = organizationProjectModuleService;
        this.employees = [];
        this.teams = [];
        this.selectedMembers = [];
        this.selectedTeams = [];
        this.selectedModules = [];
        this.availableModules = [];
        this.createTask = false;
        /*
         * Payment Mutation Form
         */
        this.form = AddTaskDialogComponent_1.buildForm(this.fb);
    }
    static buildForm(fb) {
        return fb.group({
            number: [{ value: '', disabled: true }],
            title: [null, Validators.required],
            project: [],
            projectId: [],
            parentId: [],
            status: [TaskStatusEnum.OPEN, Validators.required],
            priority: [],
            size: [],
            members: [],
            estimateDays: [],
            estimateHours: [null, [Validators.min(0), Validators.max(23)]],
            estimateMinutes: [null, [Validators.min(0), Validators.max(59)]],
            dueDate: [],
            description: [],
            tags: [],
            teams: [],
            modules: [],
            taskStatus: [],
            taskSize: [],
            taskPriority: []
        });
    }
    get task() {
        return this._task;
    }
    set task(value) {
        this.selectedTask = value;
        this._task = value;
    }
    ngOnInit() {
        const storeOrganization$ = this.store.selectedOrganization$;
        const storeEmployee$ = this.store.selectedEmployee$;
        const storeProject$ = this.store.selectedProject$;
        storeOrganization$
            .pipe(distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this.loadEmployees()), tap(() => this.loadTeams()), tap(() => this.loadAvailableModules()), tap(() => this.initializeForm()), untilDestroyed(this))
            .subscribe();
        storeEmployee$
            .pipe(distinctUntilChange(), filter((employee) => !!employee && !!employee.id), tap((employee) => {
            if (!this.selectedTask) {
                this.selectedMembers.push(employee.id);
            }
        }), untilDestroyed(this))
            .subscribe();
        storeProject$
            .pipe(distinctUntilChange(), filter((project) => !!project && !!project.id), tap((project) => {
            if (!this.selectedTask) {
                this.form.get('project').setValue(project);
                this.form.get('projectId').setValue(project.id);
                this.form.updateValueAndValidity();
            }
        }), untilDestroyed(this))
            .subscribe();
        this.form
            .get('projectId')
            .valueChanges.pipe(untilDestroyed(this))
            .subscribe(() => this.loadAvailableModules());
    }
    initializeForm() {
        if (this.selectedTask) {
            const { description, dueDate, estimate, members, project, parent, status, tags, teams, title, priority, size, taskStatus, taskSize, modules, taskPriority } = this.selectedTask;
            const duration = moment.duration(estimate, 'seconds');
            // Load both members and teams - now supporting dual assignment
            this.selectedMembers = (members || []).map((member) => member.id);
            this.selectedTeams = (teams || []).map((team) => team.id);
            this.selectedModules = (modules || []).map((module) => module.id);
            this.form.patchValue({
                title,
                project,
                projectId: project ? project.id : null,
                parentId: parent ? parent.id : null,
                status,
                priority,
                size,
                estimateDays: duration.days(),
                estimateHours: duration.hours(),
                estimateMinutes: duration.minutes(),
                dueDate: dueDate ? new Date(dueDate) : null,
                description,
                tags,
                teams: this.selectedTeams,
                members: this.selectedMembers,
                modules: this.selectedModules,
                taskStatus,
                taskSize,
                taskPriority
            });
        }
    }
    onSave() {
        if (this.form.valid) {
            // Set both members and teams - now supporting dual assignment
            this.form
                .get('members')
                .setValue((this.selectedMembers || []).map((id) => this.employees.find((e) => e.id === id)).filter((e) => !!e));
            this.form
                .get('teams')
                .setValue((this.selectedTeams || []).map((id) => this.teams.find((e) => e.id === id)).filter((e) => !!e));
            const selectedModules = this.selectedModules || [];
            const mappedModules = selectedModules
                .map((id) => this.availableModules?.find((e) => e?.id === id))
                .filter(Boolean);
            this.form.get('modules')?.setValue(mappedModules);
            this.form.get('status').setValue(this.form.get('taskStatus').value?.name);
            this.form.get('priority').setValue(this.form.get('taskPriority').value?.name);
            this.form.get('size').setValue(this.form.get('taskSize').value?.name);
            const { estimateDays, estimateHours, estimateMinutes } = this.form.value;
            const estimate = estimateDays * 24 * 60 * 60 + estimateHours * 60 * 60 + estimateMinutes * 60;
            estimate ? (this.form.value.estimate = estimate) : (this.form.value.estimate = null);
            if (this.createTask) {
                firstValueFrom(this.tasksService.createTask(this.form.value)).then((task) => {
                    this.dialogRef.close(task);
                });
            }
            else {
                this.dialogRef.close(this.form.value);
            }
        }
    }
    selectedTagsHandler(tags) {
        this.form.get('tags').setValue(tags);
        this.form.get('tags').updateValueAndValidity();
    }
    selectedProject(project) {
        this.form.get('project').setValue(project);
        this.form.get('project').updateValueAndValidity();
    }
    async loadEmployees() {
        if (!this.organization) {
            return;
        }
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        const { items = [] } = await firstValueFrom(this.employeesService.getAll(['user'], {
            organizationId,
            tenantId
        }));
        this.employees = items;
    }
    onMembersSelected(members) {
        this.selectedMembers = members;
    }
    async loadTeams() {
        if (!this.organization) {
            return;
        }
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        const { items = [] } = await this.organizationTeamsService.getAll(['members'], { organizationId, tenantId });
        this.teams = items;
    }
    onTeamsSelected(teamsSelection) {
        this.selectedTeams = teamsSelection;
    }
    onModulesSelected(modules) {
        this.selectedModules = modules;
    }
    /**
     * Loads available modules based on the selected project ID.
     */
    async loadAvailableModules() {
        if (!this.organization || !this.form.get('projectId')?.value)
            return;
        const modules = await firstValueFrom(this.organizationProjectModuleService.getAllModulesByProjectId({
            projectId: this.form.get('projectId')?.value
        }));
        this.availableModules = modules?.items || [];
    }
    /**
     * Retrieves the value of a form control by its name.
     *
     * @param control - The name of the form control whose value is to be retrieved.
     * @returns string - The value of the form control. If the control is not found or the value is null, an empty string is returned.
     */
    getControlValue(control) {
        // Retrieve the form control using the given control name.
        const formControl = this.form.get(control);
        // If the control exists, return its value. Otherwise, return an empty string.
        return formControl ? formControl.value : '';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AddTaskDialogComponent, deps: [{ token: i1.NbDialogRef }, { token: i2.UntypedFormBuilder }, { token: i3.Store }, { token: i4.TranslateService }, { token: i3.EmployeesService }, { token: i3.TasksService }, { token: i3.OrganizationTeamsService }, { token: i3.OrganizationProjectModuleService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: AddTaskDialogComponent, isStandalone: false, selector: "ngx-add-task-dialog", inputs: { createTask: "createTask", task: "task" }, usesInheritance: true, ngImport: i0, template: "<nb-card class=\"main\">\n  <nb-card-header class=\"d-flex flex-column\">\n    <div class=\"cancel\">\n      <i class=\"fas fa-times\" (click)=\"dialogRef.close()\"></i>\n    </div>\n    <h5 class=\"title\">\n      {{ (selectedTask && selectedTask.id ? 'TASKS_PAGE.EDIT_TASKS' : 'TASKS_PAGE.ADD_TASKS') | translate }}\n    </h5>\n  </nb-card-header>\n  <nb-card-body class=\"body\">\n    <form [formGroup]=\"form\">\n      @if (!(selectedTask && selectedTask.id)) {\n        <div class=\"row\">\n          <div class=\"col-sm-12\">\n            <ngx-task-number-field\n              formControlName=\"number\"\n              [formControl]=\"form.get('number')\"\n              [projectId]=\"getControlValue('projectId')\"\n              [placeholder]=\"'TASKS_PAGE.TASK_NUMBER' | translate\"\n            ></ngx-task-number-field>\n          </div>\n        </div>\n      }\n      <div class=\"row\">\n        <div class=\"col-sm-6\">\n          <div class=\"form-group\">\n            <label class=\"label\">{{ 'CONTEXT_MENU.PROJECT' | translate }}</label>\n            <ga-project-selector\n              formControlName=\"projectId\"\n              [placeholder]=\"'CONTEXT_MENU.PROJECT' | translate\"\n              [skipGlobalChange]=\"true\"\n              [defaultSelected]=\"false\"\n              [showAllOption]=\"false\"\n              (onChanged)=\"selectedProject($event)\"\n            ></ga-project-selector>\n          </div>\n        </div>\n        <div class=\"col-sm-6\">\n          <div class=\"form-group\">\n            <label class=\"label\">\n              {{ 'TASKS_PAGE.TASKS_STATUS' | translate }}\n            </label>\n            <ga-task-status-select\n              [projectId]=\"getControlValue('projectId')\"\n              formControlName=\"taskStatus\"\n              [placeholder]=\"'TASKS_PAGE.TASKS_STATUS' | translate\"\n            ></ga-task-status-select>\n          </div>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-sm-12\">\n          <div class=\"form-group\">\n            <label class=\"label\">{{ 'TASKS_PAGE.MODULE' | translate }}</label>\n            <nb-select\n              formControlName=\"modules\"\n              [placeholder]=\"'TASKS_PAGE.SELECT_MODULE' | translate\"\n              [selected]=\"selectedModules\"\n              (selectedChange)=\"onModulesSelected($event)\"\n              fullWidth\n              multiple\n              >\n              @for (module of availableModules; track module) {\n                <nb-option [value]=\"module.id\">\n                  {{ module.name }}\n                </nb-option>\n              }\n            </nb-select>\n          </div>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-sm-12\">\n          <div class=\"form-group\">\n            <label class=\"label\">{{ 'TASKS_PAGE.PARENT_TASK' | translate }}</label>\n            <ga-task-selector\n              name=\"parentId\"\n              [projectId]=\"getControlValue('projectId')\"\n              formControlName=\"parentId\"\n              [required]=\"organization?.requireTask\"\n            ></ga-task-selector>\n          </div>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-sm-12\">\n          <div class=\"form-group\">\n            <ga-employee-multi-select\n              [selectedEmployeeIds]=\"selectedMembers\"\n              [allEmployees]=\"employees\"\n              (selectedChange)=\"onMembersSelected($event)\"\n              >\n            </ga-employee-multi-select>\n          </div>\n        </div>\n        <div class=\"col-sm-12\">\n          <div class=\"form-group\">\n            <label class=\"label\">{{ 'TASKS_PAGE.TASK_TEAMS' | translate }}</label>\n            <nb-select\n              formControlName=\"teams\"\n              multiple\n              [selected]=\"selectedTeams\"\n              (selectedChange)=\"onTeamsSelected($event)\"\n              fullWidth\n              [placeholder]=\"'FORM.PLACEHOLDERS.CHOOSE_TEAMS' | translate\"\n              >\n              @for (team of teams; track team) {\n                <nb-option [value]=\"team.id\"> {{ team.name }}</nb-option>\n              }\n            </nb-select>\n          </div>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-sm-12\">\n          <div class=\"form-group\">\n            <label class=\"label\">{{ 'TASKS_PAGE.TASKS_TITLE' | translate }}</label>\n            <input\n              class=\"name-input\"\n              formControlName=\"title\"\n              type=\"text\"\n              nbInput\n              [placeholder]=\"'FORM.PLACEHOLDERS.ADD_TITLE' | translate\"\n              />\n            </div>\n          </div>\n          <div class=\"col-sm-6\">\n            <div class=\"form-group\">\n              <label class=\"label\">\n                {{ 'TASKS_PAGE.TASK_PRIORITY' | translate }}\n              </label>\n              <ga-task-priority-select\n                [projectId]=\"form.get('projectId').value\"\n                formControlName=\"taskPriority\"\n                [placeholder]=\"'TASKS_PAGE.TASK_PRIORITY' | translate\"\n              ></ga-task-priority-select>\n            </div>\n          </div>\n          <div class=\"col-sm-6\">\n            <div class=\"form-group\">\n              <label class=\"label\">\n                {{ 'TASKS_PAGE.TASK_SIZE' | translate }}\n              </label>\n              <ga-task-size-select\n                [projectId]=\"form.get('projectId').value\"\n                formControlName=\"taskSize\"\n                [placeholder]=\"'TASKS_PAGE.TASK_SIZE' | translate\"\n              ></ga-task-size-select>\n            </div>\n          </div>\n          <div class=\"col-sm-12\">\n            <div class=\"form-group\">\n              <ga-tags-color-input\n                [selectedTags]=\"form.get('tags').value\"\n                (selectedTagsEvent)=\"selectedTagsHandler($event)\"\n                [isOrgLevel]=\"true\"\n              ></ga-tags-color-input>\n            </div>\n          </div>\n        </div>\n        <div class=\"row\">\n          <div class=\"col-sm-6\">\n            <div class=\"form-group\">\n              <label for=\"dueDate\" class=\"label\">{{ 'TASKS_PAGE.DUE_DATE' | translate }}</label>\n              <input\n                formControlName=\"dueDate\"\n                type=\"text\"\n                nbInput\n                [placeholder]=\"'TASKS_PAGE.DUE_DATE' | translate\"\n                [nbDatepicker]=\"taskDueDatePicker\"\n                id=\"dueDate\"\n                fullWidth\n                />\n                <nb-datepicker #taskDueDatePicker></nb-datepicker>\n              </div>\n            </div>\n            <div class=\"col-sm-6\">\n              <div class=\"form-group\">\n                <label class=\"label\">{{ 'TASKS_PAGE.ESTIMATE' | translate }}</label>\n                <div class=\"estimate-inputs\">\n                  <input\n                    formControlName=\"estimateDays\"\n                    type=\"number\"\n                    [min]=\"0\"\n                    nbInput\n                    [placeholder]=\"'TASKS_PAGE.ESTIMATE_DAYS' | translate\"\n                    />\n                    <input\n                      formControlName=\"estimateHours\"\n                      type=\"number\"\n                      [min]=\"0\"\n                      [status]=\"form.get('estimateHours').errors ? 'danger' : 'basic'\"\n                      min=\"0\"\n                      max=\"23\"\n                      nbInput\n                      [placeholder]=\"'TASKS_PAGE.ESTIMATE_HOURS' | translate\"\n                      />\n                      <input\n                        formControlName=\"estimateMinutes\"\n                        type=\"number\"\n                        [min]=\"0\"\n                        [status]=\"form.get('estimateMinutes').errors ? 'danger' : 'basic'\"\n                        min=\"0\"\n                        max=\"59\"\n                        nbInput\n                        [placeholder]=\"'TASKS_PAGE.ESTIMATE_MINUTES' | translate\"\n                        />\n                      </div>\n                    </div>\n                  </div>\n                </div>\n                <div class=\"row\">\n                  <div class=\"col-sm-12\">\n                    <div class=\"form-group\">\n                      <label class=\"label\">{{ 'TASKS_PAGE.TASKS_DESCRIPTION' | translate }}</label>\n                      <ga-rich-text-editor\n                        class=\"description\"\n                        formControlName=\"description\"\n                        preset=\"standard\"\n                        outputFormat=\"html\"\n                        [placeholder]=\"'FORM.PLACEHOLDERS.DESCRIPTION' | translate\"\n                      ></ga-rich-text-editor>\n                    </div>\n                  </div>\n                </div>\n              </form>\n            </nb-card-body>\n            <nb-card-footer class=\"text-left\">\n              <button (click)=\"dialogRef.close()\" status=\"basic\" outline class=\"mr-3\" nbButton>\n                {{ 'BUTTONS.CANCEL' | translate }}\n              </button>\n              <button (click)=\"onSave()\" [disabled]=\"form.invalid\" status=\"success\" nbButton>\n                {{ 'BUTTONS.SAVE' | translate }}\n              </button>\n            </nb-card-footer>\n          </nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}.body{width:550px}.description{margin-top:10px;height:150px}.name-input{min-width:100%}.estimate-inputs{display:flex;justify-content:space-between}.estimate-inputs input{width:30%;padding:.4rem!important}.nb-radio{display:inline-block}:host nb-card{background-color:var(--gauzy-card-1)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i2.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i2.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "directive", type: i2.MinValidator, selector: "input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]", inputs: ["min"] }, { kind: "directive", type: i2.MaxValidator, selector: "input[type=number][max][formControlName],input[type=number][max][formControl],input[type=number][max][ngModel]", inputs: ["max"] }, { kind: "directive", type: i2.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "directive", type: i2.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i2.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i5.RichTextEditorComponent, selector: "ga-rich-text-editor", inputs: ["preset", "placeholder", "outputFormat", "minHeight", "maxHeight", "characterLimit", "showCharacterCount", "editorClass", "disabled"], outputs: ["created", "changed", "focused", "blurred"] }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "directive", type: i1.NbDatepickerDirective, selector: "input[nbDatepicker]", inputs: ["nbDatepicker"] }, { kind: "component", type: i1.NbDatepickerComponent, selector: "nb-datepicker", inputs: ["date"], outputs: ["dateChange"] }, { kind: "directive", type: i1.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i1.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i1.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "component", type: i6.EmployeeSelectComponent, selector: "ga-employee-multi-select", inputs: ["reset", "allEmployees", "selectedEmployeeIds", "multiple", "label", "disabled", "placeholder"], outputs: ["selectedChange", "onLoadEmployees"] }, { kind: "component", type: i7.TagsColorInputComponent, selector: "ga-tags-color-input", inputs: ["selectedTags", "isOrgLevel", "isTenantLevel", "multiple", "label", "addTag"], outputs: ["selectedTagsEvent"] }, { kind: "component", type: i8.ProjectSelectorComponent, selector: "ga-project-selector", inputs: ["shortened", "dropdownClass", "disabled", "multiple", "label", "placeholder", "skipGlobalChange", "defaultSelected", "showAllOption", "projectId", "employeeId", "organizationContactId"], outputs: ["onChanged"] }, { kind: "component", type: i9.TaskStatusSelectComponent, selector: "ga-task-status-select", inputs: ["addTag", "placeholder", "defaultSelected", "projectId"], outputs: ["onChanged"] }, { kind: "component", type: i10.TaskPrioritySelectComponent, selector: "ga-task-priority-select", inputs: ["projectId", "addTag", "placeholder"], outputs: ["onChanged"] }, { kind: "component", type: i11.TaskSizeSelectComponent, selector: "ga-task-size-select", inputs: ["projectId", "addTag", "placeholder"], outputs: ["onChanged"] }, { kind: "component", type: i12.TaskNumberFieldComponent, selector: "ngx-task-number-field", inputs: ["formControl", "placeholder", "projectId"] }, { kind: "component", type: i13.TaskSelectorComponent, selector: "ga-task-selector", inputs: ["placeholder", "multiple", "disabled", "addTag", "projectId", "employeeId"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
};
AddTaskDialogComponent = AddTaskDialogComponent_1 = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbDialogRef,
        UntypedFormBuilder,
        Store,
        TranslateService,
        EmployeesService,
        TasksService,
        OrganizationTeamsService,
        OrganizationProjectModuleService])
], AddTaskDialogComponent);
export { AddTaskDialogComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AddTaskDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-add-task-dialog', standalone: false, template: "<nb-card class=\"main\">\n  <nb-card-header class=\"d-flex flex-column\">\n    <div class=\"cancel\">\n      <i class=\"fas fa-times\" (click)=\"dialogRef.close()\"></i>\n    </div>\n    <h5 class=\"title\">\n      {{ (selectedTask && selectedTask.id ? 'TASKS_PAGE.EDIT_TASKS' : 'TASKS_PAGE.ADD_TASKS') | translate }}\n    </h5>\n  </nb-card-header>\n  <nb-card-body class=\"body\">\n    <form [formGroup]=\"form\">\n      @if (!(selectedTask && selectedTask.id)) {\n        <div class=\"row\">\n          <div class=\"col-sm-12\">\n            <ngx-task-number-field\n              formControlName=\"number\"\n              [formControl]=\"form.get('number')\"\n              [projectId]=\"getControlValue('projectId')\"\n              [placeholder]=\"'TASKS_PAGE.TASK_NUMBER' | translate\"\n            ></ngx-task-number-field>\n          </div>\n        </div>\n      }\n      <div class=\"row\">\n        <div class=\"col-sm-6\">\n          <div class=\"form-group\">\n            <label class=\"label\">{{ 'CONTEXT_MENU.PROJECT' | translate }}</label>\n            <ga-project-selector\n              formControlName=\"projectId\"\n              [placeholder]=\"'CONTEXT_MENU.PROJECT' | translate\"\n              [skipGlobalChange]=\"true\"\n              [defaultSelected]=\"false\"\n              [showAllOption]=\"false\"\n              (onChanged)=\"selectedProject($event)\"\n            ></ga-project-selector>\n          </div>\n        </div>\n        <div class=\"col-sm-6\">\n          <div class=\"form-group\">\n            <label class=\"label\">\n              {{ 'TASKS_PAGE.TASKS_STATUS' | translate }}\n            </label>\n            <ga-task-status-select\n              [projectId]=\"getControlValue('projectId')\"\n              formControlName=\"taskStatus\"\n              [placeholder]=\"'TASKS_PAGE.TASKS_STATUS' | translate\"\n            ></ga-task-status-select>\n          </div>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-sm-12\">\n          <div class=\"form-group\">\n            <label class=\"label\">{{ 'TASKS_PAGE.MODULE' | translate }}</label>\n            <nb-select\n              formControlName=\"modules\"\n              [placeholder]=\"'TASKS_PAGE.SELECT_MODULE' | translate\"\n              [selected]=\"selectedModules\"\n              (selectedChange)=\"onModulesSelected($event)\"\n              fullWidth\n              multiple\n              >\n              @for (module of availableModules; track module) {\n                <nb-option [value]=\"module.id\">\n                  {{ module.name }}\n                </nb-option>\n              }\n            </nb-select>\n          </div>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-sm-12\">\n          <div class=\"form-group\">\n            <label class=\"label\">{{ 'TASKS_PAGE.PARENT_TASK' | translate }}</label>\n            <ga-task-selector\n              name=\"parentId\"\n              [projectId]=\"getControlValue('projectId')\"\n              formControlName=\"parentId\"\n              [required]=\"organization?.requireTask\"\n            ></ga-task-selector>\n          </div>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-sm-12\">\n          <div class=\"form-group\">\n            <ga-employee-multi-select\n              [selectedEmployeeIds]=\"selectedMembers\"\n              [allEmployees]=\"employees\"\n              (selectedChange)=\"onMembersSelected($event)\"\n              >\n            </ga-employee-multi-select>\n          </div>\n        </div>\n        <div class=\"col-sm-12\">\n          <div class=\"form-group\">\n            <label class=\"label\">{{ 'TASKS_PAGE.TASK_TEAMS' | translate }}</label>\n            <nb-select\n              formControlName=\"teams\"\n              multiple\n              [selected]=\"selectedTeams\"\n              (selectedChange)=\"onTeamsSelected($event)\"\n              fullWidth\n              [placeholder]=\"'FORM.PLACEHOLDERS.CHOOSE_TEAMS' | translate\"\n              >\n              @for (team of teams; track team) {\n                <nb-option [value]=\"team.id\"> {{ team.name }}</nb-option>\n              }\n            </nb-select>\n          </div>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-sm-12\">\n          <div class=\"form-group\">\n            <label class=\"label\">{{ 'TASKS_PAGE.TASKS_TITLE' | translate }}</label>\n            <input\n              class=\"name-input\"\n              formControlName=\"title\"\n              type=\"text\"\n              nbInput\n              [placeholder]=\"'FORM.PLACEHOLDERS.ADD_TITLE' | translate\"\n              />\n            </div>\n          </div>\n          <div class=\"col-sm-6\">\n            <div class=\"form-group\">\n              <label class=\"label\">\n                {{ 'TASKS_PAGE.TASK_PRIORITY' | translate }}\n              </label>\n              <ga-task-priority-select\n                [projectId]=\"form.get('projectId').value\"\n                formControlName=\"taskPriority\"\n                [placeholder]=\"'TASKS_PAGE.TASK_PRIORITY' | translate\"\n              ></ga-task-priority-select>\n            </div>\n          </div>\n          <div class=\"col-sm-6\">\n            <div class=\"form-group\">\n              <label class=\"label\">\n                {{ 'TASKS_PAGE.TASK_SIZE' | translate }}\n              </label>\n              <ga-task-size-select\n                [projectId]=\"form.get('projectId').value\"\n                formControlName=\"taskSize\"\n                [placeholder]=\"'TASKS_PAGE.TASK_SIZE' | translate\"\n              ></ga-task-size-select>\n            </div>\n          </div>\n          <div class=\"col-sm-12\">\n            <div class=\"form-group\">\n              <ga-tags-color-input\n                [selectedTags]=\"form.get('tags').value\"\n                (selectedTagsEvent)=\"selectedTagsHandler($event)\"\n                [isOrgLevel]=\"true\"\n              ></ga-tags-color-input>\n            </div>\n          </div>\n        </div>\n        <div class=\"row\">\n          <div class=\"col-sm-6\">\n            <div class=\"form-group\">\n              <label for=\"dueDate\" class=\"label\">{{ 'TASKS_PAGE.DUE_DATE' | translate }}</label>\n              <input\n                formControlName=\"dueDate\"\n                type=\"text\"\n                nbInput\n                [placeholder]=\"'TASKS_PAGE.DUE_DATE' | translate\"\n                [nbDatepicker]=\"taskDueDatePicker\"\n                id=\"dueDate\"\n                fullWidth\n                />\n                <nb-datepicker #taskDueDatePicker></nb-datepicker>\n              </div>\n            </div>\n            <div class=\"col-sm-6\">\n              <div class=\"form-group\">\n                <label class=\"label\">{{ 'TASKS_PAGE.ESTIMATE' | translate }}</label>\n                <div class=\"estimate-inputs\">\n                  <input\n                    formControlName=\"estimateDays\"\n                    type=\"number\"\n                    [min]=\"0\"\n                    nbInput\n                    [placeholder]=\"'TASKS_PAGE.ESTIMATE_DAYS' | translate\"\n                    />\n                    <input\n                      formControlName=\"estimateHours\"\n                      type=\"number\"\n                      [min]=\"0\"\n                      [status]=\"form.get('estimateHours').errors ? 'danger' : 'basic'\"\n                      min=\"0\"\n                      max=\"23\"\n                      nbInput\n                      [placeholder]=\"'TASKS_PAGE.ESTIMATE_HOURS' | translate\"\n                      />\n                      <input\n                        formControlName=\"estimateMinutes\"\n                        type=\"number\"\n                        [min]=\"0\"\n                        [status]=\"form.get('estimateMinutes').errors ? 'danger' : 'basic'\"\n                        min=\"0\"\n                        max=\"59\"\n                        nbInput\n                        [placeholder]=\"'TASKS_PAGE.ESTIMATE_MINUTES' | translate\"\n                        />\n                      </div>\n                    </div>\n                  </div>\n                </div>\n                <div class=\"row\">\n                  <div class=\"col-sm-12\">\n                    <div class=\"form-group\">\n                      <label class=\"label\">{{ 'TASKS_PAGE.TASKS_DESCRIPTION' | translate }}</label>\n                      <ga-rich-text-editor\n                        class=\"description\"\n                        formControlName=\"description\"\n                        preset=\"standard\"\n                        outputFormat=\"html\"\n                        [placeholder]=\"'FORM.PLACEHOLDERS.DESCRIPTION' | translate\"\n                      ></ga-rich-text-editor>\n                    </div>\n                  </div>\n                </div>\n              </form>\n            </nb-card-body>\n            <nb-card-footer class=\"text-left\">\n              <button (click)=\"dialogRef.close()\" status=\"basic\" outline class=\"mr-3\" nbButton>\n                {{ 'BUTTONS.CANCEL' | translate }}\n              </button>\n              <button (click)=\"onSave()\" [disabled]=\"form.invalid\" status=\"success\" nbButton>\n                {{ 'BUTTONS.SAVE' | translate }}\n              </button>\n            </nb-card-footer>\n          </nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}.body{width:550px}.description{margin-top:10px;height:150px}.name-input{min-width:100%}.estimate-inputs{display:flex;justify-content:space-between}.estimate-inputs input{width:30%;padding:.4rem!important}.nb-radio{display:inline-block}:host nb-card{background-color:var(--gauzy-card-1)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i2.UntypedFormBuilder }, { type: i3.Store }, { type: i4.TranslateService }, { type: i3.EmployeesService }, { type: i3.TasksService }, { type: i3.OrganizationTeamsService }, { type: i3.OrganizationProjectModuleService }], propDecorators: { createTask: [{
                type: Input
            }], task: [{
                type: Input
            }] } });
//# sourceMappingURL=add-task-dialog.component.js.map