import { Component, Input } from '@angular/core';
import { ThemeSelectorComponent } from '../theme-selector.component';
import { NbThemeService } from '@nebular/theme';
import { Store } from '@gauzy/ui-core/core';
import { SwitchThemeService } from './switch-theme.service';
import { ActivatedRoute } from '@angular/router';
import { filter, tap } from 'rxjs/operators';
import { untilDestroyed } from '@ngneat/until-destroy';
import * as i0 from "@angular/core";
import * as i1 from "./switch-theme.service";
import * as i2 from "@nebular/theme";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "@angular/router";
import * as i5 from "@angular/common";
import * as i6 from "@ngx-translate/core";
export class SwitchThemeComponent extends ThemeSelectorComponent {
    /**
     *
     * @param switchService
     * @param themeService
     * @param store
     */
    constructor(switchService, themeService, store, activatedRoute) {
        super(themeService, store);
        this.switchService = switchService;
        this.themeService = themeService;
        this.store = store;
        this.activatedRoute = activatedRoute;
        this.DARK_OS_SCHEME = '(prefers-color-scheme: dark)';
        this.LIGHT_OS_SCHEME = '(prefers-color-scheme: light)';
        this.hasText = true;
        // Listerning event and switching to current OS color theme
        window.matchMedia(this.DARK_OS_SCHEME).addEventListener('change', (event) => {
            if (event.matches) {
                // If OS theme is dark and the current theme is light does switched, else don't.
                if (!this.isDark.state)
                    this.switchTheme();
            }
            else {
                // If OS theme is light and the current theme is dark does switched, else don't.
                if (this.isDark.state)
                    this.switchTheme();
            }
        });
        // This part of code should load only one time.
        if (!this.switchService.isAlreadyLoaded) {
            this.ngOnInit();
            // if there is a preferred theme in localStorage don't switch to OS theme
            if (!this.switchService.hasAlreadyPreferredTheme)
                this.getPreferColorOsScheme();
            // lockdown
            this.switchService.isAlreadyLoaded = true;
        }
        this.activatedRoute.queryParams
            .pipe(filter((query) => !!query.theme), tap(({ theme }) => this.handleThemeChange(theme)), untilDestroyed(this))
            .subscribe();
    }
    /**
     * this method help to switch to opposite current theme
     */
    switchTheme() {
        this.reverseTheme();
    }
    /**
     * get current OS color and switching to it.
     */
    getPreferColorOsScheme() {
        // If OS theme is dark and the current theme is dark too don't switched, else does switched.
        if (window.matchMedia(this.DARK_OS_SCHEME).matches) {
            if (!this.isDark.state)
                this.switchTheme();
        }
        // If OS theme is light and the current theme is light too don't switched, else does switched.
        if (window.matchMedia(this.LIGHT_OS_SCHEME).matches) {
            if (this.isDark.state)
                this.switchTheme();
        }
    }
    // Handle theme on theme change
    handleThemeChange(theme) {
        const isDarkTheme = this.isDark.state;
        if ((theme === 'dark' && !isDarkTheme) || (theme === 'light' && isDarkTheme)) {
            this.switchTheme();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SwitchThemeComponent, deps: [{ token: i1.SwitchThemeService }, { token: i2.NbThemeService }, { token: i3.Store }, { token: i4.ActivatedRoute }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: SwitchThemeComponent, isStandalone: false, selector: "gauzy-switch-theme", inputs: { hasText: "hasText" }, usesInheritance: true, ngImport: i0, template: "<div class=\"switch-container\">\n\t@if (hasText) {\n\t<span>{{ 'SETTINGS_MENU.LIGHT' | translate }}/{{ 'SETTINGS_MENU.DARK' | translate }}</span>\n\t}\n\t<nb-toggle\n\t\tclass=\"switch\"\n\t\t[checked]=\"switch | async\"\n\t\t[class.dark]=\"switch | async\"\n\t\t[class.light]=\"!(switch | async)\"\n\t\t(checkedChange)=\"switchTheme()\"\n\t\tsize=\"small\"\n\t></nb-toggle>\n</div>\n", styles: [":host .switch-container{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}:host .switch-container nb-toggle.switch ::ng-deep .toggle{height:1.5rem;width:3.375rem;font-family:\"Font Awesome 7 Free\"!important;font-size:.625rem;display:flex;align-items:center;background-color:#7e7e8f80;border-width:0}:host .switch-container nb-toggle.switch ::ng-deep .toggle .toggle-switcher{height:1rem;width:1rem}:host .switch-container nb-toggle.switch ::ng-deep .toggle span{display:flex;justify-content:center;align-items:center;justify-self:flex-end}:host .switch-container nb-toggle.switch ::ng-deep .toggle nb-icon{display:none}:host .switch-container nb-toggle.light ::ng-deep .toggle{justify-content:end}:host .switch-container nb-toggle.light ::ng-deep .toggle:before{content:\"\\f186\"}[dir=rtl] :host .switch-container nb-toggle.light ::ng-deep .toggle:before{margin-left:.275rem}[dir=ltr] :host .switch-container nb-toggle.light ::ng-deep .toggle:before{margin-right:.275rem}:host .switch-container nb-toggle.light ::ng-deep .toggle:before{color:#ffffff40}:host .switch-container nb-toggle.light ::ng-deep .toggle span:before{content:\"\\f185\"}[dir=ltr] :host .switch-container nb-toggle.light ::ng-deep .toggle .toggle-switcher{margin-left:.25rem}[dir=rtl] :host .switch-container nb-toggle.light ::ng-deep .toggle .toggle-switcher{margin-right:.25rem}:host .switch-container nb-toggle.dark ::ng-deep .toggle{justify-content:flex-start}:host .switch-container nb-toggle.dark ::ng-deep .toggle:before{content:\"\\f185\"}[dir=ltr] :host .switch-container nb-toggle.dark ::ng-deep .toggle:before{margin-left:.325rem}[dir=rtl] :host .switch-container nb-toggle.dark ::ng-deep .toggle:before{margin-right:.325rem}:host .switch-container nb-toggle.dark ::ng-deep .toggle:before{color:#ffffff40}:host .switch-container nb-toggle.dark ::ng-deep .toggle span:before{content:\"\\f186\"}::ng-deep [dir=ltr] nb-toggle.switch .toggle.checked .toggle-switcher{left:calc(100% - 1.375rem)}::ng-deep [dir=rtl] nb-toggle.switch .toggle.checked .toggle-switcher{right:calc(100% - 1.375rem)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i2.NbToggleComponent, selector: "nb-toggle", inputs: ["checked", "disabled", "status", "labelPosition"], outputs: ["checkedChange"] }, { kind: "pipe", type: i5.AsyncPipe, name: "async" }, { kind: "pipe", type: i6.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SwitchThemeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gauzy-switch-theme', standalone: false, template: "<div class=\"switch-container\">\n\t@if (hasText) {\n\t<span>{{ 'SETTINGS_MENU.LIGHT' | translate }}/{{ 'SETTINGS_MENU.DARK' | translate }}</span>\n\t}\n\t<nb-toggle\n\t\tclass=\"switch\"\n\t\t[checked]=\"switch | async\"\n\t\t[class.dark]=\"switch | async\"\n\t\t[class.light]=\"!(switch | async)\"\n\t\t(checkedChange)=\"switchTheme()\"\n\t\tsize=\"small\"\n\t></nb-toggle>\n</div>\n", styles: [":host .switch-container{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}:host .switch-container nb-toggle.switch ::ng-deep .toggle{height:1.5rem;width:3.375rem;font-family:\"Font Awesome 7 Free\"!important;font-size:.625rem;display:flex;align-items:center;background-color:#7e7e8f80;border-width:0}:host .switch-container nb-toggle.switch ::ng-deep .toggle .toggle-switcher{height:1rem;width:1rem}:host .switch-container nb-toggle.switch ::ng-deep .toggle span{display:flex;justify-content:center;align-items:center;justify-self:flex-end}:host .switch-container nb-toggle.switch ::ng-deep .toggle nb-icon{display:none}:host .switch-container nb-toggle.light ::ng-deep .toggle{justify-content:end}:host .switch-container nb-toggle.light ::ng-deep .toggle:before{content:\"\\f186\"}[dir=rtl] :host .switch-container nb-toggle.light ::ng-deep .toggle:before{margin-left:.275rem}[dir=ltr] :host .switch-container nb-toggle.light ::ng-deep .toggle:before{margin-right:.275rem}:host .switch-container nb-toggle.light ::ng-deep .toggle:before{color:#ffffff40}:host .switch-container nb-toggle.light ::ng-deep .toggle span:before{content:\"\\f185\"}[dir=ltr] :host .switch-container nb-toggle.light ::ng-deep .toggle .toggle-switcher{margin-left:.25rem}[dir=rtl] :host .switch-container nb-toggle.light ::ng-deep .toggle .toggle-switcher{margin-right:.25rem}:host .switch-container nb-toggle.dark ::ng-deep .toggle{justify-content:flex-start}:host .switch-container nb-toggle.dark ::ng-deep .toggle:before{content:\"\\f185\"}[dir=ltr] :host .switch-container nb-toggle.dark ::ng-deep .toggle:before{margin-left:.325rem}[dir=rtl] :host .switch-container nb-toggle.dark ::ng-deep .toggle:before{margin-right:.325rem}:host .switch-container nb-toggle.dark ::ng-deep .toggle:before{color:#ffffff40}:host .switch-container nb-toggle.dark ::ng-deep .toggle span:before{content:\"\\f186\"}::ng-deep [dir=ltr] nb-toggle.switch .toggle.checked .toggle-switcher{left:calc(100% - 1.375rem)}::ng-deep [dir=rtl] nb-toggle.switch .toggle.checked .toggle-switcher{right:calc(100% - 1.375rem)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.SwitchThemeService }, { type: i2.NbThemeService }, { type: i3.Store }, { type: i4.ActivatedRoute }], propDecorators: { hasText: [{
                type: Input
            }] } });
//# sourceMappingURL=switch-theme.component.js.map