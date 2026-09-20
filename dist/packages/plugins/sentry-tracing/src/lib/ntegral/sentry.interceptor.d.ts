import { CallHandler, ExecutionContext, HttpException, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Scope } from '@sentry/node';
import { SentryInterceptorOptions } from './sentry.interfaces';
import { SentryService } from './sentry.service';
export declare class SentryInterceptor implements NestInterceptor {
    private readonly options?;
    protected readonly client: SentryService;
    constructor(options?: SentryInterceptorOptions);
    /**
     *
     * @param context
     * @param next
     * @returns
     */
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    /**
     *
     * @param context
     * @param scope
     * @param exception
     * @returns
     */
    protected captureException(context: ExecutionContext, scope: Scope, exception: HttpException): void;
    /**
     * Captures HTTP exception with request context
     * V9 Migration: Handlers.parseRequest was removed, manually extract request data
     * Reference: https://docs.sentry.io/platforms/javascript/migration/v8-to-v9/#removals-in-sentrycore
     *
     * @param scope
     * @param http
     * @param exception
     */
    private captureHttpException;
    /**
     *
     * @param scope
     * @param rpc
     * @param exception
     */
    private captureRpcException;
    /**
     *
     * @param scope
     * @param ws
     * @param exception
     */
    private captureWsException;
    /**
     *
     * @param exception
     * @returns
     */
    private shouldReport;
}
