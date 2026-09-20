import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { StoreConfig, Store as AkitaStore, Query } from '@datorama/akita';
import { merge, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { uniq } from 'underscore';
import { SYSTEM_DEFAULT_LAYOUT } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
export function createInitialAppState() {
    return {
        userRolePermissions: [],
        workspaces: [],
        workspacesLoading: false,
        workspacesError: null,
        featureToggles: [],
        featureOrganizations: [],
        featureTenant: [],
        // Stays false until the API says otherwise, so nothing billing-related renders on a
        // self-hosted install that never answers.
        billingEnabled: false
    };
}
export function createInitialPersistState() {
    const token = localStorage.getItem('token') || null;
    const refresh_token = localStorage.getItem('refresh_token') || null;
    const userId = localStorage.getItem('_userId') || null;
    const organizationId = localStorage.getItem('_organizationId') || null;
    const serverConnection = parseInt(localStorage.getItem('serverConnection')) || null;
    const preferredLanguage = localStorage.getItem('preferredLanguage') || null;
    const componentLayout = localStorage.getItem('componentLayout') || [];
    const themeName = localStorage.getItem('themeName') || null;
    const widgets = JSON.parse(localStorage.getItem('_widgets'));
    const windows = JSON.parse(localStorage.getItem('_windows'));
    const tenantId = localStorage.getItem('_tenantId') || null;
    return {
        token,
        refresh_token,
        userId,
        organizationId,
        serverConnection,
        preferredLanguage,
        componentLayout,
        themeName,
        widgets,
        windows,
        tenantId
    };
}
let AppStore = class AppStore extends AkitaStore {
    constructor() {
        super(createInitialAppState());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AppStore, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AppStore, providedIn: 'root' }); }
};
AppStore = __decorate([
    StoreConfig({ name: 'app' }),
    __metadata("design:paramtypes", [])
], AppStore);
export { AppStore };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AppStore, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });
let PersistStore = class PersistStore extends AkitaStore {
    constructor() {
        super(createInitialPersistState());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PersistStore, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PersistStore, providedIn: 'root' }); }
};
PersistStore = __decorate([
    StoreConfig({ name: 'persist' }),
    __metadata("design:paramtypes", [])
], PersistStore);
export { PersistStore };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PersistStore, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });
export class AppQuery extends Query {
    constructor(store) {
        super(store);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AppQuery, deps: [{ token: AppStore }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AppQuery, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AppQuery, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: AppStore }] });
export class PersistQuery extends Query {
    constructor(store) {
        super(store);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PersistQuery, deps: [{ token: PersistStore }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PersistQuery, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PersistQuery, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: PersistStore }] });
