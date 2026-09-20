import { ID, IPagination, IWarehouseProduct, IWarehouseProductCreateInput, IWarehouseProductVariant } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud/tenant-aware-crud.service';
import { WarehouseProduct } from './../core/entities/internal';
import { ProductService } from '../product/product.service';
import { TypeOrmWarehouseProductVariantRepository } from './repository/type-orm-warehouse-product-variant.repository';
import { MikroOrmWarehouseProductRepository } from './repository/mikro-orm-warehouse-product.repository';
import { TypeOrmWarehouseRepository } from './repository/type-orm-warehouse.repository';
import { TypeOrmWarehouseProductRepository } from './repository/type-orm-warehouse-product.repository';
export declare class WarehouseProductService extends TenantAwareCrudService<WarehouseProduct> {
    readonly typeOrmWarehouseProductRepository: TypeOrmWarehouseProductRepository;
    readonly mikroOrmWarehouseProductRepository: MikroOrmWarehouseProductRepository;
    private readonly typeOrmWarehouseRepository;
    private readonly typeOrmWarehouseProductVariantRepository;
    private readonly _productService;
    constructor(typeOrmWarehouseProductRepository: TypeOrmWarehouseProductRepository, mikroOrmWarehouseProductRepository: MikroOrmWarehouseProductRepository, typeOrmWarehouseRepository: TypeOrmWarehouseRepository, typeOrmWarehouseProductVariantRepository: TypeOrmWarehouseProductVariantRepository, _productService: ProductService);
    /**
     * Retrieves all warehouse products for a given warehouse.
     *
     * @param {ID} warehouseId - The ID of the warehouse to fetch products from.
     * @returns {Promise<IWarehouseProduct[]>} - A list of warehouse products.
     */
    getAllWarehouseProducts(warehouseId: ID): Promise<IWarehouseProduct[]>;
    /**
     * Creates multiple warehouse products in bulk.
     *
     * @param {IWarehouseProductCreateInput[]} warehouseProductCreateInput - Array of warehouse product input data.
     * @param {ID} warehouseId - The ID of the warehouse where products will be added.
     * @returns {Promise<IPagination<IWarehouseProduct[]>>} - The created warehouse products with pagination metadata.
     *
     * @throws {NotFoundException} If warehouse or products are not found.
     *
     * @description
     * 1. Fetches the warehouse and related products based on provided input.
     * 2. Creates warehouse products and their variants in bulk.
     * 3. Saves and returns the created records.
     */
    createWarehouseProductBulk(warehouseProductCreateInput: IWarehouseProductCreateInput[], warehouseId: ID): Promise<IPagination<IWarehouseProduct>>;
    /**
     * Updates the quantity of a warehouse product.
     *
     * @param {ID} warehouseProductId - The ID of the warehouse product to update.
     * @param {number} quantity - The new quantity to be set.
     * @returns {Promise<IWarehouseProduct>} - The updated warehouse product.
     *
     * @throws {NotFoundException} If the warehouse product is not found.
     *
     * @description
     * 1. Fetches the warehouse product by its ID.
     * 2. Updates the quantity field.
     * 3. Saves and returns the updated record.
     */
    updateWarehouseProductQuantity(warehouseProductId: ID, quantity: number): Promise<IWarehouseProduct>;
    /**
     * Updates the quantity of a warehouse product variant and synchronizes the total quantity.
     *
     * @param {ID} warehouseProductVariantId - The ID of the warehouse product variant to update.
     * @param {number} quantity - The new quantity to be set.
     * @returns {Promise<IWarehouseProductVariant>} - The updated warehouse product variant.
     *
     * @throws {NotFoundException} If the warehouse product variant or its associated warehouse product is not found.
     *
     * @description
     * 1. Updates the `quantity` of the specified warehouse product variant.
     * 2. Fetches the associated warehouse product and updates its total quantity.
     * 3. Saves the updated records to the database.
     */
    updateWarehouseProductVariantQuantity(warehouseProductVariantId: ID, quantity: number): Promise<IWarehouseProductVariant>;
}
