import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { HttpStatus } from '@gauzy/contracts';
import { HubstaffService } from '../services';
import * as i0 from "@angular/core";
export class HubstaffTokenInterceptor {
    constructor(injector) {
        this.injector = injector;
        this.refreshTokenInProgress = false;
        this.refreshTokenSubject = new BehaviorSubject(null);
    }
    /**
     * Intercepts HTTP requests and handles authentication token refresh if necessary.
     *
     * @param {HttpRequest<any>} req - The HTTP request to be intercepted.
     * @param {HttpHandler} next - The next HTTP handler in the chain.
     * @return {Observable<HttpEvent<any>>} - The intercepted HTTP request or an error.
     */
    intercept(req, next) {
        if (!req.url.includes('/integration/hubstaff/')) {
            return next.handle(req);
        }
        // source from https://github.com/melcor76/interceptors/blob/master/src/app/interceptors/auth.interceptor.ts
        return next.handle(req).pipe(catchError((error) => {
            if (error && error.status === HttpStatus.UNAUTHORIZED) {
                // HttpStatus.UNAUTHORIZED errors are most likely going to be because we have an expired token that we need to refresh.
                if (this.refreshTokenInProgress) {
                    // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
                    // which means the new token is ready and we can retry the request again
                    return this.refreshTokenSubject.pipe(filter((result) => result !== null), take(1), switchMap((access_token) => next.handle(this.addAuthenticationToken(req, access_token))));
                }
                else {
                    this.refreshTokenInProgress = true;
                    // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
                    this.refreshTokenSubject.next(null);
                    return this.refreshAccessToken().pipe(switchMap(({ access_token }) => {
                        this.refreshTokenSubject.next(access_token);
                        return next.handle(this.addAuthenticationToken(req, access_token));
                    }), 
                    // When the call to refreshToken completes we reset the refreshTokenInProgress to false
                    // for the next time the token needs to be refreshed
                    finalize(() => (this.refreshTokenInProgress = false)));
                }
            }
            else {
                // If the error is not 401, we need to rethrow it so it can be handled by other interceptors or error handlers
                return throwError(error);
            }
        }));
    }
    /**
     * Refreshes the access token by calling the HubstaffService.
     * @returns An Observable that emits the response of the token refresh request.
     */
    refreshAccessToken() {
        const service = this.injector.get(HubstaffService);
        return service.refreshToken();
    }
    /**
     * Adds an authentication token to the HTTP request body.
     * @param request The outgoing HTTP request.
     * @param token The authentication token to be added.
     * @returns A new HttpRequest object with the token added to the body.
     */
    addAuthenticationToken(request, token) {
        return request.clone({
            body: { token }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HubstaffTokenInterceptor, deps: [{ token: i0.Injector }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HubstaffTokenInterceptor }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HubstaffTokenInterceptor, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i0.Injector }] });
//# sourceMappingURL=hubstaff-token-interceptor.js.map