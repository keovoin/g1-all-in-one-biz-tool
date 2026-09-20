"use strict";
var RequestContextMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContextMiddleware = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const nestjs_cls_1 = require("nestjs-cls");
const uuid_1 = require("uuid");
const request_context_1 = require("./request-context");
/**
 * A trusted inbound `x-correlation-id` is echoed back verbatim and later interpolated into log
 * lines (this middleware's own, and `packages/plugins/docs`'s queue logs) — an unvalidated value
 * is a log-injection vector (CWE-117: a client-supplied `\n` could forge additional log lines) and
 * a header-injection one (a raw CR/LF could smuggle extra response headers). Correlation ids this
 * app generates are UUIDv4, so a generous but bounded allowlist (visible ASCII only — no space,
 * tab, CR/LF or other control/non-ASCII bytes — capped well above a UUID's 36 characters for
 * interop with whatever format an upstream proxy/load balancer already uses, e.g. dotted,
 * colon-separated, base64 or braced-GUID ids) rejects control characters and unbounded input
 * while still accepting any realistic legitimate value.
 */
const SAFE_CORRELATION_ID = /^[\x21-\x7E]{1,128}$/;
let RequestContextMiddleware = RequestContextMiddleware_1 = class RequestContextMiddleware {
    constructor(clsService) {
        this.clsService = clsService;
        this.logger = new common_1.Logger(RequestContextMiddleware_1.name);
        this.loggingEnabled = true;
    }
    /**
     * Middleware to manage request context and log request lifecycle.
     *
     * This middleware generates a `RequestContext` for each incoming request,
     * logs the start and end of the request if logging is enabled, and ensures that
     * the context is preserved during the request lifecycle using `nestjs-cls`.
     *
     * @param req The incoming HTTP request.
     * @param res The outgoing HTTP response.
     * @param next The next middleware function in the request-response cycle.
     */
    use(req, res, next) {
        // Start a new context using the ClsService
        this.clsService.run(() => {
            const inboundCorrelationId = req.headers['x-correlation-id'];
            // A malformed/oversized/control-character-bearing value is treated the same as absent
            // (generate one) rather than rejecting the request — the header is advisory, and this is
            // the same fail-safe posture as trusting it at all in the first place.
            const id = typeof inboundCorrelationId === 'string' && SAFE_CORRELATION_ID.test(inboundCorrelationId)
                ? inboundCorrelationId
                : (0, uuid_1.v4)();
            // Echo it back (TASK 9 — Unified Observability and Correlation IDs): previously this id
            // was only ever readable server-side (via RequestContext.getContextId(), now also
            // RequestContext.currentCorrelationId()). Without this header, a caller that did NOT send
            // its own `x-correlation-id` had no way to learn the one the server generated, so it could
            // never hand that id to support/logs to correlate its own request with server-side logs.
            res.setHeader('x-correlation-id', String(id));
            const context = new request_context_1.RequestContext({ id, req, res });
            this.clsService.set(request_context_1.RequestContext.name, context);
            // Build the full request URL
            const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
            // Log the start of the request if logging is enabled
            if (this.loggingEnabled) {
                const contextId = request_context_1.RequestContext.getContextId();
                this.logger.log(`Context ${contextId}: ${req.method} request to ${fullUrl} started.`);
            }
            // Capture the original res.end function
            const originalEnd = res.end.bind(res);
            // Override the res.end function to log when the response finishes
            res.end = (...args) => {
                if (this.loggingEnabled) {
                    const contextId = request_context_1.RequestContext.getContextId();
                    this.logger.log(`Context ${contextId}: ${req.method} request to ${fullUrl} completed with status ${res.statusCode}.`);
                }
                // Call the original res.end and return its result
                return originalEnd(...args);
            };
            next();
        });
    }
};
exports.RequestContextMiddleware = RequestContextMiddleware;
exports.RequestContextMiddleware = RequestContextMiddleware = RequestContextMiddleware_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [nestjs_cls_1.ClsService])
], RequestContextMiddleware);
//# sourceMappingURL=request-context.middleware.js.map