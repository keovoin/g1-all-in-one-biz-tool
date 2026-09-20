import { HttpClient } from '@angular/common/http';
import { IWarehouse, IWarehouseProductCreateInput, IWarehouseProduct, IWarehouseProductVariant, IPagination, IWarehouseFindInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class WarehouseService {
    private readonly http;
    WAREHOUSES_URL: string;
    constructor(http: HttpClient);
    create(warehouse: IWarehouse): Promise<IWarehouse>;
    getAll(where: IWarehouseFindInput): Promise<IPagination<IWarehouse>>;
    update(id: IWarehouse['id'], warehouse: IWarehouse): Promise<IWarehouse>;
    getById(id: IWarehouse['id'], relations?: string[]): Promise<IWarehouse>;
    deleteFeaturedImage(id: IWarehouse['id']): Promise<{
        raw: any;
        affected: number;
    }>;
    addWarehouseProducts(warehouseProductCreateInput: IWarehouseProductCreateInput[], warehouseId: IWarehouse['id']): Promise<IWarehouseProduct[]>;
    getWarehouseProducts(warehouseId: IWarehouse['id']): Promise<IWarehouseProduct[]>;
    updateWarehouseProductCount(warehouseProductId: IWarehouseProduct['id'], count: number): Promise<IWarehouseProduct>;
    updateWarehouseProductVariantCount(warehouseProductVariantId: IWarehouseProductVariant['id'], count: number): Promise<IWarehouseProductVariant>;
    static ɵfac: i0.ɵɵFactoryDeclaration<WarehouseService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<WarehouseService>;
}
