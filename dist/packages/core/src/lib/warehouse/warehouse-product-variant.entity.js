"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseProductVariant = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const warehouse_product_entity_1 = require("./warehouse-product.entity");
const pipes_1 = require("./../shared/pipes");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_warehouse_product_variant_repository_1 = require("./repository/mikro-orm-warehouse-product-variant.repository");
let WarehouseProductVariant = class WarehouseProductVariant extends internal_1.TenantOrganizationBaseEntity {
};
exports.WarehouseProductVariant = WarehouseProductVariant;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number }),
    (0, entity_1.MultiORMColumn)({
        nullable: true,
        type: 'numeric',
        default: 0,
        transformer: new pipes_1.ColumnNumericTransformerPipe()
    }),
    tslib_1.__metadata("design:type", Number)
], WarehouseProductVariant.prototype, "quantity", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.ProductVariant }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.ProductVariant, (productVariant) => productVariant.warehouseProductVariants, {
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], WarehouseProductVariant.prototype, "variant", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.variant),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], WarehouseProductVariant.prototype, "variantId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => warehouse_product_entity_1.WarehouseProduct, (warehouseProduct) => warehouseProduct.variants, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], WarehouseProductVariant.prototype, "warehouseProduct", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.warehouseProduct),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], WarehouseProductVariant.prototype, "warehouseProductId", void 0);
exports.WarehouseProductVariant = WarehouseProductVariant = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('warehouse_product_variant', { mikroOrmRepository: () => mikro_orm_warehouse_product_variant_repository_1.MikroOrmWarehouseProductVariantRepository })
], WarehouseProductVariant);
//# sourceMappingURL=warehouse-product-variant.entity.js.map