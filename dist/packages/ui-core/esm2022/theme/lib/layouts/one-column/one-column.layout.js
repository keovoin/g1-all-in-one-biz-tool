import { Component, effect, inject, viewChild, afterNextRender, DestroyRef, Injector, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NbLayoutComponent, NbLayoutDirectionService, NbSidebarService } from '@nebular/theme';
import { ChatSidebarService, LayoutService, NavigationBuilderService, Store } from '@gauzy/ui-core/core';
import { WindowModeBlockScrollService } from '../../services/window-mode-block-scroll.service';
import { DEFAULT_SIDEBARS } from '../../components/theme-sidebar/default-sidebars';
import { ThemeLanguageSelectorService } from '../../components/theme-sidebar/theme-settings/components/theme-language-selector/theme-language-selector.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../../components/theme-sidebar/theme-sidebar.component";
import * as i3 from "@nebular/theme";
import * as i4 from "../../components/header/header.component";
import * as i5 from "../../components/footer/footer.component";
import * as i6 from "../../components/gauzy-logo/gauzy-logo.component";
import * as i7 from "../../components/user-menu/user-menu.component";
import * as i8 from "../../components/user/user.component";
import * as i9 from "../../components/workspace-menu/workspace-menu.component";
import * as i10 from "@ngx-translate/core";
export class OneColumnLayoutComponent {
    constructor() {
        this.isOpen = signal(false, ...(ngDevMode ? [{ debugName: "isOpen" }] : []));
        this.isWorkspaceOpen = signal(false, ...(ngDevMode ? [{ debugName: "isWorkspaceOpen" }] : []));
        this.isExpanded = signal(true, ...(ngDevMode ? [{ debugName: "isExpanded" }] : []));
        this.isCollapse = signal(true, ...(ngDevMode ? [{ debugName: "isCollapse" }] : []));
        this.trigger = signal(true, ...(ngDevMode ? [{ debugName: "trigger" }] : []));
        this.layout = viewChild.required(NbLayoutComponent);
        this.windowModeBlockScrollService = inject(WindowModeBlockScrollService);
        this.store = inject(Store);
        this.navigationBuilderService = inject(NavigationBuilderService);
        this.chatSidebarService = inject(ChatSidebarService);
        this.sidebarService = inject(NbSidebarService);
        this.layoutService = inject(LayoutService);
        this.themeLanguageSelectorService = inject(ThemeLanguageSelectorService);
        this.destroyRef = inject(DestroyRef);
        this.directionService = inject(NbLayoutDirectionService);
        this.injector = inject(Injector);
        /** User signal for template — derived from store observable. */
        this.user = toSignal(this.store.user$);
        /** User observable — kept for child component compatibility (gauzy-user, gauzy-user-menu). */
        this.user$ = this.store.user$;
        /**
         * Resolved chat sidebar component for `ngComponentOutlet`.
         * `IChatSidebarConfig.loadComponent` may be async (lazy chunk), so the
         * factory result is resolved into this signal.
         */
        this.chatSidebarComponent = signal(null, ...(ngDevMode ? [{ debugName: "chatSidebarComponent" }] : []));
        /** Set on destroy; gates the delayed settle ticks (see onDestroy above). */
        this.destroyed = false;
        // Resolve the (possibly lazy) chat sidebar component whenever a plugin registers one.
        effect(() => {
            const config = this.chatSidebarService.config();
            if (!config) {
                this.chatSidebarComponent.set(null);
                return;
            }
            Promise.resolve(config.loadComponent())
                .then((component) => {
                // Ignore the result if the sidebar was unregistered while loading.
                if (this.chatSidebarService.config() === config) {
                    this.chatSidebarComponent.set(component);
                }
            })
                .catch((error) => {
                console.error('[OneColumnLayout] Failed to load the chat sidebar component:', error);
                if (this.chatSidebarService.config() === config) {
                    this.chatSidebarComponent.set(null);
                }
            });
        });
        Object.entries(DEFAULT_SIDEBARS).forEach(([id, config]) => {
            this.navigationBuilderService.registerSidebar(id, config);
            this.navigationBuilderService.addSidebarActionItem(config.actionItem);
        });
        this.navigationBuilderService.getSidebarWidgets();
        this.themeLanguageSelectorService.initialize();
        // No ResizeObserver mirroring the chat width any more: the panel takes its width straight from
        // `--gz-chat-width` (the persisted user width), so there is a single source of truth and
        // nothing that can go stale. See one-column.layout.scss.
        // Runs only in the browser, after the first render — replaces ngAfterViewInit + isPlatformBrowser
        afterNextRender(() => {
            this.windowModeBlockScrollService.register(this.layout());
            this.observeHeaderHeight();
            this.observeHeaderBand();
        });
        this.destroyRef.onDestroy(() => {
            // Flipped FIRST: the settle passes schedule rAF/timeout ticks (up to 400ms
            // out) that outlive the component. The guard makes every late tick inert —
            // without it a post-destroy tick re-enters apply, constructs a fresh
            // ResizeObserver no cleanup path ever disconnects, and keeps writing the
            // --gz-* vars for a layout that no longer exists.
            this.destroyed = true;
            this.navigationBuilderService.clearSidebars();
            this.navigationBuilderService.clearActionBars();
            this.headerResizeObserver?.disconnect();
            this.bandResizeObserver?.disconnect();
            this.menuClassObserver?.disconnect();
            if (this.bandOnResize)
                window.removeEventListener('resize', this.bandOnResize);
        });
    }
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
    observeHeaderHeight() {
        if (typeof ResizeObserver === 'undefined' || typeof document === 'undefined')
            return;
        let observed = null;
        const apply = () => {
            if (this.destroyed)
                return;
            // Queried FRESH and re-observed on identity change: `@if (user())`
            // re-creates `nb-layout-header` across auth transitions, and an
            // observer captured once ends up watching a DETACHED node — the var
            // freezes at the last pre-detach height. Measured live: the var held
            // 88px while the re-created header rendered 98px once the demo
            // banner appeared, and everything anchored to it (the chat column's
            // top edge) tucked 10px under the band.
            const header = document.querySelector('nb-layout-header');
            if (!header)
                return;
            if (header !== observed) {
                this.headerResizeObserver?.disconnect();
                this.headerResizeObserver = new ResizeObserver(apply);
                this.headerResizeObserver.observe(header);
                observed = header;
            }
            document.documentElement.style.setProperty('--gz-header-height', `${Math.round(header.getBoundingClientRect().height)}px`);
        };
        this.applyHeaderHeight = apply;
        // The re-creation trigger itself: settle over the render the `user()`
        // flip causes (idempotent re-applies are free; the ResizeObserver only
        // covers the node it is attached to, never the swap).
        effect(() => {
            this.user();
            requestAnimationFrame(apply);
            setTimeout(apply, 120);
            setTimeout(apply, 400);
        }, { injector: this.injector });
        apply();
    }
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
    observeHeaderBand() {
        if (typeof ResizeObserver === 'undefined' || typeof document === 'undefined')
            return;
        let observedMenuHost = null;
        const apply = () => {
            if (this.destroyed)
                return;
            // Queried FRESH on every call — a captured node can go stale across layout re-renders,
            // and a stale node measures its old box while looking perfectly alive.
            const container = document.querySelector('nb-layout .layout .layout-container');
            if (!container)
                return;
            // Re-homed on identity change, the same freshness rule the header-height
            // observer follows: `@if (user())` creates the menu sidebar AFTER a cold
            // first pass (nothing to observe yet) and REPLACES it across auth
            // transitions (the old host detaches while the observers keep watching
            // it). Both cases land here via the settle ticks below.
            const menuHost = document.querySelector('nb-sidebar.menu-sidebar');
            if (menuHost !== observedMenuHost) {
                this.bandResizeObserver?.disconnect();
                this.menuClassObserver?.disconnect();
                if (menuHost) {
                    this.bandResizeObserver = new ResizeObserver(apply);
                    this.bandResizeObserver.observe(menuHost);
                    // A ResizeObserver fires on SIZE, and Nebular's expand/compact/collapse
                    // are stamped onto the sidebar host as CLASSES — a MutationObserver on
                    // that attribute fires on every state change no matter which observer
                    // mechanism is having a bad day. (Same belt-and-braces pattern
                    // 536fa7fced added for the chat host, re-aimed at the menu.)
                    if (typeof MutationObserver !== 'undefined') {
                        this.menuClassObserver = new MutationObserver(applySettled);
                        this.menuClassObserver.observe(menuHost, { attributes: true, attributeFilter: ['class'] });
                    }
                }
                observedMenuHost = menuHost;
            }
            const containerRect = container.getBoundingClientRect();
            let left = containerRect.left;
            let right = window.innerWidth - containerRect.right;
            const blocks = Array.from(document.querySelectorAll('nb-sidebar.menu-sidebar, nb-sidebar.user-workspace'));
            for (const block of blocks) {
                const rect = block.getBoundingClientRect();
                if (rect.width <= 0)
                    continue; // collapsed → width 0, contributes nothing
                // Nearer the container's leading edge → it insets the band's left; RTL puts the
                // menu at the trailing edge, where it insets the band's right instead.
                const onLeft = rect.left - containerRect.left <= containerRect.right - rect.right;
                if (onLeft)
                    left = Math.max(left, rect.right);
                else
                    right = Math.max(right, window.innerWidth - rect.left);
            }
            const root = document.documentElement.style;
            root.setProperty('--gz-band-left', `${Math.round(left)}px`);
            root.setProperty('--gz-band-right', `${Math.round(right)}px`);
        };
        // The menu sidebar animates its collapse/compaction, so a single measurement lands
        // mid-animation and freezes the header at a stale inset. Settle over the transition:
        // idempotent style writes make the extra ticks free. The header height rides along —
        // anything that reflows the band (menu state, window size, direction) can wrap or
        // unwrap it, and the chat column's top edge hangs off that var.
        const applySettled = () => {
            const applyAll = () => {
                apply();
                this.applyHeaderHeight?.();
            };
            requestAnimationFrame(applyAll);
            setTimeout(applyAll, 120);
            setTimeout(applyAll, 400);
        };
        // The menu's own box does not change when the window does, so track that too.
        window.addEventListener('resize', apply);
        this.bandOnResize = apply;
        // The sidebar's own CREATION is invisible to the observers above — they are
        // attached to the host, not to its parent. `@if (user())` is the creation
        // trigger, so settle over the render it causes: the ticks re-enter `apply`,
        // which re-homes the observers onto the freshly created host and re-measures.
        effect(() => {
            this.user();
            applySettled();
        }, { injector: this.injector });
        // An RTL flip moves the menu to the other edge WITHOUT resizing it, so neither observer
        // above fires — watch the direction change directly.
        this.directionService
            .onDirectionChange()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => applySettled());
        apply();
    }
    /**
     * Toggles the expansion state of the sidebar.
     */
    toggle() {
        this.isExpanded.update((v) => !v);
        if (this.isExpanded()) {
            this.sidebarService.expand('menu-sidebar');
        }
        else {
            this.trigger.set(true);
            this.sidebarService.toggle(true, 'menu-sidebar');
            this.layoutService.changeLayoutSize();
        }
    }
    /**
     * Handles the sidebar collapse event. Auto-expands if both collapsed and compacted.
     */
    onCollapse(event) {
        this.isCollapse.set(event);
        if (!this.isCollapse() && !this.isExpanded())
            this.toggle();
    }
    /**
     * Syncs expansion and trigger signals with the sidebar state change.
     */
    onStateChange(event) {
        this.isExpanded.set(event === 'expanded');
        this.trigger.set(event === 'compacted');
    }
    /**
     * Toggles the workspace menu visibility.
     */
    onWorkspaceToggle(isOpen) {
        this.isWorkspaceOpen.set(isOpen);
    }
    /**
     * Toggles the user menu overlay.
     */
    toggleUserMenu() {
        this.isOpen.update((v) => !v);
    }
    /**
     * Closes the user menu overlay.
     */
    closeUserMenu() {
        this.isOpen.set(false);
    }
    /**
     * Closes the workspace menu overlay.
     */
    closeWorkspaceMenu() {
        this.isWorkspaceOpen.set(false);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OneColumnLayoutComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: OneColumnLayoutComponent, isStandalone: false, selector: "ngx-one-column-layout", viewQueries: [{ propertyName: "layout", first: true, predicate: NbLayoutComponent, descendants: true, isSignal: true }], ngImport: i0, template: "<nb-layout windowMode>\n\t<!-- Header \u2014 spans everything right of the nav menu, INCLUDING the chat column.\n\t     Nebular renders a `fixed` header at full width, so the BAND ITSELF is inset to the menu\n\t     sidebar's trailing edge (see `--gz-band-left/right` in the layout ts and scss); the chat\n\t     panel tucks UNDER it (top = `--gz-header-height`, z one below the header's), exactly like\n\t     the canvas does. -->\n\t@if (user()) {\n\t\t<nb-layout-header fixed>\n\t\t\t<ngx-header [expanded]=\"isExpanded()\"></ngx-header>\n\t\t</nb-layout-header>\n\t}\n\n\t<!-- Sidebar -->\n\t@if (user()) {\n\t\t<nb-sidebar\n\t\t\tclass=\"menu-sidebar sidebar_class\"\n\t\t\ttag=\"menu-sidebar\"\n\t\t\t(stateChange)=\"onStateChange($event)\"\n\t\t>\n\t\t\t<div class=\"custom-box\" [class.compacted]=\"!isExpanded()\">\n\n\t\t\t\t@if (chatSidebarService.available() && !chatSidebarService.expanded()) {\n\t\t\t\t\t<button\n\t\t\t\t\t\tclass=\"rail-edge-button ai-agent-launch\"\n\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t[title]=\"'HEADER.AI_CHAT' | translate\"\n\t\t\t\t\t\t[attr.aria-label]=\"'HEADER.AI_CHAT' | translate\"\n\t\t\t\t\t\t(click)=\"chatSidebarService.expand()\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<svg\n\t\t\t\t\t\t\tviewBox=\"0 0 24 24\"\n\t\t\t\t\t\t\tfill=\"none\"\n\t\t\t\t\t\t\tstroke=\"currentColor\"\n\t\t\t\t\t\t\tstroke-width=\"2\"\n\t\t\t\t\t\t\tstroke-linecap=\"round\"\n\t\t\t\t\t\t\tstroke-linejoin=\"round\"\n\t\t\t\t\t\t\taria-hidden=\"true\"\n\t\t\t\t\t\t\tfocusable=\"false\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<path d=\"M12 8V4H8\" />\n\t\t\t\t\t\t\t<rect width=\"16\" height=\"12\" x=\"4\" y=\"8\" rx=\"2\" />\n\t\t\t\t\t\t\t<path d=\"M2 14h2\" />\n\t\t\t\t\t\t\t<path d=\"M20 14h2\" />\n\t\t\t\t\t\t\t<path d=\"M15 13v2\" />\n\t\t\t\t\t\t\t<path d=\"M9 13v2\" />\n\t\t\t\t\t\t</svg>\n\t\t\t\t\t</button>\n\t\t\t\t}\n\n\t\t\t\t<div class=\"custom-row logo\">\n\t\t\t\t\t<button\n\t\t\t\t\t\tclass=\"rail-edge-button rail-toggle\"\n\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t(click)=\"toggle()\"\n\t\t\t\t\t\t[title]=\"(isExpanded() ? 'HEADER.COLLAPSE_SIDEBAR' : 'HEADER.EXPAND_SIDEBAR') | translate\"\n\t\t\t\t\t\t[attr.aria-label]=\"\n\t\t\t\t\t\t\t(isExpanded() ? 'HEADER.COLLAPSE_SIDEBAR' : 'HEADER.EXPAND_SIDEBAR') | translate\n\t\t\t\t\t\t\"\n\t\t\t\t\t\t[attr.aria-expanded]=\"isExpanded()\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<svg\n\t\t\t\t\t\t\tviewBox=\"0 0 24 24\"\n\t\t\t\t\t\t\tfill=\"none\"\n\t\t\t\t\t\t\tstroke=\"currentColor\"\n\t\t\t\t\t\t\tstroke-width=\"2\"\n\t\t\t\t\t\t\tstroke-linecap=\"round\"\n\t\t\t\t\t\t\tstroke-linejoin=\"round\"\n\t\t\t\t\t\t\taria-hidden=\"true\"\n\t\t\t\t\t\t\tfocusable=\"false\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" />\n\t\t\t\t\t\t\t<path d=\"M9 3v18\" />\n\t\t\t\t\t\t\t<path [attr.d]=\"isExpanded() ? 'm16 15-3-3 3-3' : 'm14 9 3 3-3 3'\" />\n\t\t\t\t\t\t</svg>\n\t\t\t\t\t</button>\n\n\t\t\t\t\t<div\n\t\t\t\t\t\tclass=\"logo-container\"\n\t\t\t\t\t\t[class.not-collapsed]=\"!isCollapse() && isExpanded()\"\n\t\t\t\t\t\t[class.compacted]=\"!isExpanded()\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<ngx-gauzy-logo\n\t\t\t\t\t\t\t[controlled]=\"trigger()\"\n\t\t\t\t\t\t\t[isWorkspaceOpen]=\"isWorkspaceOpen()\"\n\t\t\t\t\t\t\t(onCollapsed)=\"onCollapse($event)\"\n\t\t\t\t\t\t\t(onWorkspaceToggle)=\"onWorkspaceToggle($event)\"\n\t\t\t\t\t\t></ngx-gauzy-logo>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"custom-row menu\">\n\t\t\t\t\t<ng-content select=\"ga-main-nav-menu\"></ng-content>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"sidebar-footer\" [class.compacted]=\"!isExpanded()\">\n\t\t\t\t\t<gauzy-user [user$]=\"user$\" [showIdentity]=\"isExpanded()\" (clicked)=\"toggleUserMenu()\"></gauzy-user>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</nb-sidebar>\n\t}\n\n\t<!-- AI Chat sidebar \u2014 dedicated slot between the nav menu and the main content.\n\t     Single @if (like the menu sidebar above): nesting control-flow blocks breaks\n\t     nb-layout's select-based content projection for nb-sidebar. -->\n\t@if (user() && chatSidebarService.available() && chatSidebarComponent(); as chatComponent) {\n\t\t<!-- A column that starts UNDER the fixed header band (top = the band's measured height)\n\t\t     and runs to the viewport bottom, in both docks. It still uses Nebular's default fixed\n\t\t     `.main-container` \u2014 see the scss for why COLLAPSED must then be `display: none`\n\t\t     rather than merely zero-width. -->\n\t\t<nb-sidebar\n\t\t\tclass=\"chat-sidebar\"\n\t\t\t[class]=\"chatSidebarService.config()?.class ?? ''\"\n\t\t\t[class.chat-sidebar-end]=\"chatSidebarService.position() === 'end'\"\n\t\t\t[class.chat-sidebar-maximized]=\"chatSidebarService.maximized()\"\n\t\t\t[style.--gz-chat-width]=\"chatSidebarService.width() + 'px'\"\n\t\t\ttag=\"chat-sidebar\"\n\t\t\t[state]=\"chatSidebarService.expanded() ? 'expanded' : 'collapsed'\"\n\t\t>\n\t\t\t<ng-container *ngComponentOutlet=\"chatComponent\"></ng-container>\n\t\t</nb-sidebar>\n\t}\n\n\t<!-- Main content -->\n\t<nb-layout-column>\n\t\t<ng-content select=\"router-outlet\"></ng-content>\n\t</nb-layout-column>\n\n\t<!-- Footer -->\n\t<nb-layout-footer fixed>\n\t\t<ngx-footer></ngx-footer>\n\t</nb-layout-footer>\n\n\t<!-- Dynamic sidebars -->\n\t@for (sidebar of navigationBuilderService.sidebars$ | async; track sidebar.id) {\n\t\t<nb-sidebar [class]=\"sidebar.class\" [tag]=\"sidebar.id\" state=\"collapsed\" fixed [end]=\"true\">\n\t\t\t<ngx-theme-sidebar [config]=\"sidebar\"></ngx-theme-sidebar>\n\t\t</nb-sidebar>\n\t}\n</nb-layout>\n\n@if (isOpen()) {\n\t<gauzy-user-menu [user$]=\"user$\" (close)=\"closeUserMenu()\"></gauzy-user-menu>\n}\n\n@if (isWorkspaceOpen()) {\n\t<gauzy-workspace-menu (close)=\"closeWorkspaceMenu()\"></gauzy-workspace-menu>\n}\n", styles: [":host .menu-sidebar ::ng-deep .scrollable{display:flex;flex-direction:column;align-items:stretch;padding-bottom:0rem!important;padding-top:.1rem!important;padding-left:0!important;padding-right:0!important}:host .settings-sidebar.expanded{width:22.5rem!important;height:fit-content;z-index:1042}:host .changelog-sidebar.expanded{width:22.5rem!important;height:fit-content;z-index:1042}:host nb-user{cursor:pointer}:host .menu-sidebar-rtl{order:2!important}:host .menu-sidebar,:host .user-workspace{order:0!important}:host nb-sidebar.chat-sidebar{order:0!important;align-self:stretch}:host nb-sidebar.chat-sidebar.chat-sidebar-end{order:2!important}:host nb-sidebar.chat-sidebar.chat-sidebar-end ::ng-deep .main-container .scrollable{border-inline-end:0;border-inline-start:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host nb-sidebar.chat-sidebar.expanded{width:var(--gz-chat-width, 24rem)!important}:host nb-sidebar.chat-sidebar.chat-sidebar-maximized{flex:1 1 auto!important;width:auto!important;min-width:0!important;max-width:none!important}:host nb-sidebar.chat-sidebar.chat-sidebar-maximized ::ng-deep .main-container{right:0;width:auto!important}:host nb-sidebar.chat-sidebar.collapsed{width:0!important;overflow:hidden}:host nb-sidebar.chat-sidebar.collapsed ::ng-deep .main-container{display:none!important}:host nb-sidebar.chat-sidebar ::ng-deep .main-container{width:var(--gz-chat-width, 24rem);max-width:none;top:var(--gz-header-height, var(--header-height, 4.5rem))!important;height:calc(100vh - var(--gz-header-height, var(--header-height, 4.5rem)))!important;z-index:1039;transition:width .2s ease;overflow:hidden}:host nb-sidebar.chat-sidebar ::ng-deep .main-container .scrollable{display:flex;flex-direction:column;height:100%;padding:0!important;overflow:hidden;background:var(--gauzy-sidebar-background-2);--gz-chat-surface: var(--gauzy-sidebar-background-2);color:var(--text-basic-color);border-inline-end:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host gauzy-user-menu{position:absolute;bottom:3.25rem}[dir=ltr] :host gauzy-user-menu{left:.75rem}[dir=rtl] :host gauzy-user-menu{right:.75rem}:host gauzy-user-menu{z-index:1041}:host gauzy-workspace-menu{position:absolute;top:4rem}[dir=ltr] :host gauzy-workspace-menu{left:.75rem}[dir=rtl] :host gauzy-workspace-menu{right:.75rem}:host gauzy-workspace-menu{z-index:1042}:host .sidebar-footer{width:100%;display:flex;align-items:center;margin-top:auto;padding:.5rem .75rem;--gz-user-surface: var(--gauzy-sidebar-background-2);--gz-user-presence: none;--gz-user-email-size: .875rem}:host .sidebar-footer gauzy-user{flex:1 1 auto;min-width:0}:host .sidebar-footer.compacted{justify-content:center;padding-left:.25rem;padding-right:.25rem}:host .sidebar-footer.compacted gauzy-user{flex:0 0 auto}nb-sidebar[tag=user-workspace] ::ng-deep .scrollable{background:var(--gauzy-sidebar-background-1)}nb-sidebar[tag=menu-sidebar] ::ng-deep nb-menu{margin:0;height:100%}nb-sidebar[tag=menu-sidebar] ::ng-deep .scrollable{background:var(--gauzy-sidebar-background-2)}.logo-container{display:flex;align-items:center;flex-wrap:nowrap;gap:.25rem;width:100%;max-width:100%;box-sizing:border-box;min-height:3.25rem;padding:.75rem;overflow:hidden}.logo-container ngx-gauzy-logo{flex:1 1 auto;min-width:0;width:auto;z-index:2;margin-right:2rem}[dir=rtl] .logo-container ngx-gauzy-logo{margin-right:0;margin-left:2rem}.logo-container ::ng-deep .accordion.workspace{width:100%;max-width:100%;min-width:0;box-sizing:border-box}.logo-container ::ng-deep .accordion.workspace nb-accordion-item-header.principal{display:flex;align-items:center;min-width:0;overflow:hidden;position:relative}.logo-container ::ng-deep .accordion.workspace nb-accordion-item-header.principal .tenant{flex:1 1 auto;min-width:0;overflow:hidden}.logo-container:not(.compacted) ::ng-deep .accordion.workspace nb-accordion-item-header.principal{padding-inline-end:.25rem}.logo-container:not(.compacted) ::ng-deep .accordion.workspace nb-accordion-item-header.principal .expansion-indicator{position:static;flex:0 0 auto;margin-inline-start:.125rem}.logo-container.not-collapsed{padding:.75rem .5rem}.logo-container.compacted{justify-content:center;padding:.375rem .25rem;min-height:0}.logo-container.compacted ngx-gauzy-logo{flex:0 0 auto;margin-right:0}[dir=rtl] .logo-container.compacted ngx-gauzy-logo{margin-left:0}.logo-container.compacted ::ng-deep .accordion.workspace{box-shadow:none;width:1.75rem;max-width:1.75rem;height:auto;max-height:none}.logo-container.compacted ::ng-deep .accordion.workspace .description,.logo-container.compacted ::ng-deep .accordion.workspace .switch-indicator,.logo-container.compacted ::ng-deep .accordion.workspace nb-accordion-item-body{display:none}.logo-container.compacted ::ng-deep .accordion.workspace .tenant{justify-content:center}.logo-container.compacted ::ng-deep .accordion.workspace .tenant img{width:1.25rem;height:1.25rem;margin-right:0}.logo-container.compacted ::ng-deep .accordion.workspace nb-accordion-item-header,.logo-container.compacted ::ng-deep .accordion.workspace nb-accordion-item-header.principal{display:flex;align-items:center;justify-content:center;width:1.75rem;min-width:1.75rem;min-height:1.75rem;max-height:1.75rem;padding:0;border-radius:var(--gauzy-radius-sm, 6px);box-shadow:unset}::ng-deep nb-layout .layout .layout-container nb-sidebar[tag=menu-sidebar] .main-container-fixed{top:0;height:100vh;z-index:1041}::ng-deep nb-layout .layout .layout-container nb-sidebar[tag=user-workspace] .main-container-fixed{top:0;height:100vh;z-index:1041}::ng-deep nb-layout .layout .layout-container nb-sidebar.settings-sidebar.expanded .main-container-fixed{top:calc(var(--gz-header-height, var(--header-height, 4.5rem)) + .5rem);height:auto;max-height:calc(100vh - var(--gz-header-height, var(--header-height, 4.5rem)) - 1rem);width:22.5rem!important;max-width:calc(100vw - 2.5rem);border:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));box-shadow:var(--gauzy-overlay-shadow, 0 8px 24px -6px rgba(0, 0, 0, .16), 0 2px 6px -2px rgba(0, 0, 0, .08));z-index:1041;border-radius:var(--border-radius);background-color:var(--background-basic-color-1);overflow:hidden}::ng-deep nb-layout .layout .layout-container nb-sidebar.settings-sidebar.expanded .main-container-fixed .scrollable{background-color:var(--background-basic-color-1);border-radius:var(--border-radius);overflow-y:auto;overflow-x:hidden}::ng-deep nb-layout .layout .layout-container nb-sidebar.changelog-sidebar.expanded .main-container-fixed{top:calc(var(--gz-header-height, var(--header-height, 4.5rem)) + .5rem);height:auto;max-height:calc(100vh - var(--gz-header-height, var(--header-height, 4.5rem)) - 1rem);width:22.5rem!important;max-width:calc(100vw - 2.5rem);border:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));box-shadow:var(--gauzy-overlay-shadow, 0 8px 24px -6px rgba(0, 0, 0, .16), 0 2px 6px -2px rgba(0, 0, 0, .08));z-index:1041;border-radius:var(--border-radius);background-color:var(--background-basic-color-1);overflow:hidden}::ng-deep nb-layout .layout .layout-container nb-sidebar.changelog-sidebar.expanded .main-container-fixed .scrollable{background-color:var(--background-basic-color-1);border-radius:var(--border-radius);overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;padding:0}@media screen and (min-width:1940px){::ng-deep nb-layout.window-mode nb-layout-header.fixed~.layout-container nb-sidebar:not(.chat-sidebar) .main-container-fixed{top:0;height:100vh;z-index:1041}}::ng-deep nb-layout .layout .layout-container nb-sidebar:not([tag=menu-sidebar]) .main-container-fixed>.scrollable{overflow-y:auto}::ng-deep nb-layout .layout .layout-container nb-sidebar[tag=menu-sidebar],::ng-deep nb-layout .layout .layout-container nb-sidebar[tag=menu-sidebar] .main-container,::ng-deep nb-layout .layout .layout-container nb-sidebar[tag=menu-sidebar] .main-container-fixed,::ng-deep nb-layout .layout .layout-container nb-sidebar[tag=menu-sidebar] .main-container>.scrollable,::ng-deep nb-layout .layout .layout-container nb-sidebar[tag=menu-sidebar] .main-container-fixed>.scrollable{overflow:visible}::ng-deep nb-layout .layout .layout-container nb-sidebar[tag=menu-sidebar] .main-container>.scrollable,::ng-deep nb-layout .layout .layout-container nb-sidebar[tag=menu-sidebar] .main-container-fixed>.scrollable{min-height:0}::ng-deep nb-layout .layout .layout-container nb-sidebar.chat-sidebar.chat-sidebar-maximized~.content{flex:0 0 0%!important;width:0!important;min-width:0!important;max-width:0!important;overflow:hidden!important}.custom-box{display:flex;flex-flow:column;height:100%;position:relative}.rail-edge-button{position:absolute;z-index:1041;display:flex;align-items:center;justify-content:center;appearance:none;padding:0;margin:0;height:1.75rem;width:1.75rem;min-width:1.75rem;border:none;cursor:pointer;line-height:0;color:var(--text-hint-color);background-color:var(--gauzy-sidebar-background-2);transition:background-color .15s ease-in-out,color .15s ease-in-out,border-color .15s ease-in-out}.rail-edge-button svg{flex:0 0 auto;width:1rem;height:1rem}.rail-edge-button:hover{color:var(--text-basic-color);background-color:var(--background-basic-color-3)}.rail-edge-button:focus-visible{outline:2px solid var(--color-primary-default);outline-offset:1px}.rail-edge-button.rail-toggle{top:50%;transform:translateY(-50%);border-radius:var(--gauzy-radius-sm, 6px);right:.75rem}[dir=rtl] .rail-edge-button.rail-toggle{right:auto;left:.75rem}.custom-box.compacted .rail-edge-button.rail-toggle{right:-.875rem}[dir=rtl] .custom-box.compacted .rail-edge-button.rail-toggle{right:auto;left:-.875rem}.rail-edge-button.ai-agent-launch{top:50%;transform:translateY(-50%);border-radius:50%;border:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));right:-.875rem}[dir=rtl] .rail-edge-button.ai-agent-launch{right:auto;left:-.875rem}.rail-edge-button.ai-agent-launch:hover{border-color:var(--color-primary-default);color:var(--color-primary-default)}.custom-box .custom-row.logo{flex:0 0 auto;align-self:stretch;min-width:0;position:relative;overflow:visible}.custom-box .custom-row.menu{flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior-y:contain;padding:0 .75rem}.custom-box.compacted .custom-row.menu{padding:0 .5rem}[dir=ltr] :host ::ng-deep nb-layout .layout .layout-container nb-sidebar.settings-sidebar.expanded .main-container-fixed,[dir=ltr] :host ::ng-deep nb-layout .layout .layout-container nb-sidebar.changelog-sidebar.expanded .main-container-fixed{right:20px}[dir=rtl] :host ::ng-deep nb-layout .layout .layout-container nb-sidebar.settings-sidebar.expanded .main-container-fixed,[dir=rtl] :host ::ng-deep nb-layout .layout .layout-container nb-sidebar.changelog-sidebar.expanded .main-container-fixed{left:20px}:host ::ng-deep nb-layout.window-mode .layout nb-layout-header.fixed,:host ::ng-deep nb-layout .layout nb-layout-header.fixed{left:var(--gz-band-left, 0px);right:var(--gz-band-right, 0px);width:auto;max-width:none;margin-left:0;margin-right:0}:host ::ng-deep nb-layout .layout nb-layout-header.fixed nav{border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host ::ng-deep nb-layout .layout .layout-container nb-sidebar[tag=menu-sidebar] .main-container-fixed{border-inline-end:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host ::ng-deep nb-layout .layout .layout-container .content nb-layout-footer nav{display:flex;align-items:center;border-top:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));box-shadow:none}:host ::ng-deep nb-layout.window-mode .layout nb-layout-footer.fixed,:host ::ng-deep nb-layout .layout nb-layout-footer.fixed{left:var(--gz-band-left, 0px);right:var(--gz-band-right, 0px);width:auto;max-width:none;margin-left:0;margin-right:0}\n/*!\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i1.NgComponentOutlet, selector: "[ngComponentOutlet]", inputs: ["ngComponentOutlet", "ngComponentOutletInputs", "ngComponentOutletInjector", "ngComponentOutletEnvironmentInjector", "ngComponentOutletContent", "ngComponentOutletNgModule"], exportAs: ["ngComponentOutlet"] }, { kind: "component", type: i2.ThemeSidebarComponent, selector: "ngx-theme-sidebar", inputs: ["config"] }, { kind: "component", type: i3.NbLayoutComponent, selector: "nb-layout", inputs: ["center", "windowMode", "withScroll", "restoreScrollTop"] }, { kind: "component", type: i3.NbLayoutColumnComponent, selector: "nb-layout-column", inputs: ["left", "start"] }, { kind: "component", type: i3.NbLayoutFooterComponent, selector: "nb-layout-footer", inputs: ["fixed"] }, { kind: "component", type: i3.NbLayoutHeaderComponent, selector: "nb-layout-header", inputs: ["fixed", "subheader"] }, { kind: "component", type: i3.NbSidebarComponent, selector: "nb-sidebar", inputs: ["right", "left", "start", "end", "fixed", "containerFixed", "state", "responsive", "tag", "compactedBreakpoints", "collapsedBreakpoints"], outputs: ["stateChange", "responsiveStateChange"] }, { kind: "component", type: i4.HeaderComponent, selector: "ngx-header", inputs: ["position", "expanded"] }, { kind: "component", type: i5.FooterComponent, selector: "ngx-footer" }, { kind: "component", type: i6.GauzyLogoComponent, selector: "ngx-gauzy-logo", inputs: ["controlled", "isAccordion", "isWorkspaceOpen"], outputs: ["onCollapsed", "onWorkspaceToggle"] }, { kind: "component", type: i7.UserMenuComponent, selector: "gauzy-user-menu", inputs: ["user$"], outputs: ["close"] }, { kind: "component", type: i8.UserComponent, selector: "gauzy-user", inputs: ["showIdentity", "user$"], outputs: ["clicked"] }, { kind: "component", type: i9.WorkspaceMenuComponent, selector: "gauzy-workspace-menu", outputs: ["close"] }, { kind: "pipe", type: i1.AsyncPipe, name: "async" }, { kind: "pipe", type: i10.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OneColumnLayoutComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-one-column-layout', standalone: false, template: "<nb-layout windowMode>\n\t<!-- Header \u2014 spans everything right of the nav menu, INCLUDING the chat column.\n\t     Nebular renders a `fixed` header at full width, so the BAND ITSELF is inset to the menu\n\t     sidebar's trailing edge (see `--gz-band-left/right` in the layout ts and scss); the chat\n\t     panel tucks UNDER it (top = `--gz-header-height`, z one below the header's), exactly like\n\t     the canvas does. -->\n\t@if (user()) {\n\t\t<nb-layout-header fixed>\n\t\t\t<ngx-header [expanded]=\"isExpanded()\"></ngx-header>\n\t\t</nb-layout-header>\n\t}\n\n\t<!-- Sidebar -->\n\t@if (user()) {\n\t\t<nb-sidebar\n\t\t\tclass=\"menu-sidebar sidebar_class\"\n\t\t\ttag=\"menu-sidebar\"\n\t\t\t(stateChange)=\"onStateChange($event)\"\n\t\t>\n\t\t\t<div class=\"custom-box\" [class.compacted]=\"!isExpanded()\">\n\n\t\t\t\t@if (chatSidebarService.available() && !chatSidebarService.expanded()) {\n\t\t\t\t\t<button\n\t\t\t\t\t\tclass=\"rail-edge-button ai-agent-launch\"\n\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t[title]=\"'HEADER.AI_CHAT' | translate\"\n\t\t\t\t\t\t[attr.aria-label]=\"'HEADER.AI_CHAT' | translate\"\n\t\t\t\t\t\t(click)=\"chatSidebarService.expand()\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<svg\n\t\t\t\t\t\t\tviewBox=\"0 0 24 24\"\n\t\t\t\t\t\t\tfill=\"none\"\n\t\t\t\t\t\t\tstroke=\"currentColor\"\n\t\t\t\t\t\t\tstroke-width=\"2\"\n\t\t\t\t\t\t\tstroke-linecap=\"round\"\n\t\t\t\t\t\t\tstroke-linejoin=\"round\"\n\t\t\t\t\t\t\taria-hidden=\"true\"\n\t\t\t\t\t\t\tfocusable=\"false\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<path d=\"M12 8V4H8\" />\n\t\t\t\t\t\t\t<rect width=\"16\" height=\"12\" x=\"4\" y=\"8\" rx=\"2\" />\n\t\t\t\t\t\t\t<path d=\"M2 14h2\" />\n\t\t\t\t\t\t\t<path d=\"M20 14h2\" />\n\t\t\t\t\t\t\t<path d=\"M15 13v2\" />\n\t\t\t\t\t\t\t<path d=\"M9 13v2\" />\n\t\t\t\t\t\t</svg>\n\t\t\t\t\t</button>\n\t\t\t\t}\n\n\t\t\t\t<div class=\"custom-row logo\">\n\t\t\t\t\t<button\n\t\t\t\t\t\tclass=\"rail-edge-button rail-toggle\"\n\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t(click)=\"toggle()\"\n\t\t\t\t\t\t[title]=\"(isExpanded() ? 'HEADER.COLLAPSE_SIDEBAR' : 'HEADER.EXPAND_SIDEBAR') | translate\"\n\t\t\t\t\t\t[attr.aria-label]=\"\n\t\t\t\t\t\t\t(isExpanded() ? 'HEADER.COLLAPSE_SIDEBAR' : 'HEADER.EXPAND_SIDEBAR') | translate\n\t\t\t\t\t\t\"\n\t\t\t\t\t\t[attr.aria-expanded]=\"isExpanded()\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<svg\n\t\t\t\t\t\t\tviewBox=\"0 0 24 24\"\n\t\t\t\t\t\t\tfill=\"none\"\n\t\t\t\t\t\t\tstroke=\"currentColor\"\n\t\t\t\t\t\t\tstroke-width=\"2\"\n\t\t\t\t\t\t\tstroke-linecap=\"round\"\n\t\t\t\t\t\t\tstroke-linejoin=\"round\"\n\t\t\t\t\t\t\taria-hidden=\"true\"\n\t\t\t\t\t\t\tfocusable=\"false\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" />\n\t\t\t\t\t\t\t<path d=\"M9 3v18\" />\n\t\t\t\t\t\t\t<path [attr.d]=\"isExpanded() ? 'm16 15-3-3 3-3' : 'm14 9 3 3-3 3'\" />\n\t\t\t\t\t\t</svg>\n\t\t\t\t\t</button>\n\n\t\t\t\t\t<div\n\t\t\t\t\t\tclass=\"logo-container\"\n\t\t\t\t\t\t[class.not-collapsed]=\"!isCollapse() && isExpanded()\"\n\t\t\t\t\t\t[class.compacted]=\"!isExpanded()\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<ngx-gauzy-logo\n\t\t\t\t\t\t\t[controlled]=\"trigger()\"\n\t\t\t\t\t\t\t[isWorkspaceOpen]=\"isWorkspaceOpen()\"\n\t\t\t\t\t\t\t(onCollapsed)=\"onCollapse($event)\"\n\t\t\t\t\t\t\t(onWorkspaceToggle)=\"onWorkspaceToggle($event)\"\n\t\t\t\t\t\t></ngx-gauzy-logo>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"custom-row menu\">\n\t\t\t\t\t<ng-content select=\"ga-main-nav-menu\"></ng-content>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"sidebar-footer\" [class.compacted]=\"!isExpanded()\">\n\t\t\t\t\t<gauzy-user [user$]=\"user$\" [showIdentity]=\"isExpanded()\" (clicked)=\"toggleUserMenu()\"></gauzy-user>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</nb-sidebar>\n\t}\n\n\t<!-- AI Chat sidebar \u2014 dedicated slot between the nav menu and the main content.\n\t     Single @if (like the menu sidebar above): nesting control-flow blocks breaks\n\t     nb-layout's select-based content projection for nb-sidebar. -->\n\t@if (user() && chatSidebarService.available() && chatSidebarComponent(); as chatComponent) {\n\t\t<!-- A column that starts UNDER the fixed header band (top = the band's measured height)\n\t\t     and runs to the viewport bottom, in both docks. It still uses Nebular's default fixed\n\t\t     `.main-container` \u2014 see the scss for why COLLAPSED must then be `display: none`\n\t\t     rather than merely zero-width. -->\n\t\t<nb-sidebar\n\t\t\tclass=\"chat-sidebar\"\n\t\t\t[class]=\"chatSidebarService.config()?.class ?? ''\"\n\t\t\t[class.chat-sidebar-end]=\"chatSidebarService.position() === 'end'\"\n\t\t\t[class.chat-sidebar-maximized]=\"chatSidebarService.maximized()\"\n\t\t\t[style.--gz-chat-width]=\"chatSidebarService.width() + 'px'\"\n\t\t\ttag=\"chat-sidebar\"\n\t\t\t[state]=\"chatSidebarService.expanded() ? 'expanded' : 'collapsed'\"\n\t\t>\n\t\t\t<ng-container *ngComponentOutlet=\"chatComponent\"></ng-container>\n\t\t</nb-sidebar>\n\t}\n\n\t<!-- Main content -->\n\t<nb-layout-column>\n\t\t<ng-content select=\"router-outlet\"></ng-content>\n\t</nb-layout-column>\n\n\t<!-- Footer -->\n\t<nb-layout-footer fixed>\n\t\t<ngx-footer></ngx-footer>\n\t</nb-layout-footer>\n\n\t<!-- Dynamic sidebars -->\n\t@for (sidebar of navigationBuilderService.sidebars$ | async; track sidebar.id) {\n\t\t<nb-sidebar [class]=\"sidebar.class\" [tag]=\"sidebar.id\" state=\"collapsed\" fixed [end]=\"true\">\n\t\t\t<ngx-theme-sidebar [config]=\"sidebar\"></ngx-theme-sidebar>\n\t\t</nb-sidebar>\n\t}\n</nb-layout>\n\n@if (isOpen()) {\n\t<gauzy-user-menu [user$]=\"user$\" (close)=\"closeUserMenu()\"></gauzy-user-menu>\n}\n\n@if (isWorkspaceOpen()) {\n\t<gauzy-workspace-menu (close)=\"closeWorkspaceMenu()\"></gauzy-workspace-menu>\n}\n", styles: [":host .menu-sidebar ::ng-deep .scrollable{display:flex;flex-direction:column;align-items:stretch;padding-bottom:0rem!important;padding-top:.1rem!important;padding-left:0!important;padding-right:0!important}:host .settings-sidebar.expanded{width:22.5rem!important;height:fit-content;z-index:1042}:host .changelog-sidebar.expanded{width:22.5rem!important;height:fit-content;z-index:1042}:host nb-user{cursor:pointer}:host .menu-sidebar-rtl{order:2!important}:host .menu-sidebar,:host .user-workspace{order:0!important}:host nb-sidebar.chat-sidebar{order:0!important;align-self:stretch}:host nb-sidebar.chat-sidebar.chat-sidebar-end{order:2!important}:host nb-sidebar.chat-sidebar.chat-sidebar-end ::ng-deep .main-container .scrollable{border-inline-end:0;border-inline-start:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host nb-sidebar.chat-sidebar.expanded{width:var(--gz-chat-width, 24rem)!important}:host nb-sidebar.chat-sidebar.chat-sidebar-maximized{flex:1 1 auto!important;width:auto!important;min-width:0!important;max-width:none!important}:host nb-sidebar.chat-sidebar.chat-sidebar-maximized ::ng-deep .main-container{right:0;width:auto!important}:host nb-sidebar.chat-sidebar.collapsed{width:0!important;overflow:hidden}:host nb-sidebar.chat-sidebar.collapsed ::ng-deep .main-container{display:none!important}:host nb-sidebar.chat-sidebar ::ng-deep .main-container{width:var(--gz-chat-width, 24rem);max-width:none;top:var(--gz-header-height, var(--header-height, 4.5rem))!important;height:calc(100vh - var(--gz-header-height, var(--header-height, 4.5rem)))!important;z-index:1039;transition:width .2s ease;overflow:hidden}:host nb-sidebar.chat-sidebar ::ng-deep .main-container .scrollable{display:flex;flex-direction:column;height:100%;padding:0!important;overflow:hidden;background:var(--gauzy-sidebar-background-2);--gz-chat-surface: var(--gauzy-sidebar-background-2);color:var(--text-basic-color);border-inline-end:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host gauzy-user-menu{position:absolute;bottom:3.25rem}[dir=ltr] :host gauzy-user-menu{left:.75rem}[dir=rtl] :host gauzy-user-menu{right:.75rem}:host gauzy-user-menu{z-index:1041}:host gauzy-workspace-menu{position:absolute;top:4rem}[dir=ltr] :host gauzy-workspace-menu{left:.75rem}[dir=rtl] :host gauzy-workspace-menu{right:.75rem}:host gauzy-workspace-menu{z-index:1042}:host .sidebar-footer{width:100%;display:flex;align-items:center;margin-top:auto;padding:.5rem .75rem;--gz-user-surface: var(--gauzy-sidebar-background-2);--gz-user-presence: none;--gz-user-email-size: .875rem}:host .sidebar-footer gauzy-user{flex:1 1 auto;min-width:0}:host .sidebar-footer.compacted{justify-content:center;padding-left:.25rem;padding-right:.25rem}:host .sidebar-footer.compacted gauzy-user{flex:0 0 auto}nb-sidebar[tag=user-workspace] ::ng-deep .scrollable{background:var(--gauzy-sidebar-background-1)}nb-sidebar[tag=menu-sidebar] ::ng-deep nb-menu{margin:0;height:100%}nb-sidebar[tag=menu-sidebar] ::ng-deep .scrollable{background:var(--gauzy-sidebar-background-2)}.logo-container{display:flex;align-items:center;flex-wrap:nowrap;gap:.25rem;width:100%;max-width:100%;box-sizing:border-box;min-height:3.25rem;padding:.75rem;overflow:hidden}.logo-container ngx-gauzy-logo{flex:1 1 auto;min-width:0;width:auto;z-index:2;margin-right:2rem}[dir=rtl] .logo-container ngx-gauzy-logo{margin-right:0;margin-left:2rem}.logo-container ::ng-deep .accordion.workspace{width:100%;max-width:100%;min-width:0;box-sizing:border-box}.logo-container ::ng-deep .accordion.workspace nb-accordion-item-header.principal{display:flex;align-items:center;min-width:0;overflow:hidden;position:relative}.logo-container ::ng-deep .accordion.workspace nb-accordion-item-header.principal .tenant{flex:1 1 auto;min-width:0;overflow:hidden}.logo-container:not(.compacted) ::ng-deep .accordion.workspace nb-accordion-item-header.principal{padding-inline-end:.25rem}.logo-container:not(.compacted) ::ng-deep .accordion.workspace nb-accordion-item-header.principal .expansion-indicator{position:static;flex:0 0 auto;margin-inline-start:.125rem}.logo-container.not-collapsed{padding:.75rem .5rem}.logo-container.compacted{justify-content:center;padding:.375rem .25rem;min-height:0}.logo-container.compacted ngx-gauzy-logo{flex:0 0 auto;margin-right:0}[dir=rtl] .logo-container.compacted ngx-gauzy-logo{margin-left:0}.logo-container.compacted ::ng-deep .accordion.workspace{box-shadow:none;width:1.75rem;max-width:1.75rem;height:auto;max-height:none}.logo-container.compacted ::ng-deep .accordion.workspace .description,.logo-container.compacted ::ng-deep .accordion.workspace .switch-indicator,.logo-container.compacted ::ng-deep .accordion.workspace nb-accordion-item-body{display:none}.logo-container.compacted ::ng-deep .accordion.workspace .tenant{justify-content:center}.logo-container.compacted ::ng-deep .accordion.workspace .tenant img{width:1.25rem;height:1.25rem;margin-right:0}.logo-container.compacted ::ng-deep .accordion.workspace nb-accordion-item-header,.logo-container.compacted ::ng-deep .accordion.workspace nb-accordion-item-header.principal{display:flex;align-items:center;justify-content:center;width:1.75rem;min-width:1.75rem;min-height:1.75rem;max-height:1.75rem;padding:0;border-radius:var(--gauzy-radius-sm, 6px);box-shadow:unset}::ng-deep nb-layout .layout .layout-container nb-sidebar[tag=menu-sidebar] .main-container-fixed{top:0;height:100vh;z-index:1041}::ng-deep nb-layout .layout .layout-container nb-sidebar[tag=user-workspace] .main-container-fixed{top:0;height:100vh;z-index:1041}::ng-deep nb-layout .layout .layout-container nb-sidebar.settings-sidebar.expanded .main-container-fixed{top:calc(var(--gz-header-height, var(--header-height, 4.5rem)) + .5rem);height:auto;max-height:calc(100vh - var(--gz-header-height, var(--header-height, 4.5rem)) - 1rem);width:22.5rem!important;max-width:calc(100vw - 2.5rem);border:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));box-shadow:var(--gauzy-overlay-shadow, 0 8px 24px -6px rgba(0, 0, 0, .16), 0 2px 6px -2px rgba(0, 0, 0, .08));z-index:1041;border-radius:var(--border-radius);background-color:var(--background-basic-color-1);overflow:hidden}::ng-deep nb-layout .layout .layout-container nb-sidebar.settings-sidebar.expanded .main-container-fixed .scrollable{background-color:var(--background-basic-color-1);border-radius:var(--border-radius);overflow-y:auto;overflow-x:hidden}::ng-deep nb-layout .layout .layout-container nb-sidebar.changelog-sidebar.expanded .main-container-fixed{top:calc(var(--gz-header-height, var(--header-height, 4.5rem)) + .5rem);height:auto;max-height:calc(100vh - var(--gz-header-height, var(--header-height, 4.5rem)) - 1rem);width:22.5rem!important;max-width:calc(100vw - 2.5rem);border:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));box-shadow:var(--gauzy-overlay-shadow, 0 8px 24px -6px rgba(0, 0, 0, .16), 0 2px 6px -2px rgba(0, 0, 0, .08));z-index:1041;border-radius:var(--border-radius);background-color:var(--background-basic-color-1);overflow:hidden}::ng-deep nb-layout .layout .layout-container nb-sidebar.changelog-sidebar.expanded .main-container-fixed .scrollable{background-color:var(--background-basic-color-1);border-radius:var(--border-radius);overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;padding:0}@media screen and (min-width:1940px){::ng-deep nb-layout.window-mode nb-layout-header.fixed~.layout-container nb-sidebar:not(.chat-sidebar) .main-container-fixed{top:0;height:100vh;z-index:1041}}::ng-deep nb-layout .layout .layout-container nb-sidebar:not([tag=menu-sidebar]) .main-container-fixed>.scrollable{overflow-y:auto}::ng-deep nb-layout .layout .layout-container nb-sidebar[tag=menu-sidebar],::ng-deep nb-layout .layout .layout-container nb-sidebar[tag=menu-sidebar] .main-container,::ng-deep nb-layout .layout .layout-container nb-sidebar[tag=menu-sidebar] .main-container-fixed,::ng-deep nb-layout .layout .layout-container nb-sidebar[tag=menu-sidebar] .main-container>.scrollable,::ng-deep nb-layout .layout .layout-container nb-sidebar[tag=menu-sidebar] .main-container-fixed>.scrollable{overflow:visible}::ng-deep nb-layout .layout .layout-container nb-sidebar[tag=menu-sidebar] .main-container>.scrollable,::ng-deep nb-layout .layout .layout-container nb-sidebar[tag=menu-sidebar] .main-container-fixed>.scrollable{min-height:0}::ng-deep nb-layout .layout .layout-container nb-sidebar.chat-sidebar.chat-sidebar-maximized~.content{flex:0 0 0%!important;width:0!important;min-width:0!important;max-width:0!important;overflow:hidden!important}.custom-box{display:flex;flex-flow:column;height:100%;position:relative}.rail-edge-button{position:absolute;z-index:1041;display:flex;align-items:center;justify-content:center;appearance:none;padding:0;margin:0;height:1.75rem;width:1.75rem;min-width:1.75rem;border:none;cursor:pointer;line-height:0;color:var(--text-hint-color);background-color:var(--gauzy-sidebar-background-2);transition:background-color .15s ease-in-out,color .15s ease-in-out,border-color .15s ease-in-out}.rail-edge-button svg{flex:0 0 auto;width:1rem;height:1rem}.rail-edge-button:hover{color:var(--text-basic-color);background-color:var(--background-basic-color-3)}.rail-edge-button:focus-visible{outline:2px solid var(--color-primary-default);outline-offset:1px}.rail-edge-button.rail-toggle{top:50%;transform:translateY(-50%);border-radius:var(--gauzy-radius-sm, 6px);right:.75rem}[dir=rtl] .rail-edge-button.rail-toggle{right:auto;left:.75rem}.custom-box.compacted .rail-edge-button.rail-toggle{right:-.875rem}[dir=rtl] .custom-box.compacted .rail-edge-button.rail-toggle{right:auto;left:-.875rem}.rail-edge-button.ai-agent-launch{top:50%;transform:translateY(-50%);border-radius:50%;border:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));right:-.875rem}[dir=rtl] .rail-edge-button.ai-agent-launch{right:auto;left:-.875rem}.rail-edge-button.ai-agent-launch:hover{border-color:var(--color-primary-default);color:var(--color-primary-default)}.custom-box .custom-row.logo{flex:0 0 auto;align-self:stretch;min-width:0;position:relative;overflow:visible}.custom-box .custom-row.menu{flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior-y:contain;padding:0 .75rem}.custom-box.compacted .custom-row.menu{padding:0 .5rem}[dir=ltr] :host ::ng-deep nb-layout .layout .layout-container nb-sidebar.settings-sidebar.expanded .main-container-fixed,[dir=ltr] :host ::ng-deep nb-layout .layout .layout-container nb-sidebar.changelog-sidebar.expanded .main-container-fixed{right:20px}[dir=rtl] :host ::ng-deep nb-layout .layout .layout-container nb-sidebar.settings-sidebar.expanded .main-container-fixed,[dir=rtl] :host ::ng-deep nb-layout .layout .layout-container nb-sidebar.changelog-sidebar.expanded .main-container-fixed{left:20px}:host ::ng-deep nb-layout.window-mode .layout nb-layout-header.fixed,:host ::ng-deep nb-layout .layout nb-layout-header.fixed{left:var(--gz-band-left, 0px);right:var(--gz-band-right, 0px);width:auto;max-width:none;margin-left:0;margin-right:0}:host ::ng-deep nb-layout .layout nb-layout-header.fixed nav{border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host ::ng-deep nb-layout .layout .layout-container nb-sidebar[tag=menu-sidebar] .main-container-fixed{border-inline-end:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host ::ng-deep nb-layout .layout .layout-container .content nb-layout-footer nav{display:flex;align-items:center;border-top:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));box-shadow:none}:host ::ng-deep nb-layout.window-mode .layout nb-layout-footer.fixed,:host ::ng-deep nb-layout .layout nb-layout-footer.fixed{left:var(--gz-band-left, 0px);right:var(--gz-band-right, 0px);width:auto;max-width:none;margin-left:0;margin-right:0}\n/*!\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [], propDecorators: { layout: [{ type: i0.ViewChild, args: [i0.forwardRef(() => NbLayoutComponent), { isSignal: true }] }] } });
//# sourceMappingURL=one-column.layout.js.map