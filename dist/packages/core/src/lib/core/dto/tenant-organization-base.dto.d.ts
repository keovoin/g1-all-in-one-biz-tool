import { IOrganization, IBasePerTenantAndOrganizationEntityModel, ID } from '@gauzy/contracts';
import { TenantBaseDTO } from './tenant-base.dto';
export declare class TenantOrganizationBaseDTO extends TenantBaseDTO implements IBasePerTenantAndOrganizationEntityModel {
    readonly organization: IOrganization;
    readonly organizationId: ID;
    readonly sentTo?: ID;
}
