import { Repository } from 'typeorm';
import { PluginSubscription } from '../entities/plugin-subscription.entity';
export declare class TypeOrmPluginSubscriptionRepository extends Repository<PluginSubscription> {
    readonly repository: Repository<PluginSubscription>;
    constructor(repository: Repository<PluginSubscription>);
}
