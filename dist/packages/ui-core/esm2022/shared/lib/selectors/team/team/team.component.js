import { __decorate, __metadata } from "tslib";
import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudActionEnum, PermissionsEnum } from '@gauzy/contracts';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { combineLatest, from, map, of, Subject, switchMap } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChange, isNotEmpty } from '@gauzy/ui-core/common';
import { ErrorHandlingService, NavigationService, OrganizationTeamStore, OrganizationTeamsService, Store, ToastrService } from '@gauzy/ui-core/core';
import { ALL_TEAM_SELECTED } from './default-team';
import { entitySelectPanelClass } from '../../entity-select-panel-class';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@angular/common";
import * as i4 from "@nebular/theme";
import * as i5 from "@angular/forms";
import * as i6 from "@ng-select/ng-select";
import * as i7 from "@ngx-translate/core";
let TeamSelectorComponent = class TeamSelectorComponent {
    /**
     * The class list ng-select puts on its appended panel. See `entitySelectPanelClass()` for
     * why an appended panel needs the whole list rebuilt rather than added to.
     */
    get panelClass() {
        return entitySelectPanelClass(this.dropdownClass);
    }
    /**
     * Sets the team ID and triggers change and touch events.
     *
     * @param value - The team ID or array of team IDs to be set.
     */
    set organizationTeamId(value) {
        this._organizationTeamId = value;
        this.onChange(value);
        this.onTouched();
    }
    /**
     * Gets the current team ID
     *
     * @returns The current team ID or array of team IDs.
     */
    get organizationTeamId() {
        return this._organizationTeamId;
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
     * Sets the project ID and triggers change and touch events.
     *
     * @param value - The ID of the project to be set.
     */
    set projectId(value) {
        this._projectId = value;
        this.subject$.next(true);
    }
    /**
     * Gets the current project ID
     *
     * @returns The current project ID or array of project IDs.
     */
    get projectId() {
        return this._projectId;
    }
    constructor(_activatedRoute, _organizationTeamsService, _store, _toastrService, _errorHandlingService, _organizationTeamStore, _navigationService) {
        this._activatedRoute = _activatedRoute;
        this._organizationTeamsService = _organizationTeamsService;
        this._store = _store;
        this._toastrService = _toastrService;
        this._errorHandlingService = _errorHandlingService;
        this._organizationTeamStore = _organizationTeamStore;
        this._navigationService = _navigationService;
        this.subject$ = new Subject();
        this.teams = [];
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
         * The placeholder text to be displayed in the team selector.
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
         * When `true`, the component may automatically select a default team upon initialization.
         *
         * @default true
         */
        this.defaultSelected = true;
        /**
         * Determines whether to display the "Show All" option in the selector.
         * Allows users to view and select all available teams if enabled.
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
         * Creates a new team with the given name.
         *
         * @param {string} name - The name of the new team.
         */
        this.createNew = async (name) => {
            // Return early if organization is not defined
            if (!this.organization) {
                console.warn('Organization is not defined.');
                return;
            }
            try {
                const { id: organizationId, tenantId } = this.organization;
                // Include member if employeeId or store user's employeeId is provided
                const memberId = this.employeeId || this._store.user.employee?.id;
                // Construct request object with common parameters
                const request = {
                    name,
                    ...(memberId && { memberIds: [memberId] }),
                    ...(this.projectId && { projects: [{ id: this.projectId }] }),
                    organizationId,
                    tenantId
                };
                // Handle the created team and update teamId
                const team = await this._organizationTeamsService.create(request);
                // Handle the created team
                this.createOrganizationTeam(team);
                // Set the newly created team's ID
                this.organizationTeamId = team.id;
                // Show success message
                this._toastrService.success('NOTES.ORGANIZATIONS.EDIT_ORGANIZATIONS_TEAM.ADD_NEW_TEAM', { name });
            }
            catch (error) {
                // Log and show error message
                console.error('Error while creating new team: ', error);
                this._errorHandlingService.handleError(error);
            }
        };
    }
    ngOnInit() {
        this.initializePermissions();
        this.initializeTeamSelection();
        this.initializeOrganizationSelection();
    }
    ngAfterViewInit() {
        this._organizationTeamStore.organizationTeamAction$
            .pipe(filter(({ action, team }) => !!action && !!team), tap(() => this._organizationTeamStore.destroy()), untilDestroyed(this))
            .subscribe(({ team, action }) => {
            switch (action) {
                case CrudActionEnum.CREATED:
                    this.createOrganizationTeam(team);
                    break;
                case CrudActionEnum.UPDATED:
                    this.updateOrganizationTeam(team);
                    break;
                case CrudActionEnum.DELETED:
                    this.deleteOrganizationTeam(team);
                    break;
                default:
                    break;
            }
        });
    }
    /**
     * Initializes the observable that determines if the user has edit permissions for teams.
     */
    initializePermissions() {
        this.hasAddTeam$ = this._store.userRolePermissions$.pipe(map(() => this._store.hasAnyPermission(PermissionsEnum.ALL_ORG_EDIT, PermissionsEnum.ORG_TEAM_ADD)), catchError((error) => {
            console.error('Error checking permissions:', error);
            return of(false);
        }), untilDestroyed(this));
    }
    /**
     * Handles the combined stream to fetch teams and select the appropriate team
     * based on route parameters and subject emissions.
     */
    initializeTeamSelection() {
        combineLatest([this.subject$, this._activatedRoute.queryParams])
            .pipe(
        // Switch to a new observable each time the source observables emit
        switchMap(([_, queryParams]) => 
        // Fetch teams and handle errors during retrieval
        from(this.getTeams()).pipe(
        // Return the teamId from queryParams on success
        map(() => queryParams.teamId), 
        // Handle any errors that occur during team fetching
        catchError((error) => {
            console.error('Error fetching teams:', error);
            return of(null); // Return a null value to prevent team selection on error
        }))), 
        // After fetching, select the team if teamId exists
        tap((teamId) => {
            if (teamId) {
                this.selectTeamById(teamId);
            }
        }), 
        // Automatically unsubscribe when the component is destroyed
        untilDestroyed(this))
            .subscribe();
    }
    /**
     * Handles changes in the selected organization.
     *
     * Updates the local organization property and triggers a team fetch.
     */
    initializeOrganizationSelection() {
        this._store.selectedOrganization$
            .pipe(distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this.subject$.next(true)), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Retrieves teams based on specified parameters.
     * If an employee ID is provided, retrieves teams associated with that employee.
     * Otherwise, retrieves all teams for the organization. Optionally inserts an "All Projects" option.
     */
    async getTeams() {
        // Return early if the organization is not defined
        if (!this.organization) {
            console.warn('Organization is not defined.');
            return;
        }
        const { id: organizationId, tenantId } = this.organization;
        // Construct query options
        const queryOptions = {
            organizationId,
            tenantId,
            ...(this.projectId && { projects: { id: this.projectId } })
        };
        try {
            // Retrieve teams based on whether employeeId is provided
            const teamsResponse = this.employeeId
                ? await this._organizationTeamsService.getMyTeams({
                    ...queryOptions,
                    members: { employeeId: this.employeeId }
                })
                : await this._organizationTeamsService.getAll([], queryOptions);
            // Assign teams from response
            this.teams = teamsResponse.items || [];
            // Optionally add "All Projects" option
            if (this.showAllOption) {
                this.teams.unshift(ALL_TEAM_SELECTED);
                this.selectTeam(ALL_TEAM_SELECTED);
            }
        }
        catch (error) {
            console.error('Error retrieving teams:', error);
            this._errorHandlingService.handleError(error);
        }
    }
    /**
     * Writes a value to the component, handling single or multiple selection modes.
     *
     * @param {ID | ID[]} value - The value(s) to write, either a single ID or IDs.
     */
    writeValue(value) {
        this._organizationTeamId = this.multiple ? (Array.isArray(value) ? value : [value]) : value;
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
     * Adds a newly created organization team to the dropdown list.
     *
     * @param team - The new organization team to add.
     */
    createOrganizationTeam(team) {
        if (!team) {
            console.warn('Invalid team or empty team provided.');
            return; // Ensure the team is valid and not empty before proceeding.
        }
        this.teams = [...(this.teams || []), team].filter(isNotEmpty);
    }
    /**
     * Updates an existing organization team in the dropdown.
     *
     * @param team - The updated organization team.
     */
    updateOrganizationTeam(team) {
        if (!team || !team.id) {
            console.warn('Invalid team or empty team provided.');
            return; // Ensure the team and its ID are valid before proceeding.
        }
        this.teams = (this.teams || [])
            .map((item) => (item.id === team.id ? { ...item, ...team } : item))
            .filter(isNotEmpty);
    }
    /**
     * Removes a deleted organization team from the dropdown.
     *
     * @param team - The organization team to remove.
     */
    deleteOrganizationTeam(team) {
        if (!team || !team.id) {
            console.warn('Invalid team or empty team provided.');
            return; // Ensure the team and its ID are valid before proceeding.
        }
        this.teams = (this.teams || []).filter((item) => item.id !== team.id).filter(isNotEmpty);
    }
    selectTeam(team) {
        if (!this.skipGlobalChange) {
            this._store.selectedTeam = team || ALL_TEAM_SELECTED;
            this.setAttributesToParams({ teamId: team?.id });
        }
        this.selectedTeam = team || ALL_TEAM_SELECTED;
        this.organizationTeamId = this.selectedTeam.id;
        this.onChanged.emit(team);
    }
    /**
     * Sets attributes to the current navigation parameters.
     * @param params An object containing key-value pairs representing the parameters to set.
     */
    async setAttributesToParams(params) {
        await this._navigationService.updateQueryParams(params);
    }
    /**
     * Selects a team by its ID.
     *
     * @param teamId - The ID of the team to select.
     */
    selectTeamById(teamId) {
        const team = this.teams.find((team) => teamId === team.id);
        if (team) {
            this.selectTeam(team);
        }
    }
    /**
     * Determines if the "clear" option should be displayed in the team selector.
     *
     * @returns True if the "clear" option should be displayed, false otherwise.
     */
    isClearable() {
        return this.selectedTeam !== ALL_TEAM_SELECTED;
    }
    /**
     * Clears the selected team value if the "Show All" option is disabled.
     */
    clearSelection() {
        if (!this.showAllOption) {
            this.organizationTeamId = null;
        }
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamSelectorComponent, deps: [{ token: i1.ActivatedRoute }, { token: i2.OrganizationTeamsService }, { token: i2.Store }, { token: i2.ToastrService }, { token: i2.ErrorHandlingService }, { token: i2.OrganizationTeamStore }, { token: i2.NavigationService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: TeamSelectorComponent, isStandalone: false, selector: "ga-team-selector", inputs: { shortened: "shortened", dropdownClass: "dropdownClass", disabled: "disabled", multiple: "multiple", label: "label", placeholder: "placeholder", skipGlobalChange: "skipGlobalChange", defaultSelected: "defaultSelected", showAllOption: "showAllOption", organizationTeamId: "organizationTeamId", employeeId: "employeeId", projectId: "projectId" }, outputs: { onChanged: "onChanged" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => TeamSelectorComponent),
                multi: true
            }
        ], ngImport: i0, template: "@if (label) {\n\t<label class=\"label\">{{ label | translate }}</label>\n}\n\n<!-- Single Select -->\n@if (!multiple) {\n\t<ng-select\n\t\t#select\n\t\tclass=\"gauzy-entity-select\"\n\t\t[ngClass]=\"panelClass\"\n\t\t[addTag]=\"(hasAddTeam$ | async) ? createNew : null\"\n\t\t[multiple]=\"false\"\n\t\t[clearable]=\"isClearable()\"\n\t\t[disabled]=\"disabled\"\n\t\t[items]=\"teams\"\n\t\t[(ngModel)]=\"organizationTeamId\"\n\t\t[placeholder]=\"placeholder || 'FORM.PLACEHOLDERS.ALL_TEAMS' | translate\"\n\t\t[addTagText]=\"'FORM.PLACEHOLDERS.ADD_TEAM' | translate\"\n\t\tbindValue=\"id\"\n\t\tbindLabel=\"name\"\n\t\tappendTo=\"body\"\n\t\tfullWidth\n\t\t(change)=\"selectTeam($event); select.blur()\"\n\t\t(clear)=\"clearSelection(); select.blur()\"\n\t>\n\t\t@if (shortened) {\n\t\t\t<ng-template ng-option-tmp let-item=\"item\">\n\t\t\t\t@if (item.logo) {\n\t\t\t\t\t<img [src]=\"item.logo\" width=\"20\" height=\"20\" alt=\"\" />\n\t\t\t\t}\n\t\t\t\t<span>{{ item.name }}</span>\n\t\t\t</ng-template>\n\t\t\t<ng-template ng-label-tmp let-item=\"item\">\n\t\t\t\t<div class=\"selector-template\" [title]=\"item?.name\">\n\t\t\t\t\t@if (item.logo) {\n\t\t\t\t\t\t<img [src]=\"item.logo\" width=\"20\" height=\"20\" alt=\"\" />\n\t\t\t\t\t}\n\t\t\t\t\t<span>{{ item?.name }}</span>\n\t\t\t\t</div>\n\t\t\t</ng-template>\n\t\t}\n\t</ng-select>\n} @else {\n\t<nb-select\n\t\tclass=\"multiple-select\"\n\t\t[disabled]=\"disabled\"\n\t\t[multiple]=\"true\"\n\t\t[(selected)]=\"organizationTeamId\"\n\t\t[placeholder]=\"placeholder || 'FORM.PLACEHOLDERS.ALL_TEAMS' | translate\"\n\t\tfullWidth\n\t>\n\t\t@for (team of teams; track team) {\n\t\t\t<nb-option [value]=\"team.id\">\n\t\t\t\t{{ team.name }}\n\t\t\t</nb-option>\n\t\t}\n\t</nb-select>\n}\n\n<!-- Multiple Select -->\n", styles: [":host{min-width:200px;display:block}:host .multiple-select{width:100%}:host ng-select .selector-template{display:flex;align-items:center;gap:.375rem;min-width:0}:host ng-select .selector-template span{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}:host ng-select img{flex:none;width:1.125rem;height:1.125rem;border-radius:var(--gauzy-radius-sm, 6px);object-fit:cover}:host ::ng-deep .ng-select .ng-select-container .ng-value-container{min-width:0}:host ::ng-deep .ng-select .ng-select-container .ng-value,:host ::ng-deep .ng-select .ng-select-container .ng-placeholder{min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: i4.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i4.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "directive", type: i5.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i5.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i6.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "directive", type: i6.NgOptionTemplateDirective, selector: "[ng-option-tmp]" }, { kind: "directive", type: i6.NgLabelTemplateDirective, selector: "[ng-label-tmp]" }, { kind: "pipe", type: i3.AsyncPipe, name: "async" }, { kind: "pipe", type: i7.TranslatePipe, name: "translate" }] }); }
};
TeamSelectorComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [ActivatedRoute,
        OrganizationTeamsService,
        Store,
        ToastrService,
        ErrorHandlingService,
        OrganizationTeamStore,
        NavigationService])
], TeamSelectorComponent);
export { TeamSelectorComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamSelectorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-team-selector', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => TeamSelectorComponent),
                            multi: true
                        }
                    ], standalone: false, template: "@if (label) {\n\t<label class=\"label\">{{ label | translate }}</label>\n}\n\n<!-- Single Select -->\n@if (!multiple) {\n\t<ng-select\n\t\t#select\n\t\tclass=\"gauzy-entity-select\"\n\t\t[ngClass]=\"panelClass\"\n\t\t[addTag]=\"(hasAddTeam$ | async) ? createNew : null\"\n\t\t[multiple]=\"false\"\n\t\t[clearable]=\"isClearable()\"\n\t\t[disabled]=\"disabled\"\n\t\t[items]=\"teams\"\n\t\t[(ngModel)]=\"organizationTeamId\"\n\t\t[placeholder]=\"placeholder || 'FORM.PLACEHOLDERS.ALL_TEAMS' | translate\"\n\t\t[addTagText]=\"'FORM.PLACEHOLDERS.ADD_TEAM' | translate\"\n\t\tbindValue=\"id\"\n\t\tbindLabel=\"name\"\n\t\tappendTo=\"body\"\n\t\tfullWidth\n\t\t(change)=\"selectTeam($event); select.blur()\"\n\t\t(clear)=\"clearSelection(); select.blur()\"\n\t>\n\t\t@if (shortened) {\n\t\t\t<ng-template ng-option-tmp let-item=\"item\">\n\t\t\t\t@if (item.logo) {\n\t\t\t\t\t<img [src]=\"item.logo\" width=\"20\" height=\"20\" alt=\"\" />\n\t\t\t\t}\n\t\t\t\t<span>{{ item.name }}</span>\n\t\t\t</ng-template>\n\t\t\t<ng-template ng-label-tmp let-item=\"item\">\n\t\t\t\t<div class=\"selector-template\" [title]=\"item?.name\">\n\t\t\t\t\t@if (item.logo) {\n\t\t\t\t\t\t<img [src]=\"item.logo\" width=\"20\" height=\"20\" alt=\"\" />\n\t\t\t\t\t}\n\t\t\t\t\t<span>{{ item?.name }}</span>\n\t\t\t\t</div>\n\t\t\t</ng-template>\n\t\t}\n\t</ng-select>\n} @else {\n\t<nb-select\n\t\tclass=\"multiple-select\"\n\t\t[disabled]=\"disabled\"\n\t\t[multiple]=\"true\"\n\t\t[(selected)]=\"organizationTeamId\"\n\t\t[placeholder]=\"placeholder || 'FORM.PLACEHOLDERS.ALL_TEAMS' | translate\"\n\t\tfullWidth\n\t>\n\t\t@for (team of teams; track team) {\n\t\t\t<nb-option [value]=\"team.id\">\n\t\t\t\t{{ team.name }}\n\t\t\t</nb-option>\n\t\t}\n\t</nb-select>\n}\n\n<!-- Multiple Select -->\n", styles: [":host{min-width:200px;display:block}:host .multiple-select{width:100%}:host ng-select .selector-template{display:flex;align-items:center;gap:.375rem;min-width:0}:host ng-select .selector-template span{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}:host ng-select img{flex:none;width:1.125rem;height:1.125rem;border-radius:var(--gauzy-radius-sm, 6px);object-fit:cover}:host ::ng-deep .ng-select .ng-select-container .ng-value-container{min-width:0}:host ::ng-deep .ng-select .ng-select-container .ng-value,:host ::ng-deep .ng-select .ng-select-container .ng-placeholder{min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.ActivatedRoute }, { type: i2.OrganizationTeamsService }, { type: i2.Store }, { type: i2.ToastrService }, { type: i2.ErrorHandlingService }, { type: i2.OrganizationTeamStore }, { type: i2.NavigationService }], propDecorators: { shortened: [{
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
            }], organizationTeamId: [{
                type: Input
            }], employeeId: [{
                type: Input
            }], projectId: [{
                type: Input
            }], onChanged: [{
                type: Output
            }] } });
//# sourceMappingURL=team.component.js.map