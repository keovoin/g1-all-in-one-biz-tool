"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphqlInterceptor = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const _1 = require(".");
let GqlExecutionContext;
try {
    ({ GqlExecutionContext } = require('@nestjs/graphql'));
}
catch (e) { }
let GraphqlInterceptor = class GraphqlInterceptor extends _1.SentryInterceptor {
    /**
     *
     * @param context
     * @param scope
     * @param exception
     */
    captureException(context, scope, exception) {
        if (context.getType() === 'graphql') {
            this.captureGraphqlException(scope, GqlExecutionContext.create(context), exception);
        }
        else {
            super.captureException(context, scope, exception);
        }
    }
    /**
     * Captures GraphQL exception with context
     * V9 Migration: Handlers.parseRequest was removed, manually extract request data
     * Reference: https://docs.sentry.io/platforms/javascript/migration/v8-to-v9/#removals-in-sentrycore
     *
     * @param scope
     * @param gqlContext
     * @param exception
     */
    captureGraphqlException(scope, gqlContext, exception) {
        const sentry = this.client.instance();
        if (!sentry)
            return;
        const info = gqlContext.getInfo();
        const context = gqlContext.getContext();
        scope.setExtra('type', info.parentType.name);
        if (context.req) {
            // V9 Migration: Manual request data extraction since Handlers.parseRequest was removed
            // The addRequestDataToEvent method has been removed. Manually extract relevant data of request objects instead.
            const req = context.req;
            const requestData = {
                url: req.url,
                method: req.method,
                headers: req.headers,
                query: req.query,
                data: req.body
            };
            scope.setExtra('req', requestData);
            // V9 Migration: Manual user context setting since requestDataIntegration no longer automatically sets user from request.user
            // Reference: https://docs.sentry.io/platforms/javascript/guides/node/migration/v8-to-v9/#behavior-changes
            if (req.user) {
                scope.setUser(req.user);
            }
        }
        sentry.captureException(exception);
    }
};
exports.GraphqlInterceptor = GraphqlInterceptor;
exports.GraphqlInterceptor = GraphqlInterceptor = tslib_1.__decorate([
    (0, common_1.Injectable)()
], GraphqlInterceptor);
//# sourceMappingURL=graphql.interceptor.js.map