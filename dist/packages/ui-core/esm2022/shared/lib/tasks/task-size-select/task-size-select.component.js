import { __decorate, __metadata } from "tslib";
import { Component, Input, forwardRef, EventEmitter, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { combineLatest, debounceTime, firstValueFrom, Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { TaskSizeEnum } from '@gauzy/contracts';
import { distinctUntilChange, sluggable } from '@gauzy/ui-core/common';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from '@gauzy/ui-core/core';
import { Store } from '@gauzy/ui-core/core';
import { TaskSizesService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@angular/forms";
import * as i4 from "@ng-select/ng-select";
import * as i5 from "../task-badge-view/task-badge-view.component";
import * as i6 from "@angular/common";
let TaskSizeSelectComponent = class TaskSizeSelectComponent extends TranslationBaseComponent {
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
    set size(val) {
        this._size = val;
        this.onChange(val);
        this.onTouched(val);
    }
    get size() {
        return this._size;
    }
    constructor(translateService, store, taskSizesService, toastrService) {
        super(translateService);
        this.translateService = translateService;
        this.store = store;
        this.taskSizesService = taskSizesService;
        this.toastrService = toastrService;
        this.subject$ = new Subject();
        this.sizes$ = new BehaviorSubject([]);
        /**
         * Default global task sizes
         */
        this._sizes = [
            {
                name: TaskSizeEnum.X_LARGE,
                value: sluggable(TaskSizeEnum.X_LARGE)
            },
            {
                name: TaskSizeEnum.LARGE,
                value: sluggable(TaskSizeEnum.LARGE)
            },
            {
                name: TaskSizeEnum.MEDIUM,
                value: sluggable(TaskSizeEnum.MEDIUM)
            },
            {
                name: TaskSizeEnum.SMALL,
                value: sluggable(TaskSizeEnum.SMALL)
            },
            {
                name: TaskSizeEnum.TINY,
                value: sluggable(TaskSizeEnum.TINY)
            }
        ];
        /*
         * Getter & Setter for dynamic add tag option
         */
        this._addTag = true;
        this.onChange = () => { };
        this.onTouched = () => { };
        this.onChanged = new EventEmitter();
        /**
         * Create new size from ng-select tag
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
                const source = this.taskSizesService.create({
                    tenantId,
                    organizationId,
                    name,
                    ...(this.projectId
                        ? {
                            projectId: this.projectId
                        }
                        : {})
                });
                const size = await firstValueFrom(source);
                if (size.value) {
                    this.size = size;
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
    ngOnInit() {
        this.subject$
            .pipe(debounceTime(200), tap(() => this.getTaskSizes()), untilDestroyed(this))
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
        this.size = value;
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    selectSize(size) {
        this.onChanged.emit(size);
    }
    /**
     * Get task sizes based organization & project
     */
    getTaskSizes() {
        if (!this.organization) {
            return;
        }
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        this.taskSizesService
            .get({
            tenantId,
            organizationId,
            ...(this.projectId
                ? {
                    projectId: this.projectId
                }
                : {})
        })
            .pipe(map(({ items, total }) => (total > 0 ? items : this._sizes)), tap((sizes) => this.sizes$.next(sizes)), untilDestroyed(this))
            .subscribe();
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskSizeSelectComponent, deps: [{ token: i1.TranslateService }, { token: i2.Store }, { token: i2.TaskSizesService }, { token: i2.ToastrService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TaskSizeSelectComponent, isStandalone: false, selector: "ga-task-size-select", inputs: { projectId: "projectId", addTag: "addTag", placeholder: "placeholder" }, outputs: { onChanged: "onChanged" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => TaskSizeSelectComponent),
                multi: true
            }
        ], usesInheritance: true, ngImport: i0, template: "<ng-select\n\t#select\n\tappendTo=\"body\"\n\t(change)=\"selectSize($event); select.blur()\"\n\t(clear)=\"select.blur()\"\n\t[(ngModel)]=\"size\"\n\t[addTag]=\"addTag ? createNew : null\"\n\t[clearable]=\"true\"\n\t[items]=\"sizes$ | async\"\n\t[placeholder]=\"placeholder || 'TASKS_PAGE.TASK_SIZE' | translate\"\n\tbindLabel=\"name\"\n>\n\t<ng-template let-index=\"index\" let-item=\"item\" ng-option-tmp>\n\t\t<gauzy-task-badge-view [taskBadge]=\"item\"></gauzy-task-badge-view>\n\t</ng-template>\n\t<ng-template let-item=\"item\" ng-label-tmp>\n\t\t<gauzy-task-badge-view [taskBadge]=\"item\"></gauzy-task-badge-view>\n\t</ng-template>\n</ng-select>\n", dependencies: [{ kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i4.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "directive", type: i4.NgOptionTemplateDirective, selector: "[ng-option-tmp]" }, { kind: "directive", type: i4.NgLabelTemplateDirective, selector: "[ng-label-tmp]" }, { kind: "component", type: i5.TaskBadgeViewComponent, selector: "gauzy-task-badge-view", inputs: ["taskBadge"] }, { kind: "pipe", type: i6.AsyncPipe, name: "async" }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
TaskSizeSelectComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        Store,
        TaskSizesService,
        ToastrService])
], TaskSizeSelectComponent);
export { TaskSizeSelectComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskSizeSelectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-task-size-select', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => TaskSizeSelectComponent),
                            multi: true
                        }
                    ], standalone: false, template: "<ng-select\n\t#select\n\tappendTo=\"body\"\n\t(change)=\"selectSize($event); select.blur()\"\n\t(clear)=\"select.blur()\"\n\t[(ngModel)]=\"size\"\n\t[addTag]=\"addTag ? createNew : null\"\n\t[clearable]=\"true\"\n\t[items]=\"sizes$ | async\"\n\t[placeholder]=\"placeholder || 'TASKS_PAGE.TASK_SIZE' | translate\"\n\tbindLabel=\"name\"\n>\n\t<ng-template let-index=\"index\" let-item=\"item\" ng-option-tmp>\n\t\t<gauzy-task-badge-view [taskBadge]=\"item\"></gauzy-task-badge-view>\n\t</ng-template>\n\t<ng-template let-item=\"item\" ng-label-tmp>\n\t\t<gauzy-task-badge-view [taskBadge]=\"item\"></gauzy-task-badge-view>\n\t</ng-template>\n</ng-select>\n" }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.Store }, { type: i2.TaskSizesService }, { type: i2.ToastrService }], propDecorators: { projectId: [{
                type: Input
            }], addTag: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], onChanged: [{
                type: Output
            }] } });
//# sourceMappingURL=task-size-select.component.js.map