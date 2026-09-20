import type { Observable } from 'rxjs';
import type { IPluginTranslateService } from '../plugin-ui.helper';
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
export declare class TranslateAdapterService implements IPluginTranslateService {
    private readonly _translate;
    private readonly _store;
    /** Merges translations for a given language into the global namespace. */
    setTranslation(lang: string, translations: Record<string, any>, shouldMerge?: boolean): void;
    /**
     * Returns the compiled translation object for a given language,
     * or `undefined` if the language has not been loaded yet.
     */
    getTranslations(lang: string): Readonly<Record<string, any>> | undefined;
    /** Returns the currently active language code. */
    getCurrentLang(): string;
    /** Returns the configured fallback language code, or `null` if none is set. */
    getFallbackLang(): string | null;
    /** Synchronous translation lookup. */
    instant(key: string, params?: Record<string, unknown>): string;
    /** Reactive translation. Re-emits when language or translations change. */
    stream(key: string, params?: Record<string, unknown>): Observable<string>;
    /** Emits whenever the active language changes (after translations are loaded). */
    get onLangChange(): Observable<{
        lang: string;
    }>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TranslateAdapterService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TranslateAdapterService>;
}
