import { OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { IGithubRepository, IIntegrationTenant, IOrganization } from '@gauzy/contracts';
import { ErrorHandlingService, GithubService, Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class RepositorySelectorComponent implements OnInit, OnDestroy {
    private readonly _store;
    private readonly _githubService;
    private readonly _errorHandlingService;
    preSelected: boolean;
    loading: boolean;
    private subject$;
    organization: IOrganization;
    repositories: IGithubRepository[];
    repositories$: Observable<IGithubRepository[]>;
    /**
     * Placeholder text to guide the user. Defaults to null if not provided.
     */
    placeholder: string | null;
    /**
     * Indicates whether the component is selected. Defaults to false.
     */
    selected: boolean;
    /** Getter & Setter for integration */
    private _integration;
    /**
     * Setter for the integration property.
     * Updates the integration and notifies observers with the new value.
     */
    set integration(value: IIntegrationTenant);
    /**
     * Getter for the integration property.
     * Returns the current integration value.
     */
    get integration(): IIntegrationTenant;
    private _sourceId;
    /**
     * Setter for the sourceId property.
     * Updates the source ID and triggers relevant changes when a valid value is provided.
     */
    set sourceId(val: number);
    /**
     * Getter for the sourceId property.
     * Returns the current source ID value.
     */
    get sourceId(): number;
    /** */
    onChanged: EventEmitter<IGithubRepository>;
    afterLoad: EventEmitter<IGithubRepository[]>;
    onChange: (value: number) => void;
    onTouched: () => void;
    constructor(_store: Store, _githubService: GithubService, _errorHandlingService: ErrorHandlingService);
    ngOnInit(): void;
    /**
     * Pre-selects a repository based on the provided source ID.
     *
     * @param sourceId - The ID of the source repository to pre-select.
     */
    private _preSelectedRepository;
    /**
     * Fetches repositories for a given integration and organization.
     */
    private _getRepositories;
    /**
     * Selects a GitHub repository and emits the selection event.
     *
     * @param repository - The selected GitHub repository.
     */
    selectRepository(repository: IGithubRepository): void;
    /**
     * Write the value (repository ID) into the component.
     *
     * @param value - The value to be written, representing the repository ID.
     */
    writeValue(value: number): void;
    /**
     * Register a function to call when the control's value changes.
     *
     * @param fn - The function that handles value changes.
     */
    registerOnChange(fn: (value: number) => void): void;
    /**
     * Register a function to call when the control is touched.
     *
     * @param fn - The function that handles touch events.
     */
    registerOnTouched(fn: () => void): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RepositorySelectorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RepositorySelectorComponent, "ngx-github-repository-selector", never, { "placeholder": { "alias": "placeholder"; "required": false; }; "selected": { "alias": "selected"; "required": false; }; "integration": { "alias": "integration"; "required": false; }; "sourceId": { "alias": "sourceId"; "required": false; }; }, { "onChanged": "onChanged"; "afterLoad": "afterLoad"; }, never, never, false, never>;
}
