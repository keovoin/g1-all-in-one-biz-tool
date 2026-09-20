import { BaseEntityEventSubscriber } from '@gauzy/core';
export declare class JitsuEventsSubscriber extends BaseEntityEventSubscriber {
    private readonly logger;
    private readonly jitsuAnalytics;
    private logEnabled;
    constructor();
    /**
     * This method is called after an entity has been created and inserted into the database.
     * It can be used to perform additional operations or processing on the newly persisted entity.
     *
     * @param entity The entity that has just been created and inserted.
     * @param em An optional entity manager which can be either from TypeORM or MikroORM, used for additional database operations if necessary.
     * @returns {Promise<void>} A promise that resolves when the post-creation processing is complete.
     */
    afterEntityCreate(entity: any): Promise<void>;
    /**
     * This method is called after an entity has been updated in the database.
     * It can be used to perform additional operations or processing on the entity following its update.
     *
     * @param entity The entity that has just been updated.
     * @returns {Promise<void>} A promise that resolves when the post-update processing is complete.
     */
    afterEntityUpdate(entity: any): Promise<void>;
    /**
     * Called after an entity is deleted from the database. This method logs the deletion and
     * tracks it with Jitsu Analytics.
     *
     * @param entity The entity that has just been deleted.
     * @param em An optional entity manager for any additional database operations, if needed.
     * @returns {Promise<void>} A promise that resolves when the post-deletion processing is complete.
     */
    afterEntityDelete(entity: any): Promise<void>;
    /**
     * Track an analytics event using Jitsu Analytics.
     *
     * @param event The name of the event to track.
     * @param properties Optional properties to include with the event tracking.
     * @returns {Promise<void>} A promise that resolves when the tracking is complete.
     */
    analyticsTrack(event: string, properties?: Record<string, any> | null): Promise<void>;
    /**
     * Track an event with optional properties.
     * @param event The name of the event to track.
     * @param properties Additional data or properties associated with the event.
     * @returns A Promise that resolves when the event is tracked.
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
