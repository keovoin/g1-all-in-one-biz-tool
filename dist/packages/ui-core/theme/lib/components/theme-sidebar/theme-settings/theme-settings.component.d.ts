import { OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbSidebarService } from '@nebular/theme';
import * as i0 from "@angular/core";
/** Tag of the Nebular sidebar this component is rendered into. */
export declare const QUICK_SETTINGS_SIDEBAR_TAG = "settings_sidebar";
export declare class ThemeSettingsComponent implements OnInit, OnDestroy {
    private readonly sidebarService;
    private readonly router;
    private state;
    private clickedInOverlay;
    trackOverlayClick(target: EventTarget | null): void;
    /**
     * Support chat is only offered when this deployment configured a Chatwoot
     * website token: AppComponent only injects the SDK in that case, so without
     * a token there would be no widget to open.
     */
    readonly isSupportChatAvailable: boolean;
    /**
     * Destination for the FAQ entry.
     *
     * There is no in-app `faq` route — the entry carried neither a link nor a click
     * handler in the header menu it came from, so it had always been dead. The only
     * FAQ that actually exists is the published one on the docs site
     * (`ever-gauzy-docs/website/docs/reference/faq.md`; that Docusaurus site is
     * configured with `baseUrl: '/'` and `routeBasePath: '/'`, hence no `/docs`
     * segment in the URL).
     */
    readonly faqUrl: string;
    constructor(sidebarService: NbSidebarService, router: Router);
    ngOnInit(): void;
    /**
     * Read the Quick Settings sidebar's current state.
     *
     * `take(1)` is what makes this safe to call repeatedly: getSidebarState() returns a ReplaySubject
     * that receives exactly one value, so without it each call would leave a subscription open forever
     * waiting for a second emission that never arrives.
     */
    private syncState;
    ngOnDestroy(): void;
    /**
     * Closes the quick settings sidebar.
     *
     * Collapses rather than toggles: this is only ever called to close the panel
     * (the X button and the outside click), and pages that need to know whether
     * the panel opened or closed listen to the sidebar's expand/collapse events.
     */
    closeSidebar(): void;
    /**
     *
     * @param event
     */
    onClickOutside(event: boolean): void;
    /**
     * Navigates to the settings page and closes the quick settings sidebar.
     */
    navigateToSettings(): void;
    /**
     * Navigates to an application route and closes the quick settings sidebar.
     *
     * @param commands router commands, e.g. ['/pages/help']
     */
    navigateTo(commands: string[]): void;
    /**
     * Opens the Chatwoot support conversation.
     *
     * The widget's launcher bubble is suppressed (`hideMessageBubble`), so this
     * entry is the only way in. Reading `$chatwoot` off the window rather than
     * caching it matters: the SDK assigns it asynchronously once its script has
     * loaded, and it never appears at all when no website token is configured.
     */
    openSupportChat(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ThemeSettingsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ThemeSettingsComponent, "ngx-theme-settings", never, {}, {}, never, never, false, never>;
}
