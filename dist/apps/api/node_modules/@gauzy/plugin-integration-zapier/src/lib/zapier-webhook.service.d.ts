import { HttpService } from '@nestjs/axios';
import { ID } from '@gauzy/contracts';
import { ZapierWebhookSubscription } from './zapier-webhook-subscription.entity';
import { TypeOrmZapierWebhookSubscriptionRepository } from './repository/type-orm-zapier-webhook-subscription.repository';
import { ITimerZapierWebhookData } from './zapier.types';
export declare class ZapierWebhookService {
    private readonly zapierWebhookSubscriptionRepository;
    private readonly _httpService;
    private readonly logger;
    /**
     * Shared agent that re-checks the resolved IP of every outbound webhook connection.
     * Created once because each instance keeps its own connection pool.
     */
    private readonly ssrfSafeHttpsAgent;
    /**
     * Dedup key -> the time it expires from this cache. See `WEBHOOK_DELIVERY_DEDUP_WINDOW_MS`.
     * Insertion order is expiry order (see `markDelivered`), capped at `WEBHOOK_DELIVERY_DEDUP_MAX_ENTRIES`.
     */
    private readonly recentlyDelivered;
    /**
     * Delivery keys currently mid-flight (reserved, not yet confirmed) — closes the concurrent-
     * duplicate window `recentlyDelivered` alone cannot: two redeliveries arriving close enough
     * together that neither has reached `markDelivered()` yet would otherwise both pass
     * `hasRecentlyDelivered()` and both send. Each key maps to a promise that settles once that
     * attempt's outcome is recorded, so a concurrent duplicate waits on it instead of being dropped
     * and can still deliver if the reserved attempt fails.
     */
    private readonly inFlight;
    constructor(zapierWebhookSubscriptionRepository: TypeOrmZapierWebhookSubscriptionRepository, _httpService: HttpService);
    /**
     * Creates a new Zapier webhook subscription if it doesn't already exist.
     *
     * @param input - The subscription details including targetUrl, event, integrationId, tenantId, and organizationId.
     * @returns The existing or newly created ZapierWebhookSubscription.
     * @throws InternalServerErrorException if the operation fails.
     */
    createSubscription(input: {
        targetUrl: string;
        event: string;
        integrationId?: ID;
        tenantId?: ID;
        organizationId?: ID;
    }): Promise<ZapierWebhookSubscription>;
    /**
     * Deletes a Zapier webhook subscription after verifying tenant ownership.
     *
     * @param id - The unique identifier of the subscription to delete.
     * @param tenantId - The tenant ID to verify ownership of the subscription.
     */
    deleteSubscription(id: ID, tenantId: ID): Promise<void>;
    /**
     * Broadcasts timer status change events to all registered webhook subscribers.
     *
     * Retrieves subscriptions for the `timer.status.changed` event matching the provided
     * tenant and organization IDs, then concurrently posts the event payload to each
     * subscriber’s callback URL. Individual delivery failures are logged but do not
     * interrupt other notifications.
     *
     * @param timerData - The payload containing timer details, including `tenantId`, `organizationId`, and other relevant fields.
     */
    notifyTimerStatusChanged(timerData: ITimerZapierWebhookData): Promise<void>;
    /**
     * Identifies one logical webhook delivery: this subscriber, this action, this source timeLog.
     * `null` when the event carries no timeLog id — every such event would otherwise share one key
     * per subscriber and action, and a genuinely different event would be suppressed for the window.
     */
    private deliveryDedupKey;
    private hasRecentlyDelivered;
    private markDelivered;
    private pruneExpiredDeliveries;
}
