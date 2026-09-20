import { Repository } from 'typeorm';
import { PluginBilling } from '../entities/plugin-billing.entity';
export declare class TypeOrmPluginBillingRepository extends Repository<PluginBilling> {
    readonly repository: Repository<PluginBilling>;
    constructor(repository: Repository<PluginBilling>);
}