export class Store {
    constructor(appStore, appQuery, persistStore, persistQuery) {
        this.appStore = appStore;
        this.appQuery = appQuery;
        this.persistStore = persistStore;
        this.persistQuery = persistQuery;
        this.user$ = this.appQuery.select((state) => state.user);
        this.selectedOrganization$ = this.appQuery.select((state) => state.selectedOrganization);
        this.selectedEmployee$ = this.appQuery.select((state) => state.selectedEmployee);
        this.selectedProject$ = this.appQuery.select((state) => state.selectedProject);
        this.selectedTeam$ = this.appQuery.select((state) => state.selectedTeam);
        this.workspaces$ = this.appQuery.select((state) => state.workspaces);
        this.selectedWorkspace$ = this.appQuery.select((state) => state.selectedWorkspace);
        this.workspacesLoading$ = this.appQuery.select((state) => state.workspacesLoading);
        this.workspacesError$ = this.appQuery.select((state) => state.workspacesError);
        this.userRolePermissions$ = this.appQuery.select((state) => state.userRolePermissions);
        this.featureToggles$ = this.appQuery.select((state) => state.featureToggles);
        this.featureOrganizations$ = this.appQuery.select((state) => state.featureOrganizations);
        this.featureTenant$ = this.appQuery.select((state) => state.featureTenant);
        this.preferredLanguage$ = this.persistQuery.select((state) => state.preferredLanguage);
        this.preferredComponentLayout$ = this.persistQuery.select((state) => state.preferredComponentLayout);
        this.componentLayoutMap$ = this.persistQuery
            .select((state) => state.componentLayout)
            .pipe(map((componentLayout) => new Map(componentLayout)));
        this.systemLanguages$ = this.appQuery.select((state) => state.systemLanguages);
        this.subject = new Subject();
    }
    /**
     * Observe any change to the component layout.
     * Returns the layout for the component given in the params in the following order of preference
     * 1. If overridden at component level, return that.
     * Else
     * 2. If preferred layout set, then return that
     * Else
     * 3. Return the system default layout
     */
    componentLayout$(component) {
        return merge(this.persistQuery
            .select((state) => state.preferredComponentLayout)
            .pipe(map((preferredLayout) => {
            const dataLayout = this.getLayoutForComponent(component);
            return dataLayout || preferredLayout || SYSTEM_DEFAULT_LAYOUT;
        })), this.persistQuery
            .select((state) => state.componentLayout)
            .pipe(map((componentLayout) => {
            const componentMap = new Map(componentLayout);
            return componentMap.get(component) || this.preferredComponentLayout || SYSTEM_DEFAULT_LAYOUT;
        })));
    }
    // Getter and Setter for selectedOrganization
    get selectedOrganization() {
        /**
         * Retrieves the currently selected organization from the application's state.
         *
         * @returns {IOrganization} - The selected organization object.
         */
        return this.appQuery.getValue().selectedOrganization;
    }
    set selectedOrganization(organization) {
        /**
         * Updates the selected organization in the application's state.
         *
         * @param {IOrganization} organization - The organization object to be set as the selected organization.
         */
        this.appStore.update({ selectedOrganization: organization });
    }
    // Getter and Setter for selectedEmployee
    get selectedEmployee() {
        /**
         * Retrieves the currently selected employee from the application's state.
         *
         * @returns {ISelectedEmployee} - The selected employee object.
         */
        return this.appQuery.getValue().selectedEmployee;
    }
    set selectedEmployee(employee) {
        /**
         * Updates the selected employee in the application's state.
         *
         * @param {ISelectedEmployee} employee - The employee object to be set as the selected employee.
         */
        this.appStore.update({ selectedEmployee: employee });
    }
    // Getter and Setter for selectedProject
    get selectedProject() {
        /**
         * Retrieves the currently selected project from the application's state.
         *
         * @returns {IOrganizationProject} - The selected project object.
         */
        return this.appQuery.getValue().selectedProject;
    }
    set selectedProject(project) {
        /**
         * Updates the selected project in the application's state.
         *
         * @param {IOrganizationProject} project - The project object to be set as the selected project.
         */
        this.appStore.update({ selectedProject: project });
    }
    // Getter and Setter for selectedTeam
    get selectedTeam() {
        /**
         * Retrieves the currently selected team from the application's state.
         *
         * @returns {IOrganizationTeam} - The selected team object.
         */
        return this.appQuery.getValue().selectedTeam;
    }
    set selectedTeam(team) {
        /**
         * Updates the selected team in the application's state.
         *
         * @param {IOrganizationTeam} team - The team object to be set as the selected team.
         */
        this.appStore.update({ selectedTeam: team });
    }
    set systemLanguages(languages) {
        this.appStore.update({
            systemLanguages: languages
        });
    }
    get systemLanguages() {
        const { systemLanguages } = this.appQuery.getValue();
        return systemLanguages;
    }
    get refresh_token() {
        const { refresh_token } = this.persistQuery.getValue();
        return refresh_token;
    }
    set refresh_token(refresh_token) {
        this.persistStore.update({
            refresh_token: refresh_token
        });
    }
    get token() {
        const { token } = this.persistQuery.getValue();
        return token;
    }
    set token(token) {
        this.persistStore.update({
            token: token
        });
    }
    get userId() {
        const { userId } = this.persistQuery.getValue();
        return userId;
    }
    set userId(id) {
        this.persistStore.update({
            userId: id
        });
    }
    get organizationId() {
        const { organizationId } = this.persistQuery.getValue();
        return organizationId;
    }
    set organizationId(id) {
        this.persistStore.update({
            organizationId: id
        });
    }
    get user() {
        const { user } = this.appQuery.getValue();
        return user;
    }
    set user(user) {
        this.appStore.update({
            user: user
        });
    }
    get selectedProposal() {
        const { selectedProposal } = this.appQuery.getValue();
        return selectedProposal;
    }
    set selectedProposal(proposal) {
        this.appStore.update({
            selectedProposal: proposal
        });
    }
    get featureToggles() {
        const { featureToggles } = this.appQuery.getValue();
        return featureToggles;
    }
    set featureToggles(featureToggles) {
        this.appStore.update({
            featureToggles: featureToggles
        });
    }
    get billingEnabled() {
        const { billingEnabled } = this.appQuery.getValue();
        return billingEnabled;
    }
    set billingEnabled(billingEnabled) {
        this.appStore.update({ billingEnabled });
    }
    get featureTenant() {
        const { featureTenant } = this.appQuery.getValue();
        return featureTenant;
    }
    set featureTenant(featureOrganizations) {
        this.appStore.update({
            featureTenant: featureOrganizations
        });
    }
    get featureOrganizations() {
        const { featureOrganizations } = this.appQuery.getValue();
        return featureOrganizations;
    }
    set featureOrganizations(featureOrganizations) {
        this.appStore.update({
            featureOrganizations: featureOrganizations
        });
    }
    /*
     * Check features are enabled/disabled for tenant organization
     */
    hasFeatureEnabled(feature) {
        const { featureTenant = [], featureOrganizations = [], featureToggles = [] } = this.appQuery.getValue();
        const filtered = uniq([...featureOrganizations, ...featureTenant], (x) => x.featureId);
        const unleashToggle = featureToggles.find((toggle) => toggle.name === feature && toggle.enabled === false);
        if (unleashToggle) {
            return unleashToggle.enabled;
        }
        return !!filtered.find((item) => item.feature.code === feature && item.isEnabled);
    }
    /**
     * Returns the user role permissions from the application state.
     *
     * @return {IRolePermission[]} The user role permissions.
     */
    get userRolePermissions() {
        const { userRolePermissions } = this.appQuery.getValue();
        return userRolePermissions;
    }
    /**
     * Updates the user role permissions in the application state.
     *
     * @param {IRolePermission[]} userRolePermissions - The new user role permissions.
     */
    set userRolePermissions(userRolePermissions) {
        this.appStore.update({ userRolePermissions });
    }
    /**
     * Checks if the user has a specific permission.
     *
     * @param {PermissionsEnum} permission - The permission to check.
     * @return {boolean} Returns true if the user has the permission, false otherwise.
     */
    hasPermission(permission) {
        const { userRolePermissions } = this.appQuery.getValue();
        return (userRolePermissions || []).some((p) => p.permission === permission && p.enabled);
    }
    /**
     * Checks if the user has all the specified permissions.
     *
     * @param {...PermissionsEnum[]} permissions - The permissions to check.
     * @return {boolean} Returns true if the user has all the permissions, false otherwise.
     */
    hasAllPermissions(...permissions) {
        return permissions.every((permission) => this.hasPermission(permission));
    }
    /**
     * Checks if the user has any of the specified permissions.
     *
     * @param {...PermissionsEnum[]} permissions - The permissions to check.
     * @return {boolean} Returns true if the user has any of the permissions, false otherwise.
     */
    hasAnyPermission(...permissions) {
        // Early return if no permissions are provided
        if (permissions.length === 0)
            return false;
        const { userRolePermissions } = this.appQuery.getValue();
        const set = new Set(permissions);
        // Check if any user role permission matches the required permissions
        return (userRolePermissions || []).some((p) => set.has(p.permission) && p.enabled);
    }
    get serverConnection() {
        const { serverConnection } = this.persistQuery.getValue();
        return serverConnection;
    }
    set serverConnection(val) {
        this.persistStore.update({
            serverConnection: val
        });
    }
    get preferredLanguage() {
        const { preferredLanguage } = this.persistQuery.getValue();
        return preferredLanguage;
    }
    set preferredLanguage(preferredLanguage) {
        this.persistStore.update({
            preferredLanguage: preferredLanguage
        });
    }
    get preferredComponentLayout() {
        const { preferredComponentLayout } = this.persistQuery.getValue();
        return preferredComponentLayout;
    }
    set preferredComponentLayout(preferredComponentLayout) {
        this.persistStore.update({
            preferredComponentLayout: preferredComponentLayout
        });
    }
    // Getter and Setter for workspaces
    get workspaces() {
        /**
         * Retrieves the workspaces from the application's state.
         *
         * @returns {IWorkSpace[]} - The workspaces array.
         */
        const { workspaces } = this.appQuery.getValue();
        return workspaces || [];
    }
    set workspaces(workspaces) {
        /**
         * Updates the workspaces in the application's state.
         *
         * @param {IWorkSpace[]} workspaces - The workspaces array to be set.
         */
        this.appStore.update({ workspaces });
    }
    // Getter and Setter for selectedWorkspace
    get selectedWorkspace() {
        /**
         * Retrieves the currently selected workspace from the application's state.
         *
         * @returns {IWorkSpace} - The selected workspace object.
         */
        const { selectedWorkspace } = this.appQuery.getValue();
        return selectedWorkspace;
    }
    set selectedWorkspace(workspace) {
        /**
         * Updates the selected workspace in the application's state.
         *
         * @param {IWorkSpace} workspace - The workspace object to be set as the selected workspace.
         */
        this.appStore.update({ selectedWorkspace: workspace });
    }
    // Getter and Setter for workspacesLoading
    get workspacesLoading() {
        /**
         * Retrieves the workspaces loading state from the application's state.
         *
         * @returns {boolean} - The workspaces loading state.
         */
        const { workspacesLoading } = this.appQuery.getValue();
        return workspacesLoading || false;
    }
    set workspacesLoading(loading) {
        /**
         * Updates the workspaces loading state in the application's state.
         *
         * @param {boolean} loading - The loading state to be set.
         */
        this.appStore.update({ workspacesLoading: loading });
    }
    // Getter and Setter for workspacesError
    get workspacesError() {
        /**
         * Retrieves the workspaces error from the application's state.
         *
         * @returns {string | null} - The workspaces error.
         */
        const { workspacesError } = this.appQuery.getValue();
        return workspacesError;
    }
    set workspacesError(error) {
        /**
         * Updates the workspaces error in the application's state.
         *
         * @param {string | null} error - The error to be set.
         */
        this.appStore.update({ workspacesError: error });
    }
    /**
     * Load workspaces and update the store
     * @param workspaces - Array of workspaces to set
     * @param selectedWorkspaceId - ID of the workspace to mark as selected
     */
    setWorkspaces(workspaces, selectedWorkspaceId) {
        // Mark the selected workspace
        const updatedWorkspaces = workspaces.map((workspace) => ({
            ...workspace,
            isSelected: selectedWorkspaceId ? workspace.id === selectedWorkspaceId : workspace.isSelected
        }));
        // Find the selected workspace
        const selectedWorkspace = updatedWorkspaces.find((w) => w.isSelected) || updatedWorkspaces[0];
        // Update the store
        this.appStore.update({
            workspaces: updatedWorkspaces,
            selectedWorkspace,
            workspacesLoading: false,
            workspacesError: null
        });
    }
    /**
     * Set workspaces loading state
     * @param loading - Loading state
     * @param error - Optional error message
     */
    setWorkspacesLoading(loading, error = null) {
        this.appStore.update({
            workspacesLoading: loading,
            workspacesError: error
        });
    }
    clear() {
        this.appStore.reset();
        this.persistStore.reset();
    }
    getLayoutForComponent(componentName) {
        const { componentLayout } = this.persistQuery.getValue();
        const componentLayoutMap = new Map(componentLayout);
        return componentLayoutMap.get(componentName);
    }
    setLayoutForComponent(componentName, style) {
        const { componentLayout } = this.persistQuery.getValue();
        const componentLayoutMap = new Map(componentLayout);
        componentLayoutMap.set(componentName, style);
        const componentLayoutArray = Array.from(componentLayoutMap.entries());
        this.persistStore.update({
            componentLayout: componentLayoutArray
        });
    }
    set componentLayout(componentLayout) {
        this.persistStore.update({
            componentLayout
        });
    }
    get currentTheme() {
        const { themeName } = this.persistQuery.getValue();
        return themeName;
    }
    set currentTheme(name) {
        this.persistStore.update({
            themeName: name
        });
    }
    get windows() {
        const { windows } = this.persistQuery.getValue();
        return windows;
    }
    set windows(values) {
        this.persistStore.update({
            windows: values
        });
    }
    get widgets() {
        const { widgets } = this.persistQuery.getValue();
        return widgets;
    }
    set widgets(values) {
        this.persistStore.update({
            widgets: values
        });
    }
    get tenantId() {
        const { tenantId } = this.persistQuery.getValue();
        return tenantId;
    }
    set tenantId(value) {
        this.persistStore.update({
            tenantId: value
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: Store, deps: [{ token: AppStore }, { token: AppQuery }, { token: PersistStore }, { token: PersistQuery }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: Store, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: Store, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: AppStore }, { type: AppQuery }, { type: PersistStore }, { type: PersistQuery }] });
//# sourceMappingURL=store.service.js.map