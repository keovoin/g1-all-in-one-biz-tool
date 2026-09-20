import { Store as AkitaStore, Query } from '@datorama/akita';
import { Subject } from 'rxjs';
import { IOrganization, PermissionsEnum, IRolePermission, IUser, LanguagesEnum, IOrganizationProject, ILanguage, IProposalViewModel, IFeatureToggle, IFeatureOrganization, FeatureEnum, ISelectedEmployee, ComponentLayoutStyleEnum, IOrganizationTeam, IWorkSpace } from '@gauzy/contracts';
import { ComponentEnum, GuiDrag } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
export interface AppState {
    user: IUser;
    userRolePermissions: IRolePermission[];
    selectedOrganization: IOrganization;
    selectedEmployee: ISelectedEmployee;
    selectedProposal: IProposalViewModel;
    selectedProject: IOrganizationProject;
    selectedTeam: IOrganizationTeam;
    workspaces: IWorkSpace[];
    selectedWorkspace: IWorkSpace;
    workspacesLoading: boolean;
    workspacesError: string | null;
    systemLanguages: ILanguage[];
    featureToggles: IFeatureToggle[];
    featureOrganizations: IFeatureOrganization[];
    featureTenant: IFeatureOrganization[];
    /** Whether this deployment does billing at all. False on every self-hosted install by default. */
    billingEnabled: boolean;
}
export interface PersistState {
    organizationId?: string;
    clientId?: string;
    token: string;
    refresh_token: string;
    userId: string;
    serverConnection: number;
    preferredLanguage: LanguagesEnum;
    preferredComponentLayout: ComponentLayoutStyleEnum;
    componentLayout: any[];
    themeName: string;
    windows: Partial<GuiDrag>[];
    widgets: Partial<GuiDrag>[];
    tenantId: string;
}
export declare function createInitialAppState(): AppState;
export declare function createInitialPersistState(): PersistState;
export declare class AppStore extends AkitaStore<AppState> {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<AppStore, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AppStore>;
}
export declare class PersistStore extends AkitaStore<PersistState> {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<PersistStore, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PersistStore>;
}
export declare class AppQuery extends Query<AppState> {
    constructor(store: AppStore);
    static ɵfac: i0.ɵɵFactoryDeclaration<AppQuery, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AppQuery>;
}
export declare class PersistQuery extends Query<PersistState> {
    constructor(store: PersistStore);
    static ɵfac: i0.ɵɵFactoryDeclaration<PersistQuery, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PersistQuery>;
}
export declare class Store {
    protected readonly appStore: AppStore;
    protected readonly appQuery: AppQuery;
    protected readonly persistStore: PersistStore;
    protected readonly persistQuery: PersistQuery;
    constructor(appStore: AppStore, appQuery: AppQuery, persistStore: PersistStore, persistQuery: PersistQuery);
    user$: import("rxjs").Observable<IUser>;
    selectedOrganization$: import("rxjs").Observable<IOrganization>;
    selectedEmployee$: import("rxjs").Observable<ISelectedEmployee>;
    selectedProject$: import("rxjs").Observable<IOrganizationProject>;
    selectedTeam$: import("rxjs").Observable<IOrganizationTeam>;
    workspaces$: import("rxjs").Observable<IWorkSpace[]>;
    selectedWorkspace$: import("rxjs").Observable<IWorkSpace>;
    workspacesLoading$: import("rxjs").Observable<boolean>;
    workspacesError$: import("rxjs").Observable<string>;
    userRolePermissions$: import("rxjs").Observable<IRolePermission[]>;
    featureToggles$: import("rxjs").Observable<IFeatureToggle[]>;
    featureOrganizations$: import("rxjs").Observable<IFeatureOrganization[]>;
    featureTenant$: import("rxjs").Observable<IFeatureOrganization[]>;
    preferredLanguage$: import("rxjs").Observable<LanguagesEnum>;
    preferredComponentLayout$: import("rxjs").Observable<ComponentLayoutStyleEnum>;
    componentLayoutMap$: import("rxjs").Observable<Map<unknown, unknown>>;
    systemLanguages$: import("rxjs").Observable<ILanguage[]>;
    subject: Subject<ComponentEnum>;
    /**
     * Observe any change to the component layout.
     * Returns the layout for the component given in the params in the following order of preference
     * 1. If overridden at component level, return that.
     * Else
     * 2. If preferred layout set, then return that
     * Else
     * 3. Return the system default layout
     */
    componentLayout$(component: ComponentEnum): import("rxjs").Observable<any>;
    get selectedOrganization(): IOrganization;
    set selectedOrganization(organization: IOrganization);
    get selectedEmployee(): ISelectedEmployee;
    set selectedEmployee(employee: ISelectedEmployee);
    get selectedProject(): IOrganizationProject;
    set selectedProject(project: IOrganizationProject);
    get selectedTeam(): IOrganizationTeam;
    set selectedTeam(team: IOrganizationTeam);
    set systemLanguages(languages: ILanguage[]);
    get systemLanguages(): ILanguage[];
    get refresh_token(): string | null;
    set refresh_token(refresh_token: string);
    get token(): string | null;
    set token(token: string);
    get userId(): IUser['id'] | null;
    set userId(id: IUser['id'] | null);
    get organizationId(): IOrganization['id'] | null;
    set organizationId(id: IOrganization['id'] | null);
    get user(): IUser;
    set user(user: IUser);
    get selectedProposal(): IProposalViewModel;
    set selectedProposal(proposal: IProposalViewModel);
    get featureToggles(): IFeatureToggle[];
    set featureToggles(featureToggles: IFeatureToggle[]);
    get billingEnabled(): boolean;
    set billingEnabled(billingEnabled: boolean);
    get featureTenant(): IFeatureOrganization[];
    set featureTenant(featureOrganizations: IFeatureOrganization[]);
    get featureOrganizations(): IFeatureOrganization[];
    set featureOrganizations(featureOrganizations: IFeatureOrganization[]);
    hasFeatureEnabled(feature: FeatureEnum): boolean;
    /**
     * Returns the user role permissions from the application state.
     *
     * @return {IRolePermission[]} The user role permissions.
     */
    get userRolePermissions(): IRolePermission[];
    /**
     * Updates the user role permissions in the application state.
     *
     * @param {IRolePermission[]} userRolePermissions - The new user role permissions.
     */
    set userRolePermissions(userRolePermissions: IRolePermission[]);
    /**
     * Checks if the user has a specific permission.
     *
     * @param {PermissionsEnum} permission - The permission to check.
     * @return {boolean} Returns true if the user has the permission, false otherwise.
     */
    hasPermission(permission: PermissionsEnum): boolean;
    /**
     * Checks if the user has all the specified permissions.
     *
     * @param {...PermissionsEnum[]} permissions - The permissions to check.
     * @return {boolean} Returns true if the user has all the permissions, false otherwise.
     */
    hasAllPermissions(...permissions: PermissionsEnum[]): boolean;
    /**
     * Checks if the user has any of the specified permissions.
     *
     * @param {...PermissionsEnum[]} permissions - The permissions to check.
     * @return {boolean} Returns true if the user has any of the permissions, false otherwise.
     */
    hasAnyPermission(...permissions: PermissionsEnum[]): boolean;
    get serverConnection(): number;
    set serverConnection(val: number);
    get preferredLanguage(): any | null;
    set preferredLanguage(preferredLanguage: any | null);
    get preferredComponentLayout(): any | null;
    set preferredComponentLayout(preferredComponentLayout: any | null);
    get workspaces(): IWorkSpace[];
    set workspaces(workspaces: IWorkSpace[]);
    get selectedWorkspace(): IWorkSpace;
    set selectedWorkspace(workspace: IWorkSpace);
    get workspacesLoading(): boolean;
    set workspacesLoading(loading: boolean);
    get workspacesError(): string | null;
    set workspacesError(error: string | null);
    /**
     * Load workspaces and update the store
     * @param workspaces - Array of workspaces to set
     * @param selectedWorkspaceId - ID of the workspace to mark as selected
     */
    setWorkspaces(workspaces: IWorkSpace[], selectedWorkspaceId?: string): void;
    /**
     * Set workspaces loading state
     * @param loading - Loading state
     * @param error - Optional error message
     */
    setWorkspacesLoading(loading: boolean, error?: string | null): void;
    clear(): void;
    getLayoutForComponent(componentName: ComponentEnum): ComponentLayoutStyleEnum;
    setLayoutForComponent(componentName: ComponentEnum, style: ComponentLayoutStyleEnum): void;
    set componentLayout(componentLayout: any[]);
    get currentTheme(): string | null;
    set currentTheme(name: string);
    get windows(): Partial<GuiDrag>[];
    set windows(values: Partial<GuiDrag>[]);
    get widgets(): Partial<GuiDrag>[];
    set widgets(values: Partial<GuiDrag>[]);
    get tenantId(): string | null;
    set tenantId(value: string);
    static ɵfac: i0.ɵɵFactoryDeclaration<Store, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<Store>;
}
