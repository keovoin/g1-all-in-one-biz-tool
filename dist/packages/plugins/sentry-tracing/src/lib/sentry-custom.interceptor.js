"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryCustomInterceptor = void 0;
const Sentry = require("@sentry/node");
const rxjs_1 = require("rxjs");
const ntegral_1 = require("./ntegral");
class SentryCustomInterceptor extends ntegral_1.SentryInterceptor {
    constructor() {
        super({
            filters: [
            /* For now let's report all, but later we can filter
            {
                type: HttpException,
                filter: (e: HttpException) => e.getStatus() < 500
            },
            {
                type: EntityNotFoundError
            }
            */
            ]
        });
    }
    /**
     * Intercepts the execution context and handles errors.
     * @param {ExecutionContext} context - The execution context.
     * @param {CallHandler} next - The call handler.
     * @returns {Observable<any>} An observable that represents the result of the intercepted operation.
     */
    intercept(context, next) {
        return next.handle().pipe((0, rxjs_1.catchError)((error) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (this.shouldReport(error)) {
                // In Sentry v9, we directly capture the exception
                Sentry.captureException(error);
            }
            return (0, rxjs_1.throwError)(() => error);
        }));
    }
}
exports.SentryCustomInterceptor = SentryCustomInterceptor;
//# sourceMappingURL=sentry-custom.interceptor.js.map