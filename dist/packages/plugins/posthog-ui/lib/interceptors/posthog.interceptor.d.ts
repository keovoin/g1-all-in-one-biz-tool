import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostHogServiceManager } from '../services/posthog-manager.service';
import { PostHogModuleConfig } from '../interfaces/posthog.interface';
import * as i0 from "@angular/core";
/**
 * HTTP interceptor that automatically tracks API requests using PostHog.
 * Captures duration, status, method, and error info (if any).
 */
export declare class PostHogInterceptor implements HttpInterceptor {
    private posthogServiceManager;
    private config;
    private debugMode;
    constructor(posthogServiceManager: PostHogServiceManager, config: PostHogModuleConfig, debugMode?: boolean);
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
    /**
     * Determines if tracking should be skipped for the given URL
     */
    private shouldSkipTracking;
    /**
     * Sanitizes response body to remove potentially sensitive information
     */
    private sanitizeResponseBody;
    static ɵfac: i0.ɵɵFactoryDeclaration<PostHogInterceptor, [null, null, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PostHogInterceptor>;
}
