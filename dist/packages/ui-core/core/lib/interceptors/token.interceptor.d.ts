import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '../services/store';
import * as i0 from "@angular/core";
export declare class TokenInterceptor implements HttpInterceptor {
    private readonly store;
    constructor(store: Store);
    /**
     * Intercepts an HTTP request and adds an authorization token to the request headers.
     *
     * @param {HttpRequest<any>} request - The outgoing HTTP request.
     * @param {HttpHandler} next - The next handler in the interceptor chain.
     * @return {Observable<HttpEvent<any>>} - An observable of the HTTP event.
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TokenInterceptor, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TokenInterceptor>;
}
