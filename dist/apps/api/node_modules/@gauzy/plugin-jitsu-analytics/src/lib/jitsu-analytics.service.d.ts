import { JitsuOptions } from '@jitsu/js';
export declare class JitsuAnalyticsService {
    private readonly config;
    private readonly logger;
    private readonly jitsu;
    private readonly clientCache;
    constructor(config: JitsuOptions);
    /**
     * Get Jitsu client for current request based on resolvedSettings.
     */
    private getClient;
    /**
     * Track an analytics event using Jitsu Analytics.
     * @param event The name of the event to track.
     * @param properties Additional event properties (optional).
     * @returns A promise that resolves when the event is tracked.
     */
    trackEvent(event: string, properties?: Record<string, any> | null): Promise<any>;
    /**
     * Identify a user with optional user traits.
     * @param id The user identifier, such as a user ID or an object representing user information.
     * @param traits User traits or properties to associate with the user.
     * @returns A Promise that resolves when the user is identified.
     */
    identify(id: string | object, traits?: Record<string, any> | null): Promise<any>;
    /**
     * Group users into a specific segment or organization.
     * @param id The identifier for the group, such as a group ID or an object representing group information.
     * @param traits Additional data or traits associated with the group.
     * @returns A Promise that resolves when the users are grouped.
     */
    group(id: string | object, traits?: Record<string, any> | null): Promise<any>;
}
