import { DataSource, EntitySubscriberInterface } from 'typeorm';
import { PluginSubscription } from '../../domain/entities/plugin-subscription.entity';
export declare class PluginSubscriptionSubscriber implements EntitySubscriberInterface<PluginSubscription> {
    readonly dataSource: DataSource;
    private readonly logger;
    constructor(dataSource: DataSource);
    /**
     * Indicates that this subscriber only listens to PluginSubscription events
     */
    listenTo(): typeof PluginSubscription;
    /**
     * Called after entity is loaded from the database
     * Computes dynamic properties and validates subscription state
     */
    afterLoad(entity: PluginSubscription): Promise<void>;
    /**
     * Updates subscription status to EXPIRED if end date has passed
     * This ensures status is accurate when entity is loaded
     */
    private updateStatusIfExpired;
    /**
     * Logs subscription state information for monitoring and debugging
     */
    private logSubscriptionState;
}
