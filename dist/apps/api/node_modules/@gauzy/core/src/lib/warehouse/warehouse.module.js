"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const product_module_1 = require("../product/product.module");
const warehouse_service_1 = require("./warehouse.service");
const warehouse_controller_1 = require("./warehouse.controller");
const warehouse_entity_1 = require("./warehouse.entity");
const warehouse_product_variant_entity_1 = require("./warehouse-product-variant.entity");
const warehouse_product_entity_1 = require("./warehouse-product.entity");
const warehouse_product_service_1 = require("./warehouse-product-service");
const type_orm_warehouse_repository_1 = require("./repository/type-orm-warehouse.repository");
const mikro_orm_warehouse_repository_1 = require("./repository/mikro-orm-warehouse.repository");
const type_orm_warehouse_product_repository_1 = require("./repository/type-orm-warehouse-product.repository");
const mikro_orm_warehouse_product_repository_1 = require("./repository/mikro-orm-warehouse-product.repository");
const type_orm_warehouse_product_variant_repository_1 = require("./repository/type-orm-warehouse-product-variant.repository");
const mikro_orm_warehouse_product_variant_repository_1 = require("./repository/mikro-orm-warehouse-product-variant.repository");
let WarehouseModule = class WarehouseModule {
};
exports.WarehouseModule = WarehouseModule;
exports.WarehouseModule = WarehouseModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([warehouse_entity_1.Warehouse, warehouse_product_entity_1.WarehouseProduct, warehouse_product_variant_entity_1.WarehouseProductVariant]),
            nestjs_1.MikroOrmModule.forFeature([warehouse_entity_1.Warehouse, warehouse_product_entity_1.WarehouseProduct, warehouse_product_variant_entity_1.WarehouseProductVariant]),
            role_permission_module_1.RolePermissionModule,
            product_module_1.ProductModule
        ],
        controllers: [warehouse_controller_1.WarehouseController],
        providers: [
            warehouse_service_1.WarehouseService,
            warehouse_product_service_1.WarehouseProductService,
            type_orm_warehouse_repository_1.TypeOrmWarehouseRepository, mikro_orm_warehouse_repository_1.MikroOrmWarehouseRepository,
            type_orm_warehouse_product_repository_1.TypeOrmWarehouseProductRepository, mikro_orm_warehouse_product_repository_1.MikroOrmWarehouseProductRepository,
            type_orm_warehouse_product_variant_repository_1.TypeOrmWarehouseProductVariantRepository, mikro_orm_warehouse_product_variant_repository_1.MikroOrmWarehouseProductVariantRepository
        ]
    })
], WarehouseModule);
//# sourceMappingURL=warehouse.module.js.map