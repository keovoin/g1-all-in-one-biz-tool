import { AfterViewInit, OnInit, OnDestroy, ChangeDetectorRef, ElementRef, ViewContainerRef, Type, TemplateRef, QueryList } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { CustomNbRouteTab, PageTabRegistryService, PageTabsetPageId } from '@gauzy/ui-core/core';
import { I18nService } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class DynamicTabsComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly _cdr;
    private readonly _elementRef;
    private readonly _translateService;
    private readonly _pageTabRegistryService;
    readonly _i18n: I18nService;
    tabs: CustomNbRouteTab[];
    reload$: Subject<boolean>;
    tabsetId: PageTabsetPageId;
    tabContents: QueryList<ViewContainerRef>;
    /**
     * Determines if all tabs in the tabset have the tabsetType set to 'route'.
     *
     * @returns true if all tabs in the tabset have tabsetType set to 'route', false otherwise.
     */
    get isRouterTabset(): boolean;
    /**
     * The rendered tab links, in the same order as `tabs`.
     */
    private static readonly TAB_LINK_SELECTOR;
    constructor(_cdr: ChangeDetectorRef, _elementRef: ElementRef<HTMLElement>, _translateService: TranslateService, _pageTabRegistryService: PageTabRegistryService, _i18n: I18nService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Setup listener for reloading tabs.
     */
    private _setupReloadTabsListener;
    /**
     * Puts each tab's full title on its link as a native `title` attribute.
     */
    private _describeTabs;
    /**
     * Load the tab content for each tab in the tabset.
     */
    private _loadTabsContent;
    /**
     * Initializes the tabs for the component based on the provided tabset ID.
     *
     * This function retrieves all registered tabs for the specified tabset ID
     * using the `getRegisteredNbTabs` method and assigns them to the `tabs`
     * property. This allows the component to display the correct set of tabs
     * dynamically.
     */
    private _initializeTabs;
    /**
     * Retrieve and filter tabs for a specified tabset.
     *
     * @param tabsetId The identifier for the tabset.
     * @returns An array of PageTabRegistryConfig objects for the specified tabset, excluding tabs with hide set to true.
     */
    private getRegisteredTabs;
    /**
     * Get all registered tabs for a specified tabset.
     *
     * This function retrieves the registered tabs from the PageTabRegistryService
     * and maps each tab configuration to an NbRouteTab object, which can be used
     * by the Nebular tabset component. The title is translated if necessary,
     * and other properties like icon, disabled state, responsive behavior, and route
     * are mapped accordingly.
     *
     * @param tabsetId The identifier for the tabset.
     * @returns An array of NbRouteTab objects representing the registered tabs.
     */
    getRegisteredNbTabs(tabsetId: PageTabsetPageId): CustomNbRouteTab[];
    /**
     * Applies translations to dynamic tabs.
     *
     * This function listens for language change events and re-initializes the tabs
     * when the language changes. This ensures that the tabs are always displayed
     * in the correct language.
     */
    private _applyTranslationOnTabs;
    /**
     * Loads a template into a specified container.
     *
     * This method clears any existing content in the provided container
     * and then creates an embedded view for the given template, inserting
     * it into the container.
     *
     * @param template The template to be loaded into the container.
     * @param container The container where the template will be inserted.
     */
    loadTemplateForTab(template: TemplateRef<any>, container: ViewContainerRef): void;
    /**
     * Create and insert a dynamic component into the specified ViewContainerRef.
     *
     * This method clears any existing content in the provided container,
     * then creates a new instance of the specified component and inserts it
     * into the container.
     *
     * @param component The component to be created dynamically.
     * @param container The ViewContainerRef where the component should be inserted.
     */
    loadComponentForTab(component: Type<any>, container: ViewContainerRef): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DynamicTabsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DynamicTabsComponent, "gz-dynamic-tabs", never, { "tabsetId": { "alias": "tabsetId"; "required": false; }; }, {}, never, never, false, never>;
}
