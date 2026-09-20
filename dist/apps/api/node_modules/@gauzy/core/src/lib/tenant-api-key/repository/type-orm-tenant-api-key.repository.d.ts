import { Repository } from 'typeorm';
import { TenantApiKey } from '../tenant-api-key.entity';
export declare class TypeOrmTenantApiKeyRepository extends Repository<TenantApiKey> {
    readonly repository: Repository<TenantApiKey>;
    constructor(repository: Repository<TenantApiKey>);
}
