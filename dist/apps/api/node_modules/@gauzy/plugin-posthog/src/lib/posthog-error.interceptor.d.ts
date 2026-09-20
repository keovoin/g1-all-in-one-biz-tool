import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PosthogInterceptorOptions } from './posthog.interfaces';
import { PosthogService } from './posthog.service';
/**
 * Interceptor for capturing and tracking exceptions through PostHog analytics.
 * Sanitizes sensitive data before sending to PostHog and provides comprehensive error context.
 */
export declare class PosthogErrorInterceptor implements NestInterceptor {
    /**
     * PostHog service instance for tracking events
     */
    protected readonly client: PosthogService;
    private readonly options?;
    /**
     * @param options - Configuration options for the interceptor
     */
    constructor(options?: PosthogInterceptorOptions);
    /**
     * Intercepts requests and captures exceptions when they occur
     *
     * @param context - Execution context of the current request
     * @param next - Call handler for the request pipeline
     * @returns Observable of the response stream
     */
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    /**
     * Routes exception capture based on context type (HTTP, RPC, WebSocket)
     *
     * @param context - Execution context of the current request
     * @param exception - The thrown exception to be captured
     * @param errorTiming - Timing information about when the error occurred
     */
    protected captureException(context: ExecutionContext, exception: any, errorTiming: {
        timestamp: string;
        duration_ms: number;
    }): void;
    /**
     * Captures HTTP exceptions with comprehensive request context
     *
     * @param http - HTTP arguments host containing request data
     * @param exception - The thrown HTTP exception
     * @param errorTiming - Timing information about when the error occurred
     */
    private captureHttpException;
    /**
     * Captures RPC exceptions with message context and improved data
     *
     * @param rpc - RPC arguments host
     * @param exception - The thrown exception
     * @param errorTiming - Timing information about when the error occurred
     */
    private captureRpcException;
    /**
     * Captures WebSocket exceptions with client context and improved data
     *
     * @param ws - WebSocket arguments host
     * @param exception - The thrown exception
     * @param errorTiming - Timing information about when the error occurred
     */
    private captureWsException;
    /**
     * Captures exceptions from unknown context types
     *
     * @param context - Execution context
     * @param exception - The thrown exception
     * @param errorTiming - Timing information about when the error occurred
     */
    private captureGenericException;
    /**
     * Adds error tags for better categorization in PostHog
     *
     * @param distinctId - User or client identifier
     * @param tags - Tags to associate with the error
     */
    private addErrorTags;
    /**
     * Determines if an exception should be reported based on configured filters
     *
     * @param exception - The thrown exception
     * @returns Boolean indicating if the exception should be reported
     */
    shouldReport(exception: any): boolean;
    /**
     * Extracts a user identifier from various sources in the request
     *
     * @param request - The HTTP request
     * @returns User identifier string
     */
    private extractUserIdentifier;
    /**
     * Extracts a client ID from RPC context
     *
     * @param ctx - RPC context
     * @returns Client ID string or null
     */
    private extractRpcClientId;
    /**
     * Extracts a client ID from WebSocket client
     *
     * @param client - WebSocket client
     * @returns Client ID string or null
     */
    private extractWsClientId;
    /**
     * Gets the handler name from the execution context
     *
     * @param context - Execution context or route info
     * @returns Handler name string
     */
    private getHandlerName;
    /**
     * Gets the controller name from route info
     *
     * @param routeInfo - Route information object
     * @returns Controller name string
     */
    private getControllerName;
    /**
     * Extracts route information from a request
     *
     * @param request - HTTP request object
     * @returns Route path string or undefined
     */
    private extractRouteInfo;
    /**
     * Gets the status code from an exception with fallback
     *
     * @param exception - Exception object
     * @returns HTTP status code
     */
    private getStatusCode;
    /**
     * Sanitizes stack traces to remove sensitive information
     *
     * @param stack - Error stack trace
     * @returns Sanitized stack trace
     */
    private sanitizeStack;
}
