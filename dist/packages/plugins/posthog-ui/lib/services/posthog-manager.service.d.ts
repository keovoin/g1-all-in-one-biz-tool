import { PostHogService } from './posthog.service';
import { PostHogModuleConfig } from '../interfaces/posthog.interface';
import { PostHog, Properties } from 'posthog-js';
import { Router } from '@angular/router';
import * as i0 from "@angular/core";
/**
 * Service manager that provides a high-level API for application components
 * This should be the primary service used by application code
 */
export declare class PostHogServiceManager {
    private posthogService;
    private router;
    constructor(posthogService: PostHogService, router: Router);
    /**
     * Initialize PostHog with the provided configuration
     * Returns true if initialization was successful
     */
    initialize(config: PostHogModuleConfig): boolean;
    /**
     * Configure PostHog behaviors based on the options provided
     */
    private setupConfigBasedBehaviors;
    /**
     * Track a custom event with the appropriate properties
     */
    trackEvent(eventName: string, properties?: Properties): void;
    /**
     * Track a page view, respecting the configuration settings
     */
    trackPageView(url?: string, properties?: Properties): void;
    /**
     * Identify a user with the given ID and properties
     */
    identifyUser(userId: string, properties?: Properties): void;
    /**
     * Check if a feature flag is enabled
     * @param flagKey The feature flag key
     * @param options Optional settings for the flag check
     * @returns boolean indicating if the flag is enabled
     */
    isFeatureEnabled(flagKey: string, options?: {
        send_event: boolean;
    }): boolean;
    /**
     * Get a feature flag value with proper typing
     * @param flagKey The feature flag key
     * @param defaultValue Default value to return if flag is not found
     * @returns The flag value or defaultValue if not found
     */
    getFeatureFlagValue<T>(flagKey: string, defaultValue: T): T;
    /**
     * Reload feature flags from the server
     */
    reloadFeatureFlags(): void;
    /**
     * Set person properties for the current user
     */
    setUserProperties(properties: Properties): void;
    /**
     * Opt user in to tracking
     */
    optInTracking(): void;
    /**
     * Opt user out of tracking
     */
    optOutTracking(): void;
    /**
     * Reset the current user
     */
    resetUser(): void;
    /**
     * Associate the current user with a group
     */
    setGroup(groupType: string, groupKey: string, groupProperties?: Properties): void;
    /**
     * Track an error with the appropriate context
     */
    trackError(error: Error, properties?: Properties): void;
    /**
     * Get the application version
     */
    private getAppVersion;
    /**
     * Start session recording
     */
    startSessionRecording(): void;
    /**
     * Get the raw PostHog instance for advanced usage
     */
    getPostHogInstance(): PostHog;
    static ɵfac: i0.ɵɵFactoryDeclaration<PostHogServiceManager, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PostHogServiceManager>;
}
