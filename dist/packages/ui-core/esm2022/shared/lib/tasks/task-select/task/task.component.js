import { __decorate, __metadata } from "tslib";
import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, firstValueFrom } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PermissionsEnum, TaskStatusEnum } from '@gauzy/contracts';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { AuthService, Store, TasksService, ToastrService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@angular/forms";
import * as i3 from "@ng-select/ng-select";
import * as i4 from "@angular/common";
import * as i5 from "@ngx-translate/core";
let TaskSelectorComponent = class TaskSelectorComponent {
    get multiple() {
        return this._multiple;
    }
    set multiple(value) {
        this._multiple = value;
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = value;
    }
    get addTag() {
        return this._addTag;
    }
    set addTag(value) {
        this._addTag = value;
    }
    get projectId() {
        return this._projectId;
    }
    set projectId(value) {
        this._projectId = value;
        this.subject$.next(true);
    }
    get employeeId() {
        return this._employeeId;
    }
    set employeeId(value) {
        this._employeeId = value;
        this.subject$.next(true);
    }
    get taskId() {
        return this._taskId;
    }
    set taskId(value) {
        this._taskId = value;
        this.onChange(value);
        this.onTouched(value);
    }
    constructor(tasksService, toastrService, store, authService) {
        this.tasksService = tasksService;
        this.toastrService = toastrService;
        this.store = store;
        this.authService = authService;
        /**
         * Prompt shown while nothing is selected. Left null so the template keeps
         * falling back to the generic "Task", for the call sites that render the
         * selector without a label of its own.
         */
        this.placeholder = null;
        this._multiple = false;
        /*
         * Getter & Setter for dynamic enabled/disabled element
         */
        this._disabled = false;
        /*
         * Getter & Setter for dynamic add task option
         */
        this._addTag = true;
        this.tasks = [];
        this.subject$ = new Subject();
        this.onChange = () => { };
        this.onTouched = () => { };
        /**
         * Creates a new task with the given title.
         * @param {string} title - The title of the new task.
         * @returns {Promise<void>} - A Promise that resolves when the task is created.
         */
        this.createNew = async (title) => {
            try {
                // Check if organization or title is not defined, return if so
                if (!this.organization || !title) {
                    return;
                }
                // Extract organization and tenant IDs
                const { id: organizationId, tenantId } = this.organization;
                // Extract employee ID from store user
                const { employee } = this.store.user;
                const employeeId = employee?.id;
                // Prepare member object
                const member = {
                    id: this.employeeId || employeeId
                };
                // Create the task
                const task = await firstValueFrom(this.tasksService.createTask({
                    title,
                    organizationId,
                    tenantId,
                    status: TaskStatusEnum.IN_PROGRESS,
                    ...(member.id && { members: [member] }),
                    ...(this.projectId && { projectId: this.projectId })
                }));
                // Update tasks list and taskId
                this.tasks = [...this.tasks, task];
                this.taskId = task.id;
            }
            catch (error) {
                // Show error message if task creation fails
                this.toastrService.error(error);
            }
        };
    }
    ngOnInit() {
        this.hasPermissionAddTask$ = this.authService.hasPermissions(PermissionsEnum.ALL_ORG_EDIT, PermissionsEnum.ORG_TASK_ADD);
        this.subject$
            .pipe(tap(() => this.getTasks()), untilDestroyed(this))
            .subscribe();
        this.store.selectedOrganization$
            .pipe(distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this.subject$.next(true)), untilDestroyed(this))
            .subscribe();
    }
    writeValue(value) {
        this.taskId = value;
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    /**
     * Retrieves tasks based on organization, employee, and project.
     * @returns {Promise<void>} - A Promise that resolves when tasks are retrieved.
     */
    async getTasks() {
        try {
            // Check if organization is not defined, return if so
            if (!this.organization) {
                return;
            }
            // Extract organization and tenant IDs
            const { id: organizationId, tenantId } = this.organization;
            // Prepare query parameters
            const queryOption = {
                ...(this.projectId ? { projectId: this.projectId } : {}),
                organizationId,
                tenantId
            };
            // Retrieve tasks based on employee or all tasks
            if (this.employeeId) {
                this.tasks = await this.tasksService.getAllTasksByEmployee(this.employeeId, { where: queryOption });
            }
            else {
                const { items = [] } = await firstValueFrom(this.tasksService.getAllTasks({ ...queryOption }));
                this.tasks = items;
            }
        }
        catch (error) {
            // Log error if task retrieval fails
            console.error('Error while retrieving tasks:', error);
        }
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskSelectorComponent, deps: [{ token: i1.TasksService }, { token: i1.ToastrService }, { token: i1.Store }, { token: i1.AuthService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TaskSelectorComponent, isStandalone: false, selector: "ga-task-selector", inputs: { placeholder: "placeholder", multiple: "multiple", disabled: "disabled", addTag: "addTag", projectId: "projectId", employeeId: "employeeId" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => TaskSelectorComponent),
                multi: true
            }
        ], ngImport: i0, template: "<div (click)=\"$event.stopPropagation()\">\n\t<ng-select\n\t\t[addTag]=\"(hasPermissionAddTask$ | async) && addTag ? createNew : null\"\n\t\t[disabled]=\"disabled\"\n\t\t[clearable]=\"true\"\n\t\t[items]=\"tasks\"\n\t\t[(ngModel)]=\"taskId\"\n\t\t[placeholder]=\"placeholder ?? ('TIMER_TRACKER.SELECT_TASK' | translate)\"\n\t\tbindValue=\"id\"\n\t\tbindLabel=\"title\"\n\t\tappendTo=\"body\"\n\t\t[multiple]=\"multiple\"\n\t>\n\t\t<!-- Full title for the dropdown list -->\n\t\t<ng-template ng-option-tmp let-task=\"item\">\n\t\t\t{{ task.title }}\n\t\t</ng-template>\n\n\t\t<!-- Display only prefix and number after selection if multiple is enabled -->\n\t\t<ng-template ng-label-tmp let-task=\"item\">\n\t\t\t{{ multiple ? '#' + task.taskNumber : task.title }}\n\t\t</ng-template>\n\t</ng-select>\n</div>\n", dependencies: [{ kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i3.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "directive", type: i3.NgOptionTemplateDirective, selector: "[ng-option-tmp]" }, { kind: "directive", type: i3.NgLabelTemplateDirective, selector: "[ng-label-tmp]" }, { kind: "pipe", type: i4.AsyncPipe, name: "async" }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
};
TaskSelectorComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TasksService,
        ToastrService,
        Store,
        AuthService])
], TaskSelectorComponent);
export { TaskSelectorComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskSelectorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-task-selector', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => TaskSelectorComponent),
                            multi: true
                        }
                    ], standalone: false, template: "<div (click)=\"$event.stopPropagation()\">\n\t<ng-select\n\t\t[addTag]=\"(hasPermissionAddTask$ | async) && addTag ? createNew : null\"\n\t\t[disabled]=\"disabled\"\n\t\t[clearable]=\"true\"\n\t\t[items]=\"tasks\"\n\t\t[(ngModel)]=\"taskId\"\n\t\t[placeholder]=\"placeholder ?? ('TIMER_TRACKER.SELECT_TASK' | translate)\"\n\t\tbindValue=\"id\"\n\t\tbindLabel=\"title\"\n\t\tappendTo=\"body\"\n\t\t[multiple]=\"multiple\"\n\t>\n\t\t<!-- Full title for the dropdown list -->\n\t\t<ng-template ng-option-tmp let-task=\"item\">\n\t\t\t{{ task.title }}\n\t\t</ng-template>\n\n\t\t<!-- Display only prefix and number after selection if multiple is enabled -->\n\t\t<ng-template ng-label-tmp let-task=\"item\">\n\t\t\t{{ multiple ? '#' + task.taskNumber : task.title }}\n\t\t</ng-template>\n\t</ng-select>\n</div>\n" }]
        }], ctorParameters: () => [{ type: i1.TasksService }, { type: i1.ToastrService }, { type: i1.Store }, { type: i1.AuthService }], propDecorators: { placeholder: [{
                type: Input
            }], multiple: [{
                type: Input
            }], disabled: [{
                type: Input
            }], addTag: [{
                type: Input
            }], projectId: [{
                type: Input
            }], employeeId: [{
                type: Input
            }] } });
//# sourceMappingURL=task.component.js.map