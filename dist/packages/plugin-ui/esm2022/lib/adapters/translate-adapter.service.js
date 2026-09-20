import { inject, Injectable } from '@angular/core';
import { PLUGIN_TRANSLATE_DELEGATE, PLUGIN_TRANSLATE_STORE_DELEGATE } from '../plugin-ui.helper';
import * as i0 from "@angular/core";
/**
 * Adapter that bridges the host application's translate service to the
 * `IPluginTranslateService` interface expected by `PluginUiModule`.
 *
 * Uses `PLUGIN_TRANSLATE_DELEGATE` and `PLUGIN_TRANSLATE_STORE_DELEGATE` tokens
 * so that `@gauzy/plugin-ui` does not depend on `@ngx-translate/core` directly.
 * The host app provides:
 * ```typescript
 * { provide: PLUGIN_TRANSLATE_DELEGATE, useExisting: TranslateService },
 * { provide: PLUGIN_TRANSLATE_STORE_DELEGATE, useExisting: TranslateStore }
 * ```
 *
 * Provided via `PluginUiModule.init({ translateService: TranslateAdapterService })`.
 * Used internally by `defineDeclarativePlugin` to merge plugin translations.
 */
export class TranslateAdapterService {
    _translate = inject(PLUGIN_TRANSLATE_DELEGATE);
    _store = inject(PLUGIN_TRANSLATE_STORE_DELEGATE);
    /** Merges translations for a given language into the global namespace. */
    setTranslation(lang, translations, shouldMerge) {
        this._translate.setTranslation(lang, translations, shouldMerge);
    }
    /**
     * Returns the compiled translation object for a given language,
     * or `undefined` if the language has not been loaded yet.
     */
    getTranslations(lang) {
        return this._store.getTranslations(lang);
    }
    /** Returns the currently active language code. */
    getCurrentLang() {
        return this._translate.getCurrentLang();
    }
    /** Returns the configured fallback language code, or `null` if none is set. */
    getFallbackLang() {
        return this._translate.getFallbackLang();
    }
    /** Synchronous translation lookup. */
    instant(key, params) {
        return this._translate.instant(key, params);
    }
    /** Reactive translation. Re-emits when language or translations change. */
    stream(key, params) {
        return this._translate.stream(key, params);
    }
    /** Emits whenever the active language changes (after translations are loaded). */
    get onLangChange() {
        return this._translate.onLangChange;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TranslateAdapterService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TranslateAdapterService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TranslateAdapterService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=translate-adapter.service.js.map