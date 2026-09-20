import { Repository } from 'typeorm';
import { EntitySubscription } from '../entity-subscription.entity';
export declare class TypeOrmEntitySubscriptionRepository extends Repository<EntitySubscription> {
    readonly repository: Repository<EntitySubscription>;
    constructor(repository: Repository<EntitySubscription>);
}
