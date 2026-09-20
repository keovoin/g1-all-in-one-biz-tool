import { Injectable } from '@angular/core';
import { environment } from '@gauzy/ui-config';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
// Base URL
const baseUrl = environment.API_BASE_URL;
export class APIInterceptor {
    constructor() {
        this.logging = false;
    }
    /**
     * Intercepts HTTP requests and modifies the URL if it starts with the API prefix.
     * @param request The outgoing HTTP request.
     * @param next The next handler in the HTTP request chain.
     * @returns An observable of the HTTP event.
     */
    intercept(request, next) {
        if (baseUrl && request.url.startsWith(API_PREFIX)) {
            // Base URL is defined, modify the URL
            const url = baseUrl + request.url;
            // Log the request if logging is enabled
            if (this.logging) {
                console.log(`API Request: ${request.url} -> ${url}`);
            }
            // Clone the request and modify the URL
            request = request.clone({ url });
        }
        return next.handle(request);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: APIInterceptor, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: APIInterceptor }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: APIInterceptor, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=api.interceptor.js.map