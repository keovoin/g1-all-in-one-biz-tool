import { Repository } from 'typeorm';
import { PluginTenant } from '../../entities/plugin-tenant.entity';
export declare class TypeOrmPluginTenantRepository extends Repository<PluginTenant> {
    readonly repository: Repository<PluginTenant>;
    constructor(repository: Repository<PluginTenant>);
}
