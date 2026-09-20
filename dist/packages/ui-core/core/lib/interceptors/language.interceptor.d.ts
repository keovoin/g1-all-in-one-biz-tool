import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { I18nService } from '@gauzy/ui-core/i18n';
import { Store } from '../services/store';
import * as i0 from "@angular/core";
export declare class LanguageInterceptor implements HttpInterceptor {
    readonly store: Store;
    readonly _i18nService: I18nService;
    logging: boolean;
    constructor(store: Store, _i18nService: I18nService);
    /**
     * Intercepts HTTP requests to add a language header.
     * @param request The outgoing HTTP request.
     * @param next The next handler in the interceptor chain.
     * @returns An observable of the HTTP event.
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<LanguageInterceptor, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LanguageInterceptor>;
}
