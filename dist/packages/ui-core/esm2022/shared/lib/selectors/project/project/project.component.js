import { __decorate, __metadata } from "tslib";
import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { combineLatest, from, map, of, Subject, switchMap } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CrudActionEnum, PermissionsEnum } from '@gauzy/contracts';
import { distinctUntilChange, isNotEmpty } from '@gauzy/ui-core/common';
import { ErrorHandlingService, NavigationService, OrganizationProjectStore, OrganizationProjectsService, Store, ToastrService } from '@gauzy/ui-core/core';
import { ALL_PROJECT_SELECTED } from './default-project';
import { entitySelectPanelClass } from '../../entity-select-panel-class';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@angular/router";
import * as i3 from "@angular/common";
import * as i4 from "@angular/forms";
import * as i5 from "@nebular/theme";
import * as i6 from "@ng-select/ng-select";
import * as i7 from "@ngx-translate/core";
let ProjectSelectorComponent = class ProjectSelectorComponent {
    /**
     * The class list ng-select puts on its appended panel. See `entitySelectPanelClass()` for
     * why an appended panel needs the whole list rebuilt rather than added to.
     */
    get panelClass() {
        return entitySelectPanelClass(this.dropdownClass);
    }
    /**
     * Sets the project ID and triggers change and touch events.
     *
     * @param value - The project ID or array of project IDs to be set.
     */
    set projectId(value) {
        this._projectId = value;
        this.onChange(value);
        this.onTouched();
    }
    /**
     * Gets the current project ID
     *
     * @returns The current project ID or array of project IDs.
     */
    get projectId() {
        return this._projectId;
    }
    /**
     * Sets the employee ID and triggers change and touch events.
     *
     * @param value - The ID of the employee to be set.
     */
    set employeeId(value) {
        this._employeeId = value;
        this.subject$.next(true);
    }
    /**
     * Gets the current employee ID
     *
     * @returns The current employee ID or array of employee IDs.
     */
    get employeeId() {
        return this._employeeId;
    }
    /**
     * Sets the organization contact ID and triggers change and touch events.
     *
     * @param value - The ID of the organization contact to be set.
     */
    set organizationContactId(value) {
        this._organizationContactId = value;
        this.subject$.next(true);
    }
    /**
     * Gets the current organization contact ID
     *
     * @returns The current organization contact ID or array of organization contact ID.
     */
    get organizationContactId() {
        return this._organizationContactId;
    }
    constructor(_organizationProjects, _store, _toastrService, _errorHandlingService, _organizationProjectStore, _navigationService, _activatedRoute) {
        this._organizationProjects = _organizationProjects;
        this._store = _store;
        this._toastrService = _toastrService;
        this._errorHandlingService = _errorHandlingService;
        this._organizationProjectStore = _organizationProjectStore;
        this._navigationService = _navigationService;
        this._activatedRoute = _activatedRoute;
        this.projects = [];
        this.subject$ = new Subject();
        /**
         * Determines whether the component should be displayed in a shortened form.
         * This might control the size, visibility of certain elements, or compactness of the UI.
         *
         * @default false
         */
        this.shortened = false;
        /**
         * Determines whether the component is disabled and non-interactive.
         * When set to `true`, user interactions (like clicking or selecting) are disabled.
         *
         * @default false
         */
        this.disabled = false;
        /**
         * Allows multiple selections if set to `true`.
         * This could enable features like multi-select dropdowns or checkboxes.
         *
         * @default false
         */
        this.multiple = false;
        /**
         * The label text to be displayed alongside the component.
         * This could be used for accessibility purposes or to provide context to the user.
         *
         * @default null
         */
        this.label = null;
        /**
         * The placeholder text to be displayed in the project selector.
         * Provides guidance to the user on what action to take or what information to provide.
         *
         */
        this.placeholder = null;
        /**
         * Determines whether to skip triggering global change detection.
         * Useful for optimizing performance by preventing unnecessary change detection cycles.
         *
         * @default false
         */
        this.skipGlobalChange = false;
        /**
         * Enables the default selection behavior.
         * When `true`, the component may automatically select a default project upon initialization.
         *
         * @default true
         */
        this.defaultSelected = true;
        /**
         * Determines whether to display the "Show All" option in the selector.
         * Allows users to view and select all available projects if enabled.
         *
         * @default true
         */
        this.showAllOption = true;
        this.onChanged = new EventEmitter();
        /**
         * Callback function to notify changes in the form control.
         */
        this.onChange = () => { };
        /**
         * Callback function to notify touch events in the form control.
         */
        this.onTouched = () => { };
        /**
         * Creates a new project with the given name.
         *
         * @param {string} name - The name of the new project.
         */
        this.createNew = async (name) => {
            // Return early if organization or project name is not defined
            if (!this.organization || !name) {
                console.warn('Organization or project name is missing.');
                return;
            }
            try {
                // Destructure tenantId and organizationId from organization
                const { id: organizationId, tenantId } = this.organization;
                // Include member if employeeId or store user's employeeId is provided
                const memberId = this.employeeId || this._store.user.employee?.id;
                // Create the project
                const project = await this._organizationProjects.create({
                    name,
                    ...(memberId && { memberIds: [memberId] }),
                    ...(this.organizationContactId && { organizationContactId: this.organizationContactId }),
                    organizationId,
                    tenantId
                });
                // Handle the created project and update projectId
                this.createOrganizationProject(project);
                // Set the newly created project's ID
                this.projectId = project.id;
                // Show success message
                this._toastrService.success('NOTES.ORGANIZATIONS.EDIT_ORGANIZATIONS_PROJECTS.ADD_PROJECT', { name });
            }
            catch (error) {
                // Log and handle the error
                console.error('Error while creating new project: ', error);
                this._errorHandlingService.handleError(error);
            }
        };
    }
    ngOnInit() {
        this.initializePermissions();
        this.initializeProjectSelection();
        this.initializeOrganizationSelection();
        // Handle organization changes and trigger project fetch
        this._store.selectedOrganization$
            .pipe(distinctUntilChange(), filter((organization) => !!organization), tap((organization) => {
            this.organization = organization;
            this.subject$.next(true); // Triggers project fetch when organization changes
        }), untilDestroyed(this))
            .subscribe();
    }
    ngAfterViewInit() {
        this._organizationProjectStore.organizationProjectAction$
            .pipe(filter(({ action, project }) => !!action && !!project), tap(() => this._organizationProjectStore.destroy()), untilDestroyed(this))
            .subscribe(({ project, action }) => {
            switch (action) {
                case CrudActionEnum.CREATED:
                    this.createOrganizationProject(project);
                    break;
                case CrudActionEnum.UPDATED:
                    this.updateOrganizationProject(project);
                    break;
                case CrudActionEnum.DELETED:
                    this.deleteOrganizationProject(project);
                    break;
                default:
                    break;
            }
        });
    }
    /**
     * Initializes the observable that determines if the user has edit permissions for projects.
     */
    initializePermissions() {
        this.hasAddProject$ = this._store.userRolePermissions$.pipe(map(() => this._store.hasAnyPermission(PermissionsEnum.ALL_ORG_EDIT, PermissionsEnum.ORG_PROJECT_ADD)), catchError((error) => {
            console.error('Error checking permissions:', error);
            return of(false);
        }), untilDestroyed(this));
    }
    /**
     * Handles the combined stream to fetch projects and select the appropriate project
     * based on route parameters and subject emissions.
     */
    initializeProjectSelection() {
        combineLatest([this.subject$, this._activatedRoute.queryParams])
            .pipe(
        // Switch to a new observable each time the source observables emit
        switchMap(([_, queryParams]) => 
        // Fetch projects and handle errors during retrieval
        from(this.getProjects()).pipe(
        // Return the projectId from queryParams on success
        map(() => queryParams.projectId), 
        // Handle any errors that occur during project fetching
        catchError((error) => {
            console.error('Error fetching projects:', error);
            return of(null); // Return a null value to prevent project selection on error
        }))), 
        // After fetching, select the project if projectId exists
        tap((projectId) => {
            if (projectId) {
                this.selectProjectById(projectId);
            }
        }), 
        // Automatically unsubscribe when the component is destroyed
        untilDestroyed(this))
            .subscribe();
    }
    /**
     * Handles changes in the selected organization.
     *
     * Updates the local organization property and triggers a project fetch.
     */
    initializeOrganizationSelection() {
        this._store.selectedOrganization$
            .pipe(
        // Emit only when the selected organization changes
        distinctUntilChange(), 
        // Proceed only if the organization is defined
        filter((organization) => !!organization), 
        // Update the organization property and trigger a project fetch
        tap((organization) => {
            this.organization = organization;
            this.subject$.next(true); // Triggers the combined stream
        }), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Retrieves projects based on specified parameters.
     * If an employee ID is provided, retrieves projects associated with that employee.
     * Otherwise, retrieves all projects for the organization. Optionally inserts an "All Projects" option.
     */
    async getProjects() {
        // Return early if the organization is not defined
        if (!this.organization) {
            console.warn('Organization is not defined.');
            return;
        }
        const { id: organizationId, tenantId } = this.organization;
        // Construct query options
        const queryOptions = {
            ...(this.organizationContactId && { organizationContactId: this.organizationContactId }),
            organizationId,
            tenantId
        };
        try {
            // Retrieve projects based on whether employeeId is provided
            this.projects = this.employeeId
                ? await this._organizationProjects.getAllByEmployee(this.employeeId, queryOptions)
                : (await this._organizationProjects.getAll([], queryOptions)).items || [];
            // Optionally add "All Projects" option
            if (this.showAllOption) {
                this.projects.unshift(ALL_PROJECT_SELECTED);
                this.selectProject(ALL_PROJECT_SELECTED);
            }
        }
        catch (error) {
            console.error('Error retrieving projects:', error);
            this._errorHandlingService.handleError(error);
        }
    }
    /**
     * Writes a value to the component, handling single or multiple selection modes.
     *
     * @param {ID | ID[]} value - The value(s) to write, either a single ID or IDs.
     */
    writeValue(value) {
        this._projectId = this.multiple ? (Array.isArray(value) ? value : [value]) : value;
    }
    /**
     * Registers a callback function to be called when the control's value changes.
     * This method is used by Angular forms to bind the model to the view.
     *
     * @param fn - The callback function to register for the 'onChange' event.
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * Registers a callback function to be called when the component is touched.
     * @param {() => void} fn - The callback function to register.
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Sets the disabled state of the component.
     *
     * @param {boolean} isDisabled - The disabled state to set.
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    /**
     * Adds a newly created organization project to the dropdown list.
     *
     * @param {IOrganizationProject} project - The project to add.
     */
    createOrganizationProject(project) {
        if (!project) {
            console.warn('Invalid project provided');
            return;
        }
        // Ensure projects array is initialized, then add the new project
        this.projects = (this.projects ?? []).concat(project).filter(isNotEmpty);
    }
    /**
     * Updates an existing organization project in the dropdown list.
     *
     * @param {IOrganizationProject} project - The project with updated details.
     */
    updateOrganizationProject(project) {
        if (!project || !project.id) {
            console.warn('Invalid project or missing project ID');
            return;
        }
        // Map through projects to update the matching project
        this.projects = (this.projects ?? [])
            .map((item) => (item.id === project.id ? { ...item, ...project } : item))
            .filter(isNotEmpty);
    }
    /**
     * Removes a deleted organization project from the dropdown list.
     * @param {IOrganizationProject} project - The project to remove.
     */
    deleteOrganizationProject(project) {
        if (!project || !project.id) {
            console.warn('Invalid project or missing project ID');
            return;
        }
        // Filter out the project with the matching ID
        this.projects = (this.projects ?? []).filter((item) => item.id !== project.id).filter(isNotEmpty);
    }
    /**
     * Selects the specified project, updates relevant parameters, and emits the change event.
     *
     * @param {IOrganizationProject} project - The project to select.
     */
    selectProject(project) {
        const selectedProject = project ?? ALL_PROJECT_SELECTED;
        // Update global store and parameters if global changes are allowed
        if (!this.skipGlobalChange) {
            this._store.selectedProject = selectedProject;
            this.setAttributesToParams({ projectId: selectedProject.id });
        }
        // Update local state and emit the change event
        this.selectedProject = selectedProject;
        this.projectId = selectedProject.id;
        this.onChanged.emit(selectedProject);
    }
    /**
     * Sets attributes to the current navigation parameters.
     * @param params An object containing key-value pairs representing the parameters to set.
     */
    async setAttributesToParams(params) {
        await this._navigationService.updateQueryParams(params);
    }
    /**
     * Selects a project by its ID and triggers further processing if found.
     *
     * @param {ID} projectId - The unique identifier of the project to select.
     */
    selectProjectById(projectId) {
        if (!projectId) {
            console.warn('Invalid project ID provided.');
            return;
        }
        const project = this.projects?.find((project) => project.id === projectId);
        if (project) {
            this.selectProject(project);
        }
        else {
            console.warn(`Project with ID ${projectId} not found.`);
        }
    }
    /**
     * Determines if the project selector should display a clearable option.
     *
     * @returns {boolean} - Returns true if the project is clearable, false otherwise.
     */
    isClearable() {
        return this.selectedProject !== ALL_PROJECT_SELECTED;
    }
    /**
     * Clears the selected project value if the "Show All" option is disabled.
     */
    clearSelection() {
        if (!this.showAllOption) {
            this.projectId = null;
        }
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectSelectorComponent, deps: [{ token: i1.OrganizationProjectsService }, { token: i1.Store }, { token: i1.ToastrService }, { token: i1.ErrorHandlingService }, { token: i1.OrganizationProjectStore }, { token: i1.NavigationService }, { token: i2.ActivatedRoute }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ProjectSelectorComponent, isStandalone: false, selector: "ga-project-selector", inputs: { shortened: "shortened", dropdownClass: "dropdownClass", disabled: "disabled", multiple: "multiple", label: "label", placeholder: "placeholder", skipGlobalChange: "skipGlobalChange", defaultSelected: "defaultSelected", showAllOption: "showAllOption", projectId: "projectId", employeeId: "employeeId", organizationContactId: "organizationContactId" }, outputs: { onChanged: "onChanged" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => ProjectSelectorComponent),
                multi: true
            }
        ], ngImport: i0, template: "@if (label) {\n  <label class=\"label\">{{ label | translate }}</label>\n}\n\n<!-- Single Select -->\n@if (!multiple) {\n  <ng-select\n    #select\n    class=\"gauzy-entity-select\"\n    [ngClass]=\"panelClass\"\n    [addTag]=\"(hasAddProject$ | async) ? createNew : null\"\n    [multiple]=\"multiple\"\n    [clearable]=\"isClearable()\"\n    [disabled]=\"disabled\"\n    [items]=\"projects\"\n    (change)=\"selectProject($event); select.blur()\"\n    (clear)=\"select.blur(); clearSelection()\"\n    [(ngModel)]=\"projectId\"\n    [placeholder]=\"placeholder || 'FORM.PLACEHOLDERS.ALL_PROJECTS' | translate\"\n    [addTagText]=\"'FORM.PLACEHOLDERS.ADD_PROJECT' | translate\"\n    bindValue=\"id\"\n    bindLabel=\"name\"\n    appendTo=\"body\"\n    fullWidth\n    >\n    @if (shortened) {\n      <ng-template ng-option-tmp let-item=\"item\" let-index=\"index\">\n        @if (item.imageUrl) {\n          <img [src]=\"item.imageUrl\" width=\"20\" height=\"20\" alt=\"\" />\n        }\n        <span>{{ item?.name }}</span>\n      </ng-template>\n      <ng-template ng-label-tmp let-item=\"item\">\n        <div class=\"selector-template\" [title]=\"item?.name\">\n          @if (item.imageUrl) {\n            <img [src]=\"item.imageUrl\" width=\"20\" height=\"20\" alt=\"\" />\n          }\n          <span>{{ item?.name }}</span>\n        </div>\n      </ng-template>\n    }\n  </ng-select>\n} @else {\n  <nb-select\n    class=\"multiple-select\"\n    [disabled]=\"disabled\"\n    [multiple]=\"multiple\"\n    [placeholder]=\"placeholder || 'FORM.PLACEHOLDERS.ALL_PROJECTS' | translate\"\n    [(selected)]=\"projectId\"\n    fullWidth\n    >\n    @for (project of projects; track project) {\n      <nb-option [value]=\"project.id\">\n        @if (project?.imageUrl) {\n          <img [src]=\"project?.imageUrl\" width=\"20px\" height=\"20px\" />\n        }\n        <span class=\"ml-1\">{{ project.name }}</span>\n      </nb-option>\n    }\n  </nb-select>\n}\n\n<!-- Multi Select -->\n", styles: [":host{min-width:200px;display:block}:host .multiple-select{width:100%}:host ng-select .selector-template{display:flex;align-items:center;gap:.375rem;min-width:0}:host ng-select .selector-template span{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}:host ng-select img{flex:none;width:1.125rem;height:1.125rem;border-radius:var(--gauzy-radius-sm, 6px);object-fit:cover}:host ::ng-deep .ng-select .ng-select-container .ng-value-container{min-width:0}:host ::ng-deep .ng-select .ng-select-container .ng-value,:host ::ng-deep .ng-select .ng-select-container .ng-placeholder{min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i4.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i5.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i5.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "component", type: i6.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "directive", type: i6.NgOptionTemplateDirective, selector: "[ng-option-tmp]" }, { kind: "directive", type: i6.NgLabelTemplateDirective, selector: "[ng-label-tmp]" }, { kind: "pipe", type: i3.AsyncPipe, name: "async" }, { kind: "pipe", type: i7.TranslatePipe, name: "translate" }] }); }
};
ProjectSelectorComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [OrganizationProjectsService,
        Store,
        ToastrService,
        ErrorHandlingService,
        OrganizationProjectStore,
        NavigationService,
        ActivatedRoute])
], ProjectSelectorComponent);
export { ProjectSelectorComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectSelectorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-project-selector', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => ProjectSelectorComponent),
                            multi: true
                        }
                    ], standalone: false, template: "@if (label) {\n  <label class=\"label\">{{ label | translate }}</label>\n}\n\n<!-- Single Select -->\n@if (!multiple) {\n  <ng-select\n    #select\n    class=\"gauzy-entity-select\"\n    [ngClass]=\"panelClass\"\n    [addTag]=\"(hasAddProject$ | async) ? createNew : null\"\n    [multiple]=\"multiple\"\n    [clearable]=\"isClearable()\"\n    [disabled]=\"disabled\"\n    [items]=\"projects\"\n    (change)=\"selectProject($event); select.blur()\"\n    (clear)=\"select.blur(); clearSelection()\"\n    [(ngModel)]=\"projectId\"\n    [placeholder]=\"placeholder || 'FORM.PLACEHOLDERS.ALL_PROJECTS' | translate\"\n    [addTagText]=\"'FORM.PLACEHOLDERS.ADD_PROJECT' | translate\"\n    bindValue=\"id\"\n    bindLabel=\"name\"\n    appendTo=\"body\"\n    fullWidth\n    >\n    @if (shortened) {\n      <ng-template ng-option-tmp let-item=\"item\" let-index=\"index\">\n        @if (item.imageUrl) {\n          <img [src]=\"item.imageUrl\" width=\"20\" height=\"20\" alt=\"\" />\n        }\n        <span>{{ item?.name }}</span>\n      </ng-template>\n      <ng-template ng-label-tmp let-item=\"item\">\n        <div class=\"selector-template\" [title]=\"item?.name\">\n          @if (item.imageUrl) {\n            <img [src]=\"item.imageUrl\" width=\"20\" height=\"20\" alt=\"\" />\n          }\n          <span>{{ item?.name }}</span>\n        </div>\n      </ng-template>\n    }\n  </ng-select>\n} @else {\n  <nb-select\n    class=\"multiple-select\"\n    [disabled]=\"disabled\"\n    [multiple]=\"multiple\"\n    [placeholder]=\"placeholder || 'FORM.PLACEHOLDERS.ALL_PROJECTS' | translate\"\n    [(selected)]=\"projectId\"\n    fullWidth\n    >\n    @for (project of projects; track project) {\n      <nb-option [value]=\"project.id\">\n        @if (project?.imageUrl) {\n          <img [src]=\"project?.imageUrl\" width=\"20px\" height=\"20px\" />\n        }\n        <span class=\"ml-1\">{{ project.name }}</span>\n      </nb-option>\n    }\n  </nb-select>\n}\n\n<!-- Multi Select -->\n", styles: [":host{min-width:200px;display:block}:host .multiple-select{width:100%}:host ng-select .selector-template{display:flex;align-items:center;gap:.375rem;min-width:0}:host ng-select .selector-template span{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}:host ng-select img{flex:none;width:1.125rem;height:1.125rem;border-radius:var(--gauzy-radius-sm, 6px);object-fit:cover}:host ::ng-deep .ng-select .ng-select-container .ng-value-container{min-width:0}:host ::ng-deep .ng-select .ng-select-container .ng-value,:host ::ng-deep .ng-select .ng-select-container .ng-placeholder{min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.OrganizationProjectsService }, { type: i1.Store }, { type: i1.ToastrService }, { type: i1.ErrorHandlingService }, { type: i1.OrganizationProjectStore }, { type: i1.NavigationService }, { type: i2.ActivatedRoute }], propDecorators: { shortened: [{
                type: Input
            }], dropdownClass: [{
                type: Input
            }], disabled: [{
                type: Input
            }], multiple: [{
                type: Input
            }], label: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], skipGlobalChange: [{
                type: Input
            }], defaultSelected: [{
                type: Input
            }], showAllOption: [{
                type: Input
            }], projectId: [{
                type: Input
            }], employeeId: [{
                type: Input
            }], organizationContactId: [{
                type: Input
            }], onChanged: [{
                type: Output
            }] } });
//# sourceMappingURL=project.component.js.map