import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from './translate-http-loader';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
/**
 * `I18nModule` provides centralized internationalization support for Angular applications based on `@ngx-translate/core`.
 *
 * It streamlines the setup of translation services, standardizing the loader configuration.
 * This module should be imported once in the root module using `forRoot()`.
 *
 * `I18nService` is not listed here — it uses `providedIn: 'root'` and is
 * available globally without explicit registration.
 *
 * **Important:** `fallbackLang` and `lang` are intentionally NOT set in the provider
 * config. Setting them here causes `TranslateService` to eagerly load translations
 * during DI initialization, which triggers an `NG0200` circular dependency in apps
 * that have HTTP interceptors depending on `TranslateService` (e.g. `LanguageInterceptor`).
 * Instead, set the fallback/default language imperatively after bootstrap
 * (e.g. via `translateService.setFallbackLang()` or a `provideAppInitializer`).
 *
 * Usage:
 *
 * 1. **Root Module Integration:**
 *    Import `I18nModule.forRoot()` in your main application module (usually `AppModule`).
 *
 *    @example
 *    ```typescript
 *    @NgModule({
 *      imports: [
 *        I18nModule.forRoot()
 *      ]
 *    })
 *    export class AppModule {}
 *    ```
 *
 * @note For standalone component-based applications (Angular 17+), consider using `provideI18n()`
 * in your application config instead of importing this module.
 * @see {@link provideI18n}
 */
export class I18nModule {
    /**
     * Configures I18nModule for the root module.
     *
     * The ngx-translate root providers (`TranslateService`, `TranslateStore`, HTTP loader)
     * are registered via `TranslateModule.forRoot()` in the `@NgModule` decorator.
     *
     * @return {ModuleWithProviders<I18nModule>} A ModuleWithProviders object with the I18nModule.
     */
    static forRoot() {
        return {
            ngModule: I18nModule,
            providers: []
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: I18nModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: I18nModule, imports: [i1.TranslateModule], exports: [TranslateModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: I18nModule, imports: [TranslateModule.forRoot({
                loader: provideTranslateHttpLoader()
            }), TranslateModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: I18nModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        TranslateModule.forRoot({
                            loader: provideTranslateHttpLoader()
                        })
                    ],
                    exports: [TranslateModule]
                }]
        }] });
//# sourceMappingURL=i18n.module.js.map