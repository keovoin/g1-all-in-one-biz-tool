import { Injectable, Inject, Optional } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { tap, finalize } from 'rxjs/operators';
import { PostHogServiceManager } from '../services/posthog-manager.service';
import { POSTHOG_CONFIG, POSTHOG_DEBUG_MODE } from '../interfaces/posthog.interface';
import * as i0 from "@angular/core";
import * as i1 from "../services/posthog-manager.service";
/**
 * HTTP interceptor that automatically tracks API requests using PostHog.
 * Captures duration, status, method, and error info (if any).
 */
export class PostHogInterceptor {
    constructor(posthogServiceManager, config, debugMode = false) {
        this.posthogServiceManager = posthogServiceManager;
        this.config = config;
        this.debugMode = debugMode;
    }
    intercept(req, next) {
        // Skip tracking if URL is excluded
        if (this.shouldSkipTracking(req.url)) {
            return next.handle(req);
        }
        const startTime = performance.now();
        const path = req.url.split('?')[0]; // Strip query params
        let eventProperties = {
            path,
            method: req.method,
            url: req.url,
            withCredentials: req.withCredentials
        };
        // Add custom properties if configured
        if (this.config.httpTracking?.additionalProperties) {
            eventProperties = {
                ...eventProperties,
                ...this.config.httpTracking.additionalProperties
            };
        }
        // Log if in debug mode
        if (this.debugMode) {
            console.debug('[PostHog] Intercepting HTTP request:', req.method, req.url);
        }
        return next.handle(req).pipe(tap({
            next: (event) => {
                if (event instanceof HttpResponse) {
                    eventProperties['status'] = event.status;
                    eventProperties['success'] = event.status >= 200 && event.status < 400;
                    // Optionally capture response body (use with caution!)
                    if (this.config.httpTracking?.captureResponseBodies && event.body) {
                        try {
                            // Attempt to safely stringify the body, omitting sensitive fields
                            eventProperties['responseBody'] = this.sanitizeResponseBody(event.body);
                        }
                        catch (e) {
                            // If we can't stringify, just set a flag that there was a body
                            eventProperties['hasResponseBody'] = true;
                        }
                    }
                }
            },
            error: (error) => {
                eventProperties['status'] = error?.status ?? 'unknown';
                eventProperties['success'] = false;
                eventProperties['errorMessage'] = error?.message ?? 'Unknown error';
                eventProperties['errorType'] = error?.name ?? 'Error';
                // Include error status text if available
                if (error?.statusText) {
                    eventProperties['statusText'] = error.statusText;
                }
            }
        }), finalize(() => {
            const duration = Math.round(performance.now() - startTime);
            eventProperties['duration'] = duration;
            // Track the API request event
            this.posthogServiceManager.trackEvent('api_request', eventProperties);
        }));
    }
    /**
     * Determines if tracking should be skipped for the given URL
     */
    shouldSkipTracking(url) {
        if (!this.config.httpTracking?.excludeUrls)
            return false;
        return this.config.httpTracking.excludeUrls.some((pattern) => {
            if (pattern instanceof RegExp) {
                return pattern.test(url);
            }
            return url.includes(pattern);
        });
    }
    /**
     * Sanitizes response body to remove potentially sensitive information
     */
    sanitizeResponseBody(body, depth = 0) {
        if (!body)
            return undefined;
        // Limit recursion depth to avoid stack overflow
        if (depth > 10)
            return '[Max depth reached]';
        // List of sensitive fields to redact
        const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth', 'credit', 'card'];
        try {
            // Handle arrays
            if (Array.isArray(body)) {
                return body.map((item) => this.sanitizeResponseBody(item, depth + 1));
            }
            if (typeof body === 'object') {
                // Create a copy to avoid modifying the original
                const sanitized = { ...body };
                // Redact sensitive fields
                for (const key in sanitized) {
                    if (sensitiveFields.some((field) => key.toLowerCase() === field.toLowerCase())) {
                        sanitized[key] = '[REDACTED]';
                    }
                    else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
                        sanitized[key] = this.sanitizeResponseBody(sanitized[key], depth + 1);
                    }
                }
                return sanitized;
            }
            return body;
        }
        catch (e) {
            return '[Error sanitizing body]';
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PostHogInterceptor, deps: [{ token: i1.PostHogServiceManager }, { token: POSTHOG_CONFIG }, { token: POSTHOG_DEBUG_MODE, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PostHogInterceptor }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PostHogInterceptor, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.PostHogServiceManager }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [POSTHOG_CONFIG]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [POSTHOG_DEBUG_MODE]
                }] }] });
//# sourceMappingURL=posthog.interceptor.js.map