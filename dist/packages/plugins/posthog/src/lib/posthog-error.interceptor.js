"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PosthogErrorInterceptor = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const posthog_service_1 = require("./posthog.service");
const utils_1 = require("./utils");
const posthog_constants_1 = require("./posthog.constants");
/**
 * Interceptor for capturing and tracking exceptions through PostHog analytics.
 * Sanitizes sensitive data before sending to PostHog and provides comprehensive error context.
 */
let PosthogErrorInterceptor = class PosthogErrorInterceptor {
    /**
     * @param options - Configuration options for the interceptor
     */
    constructor(options) {
        /**
         * PostHog service instance for tracking events
         */
        this.client = posthog_service_1.PosthogService.PosthogServiceInstance();
        this.options = options;
    }
    /**
     * Intercepts requests and captures exceptions when they occur
     *
     * @param context - Execution context of the current request
     * @param next - Call handler for the request pipeline
     * @returns Observable of the response stream
     */
    intercept(context, next) {
        const requestStartTime = Date.now();
        return next.handle().pipe((0, operators_1.tap)(null, (exception) => {
            // Calculate error timing metrics
            const errorTiming = {
                timestamp: new Date().toISOString(),
                duration_ms: Date.now() - requestStartTime
            };
            // Report to PostHog if it passes the filter
            if (this.shouldReport(exception)) {
                this.captureException(context, exception, errorTiming);
            }
        }));
    }
    /**
     * Routes exception capture based on context type (HTTP, RPC, WebSocket)
     *
     * @param context - Execution context of the current request
     * @param exception - The thrown exception to be captured
     * @param errorTiming - Timing information about when the error occurred
     */
    captureException(context, exception, errorTiming) {
        switch (context.getType()) {
            case 'http':
                return this.captureHttpException(context.switchToHttp(), exception, errorTiming);
            case 'rpc':
                return this.captureRpcException(context.switchToRpc(), exception, errorTiming);
            case 'ws':
                return this.captureWsException(context.switchToWs(), exception, errorTiming);
            default:
                // Fallback for unknown context types
                this.captureGenericException(context, exception, errorTiming);
        }
    }
    /**
     * Captures HTTP exceptions with comprehensive request context
     *
     * @param http - HTTP arguments host containing request data
     * @param exception - The thrown HTTP exception
     * @param errorTiming - Timing information about when the error occurred
     */
    captureHttpException(http, exception, errorTiming) {
        const request = http.getRequest();
        const response = http.getResponse();
        // Extract user identifier with fallbacks
        const userId = this.extractUserIdentifier(request);
        // Extract status code with error-aware fallback
        const statusCode = this.getStatusCode(exception);
        // Extract route information
        const route = this.extractRouteInfo(request);
        // Create a data object with request details
        const data = {
            request: {
                method: request.method,
                url: request.originalUrl || request.url,
                path: request.path,
                route: route,
                headers: utils_1.SanitizerUtil.sanitizeHeaders(request.headers),
                query: utils_1.SanitizerUtil.sanitizeObject(request.query),
                body: utils_1.SanitizerUtil.sanitizeObject(request.body),
                params: utils_1.SanitizerUtil.sanitizeObject(request.params)
            },
            user: {
                ip: request.ip,
                id: request.user?.id || request.user?.userId,
                email: request.user?.email,
                roles: request.user?.roles,
                agent: request.headers['user-agent']
            },
            response: {
                status_code: statusCode,
                headers: response?.getHeaders ? utils_1.SanitizerUtil.sanitizeHeaders(response.getHeaders()) : undefined
            },
            error: {
                message: exception.message,
                name: exception.name,
                stack: this.sanitizeStack(exception.stack),
                status: statusCode,
                response: utils_1.SanitizerUtil.sanitizeObject(exception.getResponse?.() || null),
                cause: exception.cause ? String(exception.cause) : undefined
            },
            context: {
                handler: this.getHandlerName(http.getRequest()?.__routeInfo),
                controller: this.getControllerName(http.getRequest()?.__routeInfo)
            },
            environment: {
                nodeEnv: process.env['NODE_ENV'],
                appVersion: process.env['APP_VERSION'],
                serviceName: process.env['SERVICE_NAME'] || 'api',
                timestamp: errorTiming.timestamp,
                duration_ms: errorTiming.duration_ms
            }
        };
        // Track the error with improved data structure
        this.client.captureException(exception, userId, {
            error_message: exception.message,
            error_name: exception.name,
            stack: this.sanitizeStack(exception.stack),
            status_code: data.response.status_code,
            request_data: data.request,
            user_data: data.user,
            response_data: data.response,
            error_data: data.error,
            context_data: data.context,
            environment_data: data.environment,
            $timestamp: errorTiming.timestamp,
            duration_ms: errorTiming.duration_ms,
            http_method: request.method
        });
        // Add tags for better error categorization in PostHog
        if (this.options?.includeTags !== false) {
            this.addErrorTags(userId, {
                error_type: exception.name,
                status_code: String(statusCode),
                http_method: request.method,
                path: route || request.path,
                environment: process.env['NODE_ENV'] || 'development'
            });
        }
    }
    /**
     * Captures RPC exceptions with message context and improved data
     *
     * @param rpc - RPC arguments host
     * @param exception - The thrown exception
     * @param errorTiming - Timing information about when the error occurred
     */
    captureRpcException(rpc, exception, errorTiming) {
        const data = rpc.getData();
        const ctx = rpc.getContext();
        // Try to extract pattern information
        const pattern = typeof ctx.getPattern === 'function' ? ctx.getPattern() : 'unknown-pattern';
        // Try to extract client ID or fallback to system
        const clientId = this.extractRpcClientId(ctx) || 'system';
        // Create detailed error context
        const errorContext = {
            rpc_data: utils_1.SanitizerUtil.sanitizeObject(data),
            rpc_context: utils_1.SanitizerUtil.sanitizeObject(ctx),
            rpc_pattern: pattern,
            error: {
                message: exception.message,
                name: exception.name,
                stack: this.sanitizeStack(exception.stack),
                cause: exception.cause ? String(exception.cause) : undefined
            },
            environment: {
                nodeEnv: process.env['NODE_ENV'],
                appVersion: process.env['APP_VERSION'],
                serviceName: process.env['SERVICE_NAME'] || 'api',
                timestamp: errorTiming.timestamp,
                duration_ms: errorTiming.duration_ms
            }
        };
        this.client.captureException(exception, clientId, {
            error_message: exception.message,
            error_name: exception.name,
            stack: this.sanitizeStack(exception.stack),
            rpc_data: errorContext.rpc_data,
            rpc_pattern: errorContext.rpc_pattern,
            rpc_context: errorContext.rpc_context,
            error_data: errorContext.error,
            environment_data: errorContext.environment,
            $timestamp: errorTiming.timestamp,
            duration_ms: errorTiming.duration_ms
        });
        // Add tags for better error categorization
        if (this.options?.includeTags !== false) {
            this.addErrorTags(clientId, {
                error_type: exception.name,
                pattern: pattern,
                environment: process.env['NODE_ENV'] || 'development',
                message_type: 'rpc'
            });
        }
    }
    /**
     * Captures WebSocket exceptions with client context and improved data
     *
     * @param ws - WebSocket arguments host
     * @param exception - The thrown exception
     * @param errorTiming - Timing information about when the error occurred
     */
    captureWsException(ws, exception, errorTiming) {
        const client = ws.getClient();
        const data = ws.getData();
        // Extract client ID with fallbacks
        const clientId = client.id || this.extractWsClientId(client) || 'websocket-client';
        // Try to extract event type
        const eventType = typeof data === 'object' && data.event ? data.event : 'unknown-event';
        // Create detailed error context
        const errorContext = {
            ws_client: {
                id: client.id,
                handshake: utils_1.SanitizerUtil.sanitizeObject(client.handshake)
            },
            ws_data: utils_1.SanitizerUtil.sanitizeObject(data),
            ws_event: eventType,
            error: {
                message: exception.message,
                name: exception.name,
                stack: this.sanitizeStack(exception.stack),
                cause: exception.cause ? String(exception.cause) : undefined
            },
            environment: {
                nodeEnv: process.env['NODE_ENV'],
                appVersion: process.env['APP_VERSION'],
                serviceName: process.env['SERVICE_NAME'] || 'api',
                timestamp: errorTiming.timestamp,
                duration_ms: errorTiming.duration_ms
            }
        };
        this.client.captureException(exception, clientId, {
            error_message: exception.message,
            error_name: exception.name,
            stack: this.sanitizeStack(exception.stack),
            ws_client: errorContext.ws_client,
            ws_data: errorContext.ws_data,
            ws_event: errorContext.ws_event,
            error_data: errorContext.error,
            environment_data: errorContext.environment,
            $timestamp: errorTiming.timestamp,
            duration_ms: errorTiming.duration_ms
        });
        // Add tags for better error categorization
        if (this.options?.includeTags !== false) {
            this.addErrorTags(clientId, {
                error_type: exception.name,
                event_type: eventType,
                environment: process.env['NODE_ENV'] || 'development',
                message_type: 'websocket'
            });
        }
    }
    /**
     * Captures exceptions from unknown context types
     *
     * @param context - Execution context
     * @param exception - The thrown exception
     * @param errorTiming - Timing information about when the error occurred
     */
    captureGenericException(context, exception, errorTiming) {
        // Use a generic system identifier
        const contextId = 'system';
        const errorContext = {
            context_type: context.getType(),
            handler: this.getHandlerName(context),
            error: {
                message: exception.message,
                name: exception.name,
                stack: this.sanitizeStack(exception.stack),
                cause: exception.cause ? String(exception.cause) : undefined
            },
            environment: {
                nodeEnv: process.env['NODE_ENV'],
                appVersion: process.env['APP_VERSION'],
                serviceName: process.env['SERVICE_NAME'] || 'api',
                timestamp: errorTiming.timestamp,
                duration_ms: errorTiming.duration_ms
            }
        };
        this.client.captureException(exception, contextId, {
            error_message: exception.message,
            error_name: exception.name,
            stack: this.sanitizeStack(exception.stack),
            context_data: {
                type: errorContext.context_type,
                handler: errorContext.handler
            },
            error_data: errorContext.error,
            environment_data: errorContext.environment,
            $timestamp: errorTiming.timestamp,
            duration_ms: errorTiming.duration_ms
        });
    }
    /**
     * Adds error tags for better categorization in PostHog
     *
     * @param distinctId - User or client identifier
     * @param tags - Tags to associate with the error
     */
    addErrorTags(distinctId, tags) {
        // Add error tags as a separate event for better filtering in PostHog
        this.client.track('error_tags', distinctId, tags);
    }
    /**
     * Determines if an exception should be reported based on configured filters
     *
     * @param exception - The thrown exception
     * @returns Boolean indicating if the exception should be reported
     */
    shouldReport(exception) {
        // If no options or filters are defined, always report
        if (!this.options)
            return true;
        // If any filter passes, then we do not report
        const filters = this.options.filters || [];
        return !filters.some(({ type, filter }) => {
            return exception instanceof type && (!filter || filter(exception));
        });
    }
    /**
     * Extracts a user identifier from various sources in the request
     *
     * @param request - The HTTP request
     * @returns User identifier string
     */
    extractUserIdentifier(request) {
        return (request.user?.id ||
            request.user?.userId ||
            request.headers['x-user-id'] ||
            request.cookies?.userId ||
            request.ip ||
            'anonymous');
    }
    /**
     * Extracts a client ID from RPC context
     *
     * @param ctx - RPC context
     * @returns Client ID string or null
     */
    extractRpcClientId(ctx) {
        return ctx.clientId || ctx.args?.[0]?.user?.id || null;
    }
    /**
     * Extracts a client ID from WebSocket client
     *
     * @param client - WebSocket client
     * @returns Client ID string or null
     */
    extractWsClientId(client) {
        if (!client)
            return null;
        // Try to extract user ID from handshake data
        if (client.handshake?.query?.userId) {
            return client.handshake.query.userId;
        }
        // Try to extract from auth data
        if (client.handshake?.auth?.userId) {
            return client.handshake.auth.userId;
        }
        return null;
    }
    /**
     * Gets the handler name from the execution context
     *
     * @param context - Execution context or route info
     * @returns Handler name string
     */
    getHandlerName(context) {
        if (!context)
            return 'unknown';
        // If passed route info directly
        if (context.handler)
            return context.handler;
        // If passed execution context
        if (typeof context.getHandler === 'function') {
            const handler = context.getHandler();
            return handler.name || 'unknown';
        }
        return 'unknown';
    }
    /**
     * Gets the controller name from route info
     *
     * @param routeInfo - Route information object
     * @returns Controller name string
     */
    getControllerName(routeInfo) {
        if (!routeInfo || !routeInfo.controller)
            return 'unknown';
        return routeInfo.controller;
    }
    /**
     * Extracts route information from a request
     *
     * @param request - HTTP request object
     * @returns Route path string or undefined
     */
    extractRouteInfo(request) {
        // Try to get route from NestJS route information
        if (request.route?.path) {
            return request.route.path;
        }
        // Fallback to path if available
        return request.path;
    }
    /**
     * Gets the status code from an exception with fallback
     *
     * @param exception - Exception object
     * @returns HTTP status code
     */
    getStatusCode(exception) {
        // Try to get status from HttpException
        if (exception instanceof common_1.HttpException) {
            return exception.getStatus();
        }
        // Check for custom status property
        if (exception.status && typeof exception.status === 'number') {
            return exception.status;
        }
        // Default to 500 Internal Server Error
        return 500;
    }
    /**
     * Sanitizes stack traces to remove sensitive information
     *
     * @param stack - Error stack trace
     * @returns Sanitized stack trace
     */
    sanitizeStack(stack) {
        if (!stack)
            return undefined;
        // Remove absolute file paths, keep only relative paths
        return stack
            .split('\n')
            .map((line) => {
            // Remove absolute paths containing user directories
            return line.replace(/\((\/Users\/|\/home\/|[A-Z]:\\Users\\)[^)]+/g, '(project/');
        })
            .join('\n')
            .slice(0, 2000); // Limit stack trace length
    }
};
exports.PosthogErrorInterceptor = PosthogErrorInterceptor;
exports.PosthogErrorInterceptor = PosthogErrorInterceptor = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Optional)()),
    tslib_1.__param(0, (0, common_1.Inject)(posthog_constants_1.POSTHOG_MODULE_OPTIONS)),
    tslib_1.__metadata("design:paramtypes", [Object])
], PosthogErrorInterceptor);
//# sourceMappingURL=posthog-error.interceptor.js.map