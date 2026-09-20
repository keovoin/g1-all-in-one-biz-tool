import { AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DashboardStoreService } from '../../services/dashboard/dashboard-store.service';
import { FavoriteStoreService } from '../../services/favorite/favorite-store.service';
import { NavMenuBuilderService } from '../../services/nav-builder/nav-menu-builder.service';
import { NavMenuSectionItem } from '../../services/nav-builder/nav-builder-types';
import { SidebarMenuService } from '../../services/nav-builder/sidebar-menu.service';
import { Store } from '../../services/store/store.service';
import * as i0 from "@angular/core";
export declare class BaseNavMenuComponent extends TranslationBaseComponent implements OnInit, AfterViewInit, OnDestroy {
    protected readonly _translateService: TranslateService;
    protected readonly _navMenuBuilderService: NavMenuBuilderService;
    protected readonly _store: Store;
    protected readonly _sidebarMenuService: SidebarMenuService;
    protected readonly _favoriteStoreService: FavoriteStoreService;
    protected readonly _dashboardStoreService: DashboardStoreService;
    private _favoriteItems;
    private _customDashboards;
    constructor(_translateService: TranslateService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Returns an `{ add: link }` object if the user has any of the given permissions, or undefined otherwise.
     */
    private _addLink;
    /**
     * Defines the base navigation menus.
     */
    private defineBaseNavMenus;
    /**
     * Retrieves the main navigation menu configuration by composing all section menus.
     * @returns An array of NavMenuSectionItem objects representing the main menu.
     */
    private _getMainMenu;
    /**
     * Returns the dashboard-related menu items (Dashboards, Focus, Applications).
     *
     * The "Dashboards" item is a plain link while the user has no custom
     * dashboards; once custom dashboards exist it becomes expandable with a
     * "Standard" child plus one child per custom dashboard.
     */
    private _getDashboardMenu;
    /**
     * Returns the children of the expandable "Dashboards" menu item:
     * the "Standard" (prebuilt) dashboard followed by each custom dashboard.
     */
    private _getDashboardChildren;
    /**
     * Returns the favorites menu section.
     */
    private _getFavoritesMenu;
    /**
     * Returns the accounting menu section with sub-items.
     */
    private _getAccountingMenu;
    /**
     * Returns the sales menu section with sub-items.
     */
    private _getSalesMenu;
    /**
     * Returns the tasks menu section with sub-items.
     */
    private _getTasksMenu;
    /**
     * Returns the employees menu section with sub-items.
     */
    private _getEmployeesMenu;
    /**
     * Returns the organization menu section with sub-items.
     */
    private _getOrganizationMenu;
    /**
     * Returns the contacts menu section with sub-items.
     */
    private _getContactsMenu;
    /**
     * Returns the goals menu section with sub-items.
     */
    private _getGoalsMenu;
    /**
     * Returns the reports menu section with sub-items.
     */
    private _getReportsMenu;
    /**
     * Retrieves the workspace menu configuration based on user permissions.
     * Each menu item includes an ID, title, icon, link, and additional data such as translation keys,
     * permission keys, and feature keys.
     *
     * @returns An array of NavMenuSectionItem objects representing the workspace menu.
     */
    private _getWorkspaceMenu;
    /**
     * Retrieves the settings menu configuration.
     *
     * @returns An array containing a single NavMenuSectionItem for settings.
     */
    private _getSettingsMenu;
    /**
     * Maps menu sections and their sub-sections recursively.
     *
     * @param items The menu items to map.
     * @returns The mapped menu sections.
     */
    mapMenuSections(items: NavMenuSectionItem[]): NavMenuSectionItem[];
    /**
     * Maps a single menu section and its sub-sections recursively.
     *
     * @param section The menu section to map.
     * @returns The mapped menu section.
     */
    mapMenuSection(item: NavMenuSectionItem): NavMenuSectionItem;
    /**
     * Checks if a menu section should be hidden based on permissions and features.
     *
     * @param section The menu section to check.
     * @returns True if the section should be hidden, false otherwise.
     */
    isSectionHidden(section: NavMenuSectionItem): boolean;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BaseNavMenuComponent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<BaseNavMenuComponent, "[gaBaseNavMenu]", never, {}, {}, never, never, true, never>;
}
