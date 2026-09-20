"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariantService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const crud_1 = require("./../core/crud");
const mikro_orm_product_variant_repository_1 = require("./repository/mikro-orm-product-variant.repository");
const type_orm_product_variant_repository_1 = require("./repository/type-orm-product-variant.repository");
let ProductVariantService = class ProductVariantService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmProductVariantRepository, mikroOrmProductVariantRepository) {
        super(typeOrmProductVariantRepository, mikroOrmProductVariantRepository);
    }
    async findAllProductVariants() {
        return this.findAll({
            relations: ['settings', 'price', 'image']
        });
    }
    async findAllVariantsByProductId(productId) {
        return this.findAll({
            relations: ['image'],
            where: { productId: productId }
        });
    }
    async findOne(id) {
        return await this.findOneByIdString(id, {
            relations: {
                setting: true,
                price: true,
                image: true
            }
        });
    }
    async createBulk(productVariants) {
        return await this.saveMany(productVariants);
    }
    async createVariant(productVariant) {
        return this.save(productVariant);
    }
    async updateVariant(productVariant) {
        return this.save(productVariant);
    }
    async deleteManyVariants(productVariants) {
        const ids = productVariants.map((v) => v.id).filter((id) => !!id);
        if (ids.length > 0) {
            const entities = await this.find({
                where: {
                    id: (0, typeorm_1.In)(ids)
                },
                relations: {
                    warehouseProductVariants: true
                }
            });
            await this.deleteMany(ids);
            return entities;
        }
        return [];
    }
    async deleteFeaturedImage(id) {
        try {
            const variant = await this.findOneByIdString(id);
            variant.image = null;
            return await this.save(variant);
        }
        catch (err) {
            throw new common_1.BadRequestException(err);
        }
    }
};
exports.ProductVariantService = ProductVariantService;
exports.ProductVariantService = ProductVariantService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_product_variant_repository_1.TypeOrmProductVariantRepository,
        mikro_orm_product_variant_repository_1.MikroOrmProductVariantRepository])
], ProductVariantService);
//# sourceMappingURL=product-variant.service.js.map