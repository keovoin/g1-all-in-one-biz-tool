import { ExecutionContext } from '@nestjs/common';
import { Scope } from '@sentry/node';
import { SentryInterceptor } from '.';
export declare class GraphqlInterceptor extends SentryInterceptor {
    /**
     *
     * @param context
     * @param scope
     * @param exception
     */
    protected captureException(context: ExecutionContext, scope: Scope, exception: any): void;
    /**
     * Captures GraphQL exception with context
     * V9 Migration: Handlers.parseRequest was removed, manually extract request data
     * Reference: https://docs.sentry.io/platforms/javascript/migration/v8-to-v9/#removals-in-sentrycore
     *
     * @param scope
     * @param gqlContext
     * @param exception
     */
    private captureGraphqlException;
}
