import { TemplateRef, Type } from '@angular/core';
import { PageTabsetPageId } from '../../common/component-registry.types';
import { IPageTabRegistry, PageTabRegistryConfig } from './page-tab-registry.types';
import * as i0 from "@angular/core";
export declare class PageTabRegistryService implements IPageTabRegistry {
    private readonly _store;
    private logging;
    /**
     * Registry for storing page tab configurations.
     *
     * This Map stores arrays of PageTabRegistryConfig objects, keyed by PageTabsetPageId.
     */
    private readonly registry;
    /**
     * Retrieves the current tab registry.
     *
     * This method returns a map of tab configurations, organized by their tabset identifiers.
     *
     * @returns A `Map` where each key is a `PageTabsetPageId` and each value is an array of
     *          `PageTabRegistryConfig` objects associated with that tabset.
     */
    getRegistry(): ReadonlyMap<PageTabsetPageId, PageTabRegistryConfig[]>;
    /**
     * Register a single page tab configuration.
     *
     * This method registers a new page tab configuration in the service's internal registry.
     * It ensures that the configuration has a valid tabset property and checks if a tab
     * with the same tabsetId already exists to prevent duplicate entries. If the configuration
     * is valid and unique, it adds it to the registry.
     *
     * @param config The configuration for the page tab.
     * @throws Will throw an error if the configuration does not have a location property.
     * @throws Will throw an error if a tab with the same location has already been registered.
     */
    registerPageTab(config: PageTabRegistryConfig): void;
    /**
     * Adds a new page tab to the specified tab set.
     *
     * @param config The configuration object representing the new tab to add.
     * @param tabsetId The identifier of the tab set to which the new tab should be added.
     */
    addPageTab(config: PageTabRegistryConfig, tabsetId: PageTabsetPageId): void;
    /**
     * Removes a page tab from the specified tab set.
     *
     * This method retrieves the list of tabs associated with the provided `tabsetId`,
     * finds the tab with the specified `tabId`, removes it from the list, and updates
     * the registry. If the tabset becomes empty after removal, it also removes the tabset
     * entry from the registry.
     *
     * @param tabsetId The identifier of the tab set from which the tab should be removed.
     * @param tabId The identifier of the tab to remove.
     */
    removePageTab(tabsetId: PageTabsetPageId, tabId: string): void;
    /**
     * Register multiple page tab configurations.
     *
     * This method registers multiple new page tab configurations in the service's internal registry.
     * It ensures that each configuration has a valid tabset property and checks if a tab with the same
     * tabsetId already exists to prevent duplicate entries. If the configurations are valid and unique,
     * it adds them to the registry.
     *
     * @param configs The array of configurations for the page tabs.
     * @throws Will throw an error if a tab with the same location and path has already been registered.
     */
    registerPageTabs(configs: PageTabRegistryConfig[]): void;
    /**
     * Get all page tabs for a specified tabset, sorted by their order.
     *
     * This method retrieves the registered tabs for a given `tabsetId` from the registry,
     * sorts them based on their `order` property, and returns the sorted array.
     * If no tabs are registered for the specified `tabsetId`, it returns an empty array.
     *
     * @param tabsetId The identifier for the tabset.
     * @returns An array of `PageTabRegistryConfig` objects, sorted by their `order` property.
     */
    private getPageTabsByOrder;
    /**
     * Retrieves all unique page tabs for a specified tabset.
     *
     * This method first retrieves all the tabs associated with the given `tabsetId`, then
     * ensures that each tab is unique based on its `tabId` by using a `Map`. Finally, it returns
     * an array of these unique tabs.
     *
     * @param tabsetId The identifier for the tabset whose tabs are to be retrieved.
     * @returns An array of unique page tabs for the specified tabset.
     */
    getPageTabset(tabsetId: PageTabsetPageId): PageTabRegistryConfig[];
    /**
     * Get all permitted registered tabs for a specified tabset.
     *
     * This method retrieves all tabs registered for the given `tabsetId` and filters them
     * based on the current user's permissions. Only tabs that the user is allowed to view
     * are included in the returned array.
     *
     * @param tabsetId The identifier for the tabset whose permitted tabs are to be retrieved.
     * @returns An array of `PageTabRegistryConfig` objects representing the permitted tabs for the specified tabset.
     */
    getPermittedPageTabset(tabsetId: PageTabsetPageId): PageTabRegistryConfig[];
    /**
     * Verify if the current user has the required permissions to view the tab.
     *
     * This method checks whether the current user has the necessary permissions to access a given tab.
     * If the tab specifies permissions, the method will validate if the user meets the criteria.
     * If no permissions are specified, the tab is accessible by default.
     * If `requireAllPermissions` is `true`, the user must have all specified permissions.
     * If `requireAllPermissions` is `false` or not specified, the user must have at least one of the permissions.
     *
     * @param tab The tab configuration object containing the permissions and other settings.
     * @returns `true` if the user has the required permissions to view the tab, `false` otherwise.
     */
    private verifyPermissions;
    /**
     * @description
     * Deletes a tabset from the registry.
     *
     * This method removes a tabset identified by the provided `tabsetId` from the internal registry.
     * If the specified `tabsetId` does not exist in the registry, the function will simply return
     * without making any changes.
     *
     * @param tabsetId The identifier for the tabset to delete.
     */
    deleteTabset(tabsetId: PageTabsetPageId): void;
    /**
     * @description
     * Retrieves the component or template associated with a specific tab ID for a given tabset.
     *
     * This method looks up the tabset using the provided `tabsetId`, then searches for the tab
     * with the specified `tabId` within that tabset. If the tab is found, it returns either the
     * component or the template based on the tab's configuration; otherwise, it returns `undefined`.
     *
     * @param tabsetId The identifier of the tabset to retrieve tabs from.
     * @param tabId The identifier of the tab whose component or template is to be retrieved.
     * @returns The component or template associated with the specified tab ID, or `undefined` if neither is found.
     */
    getComponentOrTemplateForTab(tabsetId: PageTabsetPageId, tabId: string): Type<any> | TemplateRef<any> | undefined;
    static ɵfac: i0.ɵɵFactoryDeclaration<PageTabRegistryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PageTabRegistryService>;
}
