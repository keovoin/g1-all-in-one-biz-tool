import { Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class HubstaffTokenInterceptor implements HttpInterceptor {
    private readonly injector;
    private refreshTokenInProgress;
    private refreshTokenSubject;
    constructor(injector: Injector);
    /**
     * Intercepts HTTP requests and handles authentication token refresh if necessary.
     *
     * @param {HttpRequest<any>} req - The HTTP request to be intercepted.
     * @param {HttpHandler} next - The next HTTP handler in the chain.
     * @return {Observable<HttpEvent<any>>} - The intercepted HTTP request or an error.
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
    /**
     * Refreshes the access token by calling the HubstaffService.
     * @returns An Observable that emits the response of the token refresh request.
     */
    private refreshAccessToken;
    /**
     * Adds an authentication token to the HTTP request body.
     * @param request The outgoing HTTP request.
     * @param token The authentication token to be added.
     * @returns A new HttpRequest object with the token added to the body.
     */
    private addAuthenticationToken;
    static ɵfac: i0.ɵɵFactoryDeclaration<HubstaffTokenInterceptor, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<HubstaffTokenInterceptor>;
}
