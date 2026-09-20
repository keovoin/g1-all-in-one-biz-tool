import { ID, IWarehouse } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud';
import { MikroOrmWarehouseRepository } from './repository/mikro-orm-warehouse.repository';
import { TypeOrmWarehouseRepository } from './repository/type-orm-warehouse.repository';
import { Warehouse } from './warehouse.entity';
export declare class WarehouseService extends TenantAwareCrudService<Warehouse> {
    readonly typeOrmWarehouseRepository: TypeOrmWarehouseRepository;
    readonly mikroOrmWarehouseRepository: MikroOrmWarehouseRepository;
    constructor(typeOrmWarehouseRepository: TypeOrmWarehouseRepository, mikroOrmWarehouseRepository: MikroOrmWarehouseRepository);
    /**
     * Finds a warehouse by its unique identifier.
     *
     * @param {ID} id - The unique identifier of the warehouse.
     * @param {string[]} [relations=[]] - Optional array of related entities to be included in the query.
     * @returns {Promise<IWarehouse>} - A promise resolving to the warehouse entity if found.
     *
     * @description
     * This method retrieves a warehouse entity by its ID, optionally loading related entities.
     * It uses the `findOneByIdString` method from the parent repository/service.
     *
     * @example
     * ```ts
     * const warehouse = await warehouseService.findById('123e4567-e89b-12d3-a456-426614174000', ['products', 'employees']);
     * console.log(warehouse);
     * ```
     */
    findById(id: ID, relations?: string[]): Promise<IWarehouse>;
}
