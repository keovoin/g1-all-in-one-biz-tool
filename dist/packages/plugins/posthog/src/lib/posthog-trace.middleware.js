"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PosthogTraceMiddleware = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const posthog_service_1 = require("./posthog.service");
let PosthogTraceMiddleware = class PosthogTraceMiddleware {
    constructor(posthog) {
        this.posthog = posthog;
    }
    /**
     * Tracks request performance metrics and status codes
     * Attaches to response finish event to capture final timing
     * @param req - Incoming HTTP request
     * @param res - HTTP response
     * @param next - Next middleware function
     */
    use(req, res, next) {
        const start = Date.now();
        const { method, path } = req;
        res.on('finish', () => {
            const duration = Date.now() - start;
            try {
                this.posthog.track('http_request', req.ip || 'unknown', {
                    method,
                    path,
                    status_code: res.statusCode,
                    duration_ms: duration,
                    $timestamp: new Date(start).toISOString()
                });
            }
            catch (e) {
                // Silently continue if analytics tracking fails
                console.error('Error capturing HTTP status code', e);
            }
        });
        next();
    }
};
exports.PosthogTraceMiddleware = PosthogTraceMiddleware;
exports.PosthogTraceMiddleware = PosthogTraceMiddleware = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [posthog_service_1.PosthogService])
], PosthogTraceMiddleware);
//# sourceMappingURL=posthog-trace.middleware.js.map