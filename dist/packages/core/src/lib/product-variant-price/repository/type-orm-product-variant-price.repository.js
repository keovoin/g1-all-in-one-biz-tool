"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmProductVariantPriceRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_variant_price_entity_1 = require("../product-variant-price.entity");
let TypeOrmProductVariantPriceRepository = class TypeOrmProductVariantPriceRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmProductVariantPriceRepository = TypeOrmProductVariantPriceRepository;
exports.TypeOrmProductVariantPriceRepository = TypeOrmProductVariantPriceRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(product_variant_price_entity_1.ProductVariantPrice)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmProductVariantPriceRepository);
//# sourceMappingURL=type-orm-product-variant-price.repository.js.map