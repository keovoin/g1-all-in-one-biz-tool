import { OnInit, OnDestroy, AfterViewInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { IOrganization, IOrganizationProject, ID } from '@gauzy/contracts';
import { ErrorHandlingService, NavigationService, OrganizationProjectStore, OrganizationProjectsService, Store, ToastrService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class ProjectSelectorComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly _organizationProjects;
    private readonly _store;
    private readonly _toastrService;
    private readonly _errorHandlingService;
    private readonly _organizationProjectStore;
    private readonly _navigationService;
    private readonly _activatedRoute;
    projects: IOrganizationProject[];
    selectedProject: IOrganizationProject;
    hasAddProject$: Observable<boolean>;
    organization: IOrganization;
    subject$: Subject<any>;
    private _projectId;
    private _employeeId;
    private _organizationContactId;
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
     * The placeholder text to be displayed in the project selector.
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
     * When `true`, the component may automatically select a default project upon initialization.
     *
     * @default true
     */
    defaultSelected: boolean;
    /**
     * Determines whether to display the "Show All" option in the selector.
     * Allows users to view and select all available projects if enabled.
     *
     * @default true
     */
    showAllOption: boolean;
    /**
     * Sets the project ID and triggers change and touch events.
     *
     * @param value - The project ID or array of project IDs to be set.
     */
    set projectId(value: ID | ID[]);
    /**
     * Gets the current project ID
     *
     * @returns The current project ID or array of project IDs.
     */
    get projectId(): ID | ID[];
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
     * Sets the organization contact ID and triggers change and touch events.
     *
     * @param value - The ID of the organization contact to be set.
     */
    set organizationContactId(value: ID);
    /**
     * Gets the current organization contact ID
     *
     * @returns The current organization contact ID or array of organization contact ID.
     */
    get organizationContactId(): ID | undefined;
    onChanged: EventEmitter<IOrganizationProject>;
    /**
     * Callback function to notify changes in the form control.
     */
    private onChange;
    /**
     * Callback function to notify touch events in the form control.
     */
    private onTouched;
    constructor(_organizationProjects: OrganizationProjectsService, _store: Store, _toastrService: ToastrService, _errorHandlingService: ErrorHandlingService, _organizationProjectStore: OrganizationProjectStore, _navigationService: NavigationService, _activatedRoute: ActivatedRoute);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Initializes the observable that determines if the user has edit permissions for projects.
     */
    private initializePermissions;
    /**
     * Handles the combined stream to fetch projects and select the appropriate project
     * based on route parameters and subject emissions.
     */
    private initializeProjectSelection;
    /**
     * Handles changes in the selected organization.
     *
     * Updates the local organization property and triggers a project fetch.
     */
    private initializeOrganizationSelection;
    /**
     * Retrieves projects based on specified parameters.
     * If an employee ID is provided, retrieves projects associated with that employee.
     * Otherwise, retrieves all projects for the organization. Optionally inserts an "All Projects" option.
     */
    getProjects(): Promise<void>;
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
     * Creates a new project with the given name.
     *
     * @param {string} name - The name of the new project.
     */
    createNew: (name: string) => Promise<void>;
    /**
     * Adds a newly created organization project to the dropdown list.
     *
     * @param {IOrganizationProject} project - The project to add.
     */
    createOrganizationProject(project: IOrganizationProject): void;
    /**
     * Updates an existing organization project in the dropdown list.
     *
     * @param {IOrganizationProject} project - The project with updated details.
     */
    updateOrganizationProject(project: IOrganizationProject): void;
    /**
     * Removes a deleted organization project from the dropdown list.
     * @param {IOrganizationProject} project - The project to remove.
     */
    deleteOrganizationProject(project: IOrganizationProject): void;
    /**
     * Selects the specified project, updates relevant parameters, and emits the change event.
     *
     * @param {IOrganizationProject} project - The project to select.
     */
    selectProject(project: IOrganizationProject): void;
    /**
     * Sets attributes to the current navigation parameters.
     * @param params An object containing key-value pairs representing the parameters to set.
     */
    private setAttributesToParams;
    /**
     * Selects a project by its ID and triggers further processing if found.
     *
     * @param {ID} projectId - The unique identifier of the project to select.
     */
    selectProjectById(projectId: ID): void;
    /**
     * Determines if the project selector should display a clearable option.
     *
     * @returns {boolean} - Returns true if the project is clearable, false otherwise.
     */
    isClearable(): boolean;
    /**
     * Clears the selected project value if the "Show All" option is disabled.
     */
    clearSelection(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProjectSelectorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProjectSelectorComponent, "ga-project-selector", never, { "shortened": { "alias": "shortened"; "required": false; }; "dropdownClass": { "alias": "dropdownClass"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "multiple": { "alias": "multiple"; "required": false; }; "label": { "alias": "label"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; "skipGlobalChange": { "alias": "skipGlobalChange"; "required": false; }; "defaultSelected": { "alias": "defaultSelected"; "required": false; }; "showAllOption": { "alias": "showAllOption"; "required": false; }; "projectId": { "alias": "projectId"; "required": false; }; "employeeId": { "alias": "employeeId"; "required": false; }; "organizationContactId": { "alias": "organizationContactId"; "required": false; }; }, { "onChanged": "onChanged"; }, never, never, false, never>;
}
