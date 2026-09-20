import { Injectable } from '@angular/core';
import { Store } from '../services/store';
import * as i0 from "@angular/core";
import * as i1 from "../services/store";
export class TokenInterceptor {
    constructor(store) {
        this.store = store;
    }
    /**
     * Intercepts an HTTP request and adds an authorization token to the request headers.
     *
     * @param {HttpRequest<any>} request - The outgoing HTTP request.
     * @param {HttpHandler} next - The next handler in the interceptor chain.
     * @return {Observable<HttpEvent<any>>} - An observable of the HTTP event.
     */
    intercept(request, next) {
        const token = this.store.token;
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next.handle(request);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TokenInterceptor, deps: [{ token: i1.Store }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TokenInterceptor }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TokenInterceptor, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.Store }] });
//# sourceMappingURL=token.interceptor.js.map