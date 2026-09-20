import { Observable } from 'rxjs';
import { NavMenuSectionItem, NavMenuItemsConfig, NavMenuSectionConfig } from './nav-builder-types';
import * as i0 from "@angular/core";
export declare class NavMenuBuilderService {
    menuConfig$: Observable<NavMenuSectionItem[]>;
    private initialNavMenuConfig$;
    private addedNavMenuSections;
    private addedNavMenuSectionsSubject;
    addedNavMenuSections$: Observable<NavMenuSectionConfig[]>;
    private addedNavMenuItems;
    private removedNavMenuItems;
    private addedNavMenuItemsSubject;
    addedNavMenuItems$: Observable<NavMenuItemsConfig[]>;
    constructor();
    /**
     * Defines the navigation menu sections.
     *
     * @param config An array of NavMenuSection objects representing the navigation menu sections.
     */
    defineNavMenuSections(config: NavMenuSectionItem[]): void;
    /**
     * Adds a new navigation menu section.
     *
     * @param config The configuration object representing the new navigation menu section to add.
     * @param before (Optional) The identifier of the section before which the new section should be added.
     */
    addNavMenuSection(config: NavMenuSectionItem, before?: string): void;
    /**
     * Adds multiple navigation menu sections.
     *
     * @param configs An array of configuration objects representing the new navigation menu sections to add.
     * @param before (Optional) The identifier of the section before which the new section(s) should be added.
     */
    addNavMenuSections(configs: NavMenuSectionItem[], before?: string): void;
    /**
     * Adds a new navigation menu item.
     *
     * @param config The configuration object representing the new navigation menu item to add.
     * @param sectionId The identifier of the section to which the new item should be added.
     * @param before (Optional) The identifier of the item before which the new item should be added.
     */
    addNavMenuItem(config: NavMenuSectionItem, sectionId: string, before?: string): void;
    /**
     * Adds multiple new navigation menu items.
     *
     * @param configs An array of configuration objects representing the new navigation menu items to add.
     * @param sectionId The identifier of the section to which the new items should be added.
     * @param before (Optional) The identifier of the item before which the new items should be added.
     */
    addNavMenuItems(configs: NavMenuSectionItem[], sectionId: string, before?: string): void;
    /**
     * Removes a navigation menu item.
     *
     * @param itemId The identifier of the item to be removed.
     * @param sectionId The identifier of the section from which the item should be removed.
     */
    removeNavMenuItem(itemId: string, sectionId: string): void;
    /**
     * Removes multiple navigation menu items.
     *
     * @param itemIds An array of identifiers of the items to be removed.
     * @param sectionId The identifier of the section from which the items should be removed.
     */
    removeNavMenuItems(itemIds: string[], sectionId: string): void;
    /**
     * Sets up streams to dynamically configure the navigation menu based on initial configuration and additions.
     */
    private setupStreams;
    /**
     * Logs a warning message about an inability to add a menu item.
     *
     * @param itemId - The ID of the menu item that could not be added.
     * @param sectionId - The ID of the section where the item was to be added.
     * @param level - Optional logging level; defaults to 'warn'.
     */
    private logMenuWarning;
    static ɵfac: i0.ɵɵFactoryDeclaration<NavMenuBuilderService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NavMenuBuilderService>;
}
