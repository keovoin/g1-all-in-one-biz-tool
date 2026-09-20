import { OnModuleDestroy } from '@nestjs/common';
import { PostHog } from 'posthog-node';
import { PosthogModuleOptions } from './posthog.interfaces';
/**
 * Service that provides an interface to the PostHog analytics platform.
 * Supports multi-tenant configuration via tenant settings from RequestContext.
 * Follows the same pattern as S3Provider for reading tenant settings.
 * Implements OnModuleDestroy for proper cleanup when the module is destroyed.
 */
export declare class PosthogService implements OnModuleDestroy {
    private readonly options;
    private readonly logger;
    /** Default client initialized from startup options (env vars) */
    private defaultClient;
    /** Cache of tenant-specific clients, keyed by apiKey */
    private clientCache;
    private static instance;
    /**
     * Creates a new PosthogService instance.
     * Initializes the default client from startup options (environment variables).
     *
     * @param options - Default configuration options for the PostHog client (from env)
     */
    constructor(options: PosthogModuleOptions);
    /**
     * Gets the singleton instance of the PosthogService.
     *
     * @returns The singleton instance of PosthogService
     */
    static PosthogServiceInstance(): PosthogService;
    /**
     * Gets the PostHog client for the current request context.
     * Returns tenant-specific client if tenant has custom settings, otherwise the default client.
     *
     * @returns The PostHog client instance or null if not initialized
     */
    instance(): PostHog | null;
    /**
     * Initializes the default PostHog client with startup configuration (from env).
     */
    private initDefaultClient;
    /**
     * Creates a PostHog client with the given options.
     */
    private createClient;
    /**
     * Gets the current PostHog configuration by merging default options with resolved settings.
     */
    private getCurrentConfig;
    /**
     * Gets or creates a client for the current request based on tenant settings.
     */
    private getClientForCurrentRequest;
    /**
     * Tracks a custom event for a specific user.
     *
     * @param event - The name of the event to track
     * @param distinctId - The unique identifier for the user
     * @param properties - Optional additional properties to associate with the event
     */
    track(event: string, distinctId: string, properties?: Record<string, any>): void;
    /**
     * Captures an exception or error event for a specific user.
     * Uses PostHog's captureException method to track errors.
     *
     * @param exception - The error or exception to capture
     * @param distinctId - The unique identifier for the user
     * @param properties - Optional additional properties describing the error
     */
    captureException(exception: any, distinctId: string, properties?: Record<string, any>): void;
    /**
     * Identifies a user with additional traits or properties.
     *
     * @param distinctId - The unique identifier for the user
     * @param properties - Optional user traits or properties to associate with this user
     */
    identify(distinctId: string, properties?: Record<string, any>): void;
    /**
     * Gracefully shuts down all PostHog clients, ensuring all queued events are sent.
     *
     * @returns Promise that resolves when shutdown is complete
     */
    shutdown(): Promise<void>;
    /**
     * Lifecycle hook called when the NestJS module is being destroyed.
     * Automatically calls the shutdown method to ensure proper cleanup.
     *
     * @returns Promise that resolves when shutdown is complete
     */
    onModuleDestroy(): Promise<void>;
}
