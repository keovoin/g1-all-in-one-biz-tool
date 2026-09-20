import { IBasePerTenantEntityModel, ID, ITenant } from '@gauzy/contracts';
export declare class TenantBaseDTO implements IBasePerTenantEntityModel {
    readonly tenant: ITenant;
    readonly tenantId: ID;
}
