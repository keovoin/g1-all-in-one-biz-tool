import { IProductVariant, IWarehouseProduct, IWarehouseProductVariant } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class WarehouseProductVariant extends TenantOrganizationBaseEntity implements IWarehouseProductVariant {
    quantity: number;
    /**
     * ProductVariant
     */
    variant: IProductVariant;
    variantId: string;
    /**
     * WarehouseProduct
     */
    warehouseProduct: IWarehouseProduct;
    warehouseProductId: string;
}
