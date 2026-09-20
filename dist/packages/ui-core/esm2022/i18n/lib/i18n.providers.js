import { makeEnvironmentProviders } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader, DEFAULT_HTTP_LOADER_OPTIONS } from './translate-http-loader';
/**
 * Default I18n provider options.
 *
 * `lang` and `fallbackLang` are intentionally omitted to avoid NG0200 circular
 * dependency in apps with HTTP interceptors that depend on TranslateService.
 */
export const DEFAULT_I18N_OPTIONS = {
    extend: false,
    loader: DEFAULT_HTTP_LOADER_OPTIONS
};
/**
 * Provides I18n translation services for standalone Angular applications.
 * This is the recommended approach for Angular 17+ standalone applications.
 *
 * Uses the ngx-translate v17 standalone `provideTranslateService()` API internally.
 * Deprecated options (`useDefaultLang`, `defaultLanguage`) are NOT used.
 *
 * @param options Optional configuration for the I18n provider.
 * @returns Environment providers for the I18n services.
 *
 * @example
 * ```typescript
 * // In app.config.ts (app has no LanguageInterceptor)
 * import { provideI18n } from '@gauzy/ui-core/i18n';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideHttpClient(),
 *     provideI18n({
 *       fallbackLang: 'en',
 *       loader: {
 *         prefix: './assets/i18n/',
 *         suffix: '.json'
 *       }
 *     })
 *   ]
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Simple usage with defaults (language set imperatively after bootstrap)
 * import { provideI18n } from '@gauzy/ui-core/i18n';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideHttpClient(),
 *     provideI18n()
 *   ]
 * };
 * ```
 */
export function provideI18n(options) {
    const config = { ...DEFAULT_I18N_OPTIONS, ...options };
    // Build the translate service config, only including lang/fallbackLang
    // when explicitly provided to avoid eager translation loading (NG0200).
    const translateConfig = {
        extend: config.extend,
        loader: config.customLoader ?? provideTranslateHttpLoader(config.loader)
    };
    if (config.lang) {
        translateConfig.lang = config.lang;
    }
    if (config.fallbackLang) {
        translateConfig.fallbackLang = config.fallbackLang;
    }
    // I18nService uses providedIn: 'root' — no explicit registration needed.
    return makeEnvironmentProviders([
        // Configure ngx-translate with the v17 standalone API
        provideTranslateService(translateConfig)
    ]);
}
/**
 * Re-export provideTranslateService from @ngx-translate/core for convenience.
 * This allows consumers to use the raw ngx-translate API if needed.
 */
export { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
//# sourceMappingURL=i18n.providers.js.map