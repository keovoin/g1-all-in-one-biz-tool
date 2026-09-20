import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
/**
 * I18nService provides a wrapper around @ngx-translate's TranslateService
 * with additional functionality for managing language preferences.
 *
 * @example
 * ```typescript
 * // Inject using the modern inject() function
 * const i18nService = inject(I18nService);
 *
 * // Set the language
 * i18nService.setLanguage(LanguagesEnum.ENGLISH);
 *
 * // Get a translation synchronously
 * const text = i18nService.translate('COMMON.SAVE');
 *
 * // Get a translation asynchronously
 * const text = await i18nService.translateAsync('COMMON.SAVE');
 *
 * // Get the current language
 * const currentLang = i18nService.getCurrentLang();
 *
 * // Get the fallback language
 * const fallbackLang = i18nService.getFallbackLang();
 * ```
 */
export class I18nService {
    constructor() {
        this._availableLanguages = [];
        this._preferredLanguage$ = new BehaviorSubject(null);
        /**
         * The underlying TranslateService from @ngx-translate/core.
         * Use this for direct access to the ngx-translate API.
         */
        this.translateService = inject(TranslateService);
    }
    /**
     * Gets the preferred language as an observable.
     * Emits only when the preferred language is set and changes.
     * @returns An observable of the preferred language.
     */
    get preferredLanguage$() {
        return this._preferredLanguage$.asObservable().pipe(filter((preferredLanguage) => !!preferredLanguage), distinctUntilChange());
    }
    /**
     * Gets the current preferred language value.
     * @returns The preferred language or null if not set.
     */
    get preferredLanguage() {
        return this._preferredLanguage$.getValue();
    }
    /**
     * Gets the available languages for the application.
     * @returns An array of available languages.
     */
    get availableLanguages() {
        return this._availableLanguages;
    }
    /**
     * Gets the current language being used.
     * Uses the new ngx-translate v17 API.
     * @returns The current language code or undefined if not set.
     */
    getCurrentLang() {
        return this.translateService.getCurrentLang();
    }
    /**
     * Gets the fallback language (used when a translation is missing).
     * Uses the new ngx-translate v17 API.
     * @returns The fallback language code or undefined if not set.
     */
    getFallbackLang() {
        return this.translateService.getFallbackLang();
    }
    /**
     * Sets the fallback language (used when a translation is missing).
     * Uses the new ngx-translate v17 API.
     * @param lang The language code to set as the fallback language.
     */
    setFallbackLang(lang) {
        this.translateService.setFallbackLang(lang);
    }
    /**
     * Sets the language to use and notifies all subscribers.
     * @param lang The language code to set as the current language.
     */
    setLanguage(lang) {
        this.translateService.use(lang);
        this._preferredLanguage$.next(lang);
    }
    /**
     * Sets the available languages for the application.
     * @param languages An array of language codes to set as available languages.
     */
    setAvailableLanguages(languages) {
        this._availableLanguages = languages;
    }
    /**
     * Adds a language to the available languages list.
     * @param language The language to add.
     */
    addLanguage(language) {
        if (!this._availableLanguages.includes(language)) {
            this._availableLanguages.push(language);
        }
    }
    /**
     * Removes a language from the available languages list.
     * @param language The language to remove.
     */
    removeLanguage(language) {
        this._availableLanguages = this._availableLanguages.filter((lang) => lang !== language);
    }
    /**
     * Returns the language code from the browser, e.g., "de".
     * @returns The browser language code or undefined if not available.
     */
    getBrowserLang() {
        return this.translateService.getBrowserLang();
    }
    /**
     * Returns a translation instantly from the internal state of loaded translations.
     * All rules regarding the current language, the preferred language, or even fallback languages will be used.
     * @param key The translation key or array of keys.
     * @param params Optional parameters for interpolation.
     * @returns The translated string.
     */
    translate(key, params) {
        return this.translateService.instant(key, params);
    }
    /**
     * Alias for translate() method.
     * Returns a translation instantly from the internal state of loaded translations.
     * @param key The translation key.
     * @param params Optional parameters for interpolation.
     * @returns The translated string.
     */
    getTranslation(key, params) {
        return this.translate(key, params);
    }
    /**
     * Returns a translation asynchronously, waiting for the translation to be loaded.
     * This is useful when translations may not be loaded yet.
     * @param key The translation key or array of keys.
     * @param params Optional parameters for interpolation.
     * @returns A promise that resolves to the translated string.
     */
    async translateAsync(key, params) {
        return firstValueFrom(this.translateService.get(key, params));
    }
    /**
     * Returns an observable for a translation.
     * The observable will emit whenever the language changes.
     * @param key The translation key or array of keys.
     * @param params Optional parameters for interpolation.
     * @returns An observable that emits the translated string.
     */
    translate$(key, params) {
        return this.translateService.stream(key, params);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: I18nService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: I18nService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: I18nService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=i18n.service.js.map