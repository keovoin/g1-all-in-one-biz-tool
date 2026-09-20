"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryTraceMiddleware = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
let SentryTraceMiddleware = class SentryTraceMiddleware {
    /**
     * Handles the request.
     * V9 Migration: Handlers.tracingHandler was removed, but automatic tracing is handled by httpIntegration
     * Reference: https://docs.sentry.io/platforms/javascript/migration/v8-to-v9/#new-tracing-apis
     *
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next function.
     */
    use(req, res, next) {
        // V9 Migration: Handlers.tracingHandler was removed in v9
        // However, automatic HTTP tracing is now handled by the httpIntegration
        // The SDK automatically creates spans for HTTP requests when httpIntegration is enabled
        // No manual intervention needed - just call next() to continue the middleware chain
        next();
    }
};
exports.SentryTraceMiddleware = SentryTraceMiddleware;
exports.SentryTraceMiddleware = SentryTraceMiddleware = tslib_1.__decorate([
    (0, common_1.Injectable)()
], SentryTraceMiddleware);
//# sourceMappingURL=sentry-trace.middleware.js.map