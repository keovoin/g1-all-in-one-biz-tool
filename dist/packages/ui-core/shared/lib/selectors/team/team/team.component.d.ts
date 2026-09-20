import { OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrganization, IOrganizationTeam, ID } from '@gauzy/contracts';
import { Observable, Subject } from 'rxjs';
import { ErrorHandlingService, NavigationService, OrganizationTeamStore, OrganizationTeamsService, Store, ToastrService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class TeamSelectorComponent implements OnInit, OnDestroy {
    private readonly _activatedRoute;
    private readonly _organizationTeamsService;
    private readonly _store;
    private readonly _toastrService;
    private readonly _errorHandlingService;
    private readonly _organizationTeamStore;
    private readonly _navigationService;
    organization: IOrganization;
    subject$: Subject<any>;
    hasAddTeam$: Observable<boolean>;
    teams: IOrganizationTeam[];
    selectedTeam: IOrganizationTeam;
    private _organizationTeamId;
    private _employeeId;
    private _projectId;
    /**
     * Determines whether the component should be displayed in a shortened form.
     * This might control the size, visibility of certain elements, or compactness of the UI.
     *
     * @default false
     */
    shortened: boolean;
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
    /**
     * Determines whether the component is disabled and non-interactive.
     * When set to `true`, user interactions (like clicking or selecting) are disabled.
     *
     * @default false
     */
    disabled: boolean;
    /**
     * Allows multiple selections if set to `true`.
     * This could enable features like multi-select dropdowns or checkboxes.
     *
     * @default false
     */
    multiple: boolean;
    /**
     * The label text to be displayed alongside the component.
     * This could be used for accessibility purposes or to provide context to the user.
     *
     * @default null
     */
    label: string | null;
    /**
     * The placeholder text to be displayed in the team selector.
     * Provides guidance to the user on what action to take or what information to provide.
     *
     */
    placeholder: string | null;
    /**
     * Determines whether to skip triggering global change detection.
     * Useful for optimizing performance by preventing unnecessary change detection cycles.
     *
     * @default false
     */
    skipGlobalChange: boolean;
    /**
     * Enables the default selection behavior.
     * When `true`, the component may automatically select a default team upon initialization.
     *
     * @default true
     */
    defaultSelected: boolean;
    /**
     * Determines whether to display the "Show All" option in the selector.
     * Allows users to view and select all available teams if enabled.
     *
     * @default true
     */
    showAllOption: boolean;
    /**
     * Sets the team ID and triggers change and touch events.
     *
     * @param value - The team ID or array of team IDs to be set.
     */
    set organizationTeamId(value: ID | ID[]);
    /**
     * Gets the current team ID
     *
     * @returns The current team ID or array of team IDs.
     */
    get organizationTeamId(): ID | ID[];
    /**
     * Sets the employee ID and triggers change and touch events.
     *
     * @param value - The ID of the employee to be set.
     */
    set employeeId(value: ID);
    /**
     * Gets the current employee ID
     *
     * @returns The current employee ID or array of employee IDs.
     */
    get employeeId(): ID | undefined;
    /**
     * Sets the project ID and triggers change and touch events.
     *
     * @param value - The ID of the project to be set.
     */
    set projectId(value: ID);
    /**
     * Gets the current project ID
     *
     * @returns The current project ID or array of project IDs.
     */
    get projectId(): ID | undefined;
    onChanged: EventEmitter<IOrganizationTeam>;
    /**
     * Callback function to notify changes in the form control.
     */
    private onChange;
    /**
     * Callback function to notify touch events in the form control.
     */
    private onTouched;
    constructor(_activatedRoute: ActivatedRoute, _organizationTeamsService: OrganizationTeamsService, _store: Store, _toastrService: ToastrService, _errorHandlingService: ErrorHandlingService, _organizationTeamStore: OrganizationTeamStore, _navigationService: NavigationService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Initializes the observable that determines if the user has edit permissions for teams.
     */
    private initializePermissions;
    /**
     * Handles the combined stream to fetch teams and select the appropriate team
     * based on route parameters and subject emissions.
     */
    private initializeTeamSelection;
    /**
     * Handles changes in the selected organization.
     *
     * Updates the local organization property and triggers a team fetch.
     */
    private initializeOrganizationSelection;
    /**
     * Retrieves teams based on specified parameters.
     * If an employee ID is provided, retrieves teams associated with that employee.
     * Otherwise, retrieves all teams for the organization. Optionally inserts an "All Projects" option.
     */
    getTeams(): Promise<void>;
    /**
     * Writes a value to the component, handling single or multiple selection modes.
     *
     * @param {ID | ID[]} value - The value(s) to write, either a single ID or IDs.
     */
    writeValue(value: ID | ID[]): void;
    /**
     * Registers a callback function to be called when the control's value changes.
     * This method is used by Angular forms to bind the model to the view.
     *
     * @param fn - The callback function to register for the 'onChange' event.
     */
    registerOnChange(fn: (value: ID | ID[]) => void): void;
    /**
     * Registers a callback function to be called when the component is touched.
     * @param {() => void} fn - The callback function to register.
     */
    registerOnTouched(fn: () => void): void;
    /**
     * Sets the disabled state of the component.
     *
     * @param {boolean} isDisabled - The disabled state to set.
     */
    setDisabledState(isDisabled: boolean): void;
    /**
     * Creates a new team with the given name.
     *
     * @param {string} name - The name of the new team.
     */
    createNew: (name: string) => Promise<void>;
    /**
     * Adds a newly created organization team to the dropdown list.
     *
     * @param team - The new organization team to add.
     */
    createOrganizationTeam(team: IOrganizationTeam): void;
    /**
     * Updates an existing organization team in the dropdown.
     *
     * @param team - The updated organization team.
     */
    updateOrganizationTeam(team: IOrganizationTeam): void;
    /**
     * Removes a deleted organization team from the dropdown.
     *
     * @param team - The organization team to remove.
     */
    deleteOrganizationTeam(team: IOrganizationTeam): void;
    selectTeam(team: IOrganizationTeam): void;
    /**
     * Sets attributes to the current navigation parameters.
     * @param params An object containing key-value pairs representing the parameters to set.
     */
    private setAttributesToParams;
    /**
     * Selects a team by its ID.
     *
     * @param teamId - The ID of the team to select.
     */
    selectTeamById(teamId: ID): void;
    /**
     * Determines if the "clear" option should be displayed in the team selector.
     *
     * @returns True if the "clear" option should be displayed, false otherwise.
     */
    isClearable(): boolean;
    /**
     * Clears the selected team value if the "Show All" option is disabled.
     */
    clearSelection(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TeamSelectorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TeamSelectorComponent, "ga-team-selector", never, { "shortened": { "alias": "shortened"; "required": false; }; "dropdownClass": { "alias": "dropdownClass"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "multiple": { "alias": "multiple"; "required": false; }; "label": { "alias": "label"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; "skipGlobalChange": { "alias": "skipGlobalChange"; "required": false; }; "defaultSelected": { "alias": "defaultSelected"; "required": false; }; "showAllOption": { "alias": "showAllOption"; "required": false; }; "organizationTeamId": { "alias": "organizationTeamId"; "required": false; }; "employeeId": { "alias": "employeeId"; "required": false; }; "projectId": { "alias": "projectId"; "required": false; }; }, { "onChanged": "onChanged"; }, never, never, false, never>;
}
