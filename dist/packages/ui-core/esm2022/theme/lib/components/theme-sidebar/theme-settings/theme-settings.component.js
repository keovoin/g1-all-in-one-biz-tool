import { __decorate, __metadata } from "tslib";
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NbSidebarService } from '@nebular/theme';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { asyncScheduler, merge } from 'rxjs';
import { filter, observeOn, take, tap } from 'rxjs/operators';
import { environment } from '@gauzy/ui-config';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@angular/router";
import * as i3 from "./components/theme-language-selector/theme-language-selector.component";
import * as i4 from "./components/layout-selector/layout-selector.component";
import * as i5 from "./components/theme-selector/switch-theme/switch-theme.component";
import * as i6 from "./components/theme-selector/container/theme-selector-container.component";
import * as i7 from "@gauzy/ui-core/shared";
import * as i8 from "@ngx-translate/core";
/** Tag of the Nebular sidebar this component is rendered into. */
export const QUICK_SETTINGS_SIDEBAR_TAG = 'settings_sidebar';
let ThemeSettingsComponent = class ThemeSettingsComponent {
    trackOverlayClick(target) {
        this.clickedInOverlay = target instanceof Element && !!target.closest('.cdk-overlay-container');
    }
    constructor(sidebarService, router) {
        this.sidebarService = sidebarService;
        this.router = router;
        this.clickedInOverlay = false;
        /**
         * Support chat is only offered when this deployment configured a Chatwoot
         * website token: AppComponent only injects the SDK in that case, so without
         * a token there would be no widget to open.
         */
        this.isSupportChatAvailable = !!environment.CHATWOOT_SDK_TOKEN;
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
        this.faqUrl = 'https://docs.gauzy.co/reference/faq';
    }
    ngOnInit() {
        // This ran in ngAfterViewChecked — i.e. after every change-detection pass — opening a new
        // subscription each time. untilDestroyed only reclaims them when this component is destroyed,
        // and it lives for as long as the layout does, so they piled up. `getSidebarState()` is also
        // not a plain getter: each call allocates a ReplaySubject and pushes it onto a module-level
        // Subject that Nebular broadcasts to EVERY mounted sidebar, so the cost was app-wide per tick.
        //
        // It cannot simply move to a single subscription, though: getSidebarState() emits exactly ONCE
        // (it is a query, not a stream), and `state` has to stay current — onClickOutside() below uses
        // it to decide whether an outside click should close the panel, so a value frozen at init would
        // leave the panel un-closable. Re-read it when the sidebar actually changes instead.
        this.syncState();
        merge(this.sidebarService.onToggle(), this.sidebarService.onExpand(), this.sidebarService.onCollapse(), this.sidebarService.onCompact())
            .pipe(
        // Tagged-only, matching how NbSidebarComponent itself filters: a sidebar that HAS a tag
        // ignores untagged events, so reacting to them here would just re-query for nothing.
        filter(({ tag }) => tag === QUICK_SETTINGS_SIDEBAR_TAG), 
        // DO NOT make this synchronous. The header gear calls sidebarService.toggle() from a
        // click handler, and `OutsideDirective` listens on `document:click` WITHOUT capture, so
        // it runs later in that same dispatch. If `state` were already true by then,
        // onClickOutside() below would see "clicked outside && open" and immediately collapse
        // the panel the gear just opened — verified: the trace read
        //   toggle(settings_sidebar) -> state=true -> collapse(settings_sidebar) -> state=false
        // and the panel became impossible to open.
        //
        // The old ngAfterViewChecked version only worked BECAUSE its value was stale for that
        // tick, so "read the state on demand instead" reintroduces the same bug — by the time
        // the document click runs, the sidebar really is expanded. The panel must simply not
        // count as open during the click that opened it, so defer to a macro task. A microtask is
        // NOT enough: microtask checkpoints drain between individual DOM listeners.
        observeOn(asyncScheduler), untilDestroyed(this))
            .subscribe(() => this.syncState());
    }
    /**
     * Read the Quick Settings sidebar's current state.
     *
     * `take(1)` is what makes this safe to call repeatedly: getSidebarState() returns a ReplaySubject
     * that receives exactly one value, so without it each call would leave a subscription open forever
     * waiting for a second emission that never arrives.
     */
    syncState() {
        this.sidebarService
            .getSidebarState(QUICK_SETTINGS_SIDEBAR_TAG)
            .pipe(take(1), tap((state) => (this.state = state === 'expanded')), untilDestroyed(this))
            .subscribe();
    }
    ngOnDestroy() { }
    /**
     * Closes the quick settings sidebar.
     *
     * Collapses rather than toggles: this is only ever called to close the panel
     * (the X button and the outside click), and pages that need to know whether
     * the panel opened or closed listen to the sidebar's expand/collapse events.
     */
    closeSidebar() {
        this.sidebarService.collapse(QUICK_SETTINGS_SIDEBAR_TAG);
    }
    /**
     *
     * @param event
     */
    onClickOutside(event) {
        if (!event && !this.clickedInOverlay && this.state)
            this.closeSidebar();
    }
    /**
     * Navigates to the settings page and closes the quick settings sidebar.
     */
    navigateToSettings() {
        this.router.navigate(['/pages/settings']);
        this.closeSidebar();
    }
    /**
     * Navigates to an application route and closes the quick settings sidebar.
     *
     * @param commands router commands, e.g. ['/pages/help']
     */
    navigateTo(commands) {
        this.router.navigate(commands);
        this.closeSidebar();
    }
    /**
     * Opens the Chatwoot support conversation.
     *
     * The widget's launcher bubble is suppressed (`hideMessageBubble`), so this
     * entry is the only way in. Reading `$chatwoot` off the window rather than
     * caching it matters: the SDK assigns it asynchronously once its script has
     * loaded, and it never appears at all when no website token is configured.
     */
    openSupportChat() {
        const chatwoot = () => window.$chatwoot;
        const widget = chatwoot();
        if (widget) {
            widget.toggle('open');
            this.closeSidebar();
            return;
        }
        // Not loaded YET is different from not configured. Without this branch a click
        // that lands before sdk.js finishes is silently swallowed — a dead click, and
        // the launcher bubble is hidden so this entry is the only way in. The SDK
        // dispatches `chatwoot:ready` once `$chatwoot` is usable; wait for it once.
        if (!this.isSupportChatAvailable) {
            return;
        }
        window.addEventListener('chatwoot:ready', () => chatwoot()?.toggle('open'), { once: true });
        this.closeSidebar();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeSettingsComponent, deps: [{ token: i1.NbSidebarService }, { token: i2.Router }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ThemeSettingsComponent, isStandalone: false, selector: "ngx-theme-settings", host: { listeners: { "document:click": "trackOverlayClick($event.target)" } }, ngImport: i0, template: "<div gauzyOutside (clickOutside)=\"onClickOutside($event)\" class=\"quick-settings-panel\">\n\t<header class=\"panel-header\">\n\t\t<h3 class=\"panel-title\">{{ 'SETTINGS_MENU.QUICK_SETTINGS' | translate }}</h3>\n\t\t<button\n\t\t\ttype=\"button\"\n\t\t\tclass=\"panel-close\"\n\t\t\t[attr.aria-label]=\"'BUTTONS.CLOSE' | translate\"\n\t\t\t(click)=\"closeSidebar()\"\n\t\t>\n\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t</button>\n\t</header>\n\n\t<div class=\"panel-section\">\n\t\t<span class=\"panel-overline\">{{ 'SETTINGS_MENU.PREFERENCES' | translate }}</span>\n\n\t\t<div class=\"control-row\">\n\t\t\t<gauzy-switch-theme class=\"theme\"></gauzy-switch-theme>\n\t\t</div>\n\t\t<div class=\"control-row\">\n\t\t\t<ngx-theme-selector-container [isClassic]=\"false\" class=\"theme\"></ngx-theme-selector-container>\n\t\t</div>\n\t\t<div class=\"control-row\">\n\t\t\t<ngx-theme-language-selector class=\"theme\"></ngx-theme-language-selector>\n\t\t</div>\n\t\t<div class=\"control-row\">\n\t\t\t<gauzy-layout-selector class=\"theme\"></gauzy-layout-selector>\n\t\t</div>\n\t</div>\n\n\t<div class=\"panel-divider\"></div>\n\n\t<!-- Support / help entries, moved here from the speech-bubble header menu.\n\t     `support-links` carries no styling \u2014 it is the scope the message-button E2E\n\t     spec locates these entries by (MessageButtonPageObject.supportLinksCss). -->\n\t<div class=\"panel-section support-links\">\n\t\t<span class=\"panel-overline\">{{ 'SETTINGS_MENU.SUPPORT' | translate }}</span>\n\n\t\t@if (isSupportChatAvailable) {\n\t\t\t<button type=\"button\" class=\"panel-row\" (click)=\"openSupportChat()\">\n\t\t\t\t<nb-icon icon=\"message-square-outline\"></nb-icon>\n\t\t\t\t<span>{{ 'CONTEXT_MENU.CHAT' | translate }}</span>\n\t\t\t</button>\n\t\t}\n\t\t<!-- FAQ had neither a link nor a click handler in the header menu \u2014 it was a\n\t\t     dead entry there. It points at the published FAQ on the docs site, which is\n\t\t     the only FAQ that exists (there is no in-app `faq` route). An <a> rather\n\t\t     than a <button>: it leaves the app, so it should behave like a link\n\t\t     (middle-click, ctrl-click, \"copy link address\"). -->\n\t\t<a class=\"panel-row\" [href]=\"faqUrl\" target=\"_blank\" rel=\"noopener noreferrer\" (click)=\"closeSidebar()\">\n\t\t\t<nb-icon icon=\"clipboard-outline\"></nb-icon>\n\t\t\t<span>{{ 'CONTEXT_MENU.FAQ' | translate }}</span>\n\t\t</a>\n\t\t<button type=\"button\" class=\"panel-row\" (click)=\"navigateTo(['/pages/help'])\">\n\t\t\t<nb-icon icon=\"question-mark-circle-outline\"></nb-icon>\n\t\t\t<span>{{ 'CONTEXT_MENU.HELP' | translate }}</span>\n\t\t</button>\n\t\t<button type=\"button\" class=\"panel-row\" (click)=\"navigateTo(['/pages/about'])\">\n\t\t\t<nb-icon icon=\"droplet-outline\"></nb-icon>\n\t\t\t<span>{{ 'MENU.ABOUT' | translate }}</span>\n\t\t</button>\n\t</div>\n\n\t<footer class=\"panel-actions\">\n\t\t<button nbButton fullWidth status=\"primary\" size=\"small\" (click)=\"navigateToSettings()\">\n\t\t\t<nb-icon icon=\"settings-2-outline\"></nb-icon>\n\t\t\t{{ 'SETTINGS_MENU.SETTINGS' | translate }}\n\t\t</button>\n\t</footer>\n</div>\n", styles: [":host .quick-settings-panel{display:flex;flex-direction:column;padding:.375rem;box-sizing:border-box;font-family:var(--font-family-primary);font-size:.75rem;line-height:1.4;color:var(--text-basic-color)}:host .panel-header{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin:-.375rem -.375rem 0;padding:.5rem .625rem .5rem 1rem;border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));position:sticky;top:-.375rem;z-index:1;background-color:var(--background-basic-color-1)}:host .panel-title{margin:0;font-size:.875rem;font-weight:600;letter-spacing:-.006em;line-height:1.125rem;color:var(--text-basic-color)}:host .panel-close{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:1.375rem;height:1.375rem;padding:0;border:0;border-radius:var(--gauzy-radius-sm, 6px);background:transparent;color:var(--text-hint-color);cursor:pointer;transition:background-color .12s ease-in-out,color .12s ease-in-out}:host .panel-close:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--text-basic-color)}:host .panel-close:focus-visible{outline:2px solid var(--color-primary-default);outline-offset:-2px}:host .panel-close nb-icon,:host .panel-close i{font-size:.875rem;width:.875rem;height:.875rem;line-height:1}:host .panel-divider{height:1px;margin:.375rem 0;border:0;background-color:var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host .panel-overline{display:block;margin:0;padding:.5rem .625rem .25rem;font-size:.75rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;line-height:1;color:var(--text-hint-color);-webkit-user-select:none;user-select:none}:host .panel-section{display:flex;flex-direction:column;gap:.125rem}:host .control-row{display:flex;align-items:center;justify-content:space-between;gap:.75rem;width:100%;margin:0;padding:.375rem .625rem;font-size:.75rem;font-weight:400;line-height:1rem;color:var(--text-basic-color)}:host .control-row .theme{width:100%}:host .panel-row{display:flex;align-items:center;gap:.5rem;width:100%;margin:0;padding:.375rem .625rem;border:0;border-radius:var(--gauzy-radius-sm, 6px);box-shadow:none;background-color:transparent;color:var(--text-basic-color);font-size:.75rem;font-weight:400;line-height:1rem;text-align:start;text-decoration:none;cursor:pointer;transition:background-color .12s ease-in-out,color .12s ease-in-out}:host .panel-row:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--text-basic-color)}:host .panel-row:focus-visible{outline:2px solid var(--color-primary-default);outline-offset:-2px}:host .panel-row nb-icon,:host .panel-row i{flex:0 0 auto;font-size:.9375rem;width:.9375rem;height:.9375rem;color:var(--text-hint-color)}:host .panel-row{font-family:inherit}:host .panel-actions{margin-top:.5rem;padding:0 .625rem}:host .panel-actions [nbButton]{font-size:.75rem;gap:.375rem}:host .panel-actions [nbButton] nb-icon{font-size:1rem;width:1rem;height:1rem}:host .quick-settings-panel ::ng-deep .theme-container,:host .quick-settings-panel ::ng-deep .switch-container{font-size:.75rem;font-weight:400;line-height:1rem;color:var(--text-basic-color);gap:.75rem;flex-wrap:nowrap}:host .quick-settings-panel ::ng-deep .preferred-layout nb-icon{font-size:.875rem;width:.875rem;height:.875rem;color:var(--text-hint-color)}:host .quick-settings-panel ::ng-deep nb-select.appearance-outline .select-button{width:8.75rem;min-width:8.75rem;height:1.75rem;min-height:1.75rem;padding:0 .5rem;border:0;box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--gauzy-radius-sm, 6px);background-color:transparent;font-size:.75rem;font-weight:400;color:var(--text-basic-color)}:host .quick-settings-panel ::ng-deep nb-select.appearance-outline.status-basic .select-button.placeholder{font-size:.75rem;color:var(--text-basic-color)}:host .quick-settings-panel ::ng-deep .reset-layout{font-size:.75rem;padding:.1875rem .375rem;min-width:0;border-color:transparent;color:var(--text-hint-color)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i3.ThemeLanguageSelectorComponent, selector: "ngx-theme-language-selector" }, { kind: "component", type: i4.LayoutSelectorComponent, selector: "gauzy-layout-selector" }, { kind: "component", type: i5.SwitchThemeComponent, selector: "gauzy-switch-theme", inputs: ["hasText"] }, { kind: "component", type: i6.ThemeSelectorContainerComponent, selector: "ngx-theme-selector-container", inputs: ["isClassic"] }, { kind: "directive", type: i7.OutsideDirective, selector: "[gauzyOutside]", outputs: ["clickOutside"] }, { kind: "pipe", type: i8.TranslatePipe, name: "translate" }] }); }
};
ThemeSettingsComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbSidebarService,
        Router])
], ThemeSettingsComponent);
export { ThemeSettingsComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeSettingsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-theme-settings', standalone: false, template: "<div gauzyOutside (clickOutside)=\"onClickOutside($event)\" class=\"quick-settings-panel\">\n\t<header class=\"panel-header\">\n\t\t<h3 class=\"panel-title\">{{ 'SETTINGS_MENU.QUICK_SETTINGS' | translate }}</h3>\n\t\t<button\n\t\t\ttype=\"button\"\n\t\t\tclass=\"panel-close\"\n\t\t\t[attr.aria-label]=\"'BUTTONS.CLOSE' | translate\"\n\t\t\t(click)=\"closeSidebar()\"\n\t\t>\n\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t</button>\n\t</header>\n\n\t<div class=\"panel-section\">\n\t\t<span class=\"panel-overline\">{{ 'SETTINGS_MENU.PREFERENCES' | translate }}</span>\n\n\t\t<div class=\"control-row\">\n\t\t\t<gauzy-switch-theme class=\"theme\"></gauzy-switch-theme>\n\t\t</div>\n\t\t<div class=\"control-row\">\n\t\t\t<ngx-theme-selector-container [isClassic]=\"false\" class=\"theme\"></ngx-theme-selector-container>\n\t\t</div>\n\t\t<div class=\"control-row\">\n\t\t\t<ngx-theme-language-selector class=\"theme\"></ngx-theme-language-selector>\n\t\t</div>\n\t\t<div class=\"control-row\">\n\t\t\t<gauzy-layout-selector class=\"theme\"></gauzy-layout-selector>\n\t\t</div>\n\t</div>\n\n\t<div class=\"panel-divider\"></div>\n\n\t<!-- Support / help entries, moved here from the speech-bubble header menu.\n\t     `support-links` carries no styling \u2014 it is the scope the message-button E2E\n\t     spec locates these entries by (MessageButtonPageObject.supportLinksCss). -->\n\t<div class=\"panel-section support-links\">\n\t\t<span class=\"panel-overline\">{{ 'SETTINGS_MENU.SUPPORT' | translate }}</span>\n\n\t\t@if (isSupportChatAvailable) {\n\t\t\t<button type=\"button\" class=\"panel-row\" (click)=\"openSupportChat()\">\n\t\t\t\t<nb-icon icon=\"message-square-outline\"></nb-icon>\n\t\t\t\t<span>{{ 'CONTEXT_MENU.CHAT' | translate }}</span>\n\t\t\t</button>\n\t\t}\n\t\t<!-- FAQ had neither a link nor a click handler in the header menu \u2014 it was a\n\t\t     dead entry there. It points at the published FAQ on the docs site, which is\n\t\t     the only FAQ that exists (there is no in-app `faq` route). An <a> rather\n\t\t     than a <button>: it leaves the app, so it should behave like a link\n\t\t     (middle-click, ctrl-click, \"copy link address\"). -->\n\t\t<a class=\"panel-row\" [href]=\"faqUrl\" target=\"_blank\" rel=\"noopener noreferrer\" (click)=\"closeSidebar()\">\n\t\t\t<nb-icon icon=\"clipboard-outline\"></nb-icon>\n\t\t\t<span>{{ 'CONTEXT_MENU.FAQ' | translate }}</span>\n\t\t</a>\n\t\t<button type=\"button\" class=\"panel-row\" (click)=\"navigateTo(['/pages/help'])\">\n\t\t\t<nb-icon icon=\"question-mark-circle-outline\"></nb-icon>\n\t\t\t<span>{{ 'CONTEXT_MENU.HELP' | translate }}</span>\n\t\t</button>\n\t\t<button type=\"button\" class=\"panel-row\" (click)=\"navigateTo(['/pages/about'])\">\n\t\t\t<nb-icon icon=\"droplet-outline\"></nb-icon>\n\t\t\t<span>{{ 'MENU.ABOUT' | translate }}</span>\n\t\t</button>\n\t</div>\n\n\t<footer class=\"panel-actions\">\n\t\t<button nbButton fullWidth status=\"primary\" size=\"small\" (click)=\"navigateToSettings()\">\n\t\t\t<nb-icon icon=\"settings-2-outline\"></nb-icon>\n\t\t\t{{ 'SETTINGS_MENU.SETTINGS' | translate }}\n\t\t</button>\n\t</footer>\n</div>\n", styles: [":host .quick-settings-panel{display:flex;flex-direction:column;padding:.375rem;box-sizing:border-box;font-family:var(--font-family-primary);font-size:.75rem;line-height:1.4;color:var(--text-basic-color)}:host .panel-header{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin:-.375rem -.375rem 0;padding:.5rem .625rem .5rem 1rem;border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));position:sticky;top:-.375rem;z-index:1;background-color:var(--background-basic-color-1)}:host .panel-title{margin:0;font-size:.875rem;font-weight:600;letter-spacing:-.006em;line-height:1.125rem;color:var(--text-basic-color)}:host .panel-close{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:1.375rem;height:1.375rem;padding:0;border:0;border-radius:var(--gauzy-radius-sm, 6px);background:transparent;color:var(--text-hint-color);cursor:pointer;transition:background-color .12s ease-in-out,color .12s ease-in-out}:host .panel-close:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--text-basic-color)}:host .panel-close:focus-visible{outline:2px solid var(--color-primary-default);outline-offset:-2px}:host .panel-close nb-icon,:host .panel-close i{font-size:.875rem;width:.875rem;height:.875rem;line-height:1}:host .panel-divider{height:1px;margin:.375rem 0;border:0;background-color:var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host .panel-overline{display:block;margin:0;padding:.5rem .625rem .25rem;font-size:.75rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;line-height:1;color:var(--text-hint-color);-webkit-user-select:none;user-select:none}:host .panel-section{display:flex;flex-direction:column;gap:.125rem}:host .control-row{display:flex;align-items:center;justify-content:space-between;gap:.75rem;width:100%;margin:0;padding:.375rem .625rem;font-size:.75rem;font-weight:400;line-height:1rem;color:var(--text-basic-color)}:host .control-row .theme{width:100%}:host .panel-row{display:flex;align-items:center;gap:.5rem;width:100%;margin:0;padding:.375rem .625rem;border:0;border-radius:var(--gauzy-radius-sm, 6px);box-shadow:none;background-color:transparent;color:var(--text-basic-color);font-size:.75rem;font-weight:400;line-height:1rem;text-align:start;text-decoration:none;cursor:pointer;transition:background-color .12s ease-in-out,color .12s ease-in-out}:host .panel-row:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--text-basic-color)}:host .panel-row:focus-visible{outline:2px solid var(--color-primary-default);outline-offset:-2px}:host .panel-row nb-icon,:host .panel-row i{flex:0 0 auto;font-size:.9375rem;width:.9375rem;height:.9375rem;color:var(--text-hint-color)}:host .panel-row{font-family:inherit}:host .panel-actions{margin-top:.5rem;padding:0 .625rem}:host .panel-actions [nbButton]{font-size:.75rem;gap:.375rem}:host .panel-actions [nbButton] nb-icon{font-size:1rem;width:1rem;height:1rem}:host .quick-settings-panel ::ng-deep .theme-container,:host .quick-settings-panel ::ng-deep .switch-container{font-size:.75rem;font-weight:400;line-height:1rem;color:var(--text-basic-color);gap:.75rem;flex-wrap:nowrap}:host .quick-settings-panel ::ng-deep .preferred-layout nb-icon{font-size:.875rem;width:.875rem;height:.875rem;color:var(--text-hint-color)}:host .quick-settings-panel ::ng-deep nb-select.appearance-outline .select-button{width:8.75rem;min-width:8.75rem;height:1.75rem;min-height:1.75rem;padding:0 .5rem;border:0;box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--gauzy-radius-sm, 6px);background-color:transparent;font-size:.75rem;font-weight:400;color:var(--text-basic-color)}:host .quick-settings-panel ::ng-deep nb-select.appearance-outline.status-basic .select-button.placeholder{font-size:.75rem;color:var(--text-basic-color)}:host .quick-settings-panel ::ng-deep .reset-layout{font-size:.75rem;padding:.1875rem .375rem;min-width:0;border-color:transparent;color:var(--text-hint-color)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbSidebarService }, { type: i2.Router }], propDecorators: { trackOverlayClick: [{
                type: HostListener,
                args: ['document:click', ['$event.target']]
            }] } });
//# sourceMappingURL=theme-settings.component.js.map