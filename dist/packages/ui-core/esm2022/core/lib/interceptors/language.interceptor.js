import { Injectable } from '@angular/core';
import { LanguagesEnum } from '@gauzy/contracts';
import { I18nService } from '@gauzy/ui-core/i18n';
import { Store } from '../services/store';
import * as i0 from "@angular/core";
import * as i1 from "../services/store";
import * as i2 from "@gauzy/ui-core/i18n";
export class LanguageInterceptor {
    constructor(store, _i18nService) {
        this.store = store;
        this._i18nService = _i18nService;
        this.logging = false;
        if (this.logging) {
            console.log('language interceptor constructor: %s', store.preferredLanguage);
        }
    }
    /**
     * Intercepts HTTP requests to add a language header.
     * @param request The outgoing HTTP request.
     * @param next The next handler in the interceptor chain.
     * @returns An observable of the HTTP event.
     */
    intercept(request, next) {
        // Get the preferred language from the store or the browser language
        const language = this.store?.preferredLanguage ?? this._i18nService?.getBrowserLang() ?? LanguagesEnum.ENGLISH;
        // Log the browser language
        if (this.logging) {
            console.log('language interceptor browser lang', this._i18nService?.getBrowserLang());
        }
        // Clone the request and add the language header
        request = request.clone({
            setHeaders: {
                Language: language
            }
        });
        // Pass the cloned request to the next interceptor in the chain
        return next.handle(request);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LanguageInterceptor, deps: [{ token: i1.Store }, { token: i2.I18nService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LanguageInterceptor }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LanguageInterceptor, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.Store }, { type: i2.I18nService }] });
//# sourceMappingURL=language.interceptor.js.map