"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThrottlerBehindProxyGuard = void 0;
const tslib_1 = require("tslib");
const throttler_1 = require("@nestjs/throttler");
const common_1 = require("@nestjs/common");
const config_1 = require("@gauzy/config");
const tracker_1 = require("./tracker");
/**
 * Rate-limit guard for deployments that sit behind a reverse proxy.
 *
 * The bucket key comes from {@link resolveThrottlerTracker}, which only believes
 * `CF-Connecting-IP` when `THROTTLE_TRUST_CF_CONNECTING_IP` (alias `CLOUDFLARE_PROXY_ENABLED`)
 * says the deployment is actually fronted by Cloudflare, and otherwise uses Express's `req.ip` —
 * which honours the configured `TRUST_PROXY` hop count or proxy CIDRs instead of the client-supplied
 * head of the `X-Forwarded-For` chain (GHSA-86mw-2crg-vmhc). That resistance is only as good as the
 * `TRUST_PROXY` setting: `TRUST_PROXY=true` trusts the whole chain and hands the choice of bucket
 * back to the client.
 */
let ThrottlerBehindProxyGuard = class ThrottlerBehindProxyGuard extends throttler_1.ThrottlerGuard {
    async getTracker(req) {
        return (0, tracker_1.resolveThrottlerTracker)(req, {
            trustCloudflareConnectingIp: config_1.environment.THROTTLE_TRUST_CF_CONNECTING_IP === true
        });
    }
};
exports.ThrottlerBehindProxyGuard = ThrottlerBehindProxyGuard;
exports.ThrottlerBehindProxyGuard = ThrottlerBehindProxyGuard = tslib_1.__decorate([
    (0, common_1.Injectable)()
], ThrottlerBehindProxyGuard);
//# sourceMappingURL=throttler-behind-proxy.guard.js.map