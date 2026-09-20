import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { combineLatest, debounceTime, firstValueFrom, Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { TaskPriorityEnum } from '@gauzy/contracts';
import { distinctUntilChange, sluggable } from '@gauzy/ui-core/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@gauzy/ui-core/core';
import { TaskPrioritiesService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { ToastrService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@angular/forms";
import * as i4 from "@ng-select/ng-select";
import * as i5 from "../task-badge-view/task-badge-view.component";
import * as i6 from "@angular/common";
let TaskPrioritySelectComponent = class TaskPrioritySelectComponent extends TranslationBaseComponent {
    constructor(translateService, store, taskPrioritiesService, toastrService) {
        super(translateService);
        this.translateService = translateService;
        this.store = store;
        this.taskPrioritiesService = taskPrioritiesService;
        this.toastrService = toastrService;
        this.subject$ = new Subject();
        /**
         * Default global task priorities
         */
        this._priorities = [
            {
                name: TaskPriorityEnum.URGENT,
                value: sluggable(TaskPriorityEnum.URGENT)
            },
            {
                name: TaskPriorityEnum.HIGH,
                value: sluggable(TaskPriorityEnum.HIGH)
            },
            {
                name: TaskPriorityEnum.MEDIUM,
                value: sluggable(TaskPriorityEnum.MEDIUM)
            },
            {
                name: TaskPriorityEnum.LOW,
                value: sluggable(TaskPriorityEnum.LOW)
            }
        ];
        this.priorities$ = new BehaviorSubject([]);
        this.onChanged = new EventEmitter();
        /*
         * Getter & Setter for dynamic add tag option
         */
        this._addTag = true;
        this.onChange = () => { };
        this.onTouched = () => { };
        /**
         * Create new priority from ng-select tag
         *
         * @param name
         * @returns
         */
        this.createNew = async (name) => {
            if (!this.organization) {
                return;
            }
            try {
                const { tenantId } = this.store.user;
                const { id: organizationId } = this.organization;
                const source = this.taskPrioritiesService.create({
                    tenantId,
                    organizationId,
                    name,
                    ...(this.projectId
                        ? {
                            projectId: this.projectId
                        }
                        : {})
                });
                const priority = await firstValueFrom(source);
                if (priority) {
                    this.priority = priority;
                }
            }
            catch (error) {
                this.toastrService.error(error);
            }
            finally {
                this.subject$.next(true);
            }
        };
    }
    get projectId() {
        return this._projectId;
    }
    set projectId(value) {
        this._projectId = value;
        this.subject$.next(true);
    }
    get addTag() {
        return this._addTag;
    }
    set addTag(value) {
        this._addTag = value;
    }
    get placeholder() {
        return this._placeholder;
    }
    set placeholder(value) {
        this._placeholder = value;
    }
    get priority() {
        return this._priority;
    }
    set priority(val) {
        this._priority = val;
        this.onChange(val);
        this.onTouched(val);
    }
    ngOnInit() {
        this.subject$
            .pipe(debounceTime(200), tap(() => this.getTaskPriorities()), untilDestroyed(this))
            .subscribe();
    }
    ngAfterViewInit() {
        const storeOrganization$ = this.store.selectedOrganization$;
        const storeProject$ = this.store.selectedProject$;
        combineLatest([storeOrganization$, storeProject$])
            .pipe(distinctUntilChange(), filter(([organization]) => !!organization), tap(([organization, project]) => {
            this.organization = organization;
            this.projectId = project ? project.id : null;
        }), tap(() => this.subject$.next(true)), untilDestroyed(this))
            .subscribe();
    }
    writeValue(value) {
        this.priority = value;
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    selectPriority(priority) {
        this.onChanged.emit(priority);
    }
    /**
     * Get task priorities based organization & project
     */
    getTaskPriorities() {
        if (!this.organization) {
            return;
        }
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        this.taskPrioritiesService
            .get({
            tenantId,
            organizationId,
            ...(this.projectId
                ? {
                    projectId: this.projectId
                }
                : {})
        })
            .pipe(map(({ items, total }) => (total > 0 ? items : this._priorities)), tap((priorities) => this.priorities$.next(priorities)), untilDestroyed(this))
            .subscribe();
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskPrioritySelectComponent, deps: [{ token: i1.TranslateService }, { token: i2.Store }, { token: i2.TaskPrioritiesService }, { token: i2.ToastrService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TaskPrioritySelectComponent, isStandalone: false, selector: "ga-task-priority-select", inputs: { projectId: "projectId", addTag: "addTag", placeholder: "placeholder" }, outputs: { onChanged: "onChanged" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => TaskPrioritySelectComponent),
                multi: true
            }
        ], usesInheritance: true, ngImport: i0, template: "<ng-select\n\t#select\n\t(change)=\"selectPriority($event); select.blur()\"\n\t(clear)=\"select.blur()\"\n\t[(ngModel)]=\"priority\"\n\t[addTag]=\"addTag ? createNew : null\"\n\t[clearable]=\"true\"\n\t[items]=\"priorities$ | async\"\n\t[placeholder]=\"placeholder || 'TASKS_PAGE.TASK_PRIORITY' | translate\"\n\tappendTo=\"body\"\n\tbindLabel=\"name\"\n>\n\t<ng-template let-index=\"index\" let-item=\"item\" ng-option-tmp>\n\t\t<gauzy-task-badge-view [taskBadge]=\"item\"></gauzy-task-badge-view>\n\t</ng-template>\n\t<ng-template let-item=\"item\" ng-label-tmp>\n\t\t<gauzy-task-badge-view [taskBadge]=\"item\"></gauzy-task-badge-view>\n\t</ng-template>\n</ng-select>\n", dependencies: [{ kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i4.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "directive", type: i4.NgOptionTemplateDirective, selector: "[ng-option-tmp]" }, { kind: "directive", type: i4.NgLabelTemplateDirective, selector: "[ng-label-tmp]" }, { kind: "component", type: i5.TaskBadgeViewComponent, selector: "gauzy-task-badge-view", inputs: ["taskBadge"] }, { kind: "pipe", type: i6.AsyncPipe, name: "async" }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
TaskPrioritySelectComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        Store,
        TaskPrioritiesService,
        ToastrService])
], TaskPrioritySelectComponent);
export { TaskPrioritySelectComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskPrioritySelectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-task-priority-select', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => TaskPrioritySelectComponent),
                            multi: true
                        }
                    ], standalone: false, template: "<ng-select\n\t#select\n\t(change)=\"selectPriority($event); select.blur()\"\n\t(clear)=\"select.blur()\"\n\t[(ngModel)]=\"priority\"\n\t[addTag]=\"addTag ? createNew : null\"\n\t[clearable]=\"true\"\n\t[items]=\"priorities$ | async\"\n\t[placeholder]=\"placeholder || 'TASKS_PAGE.TASK_PRIORITY' | translate\"\n\tappendTo=\"body\"\n\tbindLabel=\"name\"\n>\n\t<ng-template let-index=\"index\" let-item=\"item\" ng-option-tmp>\n\t\t<gauzy-task-badge-view [taskBadge]=\"item\"></gauzy-task-badge-view>\n\t</ng-template>\n\t<ng-template let-item=\"item\" ng-label-tmp>\n\t\t<gauzy-task-badge-view [taskBadge]=\"item\"></gauzy-task-badge-view>\n\t</ng-template>\n</ng-select>\n" }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.Store }, { type: i2.TaskPrioritiesService }, { type: i2.ToastrService }], propDecorators: { onChanged: [{
                type: Output
            }], projectId: [{
                type: Input
            }], addTag: [{
                type: Input
            }], placeholder: [{
                type: Input
            }] } });
//# sourceMappingURL=task-priority-select.component.js.map