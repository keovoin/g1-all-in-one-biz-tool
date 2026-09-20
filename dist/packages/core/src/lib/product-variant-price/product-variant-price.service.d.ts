import { DeleteResult } from 'typeorm';
import { TenantAwareCrudService } from './../core/crud';
import { ProductVariantPrice } from './product-variant-price.entity';
import { TypeOrmProductVariantPriceRepository } from './repository/type-orm-product-variant-price.repository';
import { MikroOrmProductVariantPriceRepository } from './repository/mikro-orm-product-variant-price.repository';
export declare class ProductVariantPriceService extends TenantAwareCrudService<ProductVariantPrice> {
    constructor(typeOrmProductVariantPriceRepository: TypeOrmProductVariantPriceRepository, mikroOrmProductVariantPriceRepository: MikroOrmProductVariantPriceRepository);
    /**
     * Create default product variant price
     *
     * @returns
     */
    createDefaultProductVariantPrice(): Promise<ProductVariantPrice>;
    /**
     * Delete many product variant prices
     *
     * @param productVariantPrices
     * @returns
     */
    deleteManyPrices(productVariantPrices: ProductVariantPrice[]): Promise<DeleteResult | []>;
}
