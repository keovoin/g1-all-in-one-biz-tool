import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { LanguagesEnum } from '@gauzy/contracts';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, from, tap } from 'rxjs';
import { NbLayoutDirection, NbLayoutDirectionService } from '@nebular/theme';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { ElectronService, Store } from '@gauzy/ui-core/core';
import { I18nService } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@nebular/theme";
import * as i3 from "@gauzy/ui-core/i18n";
let ThemeLanguageSelectorService = class ThemeLanguageSelectorService {
    get preferredLanguage() {
        return this._preferredLanguage;
    }
    set preferredLanguage(value) {
        this._preferredLanguage = value;
    }
    constructor(_store, _electronService, _directionService, _i18nService) {
        this._store = _store;
        this._electronService = _electronService;
        this._directionService = _directionService;
        this._i18nService = _i18nService;
        this._preferredLanguage = LanguagesEnum.ENGLISH;
    }
    initialize() {
        this._store.preferredLanguage$
            .pipe(distinctUntilChange(), filter((preferredLanguage) => !!preferredLanguage), tap((preferredLanguage) => (this.preferredLanguage = preferredLanguage)), tap(() => this.setLanguage()), tap((preferredLanguage) => {
            if (this._electronService.isElectron) {
                this._electronService.ipcRenderer.send('preferred_language_change', preferredLanguage);
            }
        }), untilDestroyed(this))
            .subscribe();
        if (this._electronService.isElectron) {
            from(this._electronService.ipcRenderer.invoke('PREFERRED_LANGUAGE'))
                .pipe(tap((language) => {
                this._store.preferredLanguage = language;
            }), untilDestroyed(this))
                .subscribe();
        }
    }
    /**
     * Sets the application language and layout direction based on the preferred language.
     */
    setLanguage() {
        const isRtl = [LanguagesEnum.HEBREW, LanguagesEnum.ARABIC].includes(this.preferredLanguage);
        // Set the layout direction
        this._directionService.setDirection(isRtl ? NbLayoutDirection.RTL : NbLayoutDirection.LTR);
        // Set the language
        this._i18nService.setLanguage(this.preferredLanguage);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeLanguageSelectorService, deps: [{ token: i1.Store }, { token: i1.ElectronService }, { token: i2.NbLayoutDirectionService }, { token: i3.I18nService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeLanguageSelectorService, providedIn: 'root' }); }
};
ThemeLanguageSelectorService = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Store,
        ElectronService,
        NbLayoutDirectionService,
        I18nService])
], ThemeLanguageSelectorService);
export { ThemeLanguageSelectorService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeLanguageSelectorService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.Store }, { type: i1.ElectronService }, { type: i2.NbLayoutDirectionService }, { type: i3.I18nService }] });
//# sourceMappingURL=theme-language-selector.service.js.map