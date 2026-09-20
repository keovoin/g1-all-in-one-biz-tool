"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmWarehouseProductVariantRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const warehouse_product_variant_entity_1 = require("../warehouse-product-variant.entity");
let TypeOrmWarehouseProductVariantRepository = class TypeOrmWarehouseProductVariantRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmWarehouseProductVariantRepository = TypeOrmWarehouseProductVariantRepository;
exports.TypeOrmWarehouseProductVariantRepository = TypeOrmWarehouseProductVariantRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(warehouse_product_variant_entity_1.WarehouseProductVariant)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmWarehouseProductVariantRepository);
//# sourceMappingURL=type-orm-warehouse-product-variant.repository.js.map