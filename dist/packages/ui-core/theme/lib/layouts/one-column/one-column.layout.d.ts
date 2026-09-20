import { Type } from '@angular/core';
import { NbLayoutComponent } from '@nebular/theme';
import { ChatSidebarService, NavigationBuilderService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class OneColumnLayoutComponent {
    readonly isOpen: import("@angular/core").WritableSignal<boolean>;
    readonly isWorkspaceOpen: import("@angular/core").WritableSignal<boolean>;
    readonly isExpanded: import("@angular/core").WritableSignal<boolean>;
    readonly isCollapse: import("@angular/core").WritableSignal<boolean>;
    readonly trigger: import("@angular/core").WritableSignal<boolean>;
    readonly layout: import("@angular/core").Signal<NbLayoutComponent>;
    private readonly windowModeBlockScrollService;
    private readonly store;
    readonly navigationBuilderService: NavigationBuilderService;
    readonly chatSidebarService: ChatSidebarService;
    private readonly sidebarService;
    private readonly layoutService;
    private readonly themeLanguageSelectorService;
    private readonly destroyRef;
    private readonly directionService;
    private readonly injector;
    /** User signal for template — derived from store observable. */
    readonly user: import("@angular/core").Signal<import("dist/packages/contracts/src").IUser>;
    /** User observable — kept for child component compatibility (gauzy-user, gauzy-user-menu). */
    readonly user$: import("rxjs").Observable<import("dist/packages/contracts/src").IUser>;
    /**
     * Resolved chat sidebar component for `ngComponentOutlet`.
     * `IChatSidebarConfig.loadComponent` may be async (lazy chunk), so the
     * factory result is resolved into this signal.
     */
    readonly chatSidebarComponent: import("@angular/core").WritableSignal<Type<any>>;
    constructor();
    /** Set on destroy; gates the delayed settle ticks (see onDestroy above). */
    private destroyed;
    private headerResizeObserver?;
    /**
     * Publish the header's REAL rendered height as `--gz-header-height`.
     *
     * Nebular's `--header-height` is a theme CONSTANT (4.5rem = 72px). The header
     * is content-driven, so it does not always agree: measured at 1600x950 it
     * renders 98px, and anything anchored to the constant then sits ~26px too
     * high and tucks under the real header. That is what put the Quick Settings
     * panel behind the header — it is not visible at 4.5rem-tall headers, which
     * is why it survived review.
     *
     * The principle: measure the box the browser actually produced, rather than restating a
     * constant that the layout is free to exceed.
     */
    private observeHeaderHeight;
    /** Re-applied from the band observer's settle ticks — see observeHeaderBand. */
    private applyHeaderHeight?;
    private bandResizeObserver?;
    /**
     * Publish where the fixed HEADER BAND begins and ends, as `--gz-band-left` /
     * `--gz-band-right`: from the nav menu sidebar's trailing edge to the layout's far edge. The
     * band runs OVER the chat column (the chat sits below it at z 1039, its top at
     * `--gz-header-height`), so unlike the old `--gz-canvas-left/right` — which measured
     * `nb-layout-column`, i.e. the edge AFTER menu + chat — the band depends only on the menu
     * sidebar's geometry. That is the point: the header chasing the chat's edge at 60Hz is where
     * the whole staleness-bug class came from (see 536fa7fced), and a band that ignores chat state
     * has nothing to go stale against.
     *
     * MEASURED, not derived from Nebular's width tokens: collapse, compaction and window-mode
     * centring all move the real edges, and the derivation going wrong is what killed the previous
     * design. Measuring the layout container (rather than assuming 0/viewport edges) keeps the
     * >1920px centred window mode correct for free. The menu block is every in-flow sidebar on the
     * leading side — `menu-sidebar` today, `user-workspace` if a layout ever renders it (none does
     * currently) — attributed to left or right by which container edge it hugs, so RTL (menu at the
     * trailing edge) falls out of the same arithmetic.
     */
    private observeHeaderBand;
    private menuClassObserver?;
    private bandOnResize?;
    /**
     * Toggles the expansion state of the sidebar.
     */
    toggle(): void;
    /**
     * Handles the sidebar collapse event. Auto-expands if both collapsed and compacted.
     */
    onCollapse(event: boolean): void;
    /**
     * Syncs expansion and trigger signals with the sidebar state change.
     */
    onStateChange(event: string): void;
    /**
     * Toggles the workspace menu visibility.
     */
    onWorkspaceToggle(isOpen: boolean): void;
    /**
     * Toggles the user menu overlay.
     */
    toggleUserMenu(): void;
    /**
     * Closes the user menu overlay.
     */
    closeUserMenu(): void;
    /**
     * Closes the workspace menu overlay.
     */
    closeWorkspaceMenu(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<OneColumnLayoutComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<OneColumnLayoutComponent, "ngx-one-column-layout", never, {}, {}, never, ["ga-main-nav-menu", "router-outlet"], false, never>;
}
