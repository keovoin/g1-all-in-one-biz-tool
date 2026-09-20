import { IOrganization, IBasePerTenantAndOrganizationEntityModel, ID } from '@gauzy/contracts';
import { TenantBaseEntity } from '../entities/internal';
export declare abstract class TenantOrganizationBaseEntity extends TenantBaseEntity implements IBasePerTenantAndOrganizationEntityModel {
    organization?: IOrganization;
    organizationId?: ID;
}
