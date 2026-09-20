import { IBasePerTenantEntityModel, ID, ITenant } from '@gauzy/contracts';
import { BaseEntity } from '../entities/internal';
export declare abstract class TenantBaseEntity extends BaseEntity implements IBasePerTenantEntityModel {
    tenant?: ITenant;
    tenantId?: ID;
}
