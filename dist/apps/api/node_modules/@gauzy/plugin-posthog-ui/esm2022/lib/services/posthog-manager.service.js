import { Injectable } from '@angular/core';
import { PostHogService } from './posthog.service';
import { Router } from '@angular/router';
import * as i0 from "@angular/core";
import * as i1 from "./posthog.service";
import * as i2 from "@angular/router";
/**
 * Service manager that provides a high-level API for application components
 * This should be the primary service used by application code
 */
export class PostHogServiceManager {
    constructor(posthogService, router) {
        this.posthogService = posthogService;
        this.router = router;
    }
    /**
     * Initialize PostHog with the provided configuration
     * Returns true if initialization was successful
     */
    initialize(config) {
        if (this.posthogService.isInitialized()) {
            console.warn('PostHogServiceManager already initialized');
            return false;
        }
        if (!config?.apiKey) {
            console.warn('No PostHog API key provided');
            return false;
        }
        const { apiKey, options = {} } = config;
        // Initialize the base service
        const initialized = this.posthogService.initialize(apiKey, options);
        if (initialized) {
            // Setup route tracking
            this.posthogService.setupRouteTracking(this.router);
            // Configure additional behaviors based on options
            this.setupConfigBasedBehaviors(options);
        }
        return initialized;
    }
    /**
     * Configure PostHog behaviors based on the options provided
     */
    setupConfigBasedBehaviors(options) {
        // Feature flags configuration
        if (options.advanced_disable_feature_flags !== true) {
            // If feature flags aren't disabled, ensure they're loaded
            if (options.advanced_disable_feature_flags_on_first_load !== true) {
                this.reloadFeatureFlags();
            }
        }
        // Session recording configuration
        if (options.disable_session_recording !== true) {
            // If session recording is enabled, start it
            this.startSessionRecording();
        }
        // Handle person properties initialization if provided in bootstrap
        if (options.bootstrap?.distinctID) {
            this.identifyUser(options.bootstrap.distinctID);
        }
        // Set up super properties if needed
        const superProps = {};
        // Add application info if using persistent storage
        if (options.persistence !== 'memory') {
            // Using a persistent method, set up any default properties
            superProps['app_version'] = this.getAppVersion();
            this.posthogService.getInstance().register(superProps);
        }
    }
    /**
     * Track a custom event with the appropriate properties
     */
    trackEvent(eventName, properties = {}) {
        if (!this.posthogService.isInitialized())
            return;
        this.posthogService.captureEvent(eventName, properties);
    }
    /**
     * Track a page view, respecting the configuration settings
     */
    trackPageView(url, properties = {}) {
        if (!this.posthogService.isInitialized())
            return;
        this.posthogService.capturePageview(url, properties);
    }
    /**
     * Identify a user with the given ID and properties
     */
    identifyUser(userId, properties = {}) {
        if (!this.posthogService.isInitialized())
            return;
        this.posthogService.getInstance().identify(userId, properties);
    }
    /**
     * Check if a feature flag is enabled
     * @param flagKey The feature flag key
     * @param options Optional settings for the flag check
     * @returns boolean indicating if the flag is enabled
     */
    isFeatureEnabled(flagKey, options) {
        if (!this.posthogService.isInitialized())
            return false;
        // Get the feature flag value
        const flagValue = this.posthogService.getInstance().isFeatureEnabled(flagKey, options);
        // isFeatureEnabled already returns a boolean
        return flagValue === true;
    }
    /**
     * Get a feature flag value with proper typing
     * @param flagKey The feature flag key
     * @param defaultValue Default value to return if flag is not found
     * @returns The flag value or defaultValue if not found
     */
    getFeatureFlagValue(flagKey, defaultValue) {
        if (!this.posthogService.isInitialized())
            return defaultValue;
        // Get the feature flag value with default fallback
        const flagValue = this.posthogService.getInstance().getFeatureFlag(flagKey);
        // Return the flag value or default if undefined
        return flagValue !== undefined ? flagValue : defaultValue;
    }
    /**
     * Reload feature flags from the server
     */
    reloadFeatureFlags() {
        if (!this.posthogService.isInitialized())
            return;
        this.posthogService.getInstance().reloadFeatureFlags();
    }
    /**
     * Set person properties for the current user
     */
    setUserProperties(properties) {
        if (!this.posthogService.isInitialized())
            return;
        this.posthogService.getInstance().people.set(properties);
    }
    /**
     * Opt user in to tracking
     */
    optInTracking() {
        if (!this.posthogService.isInitialized())
            return;
        this.posthogService.getInstance().opt_in_capturing();
    }
    /**
     * Opt user out of tracking
     */
    optOutTracking() {
        if (!this.posthogService.isInitialized())
            return;
        this.posthogService.getInstance().opt_out_capturing();
    }
    /**
     * Reset the current user
     */
    resetUser() {
        if (!this.posthogService.isInitialized())
            return;
        this.posthogService.getInstance().reset();
    }
    /**
     * Associate the current user with a group
     */
    setGroup(groupType, groupKey, groupProperties = {}) {
        if (!this.posthogService.isInitialized())
            return;
        this.posthogService.getInstance().group(groupType, groupKey, groupProperties);
    }
    /**
     * Track an error with the appropriate context
     */
    trackError(error, properties = {}) {
        if (!this.posthogService.isInitialized())
            return;
        this.posthogService.captureError(error, properties);
    }
    /**
     * Get the application version
     */
    getAppVersion() {
        return '1.0.0'; // Replace with actual version logic
    }
    /**
     * Start session recording
     */
    startSessionRecording() {
        if (!this.posthogService.isInitialized())
            return;
        this.posthogService.getInstance().startSessionRecording();
    }
    /**
     * Get the raw PostHog instance for advanced usage
     */
    getPostHogInstance() {
        return this.posthogService.getInstance();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PostHogServiceManager, deps: [{ token: i1.PostHogService }, { token: i2.Router }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PostHogServiceManager, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PostHogServiceManager, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.PostHogService }, { type: i2.Router }] });
//# sourceMappingURL=posthog-manager.service.js.map