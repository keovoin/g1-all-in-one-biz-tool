"use strict";
var PosthogService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PosthogService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const posthog_node_1 = require("posthog-node");
const core_1 = require("@gauzy/core");
const posthog_constants_1 = require("./posthog.constants");
/**
 * Service that provides an interface to the PostHog analytics platform.
 * Supports multi-tenant configuration via tenant settings from RequestContext.
 * Follows the same pattern as S3Provider for reading tenant settings.
 * Implements OnModuleDestroy for proper cleanup when the module is destroyed.
 */
let PosthogService = PosthogService_1 = class PosthogService {
    /**
     * Creates a new PosthogService instance.
     * Initializes the default client from startup options (environment variables).
     *
     * @param options - Default configuration options for the PostHog client (from env)
     */
    constructor(options) {
        this.options = options;
        this.logger = new common_1.Logger(PosthogService_1.name);
        /** Default client initialized from startup options (env vars) */
        this.defaultClient = null;
        /** Cache of tenant-specific clients, keyed by apiKey */
        this.clientCache = new Map();
        if (!PosthogService_1.instance) {
            PosthogService_1.instance = this;
            this.initDefaultClient();
        }
    }
    /**
     * Gets the singleton instance of the PosthogService.
     *
     * @returns The singleton instance of PosthogService
     */
    static PosthogServiceInstance() {
        if (!PosthogService_1.instance) {
            throw new Error('PosthogService instance not initialized');
        }
        return PosthogService_1.instance;
    }
    /**
     * Gets the PostHog client for the current request context.
     * Returns tenant-specific client if tenant has custom settings, otherwise the default client.
     *
     * @returns The PostHog client instance or null if not initialized
     */
    instance() {
        return this.getClientForCurrentRequest();
    }
    /**
     * Initializes the default PostHog client with startup configuration (from env).
     */
    initDefaultClient() {
        if (!this.options.apiKey) {
            this.logger.warn('PostHog API key is missing. Analytics will be disabled by default.');
            return;
        }
        this.defaultClient = this.createClient(this.options);
        this.logger.log('PostHog default client initialized');
    }
    /**
     * Creates a PostHog client with the given options.
     */
    createClient(options) {
        return new posthog_node_1.PostHog(options.apiKey, {
            host: options.apiHost || 'https://app.posthog.com',
            enableExceptionAutocapture: options.enableErrorTracking,
            flushAt: options.flushAt || 20,
            flushInterval: options.flushInterval || 10000,
            personalApiKey: options.personalApiKey
        });
    }
    /**
     * Gets the current PostHog configuration by merging default options with resolved settings.
     */
    getCurrentConfig() {
        let config = { ...this.options };
        try {
            const request = core_1.RequestContext.currentRequest();
            if (request) {
                const settings = request['resolvedSettings'];
                if (settings) {
                    if (settings.posthogKey) {
                        config = { ...config, apiKey: settings.posthogKey };
                    }
                    if (settings.posthogHost) {
                        config = { ...config, apiHost: settings.posthogHost };
                    }
                    if (settings.posthogEnabled !== undefined) {
                        const enabled = settings.posthogEnabled === 'true' || settings.posthogEnabled === true;
                        if (!enabled) {
                            config = { ...config, apiKey: '' };
                        }
                    }
                    if (settings.posthogFlushInterval) {
                        const interval = parseInt(settings.posthogFlushInterval, 10);
                        if (!isNaN(interval)) {
                            config = { ...config, flushInterval: interval };
                        }
                    }
                    if (settings.posthogFlushAt) {
                        const flushAt = parseInt(settings.posthogFlushAt, 10);
                        if (!isNaN(flushAt)) {
                            config = { ...config, flushAt };
                        }
                    }
                    if (settings.posthogEnableErrorTracking !== undefined) {
                        config = { ...config, enableErrorTracking: settings.posthogEnableErrorTracking === 'true' };
                    }
                }
            }
        }
        catch (error) {
            this.logger.debug('Error reading tenant settings, using default config');
        }
        return config;
    }
    /**
     * Gets or creates a client for the current request based on tenant settings.
     */
    getClientForCurrentRequest() {
        const config = this.getCurrentConfig();
        if (!config.apiKey) {
            return null;
        }
        // Generate cache key from all config properties that affect client behavior
        const cacheKey = `${config.apiKey}:${config.apiHost}:${config.flushInterval}:${config.flushAt}:${config.enableErrorTracking}`;
        const defaultCacheKey = `${this.options.apiKey}:${this.options.apiHost}:${this.options.flushInterval}:${this.options.flushAt}:${this.options.enableErrorTracking}`;
        // Return default client if config unchanged
        if (cacheKey === defaultCacheKey) {
            return this.defaultClient;
        }
        if (this.clientCache.has(cacheKey)) {
            return this.clientCache.get(cacheKey);
        }
        const client = this.createClient(config);
        this.clientCache.set(cacheKey, client);
        return client;
    }
    /**
     * Tracks a custom event for a specific user.
     *
     * @param event - The name of the event to track
     * @param distinctId - The unique identifier for the user
     * @param properties - Optional additional properties to associate with the event
     */
    track(event, distinctId, properties) {
        const client = this.getClientForCurrentRequest();
        if (!client)
            return;
        client.capture({
            event,
            distinctId,
            properties
        });
    }
    /**
     * Captures an exception or error event for a specific user.
     * Uses PostHog's captureException method to track errors.
     *
     * @param exception - The error or exception to capture
     * @param distinctId - The unique identifier for the user
     * @param properties - Optional additional properties describing the error
     */
    captureException(exception, distinctId, properties) {
        const client = this.getClientForCurrentRequest();
        if (!client)
            return;
        client.captureException({
            exception,
            distinctId,
            properties
        });
    }
    /**
     * Identifies a user with additional traits or properties.
     *
     * @param distinctId - The unique identifier for the user
     * @param properties - Optional user traits or properties to associate with this user
     */
    identify(distinctId, properties) {
        const client = this.getClientForCurrentRequest();
        if (!client)
            return;
        client.identify({
            distinctId,
            properties
        });
    }
    /**
     * Gracefully shuts down all PostHog clients, ensuring all queued events are sent.
     *
     * @returns Promise that resolves when shutdown is complete
     */
    async shutdown() {
        // Shutdown default client
        if (this.defaultClient) {
            await this.defaultClient.shutdown();
        }
        // Shutdown all cached tenant clients
        for (const client of this.clientCache.values()) {
            await client.shutdown();
        }
        this.clientCache.clear();
        this.logger.log('PostHog clients shutdown complete');
    }
    /**
     * Lifecycle hook called when the NestJS module is being destroyed.
     * Automatically calls the shutdown method to ensure proper cleanup.
     *
     * @returns Promise that resolves when shutdown is complete
     */
    async onModuleDestroy() {
        await this.shutdown();
    }
};
exports.PosthogService = PosthogService;
exports.PosthogService = PosthogService = PosthogService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(posthog_constants_1.POSTHOG_MODULE_OPTIONS)),
    tslib_1.__metadata("design:paramtypes", [Object])
], PosthogService);
//# sourceMappingURL=posthog.service.js.map