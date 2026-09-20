"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EverAsyncRateLimitGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
/** A bounded, per-process limit before credential lookup, independent of optional global throttling. */
let EverAsyncRateLimitGuard = class EverAsyncRateLimitGuard {
    constructor() {
        this.clients = new Map();
        this.capacity = 5000;
        this.windowMs = 60_000;
        this.limit = this.configuredLimit();
    }
    configuredLimit() {
        const configured = Number(process.env['EVER_ASYNC_CONNECTOR_REQUESTS_PER_MINUTE']);
        return Number.isInteger(configured) && configured > 0 && configured <= 50_000 ? configured : 600;
    }
    canActivate(context) {
        const http = context.switchToHttp();
        const request = http.getRequest();
        const response = http.getResponse();
        // Gauzy trusts all forwarding headers, so only the socket peer is safe before authentication.
        // Requests through the same reverse proxy share this configurable per-process budget.
        const client = request.socket.remoteAddress || 'unknown';
        const now = Date.now();
        let bucket = this.clients.get(client);
        if (!bucket || bucket.resetAt <= now) {
            for (const [key, value] of this.clients) {
                if (value.resetAt <= now)
                    this.clients.delete(key);
            }
            if (this.clients.size >= this.capacity) {
                const oldestClient = this.clients.keys().next().value;
                if (oldestClient !== undefined)
                    this.clients.delete(oldestClient);
            }
            bucket = { resetAt: now + this.windowMs, remaining: this.limit };
            this.clients.set(client, bucket);
        }
        if (bucket.remaining <= 0)
            return this.refuse(response, Math.ceil((bucket.resetAt - now) / 1000));
        bucket.remaining--;
        return true;
    }
    refuse(response, seconds) {
        response.setHeader('Retry-After', Math.max(seconds, 1));
        throw new common_1.HttpException('Too many connector requests. Retry later.', common_1.HttpStatus.TOO_MANY_REQUESTS);
    }
};
exports.EverAsyncRateLimitGuard = EverAsyncRateLimitGuard;
exports.EverAsyncRateLimitGuard = EverAsyncRateLimitGuard = tslib_1.__decorate([
    (0, common_1.Injectable)()
], EverAsyncRateLimitGuard);
//# sourceMappingURL=ever-async-rate-limit.guard.js.map