var DynamicTabsComponent_1;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectorRef, ElementRef, ViewContainerRef, Type, TemplateRef, ViewChildren, QueryList } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PageTabRegistryService } from '@gauzy/ui-core/core';
import { I18nService } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@gauzy/ui-core/i18n";
import * as i4 from "@nebular/theme";
let DynamicTabsComponent = class DynamicTabsComponent {
    static { DynamicTabsComponent_1 = this; }
    /**
     * Determines if all tabs in the tabset have the tabsetType set to 'route'.
     *
     * @returns true if all tabs in the tabset have tabsetType set to 'route', false otherwise.
     */
    get isRouterTabset() {
        const tabs = this.getRegisteredTabs(this.tabsetId);
        // If there are no tabs or tabs is undefined, assume it's not a router tabset.
        if (!tabs || tabs.length === 0) {
            return false;
        }
        // Check if every tab has tabsetType set to 'route'
        return tabs.every((tab) => tab.tabsetType === 'route');
    }
    /**
     * The rendered tab links, in the same order as `tabs`.
     */
    static { this.TAB_LINK_SELECTOR = ':scope > nb-route-tabset > .route-tabset > .route-tab > .tab-link, ' +
        ':scope > nb-tabset > .tabset > .tab > .tab-link'; }
    constructor(_cdr, _elementRef, _translateService, _pageTabRegistryService, _i18n) {
        this._cdr = _cdr;
        this._elementRef = _elementRef;
        this._translateService = _translateService;
        this._pageTabRegistryService = _pageTabRegistryService;
        this._i18n = _i18n;
        this.tabs = []; // Define the structure of tabs according to your needs
        this.reload$ = new Subject(); // Subject to trigger reload of tabs
    }
    ngOnInit() {
        this._initializeTabs();
        this._applyTranslationOnTabs();
        this._setupReloadTabsListener();
    }
    ngAfterViewInit() {
        this._loadTabsContent(); // Load the tab content for each tab in the tabset
        this._describeTabs();
    }
    /**
     * Setup listener for reloading tabs.
     */
    _setupReloadTabsListener() {
        this.reload$
            .pipe(tap(() => {
            this._initializeTabs();
            this._describeTabs();
        }), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Puts each tab's full title on its link as a native `title` attribute.
     */
    _describeTabs() {
        const links = this._elementRef.nativeElement.querySelectorAll(DynamicTabsComponent_1.TAB_LINK_SELECTOR);
        links.forEach((link, index) => {
            const title = this.tabs[index]?.title;
            if (title) {
                link.setAttribute('title', title);
            }
            else {
                link.removeAttribute('title');
            }
        });
    }
    /**
     * Load the tab content for each tab in the tabset.
     */
    _loadTabsContent() {
        // Load the tab content for each tab in the tabset
        this.tabContents.forEach((container, index) => {
            // Get the tab configuration for the current index
            const tab = this.tabs[index];
            // Get the component or template for the tab
            const content = this._pageTabRegistryService.getComponentOrTemplateForTab(this.tabsetId, tab.tabId);
            // Check if the content is a template or component
            if (content instanceof TemplateRef) {
                this.loadTemplateForTab(content, container); // Handle template loading
            }
            else if (content instanceof Type) {
                this.loadComponentForTab(content, container); // Handle component loading
            }
        });
        // Detect changes after loading tab content
        this._cdr.detectChanges();
    }
    /**
     * Initializes the tabs for the component based on the provided tabset ID.
     *
     * This function retrieves all registered tabs for the specified tabset ID
     * using the `getRegisteredNbTabs` method and assigns them to the `tabs`
     * property. This allows the component to display the correct set of tabs
     * dynamically.
     */
    _initializeTabs() {
        // Retrieve and set the tabs based on the tabsetId
        this.tabs = this.getRegisteredNbTabs(this.tabsetId);
        this._cdr.detectChanges();
    }
    /**
     * Retrieve and filter tabs for a specified tabset.
     *
     * @param tabsetId The identifier for the tabset.
     * @returns An array of PageTabRegistryConfig objects for the specified tabset, excluding tabs with hide set to true.
     */
    getRegisteredTabs(tabsetId) {
        return this._pageTabRegistryService.getPageTabset(tabsetId).filter((tab) => !tab.hide);
    }
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
    getRegisteredNbTabs(tabsetId) {
        // Map each tab configuration to an NbRouteTab object
        return this.getRegisteredTabs(tabsetId).map((tab) => {
            // Create a new route tab object
            const route = {
                ...(tab.tabTitle && {
                    title: typeof tab.tabTitle === 'function' ? tab.tabTitle(this._i18n) : tab.tabTitle
                }),
                ...(tab.tabId && { tabId: tab.tabId }),
                ...(tab.route && { route: tab.route }),
                ...(tab.tabIcon && { icon: tab.tabIcon }),
                ...(tab.responsive && { responsive: tab.responsive }),
                ...(tab.activeLinkOptions && { activeLinkOptions: tab.activeLinkOptions }),
                // The router-link inputs `nb-route-tabset` binds on each tab link. These used to
                // be dropped here, so a registered tab that asked for `queryParamsHandling: 'merge'`
                // silently navigated with `undefined` and lost the page's query parameters on
                // every tab switch.
                ...(tab.queryParams && { queryParams: tab.queryParams }),
                ...(tab.queryParamsHandling && { queryParamsHandling: tab.queryParamsHandling }),
                ...(tab.fragment && { fragment: tab.fragment }),
                ...(tab.preserveFragment && { preserveFragment: tab.preserveFragment }),
                ...(tab.skipLocationChange && { skipLocationChange: tab.skipLocationChange }),
                ...(tab.replaceUrl && { replaceUrl: tab.replaceUrl }),
                ...(tab.state && { state: tab.state }),
                disabled: !!tab.disabled,
                active: !!tab.active
            };
            // Check if the tabset is a router tabset
            if (!this.isRouterTabset) {
                // Check if the route configuration has a component or loadChildren property
                if (tab.template) {
                    // Set the template property to the config object
                    route.template = tab.template;
                }
                else if (tab.component) {
                    // Set the component property to the config object
                    route.component = tab.component;
                }
            }
            // Return the route object
            return route;
        });
    }
    /**
     * Applies translations to dynamic tabs.
     *
     * This function listens for language change events and re-initializes the tabs
     * when the language changes. This ensures that the tabs are always displayed
     * in the correct language.
     */
    _applyTranslationOnTabs() {
        // Listen for language change events from the translation service
        this._translateService.onLangChange
            .pipe(
        // Re-initialize the tabs when the language changes
        tap(() => this.reload$.next(true)), 
        // Automatically unsubscribe when the component is destroyed
        untilDestroyed(this))
            .subscribe();
    }
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
    loadTemplateForTab(template, container) {
        // Clear any existing content in the container
        container.clear();
        // Create an embedded view for the provided template and insert it into the container
        container.createEmbeddedView(template);
    }
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
    loadComponentForTab(component, container) {
        // Ensure the container is available and clear any existing content
        container.clear();
        // Create and insert the component into the view container
        container.createComponent(component);
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DynamicTabsComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1.TranslateService }, { token: i2.PageTabRegistryService }, { token: i3.I18nService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: DynamicTabsComponent, isStandalone: false, selector: "gz-dynamic-tabs", inputs: { tabsetId: "tabsetId" }, providers: [], viewQueries: [{ propertyName: "tabContents", predicate: ["tabContent"], descendants: true, read: ViewContainerRef }], ngImport: i0, template: "<!-- NbRouteTabset for the nb tabset -->\n@if (isRouterTabset) {\n\t<nb-route-tabset [tabs]=\"tabs\"></nb-route-tabset>\n} @else {\n\t<!-- Static tabs for the nb tabset -->\n\t<nb-tabset>\n\t\t@for (tab of tabs; track tab.tabId ?? $index; let i = $index) {\n\t\t\t<nb-tab\n\t\t\t\t[tabTitle]=\"tab?.title\"\n\t\t\t\t[tabIcon]=\"tab?.icon\"\n\t\t\t\t[tabId]=\"tab?.tabId\"\n\t\t\t\t[active]=\"tab?.active\"\n\t\t\t\t[disabled]=\"tab?.disabled\"\n\t\t\t\t[responsive]=\"tab?.responsive\"\n\t\t\t\t[route]=\"tab?.route\"\n\t\t\t>\n\t\t\t\t<!-- Placeholder for dynamic content -->\n\t\t\t\t<ng-container #tabContent></ng-container>\n\t\t\t</nb-tab>\n\t\t}\n\t</nb-tabset>\n}\n", styles: [""], dependencies: [{ kind: "component", type: i4.NbTabsetComponent, selector: "nb-tabset", inputs: ["fullWidth", "routeParam"], outputs: ["changeTab"] }, { kind: "component", type: i4.NbTabComponent, selector: "nb-tab", inputs: ["tabTitle", "tabId", "badgeDot", "tabIcon", "disabled", "responsive", "route", "active", "lazyLoad", "badgeText", "badgeStatus", "badgePosition"] }, { kind: "component", type: i4.NbRouteTabsetComponent, selector: "nb-route-tabset", inputs: ["tabs", "activeLinkOptions", "fullWidth"], outputs: ["changeTab"] }] }); }
};
DynamicTabsComponent = DynamicTabsComponent_1 = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [ChangeDetectorRef,
        ElementRef,
        TranslateService,
        PageTabRegistryService,
        I18nService])
], DynamicTabsComponent);
export { DynamicTabsComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DynamicTabsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-dynamic-tabs', providers: [], standalone: false, template: "<!-- NbRouteTabset for the nb tabset -->\n@if (isRouterTabset) {\n\t<nb-route-tabset [tabs]=\"tabs\"></nb-route-tabset>\n} @else {\n\t<!-- Static tabs for the nb tabset -->\n\t<nb-tabset>\n\t\t@for (tab of tabs; track tab.tabId ?? $index; let i = $index) {\n\t\t\t<nb-tab\n\t\t\t\t[tabTitle]=\"tab?.title\"\n\t\t\t\t[tabIcon]=\"tab?.icon\"\n\t\t\t\t[tabId]=\"tab?.tabId\"\n\t\t\t\t[active]=\"tab?.active\"\n\t\t\t\t[disabled]=\"tab?.disabled\"\n\t\t\t\t[responsive]=\"tab?.responsive\"\n\t\t\t\t[route]=\"tab?.route\"\n\t\t\t>\n\t\t\t\t<!-- Placeholder for dynamic content -->\n\t\t\t\t<ng-container #tabContent></ng-container>\n\t\t\t</nb-tab>\n\t\t}\n\t</nb-tabset>\n}\n" }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i1.TranslateService }, { type: i2.PageTabRegistryService }, { type: i3.I18nService }], propDecorators: { tabsetId: [{
                type: Input
            }], tabContents: [{
                type: ViewChildren,
                args: ['tabContent', { read: ViewContainerRef }]
            }] } });
//# sourceMappingURL=dynamic-tabs.component.js.map