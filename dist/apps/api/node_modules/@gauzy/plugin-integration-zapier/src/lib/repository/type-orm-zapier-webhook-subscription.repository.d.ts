import { Repository } from 'typeorm';
import { ZapierWebhookSubscription } from '../zapier-webhook-subscription.entity';
export declare class TypeOrmZapierWebhookSubscriptionRepository extends Repository<ZapierWebhookSubscription> {
    readonly repository: Repository<ZapierWebhookSubscription>;
    constructor(repository: Repository<ZapierWebhookSubscription>);
}
