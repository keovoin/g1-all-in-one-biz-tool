import { Repository } from 'typeorm';
import { PluginSubscriptionPlan } from '../entities/plugin-subscription-plan.entity';
export declare class TypeOrmPluginSubscriptionPlanRepository extends Repository<PluginSubscriptionPlan> {
    readonly repository: Repository<PluginSubscriptionPlan>;
    constructor(repository: Repository<PluginSubscriptionPlan>);
}
