"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariantPriceService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const product_variant_price_entity_1 = require("./product-variant-price.entity");
const type_orm_product_variant_price_repository_1 = require("./repository/type-orm-product-variant-price.repository");
const mikro_orm_product_variant_price_repository_1 = require("./repository/mikro-orm-product-variant-price.repository");
let ProductVariantPriceService = class ProductVariantPriceService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmProductVariantPriceRepository, mikroOrmProductVariantPriceRepository) {
        super(typeOrmProductVariantPriceRepository, mikroOrmProductVariantPriceRepository);
    }
    /**
     * Create default product variant price
     *
     * @returns
     */
    async createDefaultProductVariantPrice() {
        const newProductVariantPrice = new product_variant_price_entity_1.ProductVariantPrice();
        return this.save(newProductVariantPrice);
    }
    /**
     * Delete many product variant prices
     *
     * @param productVariantPrices
     * @returns
     */
    async deleteManyPrices(productVariantPrices) {
        const ids = productVariantPrices.map((p) => p.id).filter((id) => !!id);
        if (ids.length > 0) {
            return await super.deleteMany(ids);
        }
        return [];
    }
};
exports.ProductVariantPriceService = ProductVariantPriceService;
exports.ProductVariantPriceService = ProductVariantPriceService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_product_variant_price_repository_1.TypeOrmProductVariantPriceRepository,
        mikro_orm_product_variant_price_repository_1.MikroOrmProductVariantPriceRepository])
], ProductVariantPriceService);
//# sourceMappingURL=product-variant-price.service.js.map