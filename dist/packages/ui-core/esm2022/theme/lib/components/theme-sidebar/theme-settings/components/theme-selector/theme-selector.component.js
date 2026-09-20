import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Store } from '@gauzy/ui-core/core';
import { NbThemeService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CORPORATE_THEME, COSMIC_THEME, DARK_THEME, DEFAULT_THEME, GAUZY_DARK, GAUZY_LIGHT, MATERIAL_DARK_THEME, MATERIAL_LIGHT_THEME } from '../../../../../themes';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@ngx-translate/core";
let ThemeSelectorComponent = class ThemeSelectorComponent {
    constructor(themeService, store) {
        this.themeService = themeService;
        this.store = store;
        this._themes = [
            {
                light: {
                    value: GAUZY_LIGHT.name,
                    name: 'SETTINGS_MENU.GAUZY_LIGHT',
                    imageUrl: 'assets/images/themes/gauzy_light.png'
                },
                dark: {
                    value: GAUZY_DARK.name,
                    name: 'SETTINGS_MENU.GAUZY_DARK',
                    imageUrl: 'assets/images/themes/gauzy_dark.png'
                }
            },
            {
                light: {
                    value: DEFAULT_THEME.name,
                    name: 'SETTINGS_MENU.LIGHT',
                    imageUrl: 'assets/images/themes/light.png'
                },
                dark: {
                    value: DARK_THEME.name,
                    name: 'SETTINGS_MENU.DARK',
                    imageUrl: 'assets/images/themes/dark.png'
                }
            },
            {
                light: {
                    value: CORPORATE_THEME.name,
                    name: 'SETTINGS_MENU.CORPORATE',
                    imageUrl: 'assets/images/themes/corporate.png'
                },
                dark: {
                    value: COSMIC_THEME.name,
                    name: 'SETTINGS_MENU.COSMIC',
                    imageUrl: 'assets/images/themes/cosmic.png'
                }
            },
            {
                light: {
                    value: MATERIAL_LIGHT_THEME.name,
                    name: 'SETTINGS_MENU.MATERIAL_LIGHT_THEME',
                    imageUrl: 'assets/images/themes/material_light.png'
                },
                dark: {
                    value: MATERIAL_DARK_THEME.name,
                    name: 'SETTINGS_MENU.MATERIAL_DARK_THEME',
                    imageUrl: 'assets/images/themes/material_dark.png'
                }
            }
        ];
        this.switch = new Observable();
        this.switch$ = new BehaviorSubject(false);
        this.currentTheme = GAUZY_LIGHT.name;
        this.currentTheme$ = new BehaviorSubject(null);
        this.selected = new Observable();
        this.selected$ = new BehaviorSubject(null);
    }
    ngOnInit() {
        this.themeService
            .onThemeChange()
            .pipe(map(({ name }) => name), untilDestroyed(this))
            .subscribe((themeName) => {
            this.currentTheme = themeName;
            this.updateSwitch();
            this.updateCard();
        });
        this.currentTheme$.subscribe((theme) => {
            theme = theme ? theme : this.store.currentTheme ? this.store.currentTheme : this.currentTheme;
            this.store.currentTheme = theme;
            this.themeService.changeTheme(theme);
        });
        this.switch$.subscribe();
        this.selected$.subscribe();
        this.switch = this.switch$.asObservable();
        this.selected = this.selected$.asObservable();
    }
    toggleTheme() {
        this.currentTheme$.next(this.currentTheme);
    }
    get themes() {
        const themes = [];
        this._themes.map((theme) => {
            themes.push(theme.light);
            themes.push(theme.dark);
        });
        return themes;
    }
    updateSwitch() {
        this.switch$.next(this.isDark.state);
    }
    updateCard() {
        this.selected$.next(this.isDark.previous);
    }
    onSelectedTheme(theme) {
        this.currentTheme = theme;
        this.toggleTheme();
    }
    reverseTheme() {
        this.currentTheme = this.isDark.reverse;
        this.toggleTheme();
    }
    /**
     * Checks if the current theme is dark or light and provides information about the opposite theme.
     * @returns An object containing information about the current theme state and its opposite.
     */
    get isDark() {
        const res = {
            previous: null,
            reverse: this.currentTheme,
            state: false
        };
        this._themes.forEach((theme) => {
            if (theme.light.value === this.currentTheme) {
                res.reverse = theme.dark.value;
                res.state = false;
                res.previous = theme.light;
            }
            else if (theme.dark.value === this.currentTheme) {
                res.reverse = theme.light.value;
                res.state = true;
                res.previous = theme.dark;
            }
        });
        return res;
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeSelectorComponent, deps: [{ token: i1.NbThemeService }, { token: i2.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ThemeSelectorComponent, isStandalone: false, selector: "gauzy-theme-selector", ngImport: i0, template: "<div class=\"theme-container\">\n\t{{ 'SETTINGS_MENU.THEMES' | translate }}\n\t<nb-select\n\t\t[(selected)]=\"currentTheme\"\n\t\tplaceholder=\"{{ themes[0] | translate }}\"\n\t\t(selectedChange)=\"toggleTheme()\"\n\t\tstatus=\"basic\"\n\t\tsize=\"small\"\n\t\toutline\n\t\toptionsListClass=\"gz-panel-options\"\n\t>\n\t\t@for (theme of themes; track theme) {\n\t\t\t<nb-option [value]=\"theme.value\"> {{ theme.name | translate }}</nb-option>\n\t\t}\n\t</nb-select>\n</div>\n", styles: ["@charset \"UTF-8\";.theme-container{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}:host ::ng-deep nb-select.appearance-outline .select-button{color:#7e7e8f;border-width:2px;border-color:#7e7e8f80;width:129px}:host ::ng-deep nb-select.shape-rectangle .select-button{border-radius:var(--gauzy-radius-sm);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));min-height:2rem;display:flex;align-items:center;border:none}:host ::ng-deep nb-select.size-medium .select-button.placeholder{font-size:var(--select-medium-text-font-size)}:host ::ng-deep nb-select.appearance-outline.size-medium .select-button{border:none}:host ::ng-deep nb-select button span{display:block;overflow-x:hidden;text-overflow:ellipsis}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i1.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
};
ThemeSelectorComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbThemeService, Store])
], ThemeSelectorComponent);
export { ThemeSelectorComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeSelectorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gauzy-theme-selector', standalone: false, template: "<div class=\"theme-container\">\n\t{{ 'SETTINGS_MENU.THEMES' | translate }}\n\t<nb-select\n\t\t[(selected)]=\"currentTheme\"\n\t\tplaceholder=\"{{ themes[0] | translate }}\"\n\t\t(selectedChange)=\"toggleTheme()\"\n\t\tstatus=\"basic\"\n\t\tsize=\"small\"\n\t\toutline\n\t\toptionsListClass=\"gz-panel-options\"\n\t>\n\t\t@for (theme of themes; track theme) {\n\t\t\t<nb-option [value]=\"theme.value\"> {{ theme.name | translate }}</nb-option>\n\t\t}\n\t</nb-select>\n</div>\n", styles: ["@charset \"UTF-8\";.theme-container{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}:host ::ng-deep nb-select.appearance-outline .select-button{color:#7e7e8f;border-width:2px;border-color:#7e7e8f80;width:129px}:host ::ng-deep nb-select.shape-rectangle .select-button{border-radius:var(--gauzy-radius-sm);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));min-height:2rem;display:flex;align-items:center;border:none}:host ::ng-deep nb-select.size-medium .select-button.placeholder{font-size:var(--select-medium-text-font-size)}:host ::ng-deep nb-select.appearance-outline.size-medium .select-button{border:none}:host ::ng-deep nb-select button span{display:block;overflow-x:hidden;text-overflow:ellipsis}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbThemeService }, { type: i2.Store }] });
//# sourceMappingURL=theme-selector.component.js.map