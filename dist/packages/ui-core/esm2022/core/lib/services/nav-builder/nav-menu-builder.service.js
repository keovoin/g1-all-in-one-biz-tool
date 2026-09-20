import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, map, of, shareReplay } from 'rxjs';
import * as i0 from "@angular/core";
export class NavMenuBuilderService {
    constructor() {
        // Initial configuration of the navigation menu
        this.initialNavMenuConfig$ = new BehaviorSubject([]);
        // Additional sections that can be added to the navigation menu
        this.addedNavMenuSections = [];
        this.addedNavMenuSectionsSubject = new BehaviorSubject(this.addedNavMenuSections);
        this.addedNavMenuSections$ = this.addedNavMenuSectionsSubject.asObservable();
        // Additional menu items that can be added to the navigation menu
        this.addedNavMenuItems = [];
        this.removedNavMenuItems = [];
        this.addedNavMenuItemsSubject = new BehaviorSubject(this.addedNavMenuItems);
        this.addedNavMenuItems$ = this.addedNavMenuItemsSubject.asObservable();
        this.setupStreams();
    }
    /**
     * Defines the navigation menu sections.
     *
     * @param config An array of NavMenuSection objects representing the navigation menu sections.
     */
    defineNavMenuSections(config) {
        this.initialNavMenuConfig$.next(config);
    }
    /**
     * Adds a new navigation menu section.
     *
     * @param config The configuration object representing the new navigation menu section to add.
     * @param before (Optional) The identifier of the section before which the new section should be added.
     */
    addNavMenuSection(config, before) {
        // Push the new section configuration along with its positioning information into the addedNavMenuSections array
        this.addedNavMenuSections.push({ config, before });
        // Emit the updated addedNavMenuSections array to all subscribers
        this.addedNavMenuSectionsSubject.next(this.addedNavMenuSections);
    }
    /**
     * Adds multiple navigation menu sections.
     *
     * @param configs An array of configuration objects representing the new navigation menu sections to add.
     * @param before (Optional) The identifier of the section before which the new section(s) should be added.
     */
    addNavMenuSections(configs, before) {
        configs.forEach((config) => {
            // Push the new section configuration along with its positioning information into the addedNavMenuSections array
            this.addedNavMenuSections.push({ config, before });
        });
        // Emit the updated addedNavMenuSections array to all subscribers
        this.addedNavMenuSectionsSubject.next(this.addedNavMenuSections);
    }
    /**
     * Adds a new navigation menu item.
     *
     * @param config The configuration object representing the new navigation menu item to add.
     * @param sectionId The identifier of the section to which the new item should be added.
     * @param before (Optional) The identifier of the item before which the new item should be added.
     */
    addNavMenuItem(config, sectionId, before) {
        // Check if the item already exists
        const existingIndex = this.addedNavMenuItems.findIndex((item) => item.config.id === config.id && item.sectionId === sectionId);
        if (existingIndex !== -1) {
            // Item exists, replace it with the new config
            this.addedNavMenuItems[existingIndex] = { config, sectionId, before };
        }
        else {
            // Push each new item configuration along with its positioning information into the addedNavMenuItems array
            this.addedNavMenuItems.push({ config, sectionId, before });
        }
        // Emit the updated addedNavMenuItems array to all subscribers
        this.addedNavMenuItemsSubject.next([...this.addedNavMenuItems]);
    }
    /**
     * Adds multiple new navigation menu items.
     *
     * @param configs An array of configuration objects representing the new navigation menu items to add.
     * @param sectionId The identifier of the section to which the new items should be added.
     * @param before (Optional) The identifier of the item before which the new items should be added.
     */
    addNavMenuItems(configs, sectionId, before) {
        configs.forEach((config) => {
            // Check if the item already exists
            const existingIndex = this.addedNavMenuItems.findIndex((item) => item.config.id === config.id && item.sectionId === sectionId);
            if (existingIndex !== -1) {
                // If the item exists, replace it with the new config
                this.addedNavMenuItems[existingIndex] = { config, sectionId, before };
            }
            else {
                // Push each new item configuration along with its positioning information into the addedNavMenuItems array
                this.addedNavMenuItems.push({ config, sectionId, before });
            }
        });
        // Emit the updated addedNavMenuItems array to all subscribers
        this.addedNavMenuItemsSubject.next([...this.addedNavMenuItems]);
    }
    /**
     * Removes a navigation menu item.
     *
     * @param itemId The identifier of the item to be removed.
     * @param sectionId The identifier of the section from which the item should be removed.
     */
    removeNavMenuItem(itemId, sectionId) {
        const itemIndex = this.addedNavMenuItems.findIndex((item) => item.config.id === itemId && item.sectionId === sectionId);
        if (itemIndex !== -1) {
            // Check if the item is already present in the removedNavMenuItems array
            const existingIndex = this.removedNavMenuItems.findIndex((item) => item.config.id === itemId && item.sectionId === sectionId);
            if (existingIndex === -1) {
                // Push the removed item into the removedNavMenuItems array
                this.removedNavMenuItems.push(this.addedNavMenuItems[itemIndex]);
            }
            // Remove the item from the addedNavMenuItems array
            this.addedNavMenuItems.splice(itemIndex, 1);
            // Emit the updated array to subscribers
            this.addedNavMenuItemsSubject.next([...this.addedNavMenuItems]);
        }
    }
    /**
     * Removes multiple navigation menu items.
     *
     * @param itemIds An array of identifiers of the items to be removed.
     * @param sectionId The identifier of the section from which the items should be removed.
     */
    removeNavMenuItems(itemIds, sectionId) {
        itemIds.forEach((itemId) => {
            this.removeNavMenuItem(itemId, sectionId);
        });
    }
    /**
     * Sets up streams to dynamically configure the navigation menu based on initial configuration and additions.
     */
    setupStreams() {
        // Create an observable for section additions
        const sectionAdditions$ = this.addedNavMenuSections$;
        // Create an observable for item additions
        const itemAdditions$ = this.addedNavMenuItems$;
        // Combine the initial configuration and section additions
        // Don't emit until base menu is defined (prevents Jobs-only or empty flash on refresh)
        const combinedConfig$ = combineLatest([this.initialNavMenuConfig$, sectionAdditions$]).pipe(filter(([sections]) => !!sections?.length), map(([sections, additions]) => {
            const configMap = new Map();
            const orderedIds = [];
            sections.forEach((section) => {
                configMap.set(section.id, section);
                orderedIds.push(section.id);
            });
            for (const { config, before } of additions) {
                if (configMap.has(config.id)) {
                    configMap.set(config.id, config); // Update existing
                }
                else {
                    configMap.set(config.id, config);
                    const beforeIndex = before ? orderedIds.indexOf(before) : -1;
                    if (beforeIndex !== -1) {
                        orderedIds.splice(beforeIndex, 0, config.id);
                    }
                    else {
                        orderedIds.push(config.id);
                    }
                }
            }
            return orderedIds.map((id) => configMap.get(id));
        }), shareReplay(1));
        // Combine the combined configuration with item additions to produce the final menu configuration
        this.menuConfig$ = combineLatest([combinedConfig$, itemAdditions$, of(this.removedNavMenuItems)]).pipe(map(([sections, additions, removals]) => {
            const sectionMap = new Map();
            // Populate section map for quick lookup
            sections.forEach((section) => sectionMap.set(section.id, section));
            // Process item deletions
            removals.forEach((item) => {
                const sectionId = item.sectionId;
                const itemIdToRemove = item.config.id;
                const section = sectionMap.get(sectionId);
                if (section) {
                    const itemIndex = section.items.findIndex((item) => item.id === itemIdToRemove);
                    if (itemIndex !== -1) {
                        section.items.splice(itemIndex, 1); // Remove item from the section
                    }
                }
            });
            // Process item additions
            additions.forEach((item) => {
                const section = sectionMap.get(item.sectionId);
                if (section) {
                    const { config, before } = item;
                    const itemIndex = section.items.findIndex((i) => i.id === config.id);
                    if (itemIndex !== -1) {
                        section.items[itemIndex] = config; // Update existing item
                    }
                    else {
                        const beforeIndex = before ? section.items.findIndex((i) => i.id === before) : -1;
                        if (beforeIndex !== -1) {
                            section.items.splice(beforeIndex, 0, config); // Insert before specified item
                        }
                        else {
                            section.items.push(config); // Append if before item not found
                        }
                    }
                }
                else {
                    this.logMenuWarning(item.config.id, item.sectionId);
                }
            });
            return sections;
        }));
    }
    /**
     * Logs a warning message about an inability to add a menu item.
     *
     * @param itemId - The ID of the menu item that could not be added.
     * @param sectionId - The ID of the section where the item was to be added.
     * @param level - Optional logging level; defaults to 'warn'.
     */
    logMenuWarning(itemId, sectionId, level = 'warn') {
        const message = `Unable to add menu item "${itemId}". Section "${sectionId}" does not exist. Please ensure the section is defined before adding items.`;
        const logFn = console[level];
        logFn(message);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NavMenuBuilderService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NavMenuBuilderService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NavMenuBuilderService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=nav-menu-builder.service.js.map