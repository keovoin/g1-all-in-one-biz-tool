import { Router } from '@angular/router';
import posthog, { PostHogConfig, Properties } from 'posthog-js';
import * as i0 from "@angular/core";
/**
 * Complete PostHog service for Angular applications
 * Provides integration with all PostHog features including:
 * - Event tracking
 * - User identification
 * - Feature flags
 * - Session recording
 * - Heat maps
 * - Group analytics
 * - Funnel analysis
 * - Error monitoring
 * - Page views
 */
export declare class PostHogService {
    private router;
    private platformId;
    private initialized;
    private config;
    constructor(router: Router, platformId: object);
    /**
     * Initializes PostHog with API key and configuration options
     * @param apiKey - Your PostHog API key
     * @param config - Configuration options for PostHog
     */
    initialize(apiKey: string, config?: Partial<PostHogConfig>): boolean;
    /**
     * Returns whether PostHog has been initialized
     */
    isInitialized(): boolean;
    /**
     * Sets up automatic tracking of page views when navigation completes
     * Includes route information and timing metrics
     */
    /**
     * Sets up automatic tracking of route changes
     */
    setupRouteTracking(router?: Router): void;
    /**
     * Sets up global error tracking to capture frontend exceptions
     */
    private setupErrorTracking;
    /**
     * Captures a page view event
     * @param url - Optional URL override, defaults to current page URL
     * @param properties - Additional properties to include with the event
     */
    capturePageview(url?: string, properties?: Properties): void;
    /**
     * Captures a custom event using PostHog.
     * @param eventName - Name of the event to capture
     * @param properties - Properties to include with the event
     * @param sendInstantly - Optional flag to send the event instantly
     */
    captureEvent(eventName: string, properties?: Properties, sendInstantly?: boolean): void;
    /**
     * Captures an error or exception
     * @param error - Error object or error message
     * @param properties - Additional properties about the error context
     */
    captureError(error: Error | string, properties?: Properties): void;
    /**
     * Identifies a user with optional properties
     * @param distinctId - Unique identifier for the user
     * @param userProperties - Additional user properties
     * @param callback - Optional callback function
     */
    identify(distinctId: string, userProperties?: Properties, callback?: () => void): void;
    /**
     * Creates an alias for a user
     * @param alias - The new ID to be linked to the user's existing ID
     * @param distinctId - Original distinct ID (optional)
     * @param callback - Optional callback function
     */
    alias(alias: string, distinctId?: string, callback?: () => void): void;
    /**
     * Associates the current user with a group
     * @param groupType - Type of group (e.g., 'company', 'team')
     * @param groupKey - Unique identifier for the group
     * @param groupProperties - Properties to set for this group
     */
    group(groupType: string, groupKey: string, groupProperties?: Properties): void;
    /**
     * Resets the current user, clearing the distinctId and associated data
     */
    reset(): void;
    /**
     * Checks if a feature flag is enabled for the current user
     * @param key - Feature flag key
     * @param options - Additional options for the feature flag check
     */
    isFeatureEnabled(key: string, options: {
        send_event: boolean;
    }): boolean | undefined;
    /**
     * Gets the value of a feature flag for the current user
     * @param key - Feature flag key
     * @param defaultValue - Default value if flag is not found
     * @returns The feature flag value
     */
    getFeatureFlag(key: string, defaultValue?: any): any;
    /**
     * Sets a local override for a feature flag (useful for testing)
     * @param key - Feature flag key
     * @param value - Value to override with
     */
    setFeatureFlagOverride(key: string, value: any): void;
    /**
     * Reloads all feature flags from the server
     */
    reloadFeatureFlags(): void;
    /**
     * Retrieves the values of specific feature flags for the current user.
     * Since PostHog's JavaScript SDK does not support fetching all flags at once,
     * you must provide a list of known feature flag keys.
     *
     * @param keys - Array of feature flag keys to check
     * @returns An object with keys and their corresponding values
     */
    getFeatureFlags(keys: string[]): Record<string, boolean | string | undefined>;
    /**
     * Manually starts session recording
     */
    startSessionRecording(): void;
    /**
     * Manually stops session recording
     */
    stopSessionRecording(): void;
    /**
     * Register properties that will be sent with every event
     * @param properties - Super properties to register
     * @param days - How many days to keep the properties for (optional)
     */
    register(properties: Properties, days?: number): void;
    /**
     * Register properties that will be sent with every event (only if not set before)
     * @param properties - Super properties to register once
     * @param defaultValue - Default value if property isn't already set
     * @param days - How many days to keep the properties for (optional)
     */
    registerOnce(properties: Properties, defaultValue?: any, days?: number): void;
    /**
     * Unregister a super property
     * @param propertyName - Name of property to unregister
     */
    unregister(propertyName: string): void;
    /**
     * Get the current user's distinct ID
     * @returns The current distinct ID
     */
    getDistinctId(): string;
    /**
     * Opt the user out of tracking
     */
    optOut(): void;
    /**
     * Opt the user into tracking
     */
    optIn(): void;
    /**
     * Check if the user is opted out of tracking
     * @returns Whether the user is opted out
     */
    isOptedOut(): boolean;
    /**
     * Set person properties
     * @param properties - Properties to set for the person or property name
     * @param value - Value if using property name in first param
     * @param callback - Optional callback function
     */
    setPersonProperties(properties: Properties | string, value?: string, callback?: () => void): void;
    /**
     * Set once person properties (only if they are not set)
     * @param properties - Properties to set once for the person or property name
     * @param value - Value if using property name in first param
     * @param callback - Optional callback function
     */
    setPersonPropertiesOnce(properties: Properties | string, value?: string, callback?: () => void): void;
    /**
     * Set person properties for feature flags computation
     * @param properties - Properties to set for feature flags
     */
    setPersonPropertiesForFlags(properties: Properties): void;
    /**
     * Set group properties for feature flags computation
     * @param groupTypeToPropertiesMap - Object containing group types mapped to their properties
     * @param reloadFeatureFlags - Whether to reload feature flags after setting properties
     */
    setGroupPropertiesForFlags(groupTypeToPropertiesMap: {
        [type: string]: Properties;
    }, reloadFeatureFlags?: boolean): void;
    /**
     * Capture a dead click event
     * @param element - DOM element that was clicked
     * @param properties - Additional properties
     */
    captureDeadClick(element: Element, properties?: Properties): void;
    /**
     * Gets the raw PostHog instance for advanced usage
     * @returns The PostHog instance
     */
    getInstance(): typeof posthog;
    static ɵfac: i0.ɵɵFactoryDeclaration<PostHogService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PostHogService>;
}
