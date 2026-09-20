"use strict";
var JitsuAnalyticsService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JitsuAnalyticsService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const js_1 = require("@jitsu/js");
const core_1 = require("@gauzy/core");
const jitsu_types_1 = require("./jitsu.types");
const jitsu_helper_1 = require("./jitsu-helper");
let JitsuAnalyticsService = JitsuAnalyticsService_1 = class JitsuAnalyticsService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(JitsuAnalyticsService_1.name);
        this.clientCache = new Map();
        try {
            // Check if the required host and writeKey configuration properties are present
            if (this.config.host && this.config.writeKey) {
                // Initialize the Jitsu Analytics instance
                this.jitsu = (0, jitsu_helper_1.createJitsu)(this.config);
            }
            else {
                this.logger.warn(`Jitsu Analytics initialization failed at JitsuAnalyticsService: Missing host or writeKey.`);
            }
        }
        catch (error) {
            this.logger.error(`Jitsu Analytics initialization failed: ${error.message}`);
        }
    }
    /**
     * Get Jitsu client for current request based on resolvedSettings.
     */
    getClient() {
        let host = this.config.host;
        let writeKey = this.config.writeKey;
        let debug = this.config.debug;
        try {
            const settings = core_1.RequestContext.currentRequest()?.['resolvedSettings'];
            if (settings) {
                // Check if disabled
                if (settings.jitsuEnabled !== undefined) {
                    const enabled = settings.jitsuEnabled === 'true' || settings.jitsuEnabled === true;
                    if (!enabled)
                        return null;
                }
                // Override with tenant settings
                if (settings.jitsuHost)
                    host = settings.jitsuHost;
                if (settings.jitsuWriteKey)
                    writeKey = settings.jitsuWriteKey;
                if (settings.jitsuDebug !== undefined) {
                    debug = settings.jitsuDebug === 'true' || settings.jitsuDebug === true;
                }
            }
        }
        catch {
            // No request context, use defaults
        }
        // Check if this.jitsu is defined and both host and writeKey are defined
        if (!host || !writeKey)
            return null;
        // Return default client if config unchanged (including debug)
        if (host === this.config.host && writeKey === this.config.writeKey && debug === this.config.debug) {
            return this.jitsu;
        }
        // Get or create cached client for tenant config (include debug in cache key)
        const cacheKey = `${host}:${writeKey}:${debug}`;
        let client = this.clientCache.get(cacheKey);
        if (!client) {
            client = (0, jitsu_helper_1.createJitsu)({ ...this.config, host, writeKey, debug });
            this.clientCache.set(cacheKey, client);
        }
        return client;
    }
    /**
     * Track an analytics event using Jitsu Analytics.
     * @param event The name of the event to track.
     * @param properties Additional event properties (optional).
     * @returns A promise that resolves when the event is tracked.
     */
    async trackEvent(event, properties) {
        return this.getClient()?.track(event, properties) ?? null;
    }
    /**
     * Identify a user with optional user traits.
     * @param id The user identifier, such as a user ID or an object representing user information.
     * @param traits User traits or properties to associate with the user.
     * @returns A Promise that resolves when the user is identified.
     */
    async identify(id, traits) {
        return this.getClient()?.identify(id, traits) ?? null;
    }
    /**
     * Group users into a specific segment or organization.
     * @param id The identifier for the group, such as a group ID or an object representing group information.
     * @param traits Additional data or traits associated with the group.
     * @returns A Promise that resolves when the users are grouped.
     */
    async group(id, traits) {
        return this.getClient()?.group(id, traits) ?? null;
    }
};
exports.JitsuAnalyticsService = JitsuAnalyticsService;
exports.JitsuAnalyticsService = JitsuAnalyticsService = JitsuAnalyticsService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(jitsu_types_1.JITSU_MODULE_PROVIDER_CONFIG)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof js_1.JitsuOptions !== "undefined" && js_1.JitsuOptions) === "function" ? _a : Object])
], JitsuAnalyticsService);
//# sourceMappingURL=jitsu-analytics.service.js.map