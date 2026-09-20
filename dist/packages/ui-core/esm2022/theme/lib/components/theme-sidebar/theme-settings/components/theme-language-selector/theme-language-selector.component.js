import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectorRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, filter, tap, from, concatMap } from 'rxjs';
import { LanguagesEnum } from '@gauzy/contracts';
import { LanguagesService, UsersService } from '@gauzy/ui-core/core';
import { Store } from '@gauzy/ui-core/core';
import { I18nService } from '@gauzy/ui-core/i18n';
import { getLanguageFlagUrl } from '@gauzy/ui-core/shared';
import { ThemeLanguageSelectorService } from './theme-language-selector.service';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "./theme-language-selector.service";
import * as i3 from "@gauzy/ui-core/i18n";
import * as i4 from "@nebular/theme";
import * as i5 from "@ngx-translate/core";
let ThemeLanguageSelectorComponent = class ThemeLanguageSelectorComponent {
    /**
     * Get preferred language
     */
    get preferredLanguage() {
        return this._selectorService.preferredLanguage;
    }
    /**
     * Set preferred language
     */
    set preferredLanguage(value) {
        this._selectorService.preferredLanguage = value;
    }
    constructor(_store, _userService, _languagesService, _cdr, _selectorService, _i18nService) {
        this._store = _store;
        this._userService = _userService;
        this._languagesService = _languagesService;
        this._cdr = _cdr;
        this._selectorService = _selectorService;
        this._i18nService = _i18nService;
        this.languages = [];
    }
    ngOnInit() {
        this._store.systemLanguages$
            .pipe(filter((systemLanguages) => !!systemLanguages), tap((systemLanguages) => this.getSystemLanguages(systemLanguages)), untilDestroyed(this))
            .subscribe();
        this._store.user$
            .pipe(debounceTime(100), filter((user) => !!user), tap((user) => (this.user = user)), tap(({ preferredLanguage }) => {
            if (!this._store.preferredLanguage) {
                this._store.preferredLanguage = preferredLanguage || this._i18nService.getBrowserLang();
            }
        }), untilDestroyed(this))
            .subscribe();
    }
    ngAfterViewInit() {
        const systemLanguages = this._store.systemLanguages;
        if (!systemLanguages) {
            from(this._loadLanguages()).subscribe();
        }
        this._store.preferredLanguage$
            .pipe(debounceTime(100), filter((preferredLanguage) => !!preferredLanguage), tap((preferredLanguage) => (this.preferredLanguage = preferredLanguage)), tap(() => this._selectorService.setLanguage()), concatMap((preferredLanguage) => this.changePreferredLanguage({ preferredLanguage })), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Load languages
     */
    async _loadLanguages() {
        const { items = [] } = await this._languagesService.getSystemLanguages();
        this._store.systemLanguages = items.filter((item) => item.is_system) || [];
        this._cdr.detectChanges();
    }
    /**
     * Get system languages
     *
     * @param systemLanguages
     */
    getSystemLanguages(systemLanguages) {
        if (systemLanguages && systemLanguages.length > 0) {
            this.languages = systemLanguages
                .filter((item) => !!item.is_system)
                .map((item) => {
                return {
                    value: item.code,
                    code: item.code,
                    name: 'SETTINGS_MENU.' + item.name.toUpperCase()
                };
            });
        }
        else {
            const languages = [];
            for (const [name, code] of Object.entries(LanguagesEnum)) {
                languages.push({
                    code,
                    name,
                    is_system: true
                });
            }
            this._store.systemLanguages = languages;
        }
    }
    /**
     * Switch language
     */
    switchLanguage() {
        this._store.preferredLanguage = this.preferredLanguage;
    }
    /**
     * Currently selected language (drives the flag + name shown in the closed trigger)
     */
    get selectedLanguage() {
        return this.languages.find((language) => language.code === this.preferredLanguage);
    }
    /**
     * Flag asset URL for a language code (null when no flag is vendored)
     */
    getFlagUrl(code) {
        return getLanguageFlagUrl(code);
    }
    /**
     * Hides a flag image that failed to load, leaving the plain language name
     */
    onFlagError(event) {
        event.target.style.display = 'none';
    }
    /**
     * Updates the user's preferred language.
     *
     * @param input - User update payload containing preferred language information.
     */
    async changePreferredLanguage(input) {
        if (!this.user?.tenantId) {
            console.warn('User or tenantId not available. Skipping preferred language update.');
            return;
        }
        try {
            await this._userService.updatePreferredLanguage(input);
        }
        catch (error) {
            console.error('Failed to update user preferred language:', error);
        }
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeLanguageSelectorComponent, deps: [{ token: i1.Store }, { token: i1.UsersService }, { token: i1.LanguagesService }, { token: i0.ChangeDetectorRef }, { token: i2.ThemeLanguageSelectorService }, { token: i3.I18nService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ThemeLanguageSelectorComponent, isStandalone: false, selector: "ngx-theme-language-selector", ngImport: i0, template: "<div class=\"theme-container\">\n\t{{ 'SETTINGS_MENU.LANGUAGE' | translate }}\n\t<div>\n\t\t@if (languages.length) {\n\t\t\t<nb-select\n\t\t\t\t[(selected)]=\"preferredLanguage\"\n\t\t\t\t[(ngModel)]=\"preferredLanguage\"\n\t\t\t\t[placeholder]=\"'SETTINGS_MENU.ENGLISH' | translate\"\n\t\t\t\t(selectedChange)=\"switchLanguage()\"\n\t\t\t\tstatus=\"basic\"\n\t\t\t\tsize=\"small\"\n\t\t\t\toutline\n\t\t\t\toptionsListClass=\"fit-content gz-panel-options\"\n\t\t\t>\n\t\t\t\t<nb-select-label>\n\t\t\t\t\t@if (getFlagUrl(selectedLanguage?.code); as flagUrl) {\n\t\t\t\t\t\t<img class=\"flag-icon\" [src]=\"flagUrl\" (error)=\"onFlagError($event)\" alt=\"\" />\n\t\t\t\t\t}\n\t\t\t\t\t{{ selectedLanguage?.name | translate }}\n\t\t\t\t</nb-select-label>\n\t\t\t\t@for (lang of languages; track lang) {\n\t\t\t\t\t<nb-option [value]=\"lang.value\">\n\t\t\t\t\t\t@if (getFlagUrl(lang.code); as flagUrl) {\n\t\t\t\t\t\t\t<img class=\"flag-icon\" [src]=\"flagUrl\" (error)=\"onFlagError($event)\" alt=\"\" />\n\t\t\t\t\t\t}\n\t\t\t\t\t\t{{ lang.name | translate }}\n\t\t\t\t\t</nb-option>\n\t\t\t\t}\n\t\t\t</nb-select>\n\t\t}\n\t</div>\n</div>\n", styles: [":host h6{margin-bottom:.5rem;font-weight:500;font-size:1rem}:host nb-select{width:auto}:host nb-select.appearance-outline ::ng-deep .select-button{text-overflow:inherit;box-shadow:var(--gauzy-shadow);border-width:0;border-radius:var(--button-rectangle-border-radius);outline:none;height:2rem;color:#7e7e8f}:host .settings-row{display:flex;flex-direction:row;align-items:center;flex-wrap:wrap;width:100%;margin:0 0 1rem}:host .title-uppercase{text-transform:uppercase}:host .title-uppercase .settings-row select{max-height:40px;padding:0 0 0 10px;font-size:.9rem}.theme-container{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}.flag-icon{width:1.125rem;height:.75rem;margin-inline-end:.375rem;border-radius:2px;object-fit:cover;vertical-align:middle}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i4.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i4.NbSelectLabelComponent, selector: "nb-select-label" }, { kind: "component", type: i4.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
};
ThemeLanguageSelectorComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Store,
        UsersService,
        LanguagesService,
        ChangeDetectorRef,
        ThemeLanguageSelectorService,
        I18nService])
], ThemeLanguageSelectorComponent);
export { ThemeLanguageSelectorComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeLanguageSelectorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-theme-language-selector', standalone: false, template: "<div class=\"theme-container\">\n\t{{ 'SETTINGS_MENU.LANGUAGE' | translate }}\n\t<div>\n\t\t@if (languages.length) {\n\t\t\t<nb-select\n\t\t\t\t[(selected)]=\"preferredLanguage\"\n\t\t\t\t[(ngModel)]=\"preferredLanguage\"\n\t\t\t\t[placeholder]=\"'SETTINGS_MENU.ENGLISH' | translate\"\n\t\t\t\t(selectedChange)=\"switchLanguage()\"\n\t\t\t\tstatus=\"basic\"\n\t\t\t\tsize=\"small\"\n\t\t\t\toutline\n\t\t\t\toptionsListClass=\"fit-content gz-panel-options\"\n\t\t\t>\n\t\t\t\t<nb-select-label>\n\t\t\t\t\t@if (getFlagUrl(selectedLanguage?.code); as flagUrl) {\n\t\t\t\t\t\t<img class=\"flag-icon\" [src]=\"flagUrl\" (error)=\"onFlagError($event)\" alt=\"\" />\n\t\t\t\t\t}\n\t\t\t\t\t{{ selectedLanguage?.name | translate }}\n\t\t\t\t</nb-select-label>\n\t\t\t\t@for (lang of languages; track lang) {\n\t\t\t\t\t<nb-option [value]=\"lang.value\">\n\t\t\t\t\t\t@if (getFlagUrl(lang.code); as flagUrl) {\n\t\t\t\t\t\t\t<img class=\"flag-icon\" [src]=\"flagUrl\" (error)=\"onFlagError($event)\" alt=\"\" />\n\t\t\t\t\t\t}\n\t\t\t\t\t\t{{ lang.name | translate }}\n\t\t\t\t\t</nb-option>\n\t\t\t\t}\n\t\t\t</nb-select>\n\t\t}\n\t</div>\n</div>\n", styles: [":host h6{margin-bottom:.5rem;font-weight:500;font-size:1rem}:host nb-select{width:auto}:host nb-select.appearance-outline ::ng-deep .select-button{text-overflow:inherit;box-shadow:var(--gauzy-shadow);border-width:0;border-radius:var(--button-rectangle-border-radius);outline:none;height:2rem;color:#7e7e8f}:host .settings-row{display:flex;flex-direction:row;align-items:center;flex-wrap:wrap;width:100%;margin:0 0 1rem}:host .title-uppercase{text-transform:uppercase}:host .title-uppercase .settings-row select{max-height:40px;padding:0 0 0 10px;font-size:.9rem}.theme-container{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}.flag-icon{width:1.125rem;height:.75rem;margin-inline-end:.375rem;border-radius:2px;object-fit:cover;vertical-align:middle}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.Store }, { type: i1.UsersService }, { type: i1.LanguagesService }, { type: i0.ChangeDetectorRef }, { type: i2.ThemeLanguageSelectorService }, { type: i3.I18nService }] });
//# sourceMappingURL=theme-language-selector.component.js.map