"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryInterceptor = void 0;
const tslib_1 = require("tslib");
// Nestjs imports
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const core_1 = require("@sentry/core");
const sentry_service_1 = require("./sentry.service");
let SentryInterceptor = class SentryInterceptor {
    constructor(options) {
        this.options = options;
        this.client = sentry_service_1.SentryService.SentryServiceInstance();
    }
    /**
     *
     * @param context
     * @param next
     * @returns
     */
    intercept(context, next) {
        // first param would be for events, second is for errors
        return next.handle().pipe((0, operators_1.tap)(null, (exception) => {
            const sentry = this.client.instance();
            if (sentry && this.shouldReport(exception)) {
                sentry.withScope((scope) => {
                    return this.captureException(context, scope, exception);
                });
            }
        }));
    }
    /**
     *
     * @param context
     * @param scope
     * @param exception
     * @returns
     */
    captureException(context, scope, exception) {
        switch (context.getType()) {
            case 'http':
                return this.captureHttpException(scope, context.switchToHttp(), exception);
            case 'rpc':
                return this.captureRpcException(scope, context.switchToRpc(), exception);
            case 'ws':
                return this.captureWsException(scope, context.switchToWs(), exception);
        }
    }
    /**
     * Captures HTTP exception with request context
     * V9 Migration: Handlers.parseRequest was removed, manually extract request data
     * Reference: https://docs.sentry.io/platforms/javascript/migration/v8-to-v9/#removals-in-sentrycore
     *
     * @param scope
     * @param http
     * @param exception
     */
    captureHttpException(scope, http, exception) {
        const sentry = this.client.instance();
        if (!sentry)
            return;
        const request = http.getRequest();
        // V9 Migration: Use httpRequestToRequestData instead of manual extraction
        // Reference: https://docs.sentry.io/platforms/javascript/migration/v8-to-v9/#removals-in-sentrycore
        // The addRequestDataToEvent method has been removed. Use httpRequestToRequestData instead and put the resulting object directly on event.request.
        const requestData = (0, core_1.httpRequestToRequestData)(request);
        scope.setExtra('req', requestData);
        scope.setTag('url', request.url);
        scope.setTag('method', request.method);
        // V9 Migration: Manual user context setting since requestDataIntegration no longer automatically sets user from request.user
        // Reference: https://docs.sentry.io/platforms/javascript/guides/node/migration/v8-to-v9/#behavior-changes
        if (request.user) {
            scope.setUser(request.user);
        }
        sentry.captureException(exception);
    }
    /**
     *
     * @param scope
     * @param rpc
     * @param exception
     */
    captureRpcException(scope, rpc, exception) {
        const sentry = this.client.instance();
        if (!sentry)
            return;
        scope.setExtra('rpc_data', rpc.getData());
        sentry.captureException(exception);
    }
    /**
     *
     * @param scope
     * @param ws
     * @param exception
     */
    captureWsException(scope, ws, exception) {
        const sentry = this.client.instance();
        if (!sentry)
            return;
        scope.setExtra('ws_client', ws.getClient());
        scope.setExtra('ws_data', ws.getData());
        sentry.captureException(exception);
    }
    /**
     *
     * @param exception
     * @returns
     */
    shouldReport(exception) {
        if (this.options && !this.options.filters)
            return true;
        // If any filter passes, then we do not report
        if (this.options) {
            const opts = this.options;
            if (opts.filters) {
                let filters = opts.filters;
                return filters.some(({ type, filter }) => {
                    return !(exception instanceof type && (!filter || filter(exception)));
                });
            }
        }
        else {
            return true;
        }
    }
};
exports.SentryInterceptor = SentryInterceptor;
exports.SentryInterceptor = SentryInterceptor = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], SentryInterceptor);
//# sourceMappingURL=sentry.interceptor.js.map