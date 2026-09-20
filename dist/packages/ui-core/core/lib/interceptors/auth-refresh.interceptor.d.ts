import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Interceptor that automatically refreshes the access token when a 401 Unauthorized error occurs.
 * This prevents users from being logged out when their access token expires.
 */
export declare class AuthRefreshInterceptor implements HttpInterceptor {
    private readonly authService;
    private readonly store;
    private readonly router;
    private refreshTokenInProgress;
    private refreshTokenSubject;
    /**
     * Intercepts HTTP requests and handles authentication token refresh if necessary.
     *
     * @param {HttpRequest<any>} req - The HTTP request to be intercepted.
     * @param {HttpHandler} next - The next HTTP handler in the chain.
     * @return {Observable<HttpEvent<any>>} - The intercepted HTTP request or an error.
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
    /**
     * Refreshes the access token by calling the AuthService.
     * @returns An Observable that emits the response of the token refresh request.
     */
    private refreshAccessToken;
    /**
     * Adds an authentication token to the HTTP request headers.
     * @param request The outgoing HTTP request.
     * @param token The authentication token to be added.
     * @returns A new HttpRequest object with the token added to the headers.
     */
    private addToken;
    /**
     * Checks if the URL is an authentication endpoint that should not trigger token refresh.
     * @param url The request URL to check.
     * @returns True if the URL is an auth endpoint, false otherwise.
     */
    private isAuthEndpoint;
    static ɵfac: i0.ɵɵFactoryDeclaration<AuthRefreshInterceptor, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AuthRefreshInterceptor>;
}
