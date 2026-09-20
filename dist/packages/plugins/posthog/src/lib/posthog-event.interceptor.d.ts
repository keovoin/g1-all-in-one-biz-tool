import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PosthogEventInterceptorOptions } from './posthog.interfaces';
import { PosthogService } from './posthog.service';
/**
 * Interceptor for capturing and tracking events through PostHog analytics.
 * Automatically tracks route access and performance metrics.
 * Sanitizes sensitive data before sending to PostHog.
 */
export declare class PosthogEventInterceptor implements NestInterceptor {
    /**
     * PostHog service instance for tracking events
     */
    protected readonly client: PosthogService;
    private readonly options?;
    /**
     * @param options - Configuration options for the interceptor
     */
    constructor(options?: PosthogEventInterceptorOptions);
    /**
     * Intercepts requests and tracks events when they occur
     *
     * @param context - Execution context of the current request
     * @param next - Call handler for the request pipeline
     * @returns Observable of the response stream
     */
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    /**
     * Routes event capture based on context type (HTTP, RPC, WebSocket)
     *
     * @param context - Execution context of the current request
     * @param eventName - Name of the event to capture
     * @param properties - Additional properties to include with the event
     */
    protected captureEvent(context: ExecutionContext, eventName: string, properties?: Record<string, any>): void;
    /**
     * Captures HTTP request events with comprehensive request context
     *
     * @param http - HTTP arguments host containing request data
     * @param eventName - Name of the event to track
     * @param additionalProperties - Additional event properties
     */
    private captureHttpEvent;
    /**
     * Captures RPC events with message context
     *
     * @param rpc - RPC arguments host
     * @param eventName - Name of the event to track
     * @param additionalProperties - Additional event properties
     */
    private captureRpcEvent;
    /**
     * Captures WebSocket events with client context
     *
     * @param ws - WebSocket arguments host
     * @param eventName - Name of the event to track
     * @param additionalProperties - Additional event properties
     */
    private captureWsEvent;
    /**
     * Captures the start of a request processing pipeline
     *
     * @param context - Execution context of the current request
     */
    protected captureRequestStart(context: ExecutionContext): void;
    /**
     * Captures the successful completion of a request
     *
     * @param context - Execution context of the current request
     * @param response - The response being sent back
     * @param duration - Duration of the request processing in milliseconds
     */
    protected captureRequestComplete(context: ExecutionContext, response: any, duration: number): void;
    /**
     * Captures error events during request processing
     * Note: This complements the PosthogErrorInterceptor by tracking timing metrics
     *
     * @param context - Execution context of the current request
     * @param error - The error that occurred
     * @param duration - Duration until the error occurred in milliseconds
     */
    protected captureRequestError(context: ExecutionContext, error: any, duration: number): void;
    /**
     * Extracts the handler name from the execution context
     *
     * @param context - Execution context
     * @returns The name of the handler being executed
     */
    private getHandlerName;
    /**
     * Extracts a route from an HTTP request
     *
     * @param request - HTTP request object
     * @returns Route path with parameter placeholders
     */
    private extractRouteFromRequest;
    /**
     * Determines if an endpoint should be ignored for tracking
     *
     * @param method - HTTP method
     * @param url - URL of the request
     * @returns Boolean indicating if the endpoint should be ignored
     */
    private shouldIgnoreEndpoint;
    /**
     * Extracts a user ID from various possible locations in the request
     *
     * @param request - HTTP request object
     * @returns User ID string or 'anonymous' if not found
     */
    private extractUserId;
    /**
     * Extracts a client ID from RPC context
     *
     * @param ctx - RPC context
     * @returns Client ID string or null if not found
     */
    private extractRpcClientId;
    /**
     * Extracts a client ID from WebSocket client
     *
     * @param client - WebSocket client
     * @returns Client ID string or null if not found
     */
    private extractWsClientId;
}
