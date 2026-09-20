import { FindOptionsWhere, UpdateResult } from 'typeorm';
import { IPagination, IWarehouseProduct, IWarehouseProductCreateInput, IWarehouseProductVariant, IWarehouse, ID } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from './../core/crud';
import { RelationsQueryDTO } from './../shared/dto';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from './warehouse.entity';
import { WarehouseProductService } from './warehouse-product-service';
import { CreateWarehouseDTO, UpdateWarehouseDTO } from './dto';
export declare class WarehouseController extends CrudController<Warehouse> {
    private readonly warehouseService;
    private readonly warehouseProductsService;
    constructor(warehouseService: WarehouseService, warehouseProductsService: WarehouseProductService);
    /**
     * GET all warehouse products
     *
     * @param warehouseId
     * @returns
     */
    findAllWarehouseProducts(warehouseId: ID): Promise<IWarehouseProduct[]>;
    /**
     * CREATE warehouse products
     *
     * @param entity
     * @param warehouseId
     * @returns
     */
    addWarehouseProducts(warehouseId: ID, entity: IWarehouseProductCreateInput[]): Promise<IPagination<IWarehouseProduct>>;
    /**
     * UPDATE warehouse product quantity
     *
     * @param warehouseProductId
     * @param value
     * @returns
     */
    updateWarehouseProductQuantity(warehouseProductId: ID, value: {
        count: number;
    }): Promise<IWarehouseProduct>;
    /**
     * UPDATE warehouse product variant quantity
     *
     * @param warehouseProductVariantId
     * @param value
     * @returns
     */
    updateWarehouseProductVariantQuantity(warehouseProductVariantId: ID, value: {
        count: number;
    }): Promise<IWarehouseProductVariant>;
    /**
     * GET warehouse count
     *
     * @param options
     * @returns
     */
    getCount(options: FindOptionsWhere<Warehouse>): Promise<number>;
    /**
     * GET warehouses by pagination
     *
     * @param params
     * @returns
     */
    pagination(params: BaseQueryDTO<Warehouse>): Promise<IPagination<IWarehouse>>;
    /**
     * GET warehouses
     *
     * @param params
     * @returns
     */
    findAll(params: BaseQueryDTO<Warehouse>): Promise<IPagination<IWarehouse>>;
    /**
     * GET warehouse with relations by id
     *
     * @param id
     * @returns
     */
    findById(id: ID, query: RelationsQueryDTO): Promise<IWarehouse>;
    /**
     * CREATE new warehouse store
     *
     * @param entity
     * @returns
     */
    create(entity: CreateWarehouseDTO): Promise<IWarehouse>;
    /**
     * UPDATE warehouse by id
     *
     * @param id
     * @param entity
     * @returns
     */
    update(id: ID, entity: UpdateWarehouseDTO): Promise<IWarehouse | UpdateResult>;
}
