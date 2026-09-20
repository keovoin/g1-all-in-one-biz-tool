"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSsrfSafeHttpsAgent = void 0;
exports.assertSafeMakeWebhookUrl = assertSafeMakeWebhookUrl;
const common_1 = require("@nestjs/common");
const utils_1 = require("@gauzy/utils");
const core_1 = require("@gauzy/core");
Object.defineProperty(exports, "createSsrfSafeHttpsAgent", { enumerable: true, get: function () { return core_1.createSsrfSafeHttpsAgent; } });
/**
 * Validates a tenant-supplied Make.com webhook URL against the SSRF egress guard.
 *
 * Throws a {@link BadRequestException} if the URL targets a loopback / private / link-local host
 * (incl. the cloud-metadata IP `169.254.169.254`), uses a non-HTTPS scheme, contains embedded
 * credentials, or is otherwise malformed. Applied both when the URL is stored and again before each
 * outbound request, so values stored before this guard existed are also rejected
 * (GHSA-534m-c6mh-mp98).
 *
 * @param url - The webhook URL to validate.
 */
function assertSafeMakeWebhookUrl(url) {
    const reason = (0, utils_1.getUnsafeOutboundUrlReason)(url);
    if (reason) {
        throw new common_1.BadRequestException(`Invalid webhook URL: ${reason}`);
    }
}
//# sourceMappingURL=webhook-url.validator.js.map