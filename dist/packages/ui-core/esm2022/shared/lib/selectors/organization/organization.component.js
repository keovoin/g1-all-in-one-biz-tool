import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, distinctUntilChanged, filter, map, of, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { uniq } from 'underscore';
import { CrudActionEnum, PermissionsEnum } from '@gauzy/contracts';
import { isNotEmpty } from '@gauzy/ui-core/common';
import { NavigationService, OrganizationContextService, OrganizationEditStore, Store, ToastrService, UsersOrganizationsService } from '@gauzy/ui-core/core';
import { entitySelectPanelClass } from '../entity-select-panel-class';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@angular/common";
import * as i4 from "@angular/forms";
import * as i5 from "@ng-select/ng-select";
import * as i6 from "../../directives/img.directive";
import * as i7 from "@ngx-translate/core";
let OrganizationSelectorComponent = class OrganizationSelectorComponent {
    /**
     * The class list ng-select puts on its appended panel. See `entitySelectPanelClass()` for
     * why an appended panel needs the whole list rebuilt rather than added to.
     */
    get panelClass() {
        return entitySelectPanelClass(this.dropdownClass, 'organization-entity-select');
    }
    constructor(_router, _toastrService, _store, _userOrganizationService, _organizationEditStore, _activatedRoute, _navigationService, _organizationContextService) {
        this._router = _router;
        this._toastrService = _toastrService;
        this._store = _store;
        this._userOrganizationService = _userOrganizationService;
        this._organizationEditStore = _organizationEditStore;
        this._activatedRoute = _activatedRoute;
        this._navigationService = _navigationService;
        this._organizationContextService = _organizationContextService;
        this.organizations = [];
        this.isOpen = false;
        /**
         * Input properties for component customization.
         *
         * @property addTag - Whether adding new tags is allowed (default: true).
         */
        this.addTag = true;
        /**
         * Creates a new organization entry and navigates to the organization's page to open the add dialog.
         *
         * @param name - The name of the new organization to be created.
         * @returns A promise that resolves if the organization creation process is successful or returns early if permissions or required data are missing.
         */
        this.createNew = async (name) => {
            // Check if the user has the required permissions
            if (!this._store.hasPermission(PermissionsEnum.ALL_ORG_EDIT)) {
                return;
            }
            // Ensure that both the selected organization and name are provided
            if (!this.selectedOrganization || !name) {
                return;
            }
            try {
                // Navigate to the organization's page and open the add dialog with the provided name
                await this._router.navigate(['/pages/organizations/'], {
                    queryParams: { openAddDialog: true },
                    state: { name, officialName: name }
                });
            }
            catch (error) {
                // Display an error message in case of any navigation failure
                this._toastrService.error(error);
            }
        };
    }
    ngOnInit() {
        this.initializePermissions();
        this.loadSelectedOrganization();
        this.loadOrganizations().then(() => {
            this._activatedRoute.queryParams
                .pipe(filter((query) => !!query.organizationId), tap(({ organizationId }) => this.selectOrganizationById(organizationId)), untilDestroyed(this))
                .subscribe();
        });
    }
    /**
     * Initializes the observable that determines if the user has edit permissions for organizations.
     */
    initializePermissions() {
        this.hasEditOrganization$ = this._store.userRolePermissions$.pipe(map(() => this._store.hasPermission(PermissionsEnum.ALL_ORG_EDIT)), catchError((error) => {
            console.error('Error checking permissions:', error);
            return of(false);
        }), untilDestroyed(this));
    }
    /**
     * Selects an organization and updates the store and query parameters accordingly.
     * This method calls the backend to switch organization context and get a new JWT
     * with the correct employeeId for the target organization.
     *
     * @param organization - The organization to select.
     */
    async selectOrganization(organization) {
        if (!organization) {
            this._toastrService.warning('No organization provided to select.');
            console.warn('No organization provided to select.');
            return;
        }
        // Check if we're already on this organization
        if (this._store.selectedOrganization?.id === organization.id) {
            console.info('Already on this organization, skipping switch.');
            return;
        }
        console.log(`Switching to Organization: ${organization.name}`);
        // Call the backend to switch organization and get new JWT with correct employeeId
        const success = await this._organizationContextService.switchOrganization(organization);
        if (success) {
            // Update the query parameters in the URL
            this._navigationService.updateQueryParams({ organizationId: organization.id });
        }
    }
    /**
     * Updates query parameters while preserving specified parameters.
     *
     * @param queryParams New query parameters to be added or updated.
     */
    async updateQueryParams(queryParams) {
        await this._navigationService.updateQueryParams(queryParams);
    }
    /**
     * Loads and initializes the list of organizations for the current user.
     * Retrieves organizations associated with the user, ensures uniqueness,
     * and sets the selected organization in the store based on predefined logic.
     */
    async loadOrganizations() {
        try {
            // Retrieve the user's ID and tenant ID
            const { id: userId, tenantId } = this._store.user;
            // Define base relations
            const relations = ['organization', 'organization.contact'];
            // Add feature organizations relations only if user has permission
            if (this._store.hasPermission(PermissionsEnum.ALL_ORG_VIEW)) {
                relations.push('organization.featureOrganizations', 'organization.featureOrganizations.feature');
            }
            // Fetch all organizations associated with the user
            const { items = [] } = await this._userOrganizationService.getAll(relations, { userId, tenantId });
            // Extract organizations from the fetched items
            const fetchedOrganizations = items.map(({ organization }) => organization);
            // Remove duplicate organizations based on their ID
            this.organizations = uniq(fetchedOrganizations, 'id');
            // Select and set the active organization
            this.selectAndSetOrganization();
        }
        catch (error) {
            // Handle errors during organization loading
            console.error('Failed to load organizations:', error);
        }
    }
    /**
     * Selects and sets the active organization based on stored ID, default, or the first available.
     */
    selectAndSetOrganization() {
        // Check if there are organizations available
        if (this.organizations.length > 0) {
            // Select the organization based on the following priority:
            // 1. Organization with the stored ID
            // 2. Default organization
            // 3. First organization in the list
            this._store.selectedOrganization =
                this.organizations.find((org) => org.id === this._store.organizationId) ||
                    this.organizations.find((org) => org.isDefault) ||
                    this.organizations[0] ||
                    null;
            // Log the selected organization if it exists
            if (this._store.selectedOrganization) {
                // Update the query parameters in the URL
                this.updateQueryParams({ organizationId: this._store.selectedOrganization.id });
            }
            else {
                // Handle the unlikely case where organizations exist but no selection was made
                console.warn('No valid organization found to select.');
                this.resetStore();
            }
        }
        else {
            // Handle the case where no organizations are available
            this.resetStore();
            console.warn('No organizations found for the user. Store has been reset.');
        }
    }
    /**
     * Loads the currently selected organization from the store and updates local state.
     */
    loadSelectedOrganization() {
        this._store.selectedOrganization$
            .pipe(distinctUntilChanged((prev, curr) => prev?.id === curr?.id), filter((organization) => !!organization), tap((organization) => {
            this.selectedOrganization = organization;
            this._store.featureOrganizations = organization.featureOrganizations || [];
        }), untilDestroyed(this))
            .subscribe({
            error: (error) => {
                console.error('Error loading selected organization:', error);
                this._toastrService.error('Failed to load selected organization.', error);
            }
        });
    }
    ngAfterViewInit() {
        this._organizationEditStore.organizationAction$
            .pipe(filter(({ action, organization }) => !!action && !!organization), tap(() => this._organizationEditStore.destroy()), untilDestroyed(this))
            .subscribe(({ organization, action }) => {
            switch (action) {
                case CrudActionEnum.CREATED:
                    this.createOrganization(organization);
                    break;
                case CrudActionEnum.UPDATED:
                    this.updateOrganization(organization);
                    break;
                case CrudActionEnum.DELETED:
                    this.deleteOrganization(organization);
                    break;
                default:
                    break;
            }
        });
    }
    /**
     * Adds a new organization to the dropdown list.
     *
     * @param organization - The organization to add.
     */
    createOrganization(organization) {
        // Initialize the organizations array if it's undefined or null
        const updatedOrganizations = [...(this.organizations ?? []), organization];
        // Filter out any empty or invalid entries, if necessary
        this.organizations = updatedOrganizations.filter(isNotEmpty);
    }
    /**
     * Updates an existing organization in the dropdown list.
     *
     * @param organization - The organization with updated data.
     */
    async updateOrganization(organization) {
        // Check if the organization exists
        const exists = this.organizations.some((org) => org.id === organization.id);
        if (!exists) {
            console.log('updated organization not found: ', organization?.name);
            return;
        }
        try {
            // Update the organizations array immutably by mapping through existing organizations
            const updatedOrganizations = this.organizations.map((org) => org.id === organization.id ? { ...org, ...organization } : org);
            // Update the store with the selected organization details
            await this.selectOrganization(organization);
            // Assign the filtered and updated organizations list
            this.organizations = updatedOrganizations.filter(isNotEmpty);
        }
        catch (error) {
            console.error('Error updating organization:', error);
            this._toastrService.error('Failed to update organization.', error);
        }
    }
    /**
     * Deletes an organization from the dropdown list.
     *
     * @param organization - The organization to delete.
     */
    async deleteOrganization(organization) {
        if (!organization) {
            console.warn('No organization provided to delete.');
            return;
        }
        // Check if the organization exists
        const exists = this.organizations.some((org) => org.id === organization.id);
        if (!exists) {
            console.warn(`Delete failed: Organization with ID ${organization.id} not found.`);
            return;
        }
        try {
            // Remove the organization immutably by filtering it out
            const updatedOrganizations = this.organizations.filter((org) => org.id !== organization.id);
            // Assign the filtered and updated organizations list
            this.organizations = updatedOrganizations.filter(isNotEmpty);
            // Check if the deleted organization was the selected one
            if (this._store.selectedOrganization?.id === organization.id) {
                if (updatedOrganizations.length > 0) {
                    // Select a random organization from the updated list
                    const randomOrg = this.getRandomOrganization(updatedOrganizations);
                    await this.selectOrganization(randomOrg);
                }
                else {
                    // No organizations left; reset the store
                    this.resetStore();
                    console.warn('All organizations have been deleted. Store has been reset.');
                }
            }
            console.log(`Organization with ID ${organization.id} deleted successfully.`);
        }
        catch (error) {
            // Handle any errors that occur during deletion
            console.error(`Failed to delete organization with ID ${organization.id}`, error);
            this._toastrService.error(`Failed to delete organization "${organization.name}".`, error);
        }
    }
    /**
     * Selects an organization by its ID.
     *
     * @param organizationId - The ID of the organization to select.
     */
    async selectOrganizationById(organizationId) {
        const organization = this.organizations.find((organization) => organization.id === organizationId);
        if (organization) {
            await this.selectOrganization(organization);
        }
    }
    /**
     * Resets the store's selected organization, organization ID, and selected employee.
     */
    resetStore() {
        this._store.selectedOrganization = null;
        this._store.organizationId = null;
        this._store.selectedEmployee = null;
        console.info('Store reset: selectedOrganization, organizationId, and selectedEmployee have been cleared.');
    }
    /**
     * Selects a random organization from the provided list.
     *
     * @param organizations - The list of organizations to select from.
     * @returns A randomly selected organization.
     */
    getRandomOrganization(organizations) {
        if (organizations.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * organizations.length);
        return organizations[randomIndex];
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationSelectorComponent, deps: [{ token: i1.Router }, { token: i2.ToastrService }, { token: i2.Store }, { token: i2.UsersOrganizationsService }, { token: i2.OrganizationEditStore }, { token: i1.ActivatedRoute }, { token: i2.NavigationService }, { token: i2.OrganizationContextService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: OrganizationSelectorComponent, isStandalone: false, selector: "ga-organization-selector", inputs: { addTag: "addTag", dropdownClass: "dropdownClass" }, ngImport: i0, template: "@if (organizations) {\n<div>\n\t<!--\n\t\tThe isOpen flag is REPORTED by ng-select through its open and close outputs. It must\n\t\tnever be fed back in through the isOpen input: doing so puts ng-select into its\n\t\t_manualOpen mode, which early-returns out of open, close, _handleSpace and\n\t\t_handleArrowDown. The control then stays in the tab order while being impossible to\n\t\toperate. Measured against the sibling employee selector, which does not feed it back:\n\n\t\t  opens on mousedown          organization 0 of 3      employee 3 of 3\n\t\t  Enter, Space, ArrowDown     all fail                 all work\n\t\t  Escape closes               never, stuck open 3 of 3 works\n\n\t\tThat is a WCAG 2.1.1 Level A failure. It also made this the only control in the app\n\t\tneeding a complete, well-formed click to open at all: because the searchable input\n\t\tis driven from the same flag, the control is non-searchable while closed, so\n\t\tmousedown took the toggle path, early-returned, and did nothing \u2014 leaving the\n\t\ttemplate's own click handler as the only way to open it.\n\n\t\tThe flag is still needed, since the searchable, addTag and close-class bindings all\n\t\tread it, so it stays as a mirror FED BY ng-select rather than a second source of\n\t\ttruth fighting it. The gauzyOutside directive went away with the manual state:\n\t\tng-select dismisses itself on an outside click once it owns that state. Avoiding\n\t\tthat directive here is a bonus \u2014 it declares its output as an emitter of MouseEvent\n\t\tbut actually emits a boolean, and the old handler worked only because of the\n\t\tmismatch.\n\n\t\tDismissal, measured after the change and identical to the employee selector:\n\t\tclicking the control BODY while open lands in the search input and keeps it open,\n\t\tclicking the ARROW closes it, and Escape, an outside click or picking an item all\n\t\tclose it too.\n\n\t\tThis element also carried three state classes, all of them now gone:\n\n\t\t  [class.organization]=\"isOpen\"\n\t\t  [class.organization]=\"!isOpen\"\n\t\t  [class.close]=\"!isOpen\"\n\n\t\tThe first two are one binding written twice, so `.organization` was really just\n\t\t\"always on\" via whichever copy Angular applied last. Nothing outside this file\n\t\tever styled it.\n\n\t\t`.close` is the damaging one. `bootstrap.css` is loaded globally (it is in the\n\t\tapp's `styles` list) and ships `.close` as a UTILITY for dismiss buttons:\n\n\t\t  .close { float: right; font-size: 1.5rem; font-weight: 700; line-height: 1;\n\t\t           color: #000; text-shadow: 0 1px 0 #fff; opacity: .5 }\n\n\t\tSo the control picked all of that up exactly while the dropdown was CLOSED and\n\t\tshed it again on open, which is why the two states did not read as the same\n\t\twidget. `text-shadow` is the one nothing in the app resets: it inherits down to\n\t\tthe label and paints a white copy of the text one pixel below it, so the closed\n\t\ttrigger looked doubled. `float: right` applies here too, since this ng-select is\n\t\ta block-level child of a plain `<div>`. The `opacity: .5` was already being\n\t\tclawed back by a `.organization.close { opacity: 1 }` rule in the stylesheet \u2014\n\t\tthat rule went with these bindings, having nothing left to undo.\n\n\t\tNothing replaces them: `isOpen` still drives `searchable` and `addTag`, and a\n\t\tstylesheet that wants the open state has ng-select's own `.ng-select-opened`.\n\n\t\tTwo classes ride on the element below purely so they reach the DROPDOWN PANEL.\n\t\tWith `appendTo` set, ng-select puts them there itself:\n\n\t\t  [class]=\"appendToValue ? (ngClass() ? ngClass() : classes) : null\"\n\n\t\tand that copy is the only handle a stylesheet has on an appended panel \u2014 every one\n\t\tof them is otherwise just `.ng-dropdown-panel`. `classes` is read once through\n\t\t`HostAttributeToken('class')`, so it has to be a STATIC attribute; a `[class.x]`\n\t\tbinding never reaches the panel. `[ngClass]` REPLACES that fallback rather than\n\t\tadding to it, which is why `panelClass` rebuilds both names.\n\n\t\t`organization-entity-select` lets `_overrides.scss` right-align THIS panel: the\n\t\theader's organization control sits too close to the right edge of the screen for a\n\t\tleft-anchored panel.\n\t-->\n\t<ng-select\n\t\t#select\n\t\tclass=\"gauzy-entity-select organization-entity-select\"\n\t\t[ngClass]=\"panelClass\"\n\t\t[addTag]=\"(hasEditOrganization$ | async) && addTag && isOpen ? createNew : null\"\n\t\t[searchable]=\"isOpen\"\n\t\t[clearable]=\"false\"\n\t\t[items]=\"organizations\"\n\t\tbindLabel=\"name\"\n\t\t(change)=\"selectOrganization($event); select.blur()\"\n\t\t(clear)=\"select.blur()\"\n\t\t[(ngModel)]=\"selectedOrganization\"\n\t\t[placeholder]=\"'FORM.PLACEHOLDERS.SELECT_COMPANY' | translate\"\n\t\t[addTagText]=\"'FORM.PLACEHOLDERS.ADD_ORGANIZATION' | translate\"\n\t\tappendTo=\"body\"\n\t\t(open)=\"isOpen = true\"\n\t\t(close)=\"isOpen = false\"\n\t>\n\t\t<ng-template ng-option-tmp let-item=\"item\" let-index=\"index\">\n\t\t\t@if (item.imageUrl) {\n\t\t\t<img [src]=\"item.imageUrl\" width=\"40\" height=\"40\" alt=\"\" />\n\t\t\t}\n\t\t\t<span>{{ item.name }}</span>\n\t\t</ng-template>\n\t\t<ng-template ng-label-tmp let-item=\"item\">\n\t\t\t<!-- The trigger is a fixed-width pill in the header band, so the name\n\t\t\t     clips to an ellipsis; the title carries the untruncated one. The\n\t\t\t     employee, project and team selectors each do the same. -->\n\t\t\t<div class=\"selector-template\" [title]=\"item?.name\">\n\t\t\t\t@if (item.imageUrl) {\n\t\t\t\t<img height=\"25\" width=\"25\" [src]=\"item.imageUrl\" alt=\"\" />\n\t\t\t\t}\n\t\t\t\t<span>{{ item.name }}</span>\n\t\t\t</div>\n\t\t</ng-template>\n\t</ng-select>\n</div>\n}\n", styles: ["ng-select .selector-template{display:flex;align-items:center;gap:.375rem;min-width:0}ng-select .selector-template span{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}ng-select img{flex:none;width:1.125rem;height:1.125rem;border-radius:var(--gauzy-radius-sm, 6px);object-fit:cover}:host ::ng-deep .ng-select .ng-select-container .ng-value-container{min-width:0}:host ::ng-deep .ng-select .ng-select-container .ng-value,:host ::ng-deep .ng-select .ng-select-container .ng-placeholder{min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i4.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i5.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "directive", type: i5.NgOptionTemplateDirective, selector: "[ng-option-tmp]" }, { kind: "directive", type: i5.NgLabelTemplateDirective, selector: "[ng-label-tmp]" }, { kind: "directive", type: i6.ImgDirective, selector: "img", inputs: ["type", "skipDefaultImage", "enableFadeIn"] }, { kind: "pipe", type: i3.AsyncPipe, name: "async" }, { kind: "pipe", type: i7.TranslatePipe, name: "translate" }] }); }
};
OrganizationSelectorComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Router,
        ToastrService,
        Store,
        UsersOrganizationsService,
        OrganizationEditStore,
        ActivatedRoute,
        NavigationService,
        OrganizationContextService])
], OrganizationSelectorComponent);
export { OrganizationSelectorComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationSelectorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-organization-selector', standalone: false, template: "@if (organizations) {\n<div>\n\t<!--\n\t\tThe isOpen flag is REPORTED by ng-select through its open and close outputs. It must\n\t\tnever be fed back in through the isOpen input: doing so puts ng-select into its\n\t\t_manualOpen mode, which early-returns out of open, close, _handleSpace and\n\t\t_handleArrowDown. The control then stays in the tab order while being impossible to\n\t\toperate. Measured against the sibling employee selector, which does not feed it back:\n\n\t\t  opens on mousedown          organization 0 of 3      employee 3 of 3\n\t\t  Enter, Space, ArrowDown     all fail                 all work\n\t\t  Escape closes               never, stuck open 3 of 3 works\n\n\t\tThat is a WCAG 2.1.1 Level A failure. It also made this the only control in the app\n\t\tneeding a complete, well-formed click to open at all: because the searchable input\n\t\tis driven from the same flag, the control is non-searchable while closed, so\n\t\tmousedown took the toggle path, early-returned, and did nothing \u2014 leaving the\n\t\ttemplate's own click handler as the only way to open it.\n\n\t\tThe flag is still needed, since the searchable, addTag and close-class bindings all\n\t\tread it, so it stays as a mirror FED BY ng-select rather than a second source of\n\t\ttruth fighting it. The gauzyOutside directive went away with the manual state:\n\t\tng-select dismisses itself on an outside click once it owns that state. Avoiding\n\t\tthat directive here is a bonus \u2014 it declares its output as an emitter of MouseEvent\n\t\tbut actually emits a boolean, and the old handler worked only because of the\n\t\tmismatch.\n\n\t\tDismissal, measured after the change and identical to the employee selector:\n\t\tclicking the control BODY while open lands in the search input and keeps it open,\n\t\tclicking the ARROW closes it, and Escape, an outside click or picking an item all\n\t\tclose it too.\n\n\t\tThis element also carried three state classes, all of them now gone:\n\n\t\t  [class.organization]=\"isOpen\"\n\t\t  [class.organization]=\"!isOpen\"\n\t\t  [class.close]=\"!isOpen\"\n\n\t\tThe first two are one binding written twice, so `.organization` was really just\n\t\t\"always on\" via whichever copy Angular applied last. Nothing outside this file\n\t\tever styled it.\n\n\t\t`.close` is the damaging one. `bootstrap.css` is loaded globally (it is in the\n\t\tapp's `styles` list) and ships `.close` as a UTILITY for dismiss buttons:\n\n\t\t  .close { float: right; font-size: 1.5rem; font-weight: 700; line-height: 1;\n\t\t           color: #000; text-shadow: 0 1px 0 #fff; opacity: .5 }\n\n\t\tSo the control picked all of that up exactly while the dropdown was CLOSED and\n\t\tshed it again on open, which is why the two states did not read as the same\n\t\twidget. `text-shadow` is the one nothing in the app resets: it inherits down to\n\t\tthe label and paints a white copy of the text one pixel below it, so the closed\n\t\ttrigger looked doubled. `float: right` applies here too, since this ng-select is\n\t\ta block-level child of a plain `<div>`. The `opacity: .5` was already being\n\t\tclawed back by a `.organization.close { opacity: 1 }` rule in the stylesheet \u2014\n\t\tthat rule went with these bindings, having nothing left to undo.\n\n\t\tNothing replaces them: `isOpen` still drives `searchable` and `addTag`, and a\n\t\tstylesheet that wants the open state has ng-select's own `.ng-select-opened`.\n\n\t\tTwo classes ride on the element below purely so they reach the DROPDOWN PANEL.\n\t\tWith `appendTo` set, ng-select puts them there itself:\n\n\t\t  [class]=\"appendToValue ? (ngClass() ? ngClass() : classes) : null\"\n\n\t\tand that copy is the only handle a stylesheet has on an appended panel \u2014 every one\n\t\tof them is otherwise just `.ng-dropdown-panel`. `classes` is read once through\n\t\t`HostAttributeToken('class')`, so it has to be a STATIC attribute; a `[class.x]`\n\t\tbinding never reaches the panel. `[ngClass]` REPLACES that fallback rather than\n\t\tadding to it, which is why `panelClass` rebuilds both names.\n\n\t\t`organization-entity-select` lets `_overrides.scss` right-align THIS panel: the\n\t\theader's organization control sits too close to the right edge of the screen for a\n\t\tleft-anchored panel.\n\t-->\n\t<ng-select\n\t\t#select\n\t\tclass=\"gauzy-entity-select organization-entity-select\"\n\t\t[ngClass]=\"panelClass\"\n\t\t[addTag]=\"(hasEditOrganization$ | async) && addTag && isOpen ? createNew : null\"\n\t\t[searchable]=\"isOpen\"\n\t\t[clearable]=\"false\"\n\t\t[items]=\"organizations\"\n\t\tbindLabel=\"name\"\n\t\t(change)=\"selectOrganization($event); select.blur()\"\n\t\t(clear)=\"select.blur()\"\n\t\t[(ngModel)]=\"selectedOrganization\"\n\t\t[placeholder]=\"'FORM.PLACEHOLDERS.SELECT_COMPANY' | translate\"\n\t\t[addTagText]=\"'FORM.PLACEHOLDERS.ADD_ORGANIZATION' | translate\"\n\t\tappendTo=\"body\"\n\t\t(open)=\"isOpen = true\"\n\t\t(close)=\"isOpen = false\"\n\t>\n\t\t<ng-template ng-option-tmp let-item=\"item\" let-index=\"index\">\n\t\t\t@if (item.imageUrl) {\n\t\t\t<img [src]=\"item.imageUrl\" width=\"40\" height=\"40\" alt=\"\" />\n\t\t\t}\n\t\t\t<span>{{ item.name }}</span>\n\t\t</ng-template>\n\t\t<ng-template ng-label-tmp let-item=\"item\">\n\t\t\t<!-- The trigger is a fixed-width pill in the header band, so the name\n\t\t\t     clips to an ellipsis; the title carries the untruncated one. The\n\t\t\t     employee, project and team selectors each do the same. -->\n\t\t\t<div class=\"selector-template\" [title]=\"item?.name\">\n\t\t\t\t@if (item.imageUrl) {\n\t\t\t\t<img height=\"25\" width=\"25\" [src]=\"item.imageUrl\" alt=\"\" />\n\t\t\t\t}\n\t\t\t\t<span>{{ item.name }}</span>\n\t\t\t</div>\n\t\t</ng-template>\n\t</ng-select>\n</div>\n}\n", styles: ["ng-select .selector-template{display:flex;align-items:center;gap:.375rem;min-width:0}ng-select .selector-template span{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}ng-select img{flex:none;width:1.125rem;height:1.125rem;border-radius:var(--gauzy-radius-sm, 6px);object-fit:cover}:host ::ng-deep .ng-select .ng-select-container .ng-value-container{min-width:0}:host ::ng-deep .ng-select .ng-select-container .ng-value,:host ::ng-deep .ng-select .ng-select-container .ng-placeholder{min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.Router }, { type: i2.ToastrService }, { type: i2.Store }, { type: i2.UsersOrganizationsService }, { type: i2.OrganizationEditStore }, { type: i1.ActivatedRoute }, { type: i2.NavigationService }, { type: i2.OrganizationContextService }], propDecorators: { addTag: [{
                type: Input
            }], dropdownClass: [{
                type: Input
            }] } });
//# sourceMappingURL=organization.component.js.map