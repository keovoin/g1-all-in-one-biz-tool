import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '../services/store';
import * as i0 from "@angular/core";
export declare class TenantInterceptor implements HttpInterceptor {
    private readonly store;
    constructor(store: Store);
    /**
     * Intercept HTTP requests and modify them based on user and organization information.
     * @param request - The HttpRequest instance.
     * @param next - The HttpHandler instance.
     * @returns An Observable of HttpEvent<any>.
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TenantInterceptor, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TenantInterceptor>;
}
