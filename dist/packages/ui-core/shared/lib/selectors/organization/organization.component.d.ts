import { OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IOrganization, ID } from '@gauzy/contracts';
import { NavigationService, OrganizationContextService, OrganizationEditStore, Store, ToastrService, UsersOrganizationsService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class OrganizationSelectorComponent implements AfterViewInit, OnInit, OnDestroy {
    private readonly _router;
    private readonly _toastrService;
    private readonly _store;
    private readonly _userOrganizationService;
    private readonly _organizationEditStore;
    private readonly _activatedRoute;
    private readonly _navigationService;
    private readonly _organizationContextService;
    organizations: IOrganization[];
    selectedOrganization: IOrganization;
    isOpen: boolean;
    hasEditOrganization$: Observable<boolean>;
    /**
     * Input properties for component customization.
     *
     * @property addTag - Whether adding new tags is allowed (default: true).
     */
    addTag: boolean;
    /**
     * Extra class(es) for the DROPDOWN PANEL, not for this component.
     *
     * The header passes `header-entity-select` so its panels can be set in the header band's
     * text; see `.ng-dropdown-panel.header-entity-select` in `_overrides.scss`.
     */
    dropdownClass: string;
    /**
     * The class list ng-select puts on its appended panel. See `entitySelectPanelClass()` for
     * why an appended panel needs the whole list rebuilt rather than added to.
     */
    get panelClass(): string | null;
    constructor(_router: Router, _toastrService: ToastrService, _store: Store, _userOrganizationService: UsersOrganizationsService, _organizationEditStore: OrganizationEditStore, _activatedRoute: ActivatedRoute, _navigationService: NavigationService, _organizationContextService: OrganizationContextService);
    ngOnInit(): void;
    /**
     * Initializes the observable that determines if the user has edit permissions for organizations.
     */
    private initializePermissions;
    /**
     * Selects an organization and updates the store and query parameters accordingly.
     * This method calls the backend to switch organization context and get a new JWT
     * with the correct employeeId for the target organization.
     *
     * @param organization - The organization to select.
     */
    selectOrganization(organization: IOrganization | null | undefined): Promise<void>;
    /**
     * Updates query parameters while preserving specified parameters.
     *
     * @param queryParams New query parameters to be added or updated.
     */
    private updateQueryParams;
    /**
     * Loads and initializes the list of organizations for the current user.
     * Retrieves organizations associated with the user, ensures uniqueness,
     * and sets the selected organization in the store based on predefined logic.
     */
    private loadOrganizations;
    /**
     * Selects and sets the active organization based on stored ID, default, or the first available.
     */
    private selectAndSetOrganization;
    /**
     * Loads the currently selected organization from the store and updates local state.
     */
    private loadSelectedOrganization;
    ngAfterViewInit(): void;
    /**
     * Adds a new organization to the dropdown list.
     *
     * @param organization - The organization to add.
     */
    createOrganization(organization: IOrganization): void;
    /**
     * Updates an existing organization in the dropdown list.
     *
     * @param organization - The organization with updated data.
     */
    updateOrganization(organization: IOrganization): Promise<void>;
    /**
     * Deletes an organization from the dropdown list.
     *
     * @param organization - The organization to delete.
     */
    deleteOrganization(organization: IOrganization): Promise<void>;
    /**
     * Creates a new organization entry and navigates to the organization's page to open the add dialog.
     *
     * @param name - The name of the new organization to be created.
     * @returns A promise that resolves if the organization creation process is successful or returns early if permissions or required data are missing.
     */
    createNew: (name: string) => Promise<void>;
    /**
     * Selects an organization by its ID.
     *
     * @param organizationId - The ID of the organization to select.
     */
    selectOrganizationById(organizationId: ID): Promise<void>;
    /**
     * Resets the store's selected organization, organization ID, and selected employee.
     */
    private resetStore;
    /**
     * Selects a random organization from the provided list.
     *
     * @param organizations - The list of organizations to select from.
     * @returns A randomly selected organization.
     */
    private getRandomOrganization;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationSelectorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<OrganizationSelectorComponent, "ga-organization-selector", never, { "addTag": { "alias": "addTag"; "required": false; }; "dropdownClass": { "alias": "dropdownClass"; "required": false; }; }, {}, never, never, false, never>;
}
