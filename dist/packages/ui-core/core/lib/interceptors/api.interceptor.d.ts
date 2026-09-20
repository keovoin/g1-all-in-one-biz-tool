import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class APIInterceptor implements HttpInterceptor {
    logging: boolean;
    /**
     * Intercepts HTTP requests and modifies the URL if it starts with the API prefix.
     * @param request The outgoing HTTP request.
     * @param next The next handler in the HTTP request chain.
     * @returns An observable of the HTTP event.
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<APIInterceptor, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<APIInterceptor>;
}
