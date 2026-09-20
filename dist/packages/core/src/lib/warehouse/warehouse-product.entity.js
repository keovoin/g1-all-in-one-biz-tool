"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseProduct = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const internal_1 = require("../core/entities/internal");
const pipes_1 = require("./../shared/pipes");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_warehouse_product_repository_1 = require("./repository/mikro-orm-warehouse-product.repository");
let WarehouseProduct = class WarehouseProduct extends internal_1.TenantOrganizationBaseEntity {
};
exports.WarehouseProduct = WarehouseProduct;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number }),
    (0, entity_1.MultiORMColumn)({
        nullable: true,
        type: 'numeric',
        default: 0,
        transformer: new pipes_1.ColumnNumericTransformerPipe()
    }),
    tslib_1.__metadata("design:type", Number)
], WarehouseProduct.prototype, "quantity", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Warehouse }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Warehouse, (warehouse) => warehouse.products, {
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], WarehouseProduct.prototype, "warehouse", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.warehouse),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], WarehouseProduct.prototype, "warehouseId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Product }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Product, (product) => product.warehouses, {
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], WarehouseProduct.prototype, "product", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.product),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], WarehouseProduct.prototype, "productId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.WarehouseProductVariant, isArray: true }),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.WarehouseProductVariant, (warehouseProductVariant) => warehouseProductVariant.warehouseProduct, {
        cascade: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], WarehouseProduct.prototype, "variants", void 0);
exports.WarehouseProduct = WarehouseProduct = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('warehouse_product', { mikroOrmRepository: () => mikro_orm_warehouse_product_repository_1.MikroOrmWarehouseProductRepository })
], WarehouseProduct);
//# sourceMappingURL=warehouse-product.entity.js.map