import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, filter, firstValueFrom, map, Subject, tap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TaskStatusEnum } from '@gauzy/contracts';
import { distinctUntilChange, sluggable } from '@gauzy/ui-core/common';
import { ErrorHandlingService, Store, TaskStatusesService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@angular/forms";
import * as i4 from "@ng-select/ng-select";
import * as i5 from "../task-badge-view/task-badge-view.component";
import * as i6 from "@angular/common";
let TaskStatusSelectComponent = class TaskStatusSelectComponent extends TranslationBaseComponent {
    set projectId(value) {
        this._projectId = value;
        this.subject$.next(true); // Notify subscribers that the project ID has changed
    }
    get projectId() {
        return this._projectId;
    }
    get status() {
        return this._status;
    }
    set status(val) {
        this._status = val;
        this.onChange(val); // Notify form control value change
        this.onTouched(); // Mark as touched in form control
    }
    constructor(translateService, _store, _taskStatusesService, _errorHandlingService) {
        super(translateService);
        this.translateService = translateService;
        this._store = _store;
        this._taskStatusesService = _taskStatusesService;
        this._errorHandlingService = _errorHandlingService;
        this.subject$ = new Subject();
        /**
         * A BehaviorSubject to store and emit the latest list of task statuses.
         */
        this.statuses$ = new BehaviorSubject([]);
        /**
         * Predefined task statuses with names and sluggable values.
         */
        this._statuses = [
            { name: TaskStatusEnum.OPEN, value: sluggable(TaskStatusEnum.OPEN) },
            { name: TaskStatusEnum.IN_PROGRESS, value: sluggable(TaskStatusEnum.IN_PROGRESS) },
            { name: TaskStatusEnum.READY_FOR_REVIEW, value: sluggable(TaskStatusEnum.READY_FOR_REVIEW) },
            { name: TaskStatusEnum.IN_REVIEW, value: sluggable(TaskStatusEnum.IN_REVIEW) },
            { name: TaskStatusEnum.BLOCKED, value: sluggable(TaskStatusEnum.BLOCKED) },
            { name: TaskStatusEnum.COMPLETED, value: sluggable(TaskStatusEnum.COMPLETED) }
        ];
        /**
         * Input properties for component customization.
         *
         * @property addTag - Whether adding new tags is allowed (default: true).
         */
        this.addTag = true;
        /**
         * The placeholder text to be displayed in the project selector.
         * Provides guidance to the user on what action to take or what information to provide.
         *
         */
        this.placeholder = null;
        /**
         * Enables the default selection behavior.
         * When `true`, the component may automatically select a default team upon initialization.
         *
         * @default true
         */
        this.defaultSelected = true;
        /**
         * Callback function to notify changes in the form control.
         */
        this.onChange = () => { };
        /**
         * Callback function to notify touch events in the form control.
         */
        this.onTouched = () => { };
        /**
         * EventEmitter to notify when a status is selected or changed.
         */
        this.onChanged = new EventEmitter();
        /**
         * Creates a new task status from the ng-select input.
         *
         * @param name - The name of the new status to be created.
         * @returns A promise that resolves when the status is successfully created.
         */
        this.createNew = async (name) => {
            if (!this.organization) {
                return;
            }
            try {
                const { id: organizationId, tenantId } = this.organization;
                // Prepare the task status payload
                const payload = {
                    tenantId,
                    organizationId,
                    name,
                    value: sluggable(name),
                    ...(this.projectId ? { projectId: this.projectId } : {})
                };
                // Create the new task status and wait for completion
                await firstValueFrom(this._taskStatusesService.create(payload));
            }
            catch (error) {
                console.error('Error while creating new task status:', error);
                this._errorHandlingService.handleError(error);
            }
            finally {
                // Notify observers after creation attempt
                this.subject$.next(true);
            }
        };
    }
    ngOnInit() {
        this.subject$
            .pipe(debounceTime(200), tap(() => this.getStatuses()), untilDestroyed(this))
            .subscribe();
    }
    ngAfterViewInit() {
        const storeOrganization$ = this._store.selectedOrganization$;
        const storeProject$ = this._store.selectedProject$;
        combineLatest([storeOrganization$, storeProject$])
            .pipe(distinctUntilChange(), filter(([organization]) => !!organization), tap(([organization, project]) => {
            this.organization = organization;
            this.projectId = project ? project.id : null;
        }), tap(() => this.subject$.next(true)), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Updates the status value for the component.
     *
     * @param value - The task status to be written to the component.
     */
    writeValue(value) {
        this.status = value;
    }
    /**
     * Registers a callback function to be called when the status changes.
     *
     * @param fn - The function that is triggered on status change.
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * Registers a callback function to be called when the component is touched.
     *
     * @param fn - The function that is triggered when the component is touched.
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Emits the selected status when a task status is chosen.
     *
     * @param status - The selected task status.
     */
    selectStatus(status) {
        this.onChanged.emit(status);
    }
    /**
     * Retrieves task statuses based on the organization and project.
     * If a project ID is available, it filters statuses accordingly.
     * Emits the list of statuses and sets the default status if none is selected.
     */
    getStatuses() {
        if (!this.organization) {
            return;
        }
        const { id: organizationId, tenantId } = this.organization;
        // Fetch task statuses from the service
        this._taskStatusesService
            .get({
            tenantId,
            organizationId,
            ...(this.projectId ? { projectId: this.projectId } : {})
        })
            .pipe(
        // Map the response to either the fetched statuses or a default set
        map(({ items, total }) => (total > 0 ? items : this._statuses)), 
        // Update the observable with the fetched statuses
        tap((statuses) => {
            this.statuses$.next(statuses);
            // Set default status if no status is currently selected and defaultSelected is true
            if (this.defaultSelected) {
                this.setDefaultStatusIfNeeded(statuses);
            }
        }), untilDestroyed(this) // Clean up the subscription when component is destroyed
        )
            .subscribe();
    }
    /**
     * Sets the default status for the task if no status is currently assigned.
     *
     * This method checks if the `status` property is not set. If it is not set,
     * it looks for the default status in the provided array of statuses.
     * If found, it assigns this default status to the `status` property and triggers
     * the `onChange` callback with the default status.
     *
     * @param statuses - An array of task statuses to search for the default status.
     *                   It should contain objects that implement the `ITaskStatus` interface.
     */
    setDefaultStatusIfNeeded(statuses) {
        if (!this.status) {
            const defaultStatus = statuses.find((status) => status.name === TaskStatusEnum.OPEN);
            if (defaultStatus) {
                this.status = defaultStatus;
                this.onChange(defaultStatus);
            }
        }
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskStatusSelectComponent, deps: [{ token: i1.TranslateService }, { token: i2.Store }, { token: i2.TaskStatusesService }, { token: i2.ErrorHandlingService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TaskStatusSelectComponent, isStandalone: false, selector: "ga-task-status-select", inputs: { addTag: "addTag", placeholder: "placeholder", defaultSelected: "defaultSelected", projectId: "projectId" }, outputs: { onChanged: "onChanged" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => TaskStatusSelectComponent),
                multi: true
            }
        ], usesInheritance: true, ngImport: i0, template: "<ng-select\n\t(change)=\"selectStatus($event)\"\n\t[(ngModel)]=\"status\"\n\t[addTag]=\"addTag ? createNew : null\"\n\t[items]=\"statuses$ | async\"\n\t[placeholder]=\"placeholder || 'TASKS_PAGE.TASKS_STATUS' | translate\"\n\tappendTo=\"body\"\n\tbindLabel=\"name\"\n>\n\t<ng-template let-index=\"index\" let-item=\"item\" ng-option-tmp>\n\t\t<gauzy-task-badge-view [taskBadge]=\"item\"></gauzy-task-badge-view>\n\t</ng-template>\n\t<ng-template let-item=\"item\" ng-label-tmp>\n\t\t<gauzy-task-badge-view [taskBadge]=\"item\"></gauzy-task-badge-view>\n\t</ng-template>\n</ng-select>\n", dependencies: [{ kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i4.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "directive", type: i4.NgOptionTemplateDirective, selector: "[ng-option-tmp]" }, { kind: "directive", type: i4.NgLabelTemplateDirective, selector: "[ng-label-tmp]" }, { kind: "component", type: i5.TaskBadgeViewComponent, selector: "gauzy-task-badge-view", inputs: ["taskBadge"] }, { kind: "pipe", type: i6.AsyncPipe, name: "async" }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
TaskStatusSelectComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        Store,
        TaskStatusesService,
        ErrorHandlingService])
], TaskStatusSelectComponent);
export { TaskStatusSelectComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskStatusSelectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-task-status-select', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => TaskStatusSelectComponent),
                            multi: true
                        }
                    ], standalone: false, template: "<ng-select\n\t(change)=\"selectStatus($event)\"\n\t[(ngModel)]=\"status\"\n\t[addTag]=\"addTag ? createNew : null\"\n\t[items]=\"statuses$ | async\"\n\t[placeholder]=\"placeholder || 'TASKS_PAGE.TASKS_STATUS' | translate\"\n\tappendTo=\"body\"\n\tbindLabel=\"name\"\n>\n\t<ng-template let-index=\"index\" let-item=\"item\" ng-option-tmp>\n\t\t<gauzy-task-badge-view [taskBadge]=\"item\"></gauzy-task-badge-view>\n\t</ng-template>\n\t<ng-template let-item=\"item\" ng-label-tmp>\n\t\t<gauzy-task-badge-view [taskBadge]=\"item\"></gauzy-task-badge-view>\n\t</ng-template>\n</ng-select>\n" }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.Store }, { type: i2.TaskStatusesService }, { type: i2.ErrorHandlingService }], propDecorators: { addTag: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], defaultSelected: [{
                type: Input
            }], projectId: [{
                type: Input
            }], onChanged: [{
                type: Output
            }] } });
//# sourceMappingURL=task-status-select.component.js.map