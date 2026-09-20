"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PosthogRequestMiddleware = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const posthog_service_1 = require("./posthog.service");
let PosthogRequestMiddleware = class PosthogRequestMiddleware {
    constructor(posthog) {
        this.posthog = posthog;
    }
    /**
     * Intercepts incoming requests to capture basic request information
     * Identifies the user/device and sets initial event properties
     * @param req - Incoming HTTP request
     * @param res - HTTP response
     * @param next - Next middleware function
     */
    use(req, res, next) {
        // Capture essential request properties as user identification
        try {
            this.posthog.identify(req.ip || 'anonymous', {
                $current_url: req.originalUrl,
                $referrer: req.get('referer'),
                $user_agent: req.get('user-agent'),
                $host: req.get('host'),
                $pathname: req.path,
                ip: req.ip,
                http_method: req.method
            });
        }
        catch (error) {
            console.debug('PostHog analytics error:', error);
        }
        next();
    }
};
exports.PosthogRequestMiddleware = PosthogRequestMiddleware;
exports.PosthogRequestMiddleware = PosthogRequestMiddleware = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [posthog_service_1.PosthogService])
], PosthogRequestMiddleware);
//# sourceMappingURL=posthog-request.middleware.js.map