import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Output, ChangeDetectorRef, Input, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { combineLatest } from 'rxjs';
import { tap, debounceTime, map } from 'rxjs/operators';
import { NbThemeService } from '@nebular/theme';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { GAUZY_ENV } from '@gauzy/ui-config';
import { DEFAULT_SVG, distinctUntilChange } from '@gauzy/ui-core/common';
import { Store } from '@gauzy/ui-core/core';
import { COSMIC_THEME, DARK_THEME, GAUZY_DARK, MATERIAL_DARK_THEME } from '../../themes';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@angular/platform-browser";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "@gauzy/ui-core/shared";
let GauzyLogoComponent = class GauzyLogoComponent {
    get controlled() {
        return this._controlled;
    }
    set controlled(value) {
        this._controlled = value;
        // Defer update to avoid change detection issues
        setTimeout(() => (this.isCollapse = value), 0);
    }
    /**
     * Checks if the logo file is in SVG format.
     * @returns {boolean} True if the logo ends with '.svg' (case-insensitive), false otherwise.
     */
    isSVG() {
        const logo = this.environment.PLATFORM_LOGO;
        return logo ? logo.toLowerCase().endsWith('.svg') : false;
    }
    constructor(_themeService, _domSanitizer, _cd, _store, environment) {
        this._themeService = _themeService;
        this._domSanitizer = _domSanitizer;
        this._cd = _cd;
        this._store = _store;
        this.environment = environment;
        this.isCollapse = true;
        /** Active tenant (workspace) shown by the sidebar switcher. */
        this.tenantName = '';
        this.tenantLogo = DEFAULT_SVG;
        this._controlled = true;
        this.isAccordion = true;
        /**
         * Whether the workspace panel is currently open.
         *
         * Owned by the parent layout, which is what actually renders the panel
         * (`@if (isWorkspaceOpen())` in `one-column.layout.html`). This used to be a
         * private boolean flipped only by `toggleWorkspace()`, which went stale as
         * soon as the panel closed itself on an outside click — the switcher then
         * still believed it was open and the next click on it emitted `false`, so
         * the panel did not reopen and the click read as dead. Reading the parent's
         * state keeps one source of truth.
         */
        this.isWorkspaceOpen = false;
        this.onCollapsed = new EventEmitter(this.isCollapse);
        this.onWorkspaceToggle = new EventEmitter();
        this.logoUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(environment.PLATFORM_LOGO);
    }
    ngOnInit() {
        // The switcher identifies the TENANT. `selectedWorkspace` only exists once
        // the switcher panel has fetched the workspace list, so the signed-in
        // user's own tenant is the authoritative source until then (and the only
        // one available to users with a single tenant, who never load the list).
        combineLatest([this._store.user$, this._store.selectedWorkspace$])
            .pipe(debounceTime(100), 
        // Narrow to the two values actually rendered BEFORE the equality
        // check — `user$` carries the whole user graph, and comparing that
        // on every emission is pure waste.
        map(([user, workspace]) => ({
            name: workspace?.name || user?.tenant?.name || '',
            logo: workspace?.imgUrl || user?.tenant?.logo || DEFAULT_SVG
        })), distinctUntilChange(), tap(({ name, logo }) => {
            this.tenantName = name;
            this.tenantLogo = logo;
        }), untilDestroyed(this))
            .subscribe();
    }
    ngAfterViewInit() {
        this._themeService.onThemeChange().subscribe((theme) => {
            this.theme = theme.name;
            this._cd.detectChanges();
        });
    }
    /**
     * Handles the collapse state of the accordion.
     * @param isCollapsed - The new collapsed state of the accordion.
     */
    onCollapse(isCollapsed) {
        this.isCollapse = isCollapsed; // Update the collapse state
        this.onCollapsed.emit(this.isCollapse); // Emit the new state
    }
    /**
     * Toggles the workspace dropdown.
     */
    toggleWorkspace() {
        // Derived from the parent's state, never from a local copy — see the
        // `isWorkspaceOpen` input above.
        this.onWorkspaceToggle.emit(!this.isWorkspaceOpen);
    }
    /**
     * Navigates to the home page.
     * @returns false to prevent default behavior, if needed.
     */
    navigateHome() {
        // this.menuService.navigateHome();
        return false; // Prevent default action
    }
    /**
     * Determines if the logo should have the 'white-svg' class.
     * @returns true if isSVG is true and the theme is dark; otherwise, false.
     */
    isWhiteSvg() {
        return this.isSVG && this.isDarkTheme();
    }
    /**
     * Checks if the current theme is a dark theme.
     * @returns true if the theme is dark; otherwise, false.
     */
    isDarkTheme() {
        return [DARK_THEME.name, COSMIC_THEME.name, GAUZY_DARK.name, MATERIAL_DARK_THEME.name].includes(this.theme);
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GauzyLogoComponent, deps: [{ token: i1.NbThemeService }, { token: i2.DomSanitizer }, { token: i0.ChangeDetectorRef }, { token: i3.Store }, { token: GAUZY_ENV }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: GauzyLogoComponent, isStandalone: false, selector: "ngx-gauzy-logo", inputs: { controlled: "controlled", isAccordion: "isAccordion", isWorkspaceOpen: "isWorkspaceOpen" }, outputs: { onCollapsed: "onCollapsed", onWorkspaceToggle: "onWorkspaceToggle" }, ngImport: i0, template: "@if (isAccordion) {\n\t<nb-accordion class=\"accordion workspace\">\n\t\t<nb-accordion-item [collapsed]=\"controlled\" (collapsedChange)=\"onCollapse($event)\">\n\t\t\t<nb-accordion-item-header class=\"principal\" (click)=\"toggleWorkspace()\">\n\t\t\t\t<!-- This block is the TENANT (workspace) switcher, not an organization\n\t\t\t\t     one \u2014 the organization is picked from the header selector, and\n\t\t\t\t     duplicating it here is what made the two read as the same control.\n\t\t\t\t     The active tenant stays visible in BOTH states, so the panel it\n\t\t\t\t     opens lists only the other tenants. -->\n\t\t\t\t<div class=\"tenant\">\n\t\t\t\t\t<img [src]=\"tenantLogo\" [alt]=\"tenantName\" />\n\t\t\t\t\t<div class=\"description text\">\n\t\t\t\t\t\t<div [nbTooltip]=\"tenantName\">\n\t\t\t\t\t\t\t{{ tenantName }}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<svg\n\t\t\t\t\t\tclass=\"switch-indicator\"\n\t\t\t\t\t\tviewBox=\"0 0 24 24\"\n\t\t\t\t\t\tfill=\"none\"\n\t\t\t\t\t\tstroke=\"currentColor\"\n\t\t\t\t\t\tstroke-width=\"2\"\n\t\t\t\t\t\tstroke-linecap=\"round\"\n\t\t\t\t\t\tstroke-linejoin=\"round\"\n\t\t\t\t\t\taria-hidden=\"true\"\n\t\t\t\t\t\tfocusable=\"false\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<path d=\"m7 15 5 5 5-5\" />\n\t\t\t\t\t\t<path d=\"m7 9 5-5 5 5\" />\n\t\t\t\t\t</svg>\n\t\t\t\t</div>\n\t\t\t</nb-accordion-item-header>\n\t\t</nb-accordion-item>\n\t</nb-accordion>\n}\n@if (!isAccordion) {\n\t<div>\n\t\t<!-- Standalone platform logo (auth screens, onboarding). -->\n\t\t<div class=\"logo\" [class.white-svg]=\"isWhiteSvg()\" (click)=\"navigateHome()\">\n\t\t\t@if (isSVG) {\n\t\t\t\t<object [data]=\"logoUrl\" type=\"image/svg+xml\">\n\t\t\t\t\t<img src=\"assets/images/logos/logo_Gauzy.png\" />\n\t\t\t\t</object>\n\t\t\t} @else {\n\t\t\t\t<img [src]=\"logoUrl || 'assets/images/logos/logo_Gauzy.png'\" />\n\t\t\t}\n\t\t</div>\n\t</div>\n}\n", styles: [".accordion.workspace{width:100%;max-width:var(--sidebar-width);max-height:2.625rem;box-shadow:unset}.accordion.workspace .tenant{display:flex;flex-direction:row;align-items:center;width:100%}.accordion.workspace .tenant img{width:1.75rem;height:1.75rem;border-radius:var(--button-rectangle-border-radius);margin-right:.5rem;object-fit:cover;flex:0 0 auto}.accordion.workspace .tenant .description{min-width:0;flex:1 1 auto;margin:0}.accordion.workspace .tenant .description>div{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;width:auto;max-width:150px;font-size:.875rem;font-weight:400;color:var(--text-basic-color)}.accordion.workspace .item.footer{box-shadow:none;border-radius:0 0 var(--border-radius) var(--border-radius)}.accordion.workspace .item.footer ::ng-deep .item-body{padding:5px}nb-accordion-item-header ::ng-deep nb-icon{display:none}.switch-indicator{flex:0 0 auto;width:1rem;height:1rem;margin-left:.25rem;color:var(--text-hint-color)}nb-accordion-item-body ::ng-deep{background-color:#ffffff0d}nb-accordion-item-body.setting ::ng-deep .item-body{padding-top:0;padding-bottom:0}nb-accordion-item-body.setting ::ng-deep .item-body .border-bottom{border:unset!important}nb-accordion-item-body.setting ::ng-deep .item-body .item-body{padding:6px}.setting.action ::ng-deep ga-main-nav-menu ga-sidebar-menu nb-accordion-item nb-accordion-item-header{box-shadow:unset;border-width:0}.setting.action ::ng-deep ga-main-nav-menu ga-sidebar-menu nb-accordion-item nb-accordion-item-header nb-icon{display:none}nb-accordion-item:first-child nb-accordion-item-header.principal{max-height:42px;min-height:42px;align-items:center;padding:.25rem .625rem;border-bottom:none;background-color:transparent;border-radius:var(--border-radius);box-shadow:none;transition:background-color .15s ease-in-out}nb-accordion-item:first-child.collapsed nb-accordion-item-header.principal{border-bottom:none;background-color:transparent;box-shadow:none}nb-accordion-item:first-child nb-accordion-item-header.principal:hover,nb-accordion-item:first-child.collapsed nb-accordion-item-header.principal:hover{background-color:var(--background-basic-color-3)}.white-svg{filter:brightness(0) invert(1)}.link{cursor:pointer;margin:0 10px;padding:10px}.link:hover{background-color:#7e7e8f1a;border-radius:var(--border-radius)}.text{margin:0 10px;font-size:.875rem;font-style:normal;font-weight:500;line-height:16px;letter-spacing:0em}.logo img{height:22px}.logo object{max-width:128px;max-height:22px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i1.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "component", type: i1.NbAccordionComponent, selector: "nb-accordion", inputs: ["multi"] }, { kind: "component", type: i1.NbAccordionItemComponent, selector: "nb-accordion-item", inputs: ["collapsed", "expanded", "disabled"], outputs: ["collapsedChange"] }, { kind: "component", type: i1.NbAccordionItemHeaderComponent, selector: "nb-accordion-item-header" }, { kind: "directive", type: i4.ImgDirective, selector: "img", inputs: ["type", "skipDefaultImage", "enableFadeIn"] }] }); }
};
GauzyLogoComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbThemeService,
        DomSanitizer,
        ChangeDetectorRef,
        Store, Object])
], GauzyLogoComponent);
export { GauzyLogoComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GauzyLogoComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-gauzy-logo', standalone: false, template: "@if (isAccordion) {\n\t<nb-accordion class=\"accordion workspace\">\n\t\t<nb-accordion-item [collapsed]=\"controlled\" (collapsedChange)=\"onCollapse($event)\">\n\t\t\t<nb-accordion-item-header class=\"principal\" (click)=\"toggleWorkspace()\">\n\t\t\t\t<!-- This block is the TENANT (workspace) switcher, not an organization\n\t\t\t\t     one \u2014 the organization is picked from the header selector, and\n\t\t\t\t     duplicating it here is what made the two read as the same control.\n\t\t\t\t     The active tenant stays visible in BOTH states, so the panel it\n\t\t\t\t     opens lists only the other tenants. -->\n\t\t\t\t<div class=\"tenant\">\n\t\t\t\t\t<img [src]=\"tenantLogo\" [alt]=\"tenantName\" />\n\t\t\t\t\t<div class=\"description text\">\n\t\t\t\t\t\t<div [nbTooltip]=\"tenantName\">\n\t\t\t\t\t\t\t{{ tenantName }}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<svg\n\t\t\t\t\t\tclass=\"switch-indicator\"\n\t\t\t\t\t\tviewBox=\"0 0 24 24\"\n\t\t\t\t\t\tfill=\"none\"\n\t\t\t\t\t\tstroke=\"currentColor\"\n\t\t\t\t\t\tstroke-width=\"2\"\n\t\t\t\t\t\tstroke-linecap=\"round\"\n\t\t\t\t\t\tstroke-linejoin=\"round\"\n\t\t\t\t\t\taria-hidden=\"true\"\n\t\t\t\t\t\tfocusable=\"false\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<path d=\"m7 15 5 5 5-5\" />\n\t\t\t\t\t\t<path d=\"m7 9 5-5 5 5\" />\n\t\t\t\t\t</svg>\n\t\t\t\t</div>\n\t\t\t</nb-accordion-item-header>\n\t\t</nb-accordion-item>\n\t</nb-accordion>\n}\n@if (!isAccordion) {\n\t<div>\n\t\t<!-- Standalone platform logo (auth screens, onboarding). -->\n\t\t<div class=\"logo\" [class.white-svg]=\"isWhiteSvg()\" (click)=\"navigateHome()\">\n\t\t\t@if (isSVG) {\n\t\t\t\t<object [data]=\"logoUrl\" type=\"image/svg+xml\">\n\t\t\t\t\t<img src=\"assets/images/logos/logo_Gauzy.png\" />\n\t\t\t\t</object>\n\t\t\t} @else {\n\t\t\t\t<img [src]=\"logoUrl || 'assets/images/logos/logo_Gauzy.png'\" />\n\t\t\t}\n\t\t</div>\n\t</div>\n}\n", styles: [".accordion.workspace{width:100%;max-width:var(--sidebar-width);max-height:2.625rem;box-shadow:unset}.accordion.workspace .tenant{display:flex;flex-direction:row;align-items:center;width:100%}.accordion.workspace .tenant img{width:1.75rem;height:1.75rem;border-radius:var(--button-rectangle-border-radius);margin-right:.5rem;object-fit:cover;flex:0 0 auto}.accordion.workspace .tenant .description{min-width:0;flex:1 1 auto;margin:0}.accordion.workspace .tenant .description>div{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;width:auto;max-width:150px;font-size:.875rem;font-weight:400;color:var(--text-basic-color)}.accordion.workspace .item.footer{box-shadow:none;border-radius:0 0 var(--border-radius) var(--border-radius)}.accordion.workspace .item.footer ::ng-deep .item-body{padding:5px}nb-accordion-item-header ::ng-deep nb-icon{display:none}.switch-indicator{flex:0 0 auto;width:1rem;height:1rem;margin-left:.25rem;color:var(--text-hint-color)}nb-accordion-item-body ::ng-deep{background-color:#ffffff0d}nb-accordion-item-body.setting ::ng-deep .item-body{padding-top:0;padding-bottom:0}nb-accordion-item-body.setting ::ng-deep .item-body .border-bottom{border:unset!important}nb-accordion-item-body.setting ::ng-deep .item-body .item-body{padding:6px}.setting.action ::ng-deep ga-main-nav-menu ga-sidebar-menu nb-accordion-item nb-accordion-item-header{box-shadow:unset;border-width:0}.setting.action ::ng-deep ga-main-nav-menu ga-sidebar-menu nb-accordion-item nb-accordion-item-header nb-icon{display:none}nb-accordion-item:first-child nb-accordion-item-header.principal{max-height:42px;min-height:42px;align-items:center;padding:.25rem .625rem;border-bottom:none;background-color:transparent;border-radius:var(--border-radius);box-shadow:none;transition:background-color .15s ease-in-out}nb-accordion-item:first-child.collapsed nb-accordion-item-header.principal{border-bottom:none;background-color:transparent;box-shadow:none}nb-accordion-item:first-child nb-accordion-item-header.principal:hover,nb-accordion-item:first-child.collapsed nb-accordion-item-header.principal:hover{background-color:var(--background-basic-color-3)}.white-svg{filter:brightness(0) invert(1)}.link{cursor:pointer;margin:0 10px;padding:10px}.link:hover{background-color:#7e7e8f1a;border-radius:var(--border-radius)}.text{margin:0 10px;font-size:.875rem;font-style:normal;font-weight:500;line-height:16px;letter-spacing:0em}.logo img{height:22px}.logo object{max-width:128px;max-height:22px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbThemeService }, { type: i2.DomSanitizer }, { type: i0.ChangeDetectorRef }, { type: i3.Store }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [GAUZY_ENV]
                }] }], propDecorators: { controlled: [{
                type: Input
            }], isAccordion: [{
                type: Input
            }], isWorkspaceOpen: [{
                type: Input
            }], onCollapsed: [{
                type: Output
            }], onWorkspaceToggle: [{
                type: Output
            }] } });
//# sourceMappingURL=gauzy-logo.component.js.map