import { IContact, IImageAsset, IMerchant, ITag, IWarehouse, IWarehouseProduct } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class Warehouse extends TenantOrganizationBaseEntity implements IWarehouse {
    name: string;
    code: string;
    email: string;
    description: string;
    active: boolean;
    /**
     * ImageAsset
     */
    logo?: IImageAsset;
    logoId?: string;
    /**
     * Contact
     */
    contact?: IContact;
    contactId?: IContact['id'];
    /**
     * WarehouseProduct
     */
    products?: IWarehouseProduct[];
    /**
     * Warehouse Tags
     */
    tags?: ITag[];
    /**
     * Merchants
     */
    merchants?: IMerchant[];
}
