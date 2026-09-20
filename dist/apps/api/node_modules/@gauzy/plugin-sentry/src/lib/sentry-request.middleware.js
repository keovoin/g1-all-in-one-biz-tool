"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryRequestMiddleware = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const Sentry = require("@sentry/node");
let SentryRequestMiddleware = class SentryRequestMiddleware {
    constructor() { }
    /**
     * Handles the request.
     * V9 Migration: Handlers.requestHandler was removed, manual context setting
     * Reference: https://docs.sentry.io/platforms/javascript/migration/v8-to-v9/#behavior-changes
     *
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next function.
     */
    use(req, res, next) {
        // V9 Migration: In Sentry v9, request handling is done automatically by the httpIntegration
        // We just need to set additional request context if needed
        Sentry.getCurrentScope().setContext('request', {
            method: req.method,
            url: req.url,
            headers: req.headers,
            query: req.query
        });
        // V9 Migration: Manual user context setting since requestDataIntegration no longer automatically sets user from request.user
        // Reference: https://docs.sentry.io/platforms/javascript/guides/node/migration/v8-to-v9/#behavior-changes
        if (req.user) {
            Sentry.getCurrentScope().setUser(req.user);
        }
        next();
    }
};
exports.SentryRequestMiddleware = SentryRequestMiddleware;
exports.SentryRequestMiddleware = SentryRequestMiddleware = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], SentryRequestMiddleware);
//# sourceMappingURL=sentry-request.middleware.js.map